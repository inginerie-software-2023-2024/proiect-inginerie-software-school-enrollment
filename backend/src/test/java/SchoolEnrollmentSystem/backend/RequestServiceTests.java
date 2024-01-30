package SchoolEnrollmentSystem.backend;

import SchoolEnrollmentSystem.backend.enums.RequestStatus;
import SchoolEnrollmentSystem.backend.exception.UniqueResourceExistent;
import SchoolEnrollmentSystem.backend.service.RequestService;
import SchoolEnrollmentSystem.backend.service.SchoolService;
import SchoolEnrollmentSystem.backend.service.StudentService;
import jakarta.transaction.Transactional;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;

@SpringBootTest
public class RequestServiceTests {
    @Autowired
    private RequestService requestService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private SchoolService schoolService;

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAddRequest() {
        Assertions.assertDoesNotThrow(() -> {
            requestService.addRequest(studentService.findById(2004).get(), schoolService.getSchoolById(1).get(), 10);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testAddRequestAlreadyExist() {
        Assertions.assertThrows(UniqueResourceExistent.class, () -> {
            requestService.addRequest(studentService.findById(2008).get(), schoolService.getSchoolById(1).get(), 10);
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testChangeRequestStatusConfirmed() {
        Assertions.assertDoesNotThrow(() -> {
            requestService.changeRequestStatus(3001, RequestStatus.CONFIRMED);

            Assertions.assertEquals(RequestStatus.CONFIRMED, requestService.getRequestById(3001).getStatus());

            Assertions.assertEquals(studentService.findById(2008).get().getSchool().getId(), requestService.getRequestById(3001).getSchool().getId());
        });
    }

    @Test
    @DirtiesContext(methodMode = DirtiesContext.MethodMode.AFTER_METHOD)
    @Transactional
    void testChangeRequestStatusAccepted() {
        Assertions.assertDoesNotThrow(() -> {
            requestService.changeRequestStatus(3001, RequestStatus.ACCEPTED);

            Assertions.assertEquals(RequestStatus.ACCEPTED, requestService.getRequestById(3001).getStatus());

            Assertions.assertNull(studentService.findById(2008).get().getSchool());
        });
    }
}
