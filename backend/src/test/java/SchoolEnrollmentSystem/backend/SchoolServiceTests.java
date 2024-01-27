package SchoolEnrollmentSystem.backend;

import SchoolEnrollmentSystem.backend.exception.AlreadyAssignedException;
import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.persistence.User;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.boot.test.context.SpringBootTest;
import SchoolEnrollmentSystem.backend.service.SchoolService;

import SchoolEnrollmentSystem.backend.persistence.Class;
import SchoolEnrollmentSystem.backend.persistence.School;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.annotation.DirtiesContext;

import java.util.Optional;


@SpringBootTest
public class SchoolServiceTests {

    @Autowired
    private SchoolService schoolService;

    private School getSchool(Integer id) {
        School school = new School();
        school.setId(id);
        return school;
    }

    private Class getClass(String name, School school) {
        Class c = new Class();
        c.setName(name);
        c.setMaxNumberOfStudents(10);
        c.setSchool(school);
        c.setTeacher(null);
        return c;
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAddClass() {
        Class clazz = getClass("test_class", schoolService.getSchoolById(1).get());
        Class addedClass = schoolService.addClass(clazz);

        Assertions.assertNotNull(addedClass);
        Assertions.assertNotNull(addedClass.getId());

    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testAddClassWithSameName() {
        Class clazz = getClass("clasa1", getSchool(1));
        Assertions.assertThrows(AlreadyAssignedException.class, () -> {
            schoolService.addClass(clazz);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testFindByPrincipalUsername() {
        School schoolToFind = schoolService.getSchoolByPrincipalUsername("director1").get();

        Assertions.assertNotNull(schoolToFind);
        Assertions.assertEquals(schoolToFind.getPrincipalId(), 1000);
        Assertions.assertEquals(schoolToFind.getId(), 1);
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testDontFindByPrincipalUsername() {
        Optional<School> schoolToFind = schoolService.getSchoolByPrincipalUsername("director_nu_exista");

        Assertions.assertFalse(schoolToFind.isPresent());
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAddTeacherToSchool() {
        User addedTeacher = schoolService.addTeacherToSchool("profesor8", schoolService.getSchoolById(1).get());

        Assertions.assertEquals(addedTeacher.getSchoolTeacher().getId(), 1);
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAddNonExistentTeacherToSchool() {
        Assertions.assertThrows(NotFoundException.class, () -> {
            schoolService.addTeacherToSchool("profesor_nu_exista", schoolService.getSchoolById(1).get());
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAddAlreadyAssignedTeacherToSchool() {
        Assertions.assertThrows(AlreadyAssignedException.class, () -> {
            schoolService.addTeacherToSchool("profesor1", schoolService.getSchoolById(1).get());
        });
    }
}
