package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.AddTeacherToClassDTO;
import SchoolEnrollmentSystem.backend.DTOs.SchoolAddDTO;
import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
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
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addSchool(@RequestHeader("Authorization") String token, @RequestBody SchoolAddDTO schoolAddDTO) {
        Claims principalClaim = jwtUtil.resolveClaims(token);
        Boolean isPrincipal = principalClaim.get("principal", Boolean.class);

        if(isPrincipal == null || !isPrincipal)
            return ResponseEntity.badRequest().body("Unauthorized");

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

    @PostMapping(path = "/addClass")
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<?> addClass(@RequestHeader("Authorization") String token) {
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

        try {
            schoolService.addClass(c);

        } catch (Exception e) {
            System.out.println(e.getMessage());
        }

        return ResponseEntity.ok("Class added");
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
