package SchoolEnrollmentSystem.backend;
import SchoolEnrollmentSystem.backend.persistence.User;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import SchoolEnrollmentSystem.backend.service.UserService;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
public class UserServiceTests {

    @Autowired
    private UserService userService;

    private User getUser(String username, String firstName, String lastName, String email, String passwordHash, String passwordSalt, boolean parent, boolean director, boolean teacher) {
        User user = new User();
        user.setUsername(username);
        user.setFirstName(firstName);
        user.setLastName(lastName);
        user.setEmail(email);
        user.setPasswordHash(passwordHash);
        user.setPasswordSalt(passwordSalt);
        user.setParent(parent);
        user.setDirector(director);
        user.setTeacher(teacher);
        return user;
    }
    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testAddUser() {
        User userToAdd = getUser("test_username", "test_first_name", "test_last_name", "test_email@gmail.com", "test_password_hash", "test_password_salt", false, false, false);

        User addedUser = userService.addUser(userToAdd);

        Assertions.assertNotNull(addedUser);
        Assertions.assertEquals(userToAdd.getUsername(), addedUser.getUsername());
        Assertions.assertNotNull(addedUser.getId());
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testAddUserWithNullUsername() {
        User userToAdd = getUser(null, "test_first_name", "test_last_name", "test_email@gmail.com", "test_password_hash", "test_password_salt", false, false, false);

        Assertions.assertThrows(DataIntegrityViolationException.class, () -> {
            userService.addUser(userToAdd);
        });
    }


    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testAddUserWithSameUsername() {
        User userToAdd = getUser("deja_exista", "test_first_name", "test_last_name", "test_email1@gmail.com", "test_password_hash", "test_password_salt", false, false, false);

        Assertions.assertThrows(DataIntegrityViolationException.class, () -> {
            userService.addUser(userToAdd);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testExistsByUsername() {
        Assertions.assertTrue(userService.existsByUsername("deja_exista"));
    }
    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testDoesNotExistsByUsername() {
        Assertions.assertFalse(userService.existsByUsername("nu_exista"));
    }


    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testFindByUsername() {
        Assertions.assertNotNull(userService.findByUsername("deja_exista"));
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    void testDontFindByUsername() {
        Assertions.assertNull(userService.findByUsername("nu_exista"));
    }

//    @Test
//    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
//    @Transactional
//    void testPrincipalHasAccesToClass() {
//        Assertions.assertTrue(userService.principalHasAccessToClass("director1", 1006));
//    }
//
//    @Test
//    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
//    @Transactional
//    void testPrincipalDoesNotHasAccesToClass() {
//        Assertions.assertFalse(userService.principalHasAccessToClass("director2", 1006));
//    }
}
