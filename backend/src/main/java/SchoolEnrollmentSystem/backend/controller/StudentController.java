package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.StudentDTO;
import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.exception.UniqueResourceExistent;
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
    public ResponseEntity<?> addStudent(@RequestBody StudentDTO student) {
        try{
            studentService.addStudent(student);
        } catch (NotFoundException e) {
            return new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND);
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
    public ResponseEntity<?> updateStudent(@RequestBody StudentDTO student) {
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
}
