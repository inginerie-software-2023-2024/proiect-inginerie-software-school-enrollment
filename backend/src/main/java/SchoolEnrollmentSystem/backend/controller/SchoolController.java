package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.AddTeacherToClassDTO;
import SchoolEnrollmentSystem.backend.DTOs.ClassDTO;
import SchoolEnrollmentSystem.backend.DTOs.SchoolAddDTO;
import SchoolEnrollmentSystem.backend.DTOs.TeacherGetDTO;
import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
import SchoolEnrollmentSystem.backend.exception.AlreadyAssignedException;
import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.exception.ResourcesNotCorrelatedException;
import SchoolEnrollmentSystem.backend.persistence.Class;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.service.ClassService;
import SchoolEnrollmentSystem.backend.service.SchoolService;
import SchoolEnrollmentSystem.backend.service.UserService;
import io.jsonwebtoken.Claims;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/schools")
public class SchoolController {
    @Autowired
    private SchoolService schoolService;

    @Autowired
    private ClassService classService;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<School> getAllSchools() {
        return schoolService.getAllSchools();
    }

    @GetMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getSchoolWithId(@PathVariable Integer id) {
        Optional<School> schoolOptional = schoolService.getSchoolById(id);
        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("School not found", HttpStatus.NOT_FOUND);

        return ResponseEntity.ok(schoolOptional.get());
    }

    @DeleteMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteSchool(@PathVariable Integer id) {
        schoolService.deleteSchool(id);
    }

    @PostMapping(path = "/addSchool")
    public ResponseEntity<?> addSchool(@RequestHeader("Authorization") String token, @RequestBody SchoolAddDTO schoolAddDTO) {
        Claims principalClaim = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = principalClaim.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);

        String principalUsername = principalClaim.getSubject();
        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);

        if (schoolOptional.isPresent())
            return new ResponseEntity<>("Principal already has a school assigned!", HttpStatus.BAD_REQUEST);

        User principal = userService.findByUsername(principalUsername);

        School school = new School();
        school.setName(schoolAddDTO.getName());
        school.setDescription(schoolAddDTO.getDescription());
        school.setPrincipal(principal);

        schoolService.addSchool(school);

        return ResponseEntity.ok("School added");
    }

    @PutMapping(path = "/updateMySchool")
    public ResponseEntity<?> updateMySchool(
            @RequestHeader("Authorization") String token,
            @RequestBody SchoolAddDTO schoolAddDTO
    ) {
        Claims principalClaim = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = principalClaim.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);

        String principalUsername = principalClaim.getSubject();
        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);

        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Principal has no school assigned!", HttpStatus.NOT_FOUND);

        School school = schoolOptional.get();
        school.setName(schoolAddDTO.getName());
        school.setDescription(schoolAddDTO.getDescription());

        schoolService.update(school);

        return ResponseEntity.ok("School updated");
    }

    @GetMapping(path = "/mySchoolTeachers")
    public ResponseEntity<?> getMySchoolTeachers(
            @RequestHeader("Authorization") String token
    ) {
        Claims claims = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = claims.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);

        String principalUsername = claims.getSubject();
        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);
        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Principal has no school assigned!", HttpStatus.NOT_FOUND);

        System.out.println("ID-ul scolii din request: " + schoolOptional.get().getId());
        return ResponseEntity.ok(schoolOptional.get().getTeachers().stream().map(TeacherGetDTO::new).toList());
    }

    @GetMapping(path = "/mySchoolDetails")
    public ResponseEntity<?> getMySchoolDetails(
            @RequestHeader("Authorization") String token
    ) {
        Claims claims = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = claims.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return new ResponseEntity<>("Unauthorized", HttpStatus.UNAUTHORIZED);

        String principalUsername = claims.getSubject();
        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);
        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Principal has no school assigned!", HttpStatus.NOT_FOUND);

        return ResponseEntity.ok(schoolOptional.get());
    }

    @PutMapping(path = "/addTeacher/{usernameToInvite}")
    public ResponseEntity<?> inviteTeacher(
            @RequestHeader("Authorization") String token,
            @PathVariable String usernameToInvite
    ) {
        Claims claims = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = claims.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return new ResponseEntity<>("Neautorizat", HttpStatus.UNAUTHORIZED);

        String principalUsername = claims.getSubject();
        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);
        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Nu aveti nici o scoala inregistrata", HttpStatus.NOT_FOUND);

        School school = schoolOptional.get();
        try {
            schoolService.addTeacherToSchool(usernameToInvite, school);
        }
        catch(NotFoundException e) {
            return new ResponseEntity<>("Utilizatorul nu a fost gasit", HttpStatus.NOT_FOUND);
        }
        catch(AlreadyAssignedException e) {
            return new ResponseEntity<>("Utilizatorul este deja profesor la o scoala", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("Profesor adaugat cu succes");
    }

    @PostMapping(path = "/addClass")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addClass(@RequestHeader("Authorization") String token, @RequestBody ClassDTO classDTO) {
        Claims principalClaim = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = principalClaim.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return ResponseEntity.badRequest().body("Unauthorized");

        String principalUsername = principalClaim.getSubject();

        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);

        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Principal has no school assigned!", HttpStatus.NOT_FOUND);

        School school = schoolOptional.get();

        Class c = new Class();
        c.setSchool(school);
        c.setTeacher(null);
        c.setName(classDTO.getName());
        c.setMaxNumberOfStudents(classDTO.getMaxNumberOfStudents());

        try {
            schoolService.addClass(c);
        }
        catch(AlreadyAssignedException e) {
            return new ResponseEntity<>("Deja aveti o clasa cu numele acesta", HttpStatus.CONFLICT);
        }
        catch (Exception e) {
            System.out.println(e.getMessage());
            return ResponseEntity.internalServerError().body("Something went wrong!");
        }

        return ResponseEntity.ok("Clasa adaugata cu succes");
    }

    @PutMapping(path = "/removeTeacher/{teacherId}")
    public ResponseEntity<?> removeTeacher(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer teacherId
    ) {
        Claims claims = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = claims.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return new ResponseEntity<>("Neautorizat", HttpStatus.UNAUTHORIZED);

        String principalUsername = claims.getSubject();
        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);

        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Directorul nu are nici o scoala adaugata", HttpStatus.NOT_FOUND);

        try {
            schoolService.removeTeacherFromSchool(teacherId, schoolOptional.get());
        }
        catch(NotFoundException e) {
            return new ResponseEntity<>("Profesorul nu a fost gasit", HttpStatus.NOT_FOUND);
        }
        catch(ResourcesNotCorrelatedException e) {
            return new ResponseEntity<>("Utilizatorul nu este profesor la scoala dumneavoastra", HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok("Profesor sters cu succes");
    }

    @PutMapping(path = "/removeClass/{classId}")
    public ResponseEntity<?> removeClass(
            @RequestHeader("Authorization") String token,
            @PathVariable Integer classId
    ) {
        Claims claims = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = claims.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return new ResponseEntity<>("Neautorizat", HttpStatus.UNAUTHORIZED);

        String principalUsername = claims.getSubject();
        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);

        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Directorul nu are nici o scoala adaugata", HttpStatus.NOT_FOUND);

        try {
            schoolService.removeClassFromSchool(classId, schoolOptional.get());
        }
        catch(ResourcesNotCorrelatedException e) {
            return new ResponseEntity<>("Clasa nu este a scolii dumneavoastra", HttpStatus.BAD_REQUEST);
        }
        catch(NotFoundException e) {
            return new ResponseEntity<>("Clasa nu a fost gasita", HttpStatus.NOT_FOUND);
        }
        catch(Exception e) {
            return new ResponseEntity<>("Eroare la stergerea clasei", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return ResponseEntity.ok("Clasa stearsa cu succes");
    }

    @PostMapping(path = "/addTeacherToClass")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addTeacherToClass(@RequestHeader("Authorization") String token, @RequestBody AddTeacherToClassDTO addTeacherToClassDTO) {
        Claims principalClaim = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = principalClaim.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return ResponseEntity.badRequest().body("Unauthorized");

        String principalUsername = principalClaim.getSubject();

        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);

        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Principal has no school assigned!", HttpStatus.NOT_FOUND);

        School school = schoolOptional.get();

        List<Class> classes = classService.getClassesBySchoolId(school.getId());

        Class cls = classes.stream().filter(c -> c.getId().equals(addTeacherToClassDTO.getClassId())).findFirst().orElse(null);

        if (cls == null)
            return new ResponseEntity<>("Class not found!", HttpStatus.NOT_FOUND);

        User teacher = userService.getUserById(addTeacherToClassDTO.getTeacherId());

        if (teacher == null)
            return new ResponseEntity<>("Teacher not found!", HttpStatus.NOT_FOUND);

        if (!teacher.isTeacher())
            return new ResponseEntity<>("User is not a teacher!", HttpStatus.BAD_REQUEST);

        Optional<Class> classOptional = classService.getClassesByTeacherId(addTeacherToClassDTO.getTeacherId());

        if (classOptional.isPresent())
            return new ResponseEntity<>("Teacher already has a class assigned!", HttpStatus.BAD_REQUEST);

        if(cls.getSchool().getId().equals(teacher.getSchoolTeacher().getId()))
            return new ResponseEntity<>("Teacher is not from the same school as the class!", HttpStatus.BAD_REQUEST);

        cls.setTeacher(teacher);
        classService.addClass(cls);

        return ResponseEntity.ok("Teacher added to class");
    }

    @PostMapping(path = "/changeClassTeacher")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> changeClassTeacher(@RequestHeader("Authorization") String token, @RequestBody AddTeacherToClassDTO addTeacherToClassDTO) {
        Claims principalClaim = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = principalClaim.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return ResponseEntity.badRequest().body("Unauthorized");

        String principalUsername = principalClaim.getSubject();

        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);

        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Principal has no school assigned!", HttpStatus.NOT_FOUND);

        School school = schoolOptional.get();

        List<Class> classes = classService.getClassesBySchoolId(school.getId());

        Class cls = classes.stream().filter(c -> c.getId().equals(addTeacherToClassDTO.getClassId())).findFirst().orElse(null);

        if (cls == null)
            return new ResponseEntity<>("Class not found!", HttpStatus.NOT_FOUND);

        User teacher = userService.getUserById(addTeacherToClassDTO.getTeacherId());

        if (teacher == null)
            return new ResponseEntity<>("Teacher not found!", HttpStatus.NOT_FOUND);

        if (!teacher.isTeacher())
            return new ResponseEntity<>("User is not a teacher!", HttpStatus.BAD_REQUEST);

        Optional<Class> classOptional = classService.getClassesByTeacherId(addTeacherToClassDTO.getTeacherId());

        if (classOptional.isPresent()) {
            /// swap teachers
            Class otherClass = classOptional.get();
            User clsTeacher = cls.getTeacher();
            cls.setTeacher(null);
            classService.addClass(cls);
            otherClass.setTeacher(clsTeacher);
            cls.setTeacher(teacher);

            classService.addClass(otherClass);
            classService.addClass(cls);

            return new ResponseEntity<>("Both teaches has assigned classes, so we swap!", HttpStatus.BAD_REQUEST);
        }

        if(cls.getSchool().getId().equals(teacher.getSchoolTeacher().getId()))
            return new ResponseEntity<>("Teacher is not from the same school as the class!", HttpStatus.BAD_REQUEST);

        cls.setTeacher(teacher);
        classService.addClass(cls);

        return ResponseEntity.ok("Teacher added to class");
    }

    @GetMapping(path = "/getClasses")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getClasses(@RequestHeader("Authorization") String token) {
        Claims principalClaim = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = principalClaim.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return ResponseEntity.badRequest().body("Unauthorized");

        String principalUsername = principalClaim.getSubject();

        Optional<School> schoolOptional = schoolService.getSchoolByPrincipalUsername(principalUsername);

        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("Principal has no school assigned!", HttpStatus.NOT_FOUND);

        School school = schoolOptional.get();

        List<Class> classes = classService.getClassesBySchoolId(school.getId());

        return ResponseEntity.ok(classes);
    }
}
