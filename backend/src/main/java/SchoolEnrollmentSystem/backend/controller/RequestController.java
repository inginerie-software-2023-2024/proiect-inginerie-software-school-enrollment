package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.GetRequestDTO;
import SchoolEnrollmentSystem.backend.DTOs.RequestDTO;
import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
import SchoolEnrollmentSystem.backend.enums.RequestStatus;
import SchoolEnrollmentSystem.backend.exception.AlreadyAssignedException;
import SchoolEnrollmentSystem.backend.exception.InvalidStateException;
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

import java.util.*;
import java.util.stream.Collectors;

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

        List<GetRequestDTO> requestDTOs = requestService.getAllRequests().stream()
                .map(request -> {
                    GetRequestDTO requestDTO = new GetRequestDTO();
                    requestDTO.setStudentId(request.getStudent().getId());
                    requestDTO.setGrade(request.getGrade());
                    requestDTO.setSchoolId(request.getSchool().getId());
                    requestDTO.setId(request.getId());
                    requestDTO.setStatus(request.getStatus());
                    return requestDTO;
                })
                .collect(Collectors.toList());

        return ResponseEntity.ok(requestDTOs);
    }

    @GetMapping("/ofSchool/{schoolId}")
    public ResponseEntity<?> getAllRequestsToSchool(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer schoolId
    ) {
        Claims accessClaim = jwtUtil.resolveClaims(token);
        Boolean isAdmin = accessClaim.get("admin", Boolean.class);

        // if it's not a principal or an admin, return unauthorized
        if(isAdmin == null || !isAdmin)
            return ResponseEntity.badRequest().body("Unauthorized");

        Optional<School> schoolOptional = schoolService.getSchoolById(schoolId);
        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("School not found", HttpStatus.NOT_FOUND);

        return ResponseEntity.ok(requestService.getAllRequestsToSchool(schoolOptional.get()));
    }

    @GetMapping(path="/ofMySchool")
    public ResponseEntity<?> getAllRequestsToMySchool(
            @RequestHeader("Authorization") String token
    ) {
        Claims accessClaim = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = accessClaim.get("principal", Boolean.class);

        // if it's not a principal, return unauthorized
        if(isPrincipal == null || !isPrincipal)
            return ResponseEntity.badRequest().body("Neautorizat");

        String username = accessClaim.getSubject();
        User principal = userService.findByUsername(username);
        if(principal == null)
            return new ResponseEntity<>("Directorul nu a fost gasit", HttpStatus.NOT_FOUND);

        if(principal.getSchool() == null)
            return new ResponseEntity<>("Nu aveti nici o scoala adaugata", HttpStatus.BAD_REQUEST);

        return ResponseEntity.ok(requestService.getAllRequestsToSchool(principal.getSchool()));
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

    @PostMapping("/add")
    public ResponseEntity<?> addRequest(
            @RequestBody RequestDTO requestDTO,
            @RequestHeader("Authorization") String token
    ) {
        Claims accessClaim = jwtUtil.resolveClaims(token);
        Boolean isParent = accessClaim.get("parent", Boolean.class);

        Integer studentId = requestDTO.getStudentId();
        Integer schoolId = requestDTO.getSchoolId();
        Integer grade = requestDTO.getGrade();

        if(isParent == null || !isParent)
            return ResponseEntity.badRequest().body("Neautorizat");

        Optional<Student> studentOptional = studentService.findById(studentId);
        if(studentOptional.isEmpty())
            return new ResponseEntity<>("Copilul nu a fost gasit", HttpStatus.NOT_FOUND);

        Optional<School> schoolOptional = schoolService.getSchoolById(schoolId);
        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Scoala nu a fost gasita", HttpStatus.NOT_FOUND);

        try {
            requestService.addRequest(studentOptional.get(), schoolOptional.get(), grade);
        }
        catch (AlreadyAssignedException e) {
            return ResponseEntity.badRequest().body("Copilul este deja asignat la o scoala");
        }
        catch (NullArgumentException e) {
            return new ResponseEntity<>("Eroare la adaugarea cererii", HttpStatus.INTERNAL_SERVER_ERROR);
        }
        catch(UniqueResourceExistent e) {
            return ResponseEntity.badRequest().body("Deja exista o cerere pentru acest copil la aceasta scoala");
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
        boolean isPrincipal = accessClaim.get("currentRole", String.class).equals("principal");
        boolean isAdmin = accessClaim.get("currentRole", String.class).equals("admin");
        boolean isParent = accessClaim.get("currentRole", String.class).equals("parent");

        if(!isPrincipal && !isAdmin && !isParent)
            return new ResponseEntity<>("Neautorizat", HttpStatus.UNAUTHORIZED);

        RequestStatus requestStatus;
        try {
            requestStatus = RequestStatus.valueOf(status.toUpperCase());
        }
        catch (IllegalArgumentException e) {
            return new ResponseEntity<>("Status invalid", HttpStatus.BAD_REQUEST);
        }

        if(isParent &&
                (requestStatus == RequestStatus.ACCEPTED ||
                requestStatus == RequestStatus.REJECTED)
        )
            return new ResponseEntity<>("Schimbare de status neautorizata", HttpStatus.BAD_REQUEST);

        if(isPrincipal &&
                (requestStatus == RequestStatus.CONFIRMED ||
                requestStatus == RequestStatus.DECLINED ||
                requestStatus == RequestStatus.CANCELED)
        )
            return new ResponseEntity<>("Schimbare de status neautorizata", HttpStatus.BAD_REQUEST);


        try {
            if (!requestService.changeRequestStatus(requestId, requestStatus))
                return new ResponseEntity<>("Cererea nu a fost gasita", HttpStatus.NOT_FOUND);
        }
        catch(InvalidStateException e) {
            return new ResponseEntity<>("Schimbare de status neautorizata", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok().build();
    }
}
