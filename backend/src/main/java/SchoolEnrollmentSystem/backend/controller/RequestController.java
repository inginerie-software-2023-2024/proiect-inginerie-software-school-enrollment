package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
import SchoolEnrollmentSystem.backend.enums.RequestStatus;
import SchoolEnrollmentSystem.backend.exception.NullArgumentException;
import SchoolEnrollmentSystem.backend.exception.UniqueResourceExistent;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.service.RequestService;
import SchoolEnrollmentSystem.backend.service.SchoolService;
import SchoolEnrollmentSystem.backend.service.StudentService;
import SchoolEnrollmentSystem.backend.service.UserService;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/requests")
public class RequestController {

    @Autowired
    private RequestService requestService;

    @Autowired
    private SchoolService schoolService;

    @Autowired
    private UserService userService;

    @Autowired
    private StudentService studentService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    public ResponseEntity<?> getAllRequests(@RequestHeader("Authorization") String token) {
        Claims adminClaim = jwtUtil.resolveClaims(token);
        Boolean isAdmin = adminClaim.get("admin", Boolean.class);
        if(isAdmin == null || !isAdmin)
            return ResponseEntity.badRequest().body("Unauthorized");

        return ResponseEntity.ok(requestService.getAllRequests());
    }

    @GetMapping("/ofSchool/{schoolId}")
    public ResponseEntity<?> getAllRequestsToSchool(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer schoolId
    ) {
        Claims accessClaim = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = accessClaim.get("principal", Boolean.class);
        Boolean isAdmin = accessClaim.get("admin", Boolean.class);

        // if it's not a principal or an admin, return unauthorized
        if((isPrincipal == null || !isPrincipal) && (isAdmin == null || !isAdmin))
            return ResponseEntity.badRequest().body("Unauthorized");

        Optional<School> schoolOptional = schoolService.getSchoolById(schoolId);
        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("School not found", HttpStatus.NOT_FOUND);

        return ResponseEntity.ok(requestService.getAllRequestsToSchool(schoolOptional.get()));
    }

    private ResponseEntity<?> getAllRequestsOfParentGeneric(String username) {
        User parent = userService.findByUsername(username);
        if(parent == null)
            return new ResponseEntity<>("Parent not found", HttpStatus.NOT_FOUND);

        return ResponseEntity.ok(requestService.getAllRequestsOfParent(parent));
    }

    @GetMapping("/ofParent/{username}")
    public ResponseEntity<?> getAllRequestsOfParentByAdmin(
            @RequestHeader("Authorization") String token,
            @PathVariable String username
    ) {
        Claims accessClaim = jwtUtil.resolveClaims(token);
        Boolean isAdmin = accessClaim.get("admin", Boolean.class);

        // if it's not an admin, return unauthorized
        if(isAdmin == null || !isAdmin)
            return ResponseEntity.badRequest().body("Unauthorized");

        return getAllRequestsOfParentGeneric(username);
    }

    @GetMapping("/ofMyChildren")
    public ResponseEntity<?> getAllRequestsOfLoggedParent(
            @RequestHeader("Authorization") String token
    ) {
        Claims accessClaim = jwtUtil.resolveClaims(token);
        Boolean isParent = accessClaim.get("parent", Boolean.class);

        // if it's not a parent, return unauthorized
        if(isParent == null || !isParent)
            return ResponseEntity.badRequest().body("Unauthorized");

        String username = accessClaim.getSubject();

        return getAllRequestsOfParentGeneric(username);
    }

    @GetMapping("/ofStudent/{studentId}")
    public ResponseEntity<?> getAllRequestsOfStudent(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer studentId
    ) {
        Claims accessClaim = jwtUtil.resolveClaims(token);
        Boolean isParent = accessClaim.get("parent", Boolean.class);
        Boolean isAdmin = accessClaim.get("admin", Boolean.class);

        // if it's not a parent or an admin, return unauthorized
        if((isParent == null || !isParent) && (isAdmin == null || !isAdmin))
            return ResponseEntity.badRequest().body("Unauthorized");

        Optional<Student> studentOptional = studentService.findById(studentId);
        if(studentOptional.isEmpty())
            return new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND);

        return ResponseEntity.ok(requestService.getAllRequestsOfStudent(studentOptional.get()));
    }

    @PostMapping("/add/{studentId}/{schoolId}")
    public ResponseEntity<?> addRequest(
            @PathVariable Integer studentId,
            @PathVariable Integer schoolId,
            @RequestHeader("Authorization") String token
    ) {
        Claims accessClaim = jwtUtil.resolveClaims(token);
        Boolean isParent = accessClaim.get("parent", Boolean.class);

        if(isParent == null || !isParent)
            return ResponseEntity.badRequest().body("Unauthorized");

        Optional<Student> studentOptional = studentService.findById(studentId);
        if(studentOptional.isEmpty())
            return new ResponseEntity<>("Student not found", HttpStatus.NOT_FOUND);

        Optional<School> schoolOptional = schoolService.getSchoolById(schoolId);
        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("School not found", HttpStatus.NOT_FOUND);

        try {
            requestService.addRequest(studentOptional.get(), schoolOptional.get());

        }
        catch (NullArgumentException e) {
            return ResponseEntity.internalServerError().build();
        }
        catch(UniqueResourceExistent e) {
            return ResponseEntity.badRequest().body("Request already exists");
        }

        return ResponseEntity.ok().build();
    }

    @PutMapping("/changeStatus/{requestId}/{status}")
    public ResponseEntity<?> changeRequestStatus(
            @PathVariable Integer requestId,
            @PathVariable String status,
            @RequestHeader("Authorization") String token
    ) {
        Claims accessClaim = jwtUtil.resolveClaims(token);
        Boolean isTempPrincipal = accessClaim.get("principal", Boolean.class);
        Boolean isTempAdmin = accessClaim.get("admin", Boolean.class);
        Boolean isTempParent = accessClaim.get("parent", Boolean.class);

        boolean isPrincipal = isTempPrincipal != null && isTempPrincipal;
        boolean isAdmin = isTempAdmin != null && isTempAdmin;
        boolean isParent = isTempParent != null && isTempParent;

        if(!isPrincipal && !isAdmin && !isParent)
            return ResponseEntity.badRequest().body("Unauthorized");

        RequestStatus requestStatus;
        try {
            requestStatus = RequestStatus.valueOf(status.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid status");
        }

        if(isParent &&
                (requestStatus == RequestStatus.ACCEPTED ||
                requestStatus == RequestStatus.REJECTED)
        )
            return ResponseEntity.badRequest().body("Unauthorized");

        if(isPrincipal &&
                (requestStatus == RequestStatus.CONFIRMED ||
                requestStatus == RequestStatus.DECLINED ||
                requestStatus == RequestStatus.CANCELED)
        )
            return ResponseEntity.badRequest().body("Unauthorized");

        if(!requestService.changeRequestStatus(requestId, requestStatus))
            return new ResponseEntity<>("Request not found", HttpStatus.NOT_FOUND);

        return ResponseEntity.ok().build();
    }
}
