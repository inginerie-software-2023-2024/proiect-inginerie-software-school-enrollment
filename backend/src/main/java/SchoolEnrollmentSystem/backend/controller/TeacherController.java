package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.ClassDTO;
import SchoolEnrollmentSystem.backend.DTOs.SendStudentDTO;
import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.service.ClassService;
import SchoolEnrollmentSystem.backend.service.StudentService;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.ArrayList;
import java.util.List;
@RestController
@AllArgsConstructor
@RequestMapping("/teacher")
public class TeacherController {
    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private StudentService studentService;

    @Autowired
    private ClassService classService;

    @GetMapping(path = "/getMyClassStudents")
    public ResponseEntity<?> getMyClassStudents(@RequestHeader("Authorization") String token) {
        Claims teacherClaim = jwtUtil.resolveClaims(token);
        Boolean isTeacher = teacherClaim.get("teacher", Boolean.class);
        if(isTeacher == null || !isTeacher)
            return ResponseEntity.badRequest().body("Unauthorized");

        List<SendStudentDTO> students = new ArrayList<>();

        List<Student> allStudents = studentService.findAll();

        for (Student student : allStudents) {
            if (student.getSchoolClass() == null) {
                continue;
            }

            if (student.getSchoolClass().getTeacher().getUsername().equals(teacherClaim.getSubject())) {
                SendStudentDTO sendStudentDTO = new SendStudentDTO();
                sendStudentDTO.setId(student.getId());
                sendStudentDTO.setFirstName(student.getFirstName());
                sendStudentDTO.setLastName(student.getLastName());
                sendStudentDTO.setCnp(student.getCnp());
                sendStudentDTO.setSchoolClassId(student.getSchoolClass().getId());
                sendStudentDTO.setSchoolClassName(student.getSchoolClass().getName());
                sendStudentDTO.setSchoolId(student.getSchoolClass().getSchool().getId());
                sendStudentDTO.setSchoolName(student.getSchoolClass().getSchool().getName());
                sendStudentDTO.setAge(student.getAge());
                sendStudentDTO.setParentId(student.getParent().getId());
                sendStudentDTO.setParentFirstName(student.getParent().getFirstName());
                sendStudentDTO.setParentLastName(student.getParent().getLastName());
                students.add(sendStudentDTO);
            }
        }

        return ResponseEntity.ok(students);
    }

        @GetMapping(path = "/getMyClassDetails")
    public ResponseEntity<?> getMyClassDetails(
            @RequestHeader("Authorization") String token
    ) {
        Claims teacherClaim = jwtUtil.resolveClaims(token);
        Boolean isTeacher = teacherClaim.get("teacher", Boolean.class);
        if(isTeacher == null || !isTeacher)
            return ResponseEntity.badRequest().body("Unauthorized");

        String teacherUsername = teacherClaim.getSubject();
        try {
            ClassDTO classDTO = classService.getClassDetailsByTeacherUsername(teacherUsername);
            return ResponseEntity.ok(classDTO);
        }
        catch(NotFoundException e) {
            return ResponseEntity.notFound().build();
        }
        catch(Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }

}
