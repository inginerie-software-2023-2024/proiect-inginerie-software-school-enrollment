package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.StudentDTO;
import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
import SchoolEnrollmentSystem.backend.exception.*;
import SchoolEnrollmentSystem.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.service.StudentService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/students")
public class StudentController {
    @Autowired
    private StudentService studentService;
    @Autowired
    private UserService userService;
    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<Student> getAllStudents() {
        return studentService.findAll();
    }

    @GetMapping(path = "/{id}")
    public ResponseEntity<?> getStudentById(@PathVariable Integer id) {
        Optional<Student> studentOptional = studentService.findById(id);
        if(studentOptional.isEmpty())
            return new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND);
        return new ResponseEntity<>(studentOptional.get(), HttpStatus.OK);
    }

    @GetMapping(path="ofMyself")
    public ResponseEntity<?> getMyChildren(@RequestHeader("Authorization") String token){
        String username = jwtUtil.resolveClaims(token).getSubject();
        List<Student> students = studentService.findByParentUsername(username);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @GetMapping(path="ofParent/{parentUsername}")
    public ResponseEntity<?> getChildrenOfParent(
            @PathVariable String parentUsername,
            @RequestHeader("Authorization") String token
    ) {
        Boolean isAdmin = jwtUtil.resolveClaims(token).get("admin", Boolean.class);
        if(isAdmin == null || !isAdmin)
            return new ResponseEntity<>("You are not an admin", HttpStatus.UNAUTHORIZED);

        List<Student> students = studentService.findByParentUsername(parentUsername);
        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @DeleteMapping(path = "delete/{id}")
    public ResponseEntity<?> deleteStudent(@PathVariable Integer id) {
        try{
            studentService.deleteStudent(id);
        } catch (NotFoundException e) {
            return new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND);
        }
        catch(Exception e){
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Student deleted successfully", HttpStatus.OK);
    }

    @PostMapping(path = "/add")
    public ResponseEntity<?> addStudent(
            @RequestBody StudentDTO student,
            @RequestHeader("Authorization") String token
    ) {
        String parentUsername = jwtUtil.resolveClaims(token).getSubject();
        student.setParentUsername(parentUsername);
        try{
            studentService.addStudent(student);
        }
        catch (UniqueResourceExistent e) {
            return new ResponseEntity<>("Student with that CNP already exists", HttpStatus.CONFLICT);
        }
        catch(Exception e){
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Student added successfully", HttpStatus.CREATED);
    }

    @PutMapping(path = "/update")
    public ResponseEntity<?> updateStudent(
            @RequestBody StudentDTO student,
            @RequestHeader("Authorization") String token
    ) {
        String parentUsername = jwtUtil.resolveClaims(token).getSubject();
        student.setParentUsername(parentUsername);
        System.out.println(student);
        try{
            studentService.update(student);
        } catch (NotFoundException e) {
            return new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND);
        }
        catch (UniqueResourceExistent e) {
            return new ResponseEntity<>("Student with that CNP already exists", HttpStatus.CONFLICT);
        }
        catch(Exception e){
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Student updated successfully", HttpStatus.OK);
    }

    @PostMapping(path = "/assign/{studentId}/toClass/{classId}")
    public ResponseEntity<?> assignStudentToClass(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer studentId,
            @PathVariable Integer classId
    ) {
        Boolean isAdmin = jwtUtil.resolveClaims(token).get("admin", Boolean.class);
        Boolean isTeacher = jwtUtil.resolveClaims(token).get("teacher", Boolean.class);
        if((isAdmin == null || !isAdmin) && (isTeacher == null || !isTeacher))
            return new ResponseEntity<>("Neautorizat", HttpStatus.UNAUTHORIZED);

        String username = jwtUtil.resolveClaims(token).getSubject();
        if((isAdmin == null || !isAdmin) && !userService.principalHasAccessToClass(username, classId))
            return new ResponseEntity<>("Neautorizat", HttpStatus.UNAUTHORIZED);

        try{
            studentService.assignStudentToClass(studentId, classId);
        } catch (NotFoundException e) {
            return new ResponseEntity<>("Elevul sau clasa nu au fost gasit(a)", HttpStatus.NOT_FOUND);
        }
        catch (AlreadyAssignedException e) {
            return new ResponseEntity<>("Elevul face deja parte dintr-o clasa", HttpStatus.CONFLICT);
        }
        catch(Exception e){
            return new ResponseEntity<>("Eroare la asignarea elevului in clasa", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Elev asignat cu succes in clasa", HttpStatus.OK);
    }

    @PostMapping(path = "/remove/{studentId}/fromClass/{classId}")
    public ResponseEntity<?> removeStudentFromClass(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer studentId,
            @PathVariable Integer classId
    ) {
        Boolean isAdmin = jwtUtil.resolveClaims(token).get("admin", Boolean.class);
        Boolean isTeacher = jwtUtil.resolveClaims(token).get("teacher", Boolean.class);
        if((isAdmin == null || !isAdmin) && (isTeacher == null || !isTeacher))
            return new ResponseEntity<>("Neautorizat", HttpStatus.UNAUTHORIZED);

        String username = jwtUtil.resolveClaims(token).getSubject();
        if((isAdmin == null || !isAdmin) && !userService.principalHasAccessToClass(username, classId))
            return new ResponseEntity<>("Neautorizat", HttpStatus.UNAUTHORIZED);

        try{
            studentService.removeStudentFromClass(studentId, classId);
        } catch (NotFoundException e) {
            return new ResponseEntity<>("Elevul sau clasa nu au putut fi gasite", HttpStatus.NOT_FOUND);
        }
        catch (ResourcesNotCorrelatedException e) {
            return new ResponseEntity<>("Elevul nu face parte dintr-o clasa", HttpStatus.CONFLICT);
        }
        catch(Exception e){
            return new ResponseEntity<>("Eroare la eliminarea elevului din clasa", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Elev eliminat cu succes", HttpStatus.OK);
    }

    @PostMapping(path = "/move/{studentId}/toClass/{classId}")
    public ResponseEntity<?> moveStudentToClass(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer studentId,
            @PathVariable Integer classId
    ) {
        Boolean isAdmin = jwtUtil.resolveClaims(token).get("admin", Boolean.class);
        Boolean isTeacher = jwtUtil.resolveClaims(token).get("teacher", Boolean.class);
        if((isAdmin == null || !isAdmin) && (isTeacher == null || !isTeacher))
            return new ResponseEntity<>("Not authorized", HttpStatus.UNAUTHORIZED);

        String username = jwtUtil.resolveClaims(token).getSubject();
        if((isAdmin == null || !isAdmin) && !userService.principalHasAccessToClass(username, classId))
            return new ResponseEntity<>("Not authorized", HttpStatus.UNAUTHORIZED);

        try{
            studentService.changeStudentClass(studentId, classId);
        } catch (NotFoundException e) {
            return new ResponseEntity<>("Student or class not found", HttpStatus.NOT_FOUND);
        }
        catch (ResourcesNotCorrelatedException e) {
            return new ResponseEntity<>("Student is not in the same school as the class", HttpStatus.CONFLICT);
        }
        catch (NullArgumentException e) {
            return new ResponseEntity<>("Student is not assigned to a class", HttpStatus.CONFLICT);
        }
        catch(Exception e){
            return new ResponseEntity<>("Something went wrong", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return new ResponseEntity<>("Student moved successfully", HttpStatus.OK);
    }
}
