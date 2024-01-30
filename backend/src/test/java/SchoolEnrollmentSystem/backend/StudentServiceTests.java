package SchoolEnrollmentSystem.backend;

import SchoolEnrollmentSystem.backend.DTOs.StudentDTO;
import SchoolEnrollmentSystem.backend.exception.AlreadyAssignedException;
import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.exception.ResourcesNotCorrelatedException;
import SchoolEnrollmentSystem.backend.exception.UniqueResourceExistent;
import SchoolEnrollmentSystem.backend.service.StudentService;
import com.fasterxml.jackson.annotation.JsonTypeInfo;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import SchoolEnrollmentSystem.backend.persistence.Student;
import org.springframework.test.annotation.DirtiesContext;

import java.util.List;
import java.util.Optional;

@SpringBootTest
public class StudentServiceTests {

    @Autowired
    private StudentService studentService;

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testAddStudent() {
        StudentDTO studentToAdd = new StudentDTO(10, "test_first_name", "test_last_name", "7777777777777", "parinte1");

        Assertions.assertDoesNotThrow(() -> {
            Student addedStudent = studentService.addStudent(studentToAdd);
            Assertions.assertNotNull(addedStudent.getId());
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testDoesNotAddStudentWithSame() {
        StudentDTO studentToAdd = new StudentDTO(10, "test_first_name", "test_last_name", "1111111111111", "parinte1");

        Assertions.assertThrows(UniqueResourceExistent.class, () -> {
            studentService.addStudent(studentToAdd);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testDoesNotAddStudentWithoutParent() {
        StudentDTO studentToAdd = new StudentDTO(10, "test_first_name", "test_last_name", "9999999999999", "parinte_nu_exista");

        Assertions.assertThrows(NotFoundException.class, () -> {
            studentService.addStudent(studentToAdd);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testStudentUpdate() {
        StudentDTO studentToUpdate = new StudentDTO(11, "student_schimbat", "student1", "1111111111111", "parinte1");
        studentToUpdate.setId(2003);
        Assertions.assertDoesNotThrow(() -> {
            studentService.update(studentToUpdate);
        });

        Optional<Student> student = studentService.findById(2003);

        Assertions.assertTrue(student.isPresent());

        Assertions.assertEquals(student.get().getFirstName(), studentToUpdate.getFirstName());
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testStudentUpdateInvalidCnpAndId() {
        StudentDTO studentToUpdate = new StudentDTO(11, "student_schimbat", "student1", "3333333333333", "parinte1");
        studentToUpdate.setId(2004);
        Assertions.assertThrows(UniqueResourceExistent.class, () -> {
            studentService.update(studentToUpdate);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testStudentUpdateCnpAndId_second() {
        StudentDTO studentToUpdate = new StudentDTO(11, "student_schimbat", "student1", "1111111111111", "parinte1");
        studentToUpdate.setId(20003);
        Assertions.assertThrows(UniqueResourceExistent.class, () -> {
            studentService.update(studentToUpdate);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testStudentUpdateCnpAndId() {
        StudentDTO studentToUpdate = new StudentDTO(11, "student_schimbat", "student1", "23232332", "parinte1");
        studentToUpdate.setId(20003);
        Assertions.assertThrows(NotFoundException.class, () -> {
            studentService.update(studentToUpdate);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testStudentUpdateInvalidParent() {
        StudentDTO studentToUpdate = new StudentDTO(11, "student_schimbat", "student1", "1111111111111", "parinte_invalid");
        studentToUpdate.setId(2003);
        Assertions.assertThrows(NotFoundException.class, () -> {
            studentService.update(studentToUpdate);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testFindByParentUsername() {
        Assertions.assertDoesNotThrow(() -> {
            List<Student> students = studentService.findByParentUsername("parinte2");

            Assertions.assertEquals(students.size(), 2);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testFindByParentInvalidUsername() {
        Assertions.assertThrows(NotFoundException.class, () -> {
            List<Student> students = studentService.findByParentUsername("parinte_invalid");

            Assertions.assertEquals(students.size(), 0);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAssignStudentToClass() {
        Assertions.assertDoesNotThrow(() -> {
            studentService.assignStudentToClass(2003, 1006);

            Assertions.assertTrue(studentService.findById(2003).get().getSchoolClass().getId().equals(1006));
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAssignStudentToClassInvalidClass() {
        Assertions.assertThrows(ResourcesNotCorrelatedException.class, () -> {
            studentService.assignStudentToClass(2003, 1007);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAssignStudentToClassNullSchool() {
        Assertions.assertThrows(ResourcesNotCorrelatedException.class, () -> {
            studentService.assignStudentToClass(2004, 1007);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAssignStudentToClassAlreadyAssigned() {
        Assertions.assertThrows(AlreadyAssignedException.class, () -> {
            studentService.assignStudentToClass(2005, 1008);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testRemoveStudentFromClass() {
        Assertions.assertDoesNotThrow(() -> {
            studentService.removeStudentFromClass(2005, 1007);

            Assertions.assertNull(studentService.findById(2005).get().getSchoolClass());
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testRemoveStudentFromClassInvalidClass() {
        Assertions.assertThrows(NotFoundException.class, () -> {
            studentService.removeStudentFromClass(2005, 1070);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testRemoveStudentFromClassInvalidStudent() {
        Assertions.assertThrows(NotFoundException.class, () -> {
            studentService.removeStudentFromClass(2050, 1007);

        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testRemoveStudentFromClassIStudentNotInClass() {
        Assertions.assertThrows(ResourcesNotCorrelatedException.class, () -> {
            studentService.removeStudentFromClass(2003, 1007);

        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testChangeStudentClass() {
        Assertions.assertDoesNotThrow(() -> {
            studentService.changeStudentClass(2005, 1008);

            Assertions.assertTrue(studentService.findById(2005).get().getSchoolClass().getId().equals(1008));
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testChangeStudentClassInvalidClass() {
        Assertions.assertDoesNotThrow( () -> {
            Integer initialClassId = studentService.findById(2005).get().getSchoolClass().getId();
            studentService.changeStudentClass(2005, 1070);

            Assertions.assertTrue(studentService.findById(2005).get().getSchoolClass().getId().equals(initialClassId));
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testChangeStudentClassInvalidClassSchool() {
        Assertions.assertDoesNotThrow( () -> {
            Integer initialClassId = studentService.findById(2005).get().getSchoolClass().getId();
            studentService.changeStudentClass(2005, 1006);

            Assertions.assertTrue(studentService.findById(2005).get().getSchoolClass().getId().equals(initialClassId));
        });
    }
}
