package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.LoginDTO;
import SchoolEnrollmentSystem.backend.DTOs.RegisterDTO;
import SchoolEnrollmentSystem.backend.DTOs.UserInfoDTO;
import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
import SchoolEnrollmentSystem.backend.persistence.Admin;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.service.AdminService;
import io.jsonwebtoken.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.web.bind.annotation.*;
import SchoolEnrollmentSystem.backend.service.UserService;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        if (userService.existsByUsername(registerDTO.getUsername())) {
            return ResponseEntity.badRequest().body("Username already exists");
        }
        if (userService.existsByEmail(registerDTO.getEmail())) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setUsername(registerDTO.getUsername());
        user.setEmail(registerDTO.getEmail());
        user.setFirstName(registerDTO.getFirstName());
        user.setLastName(registerDTO.getLastName());
        user.setParent(true);

        String salt = BCrypt.gensalt();
        String hashedPassword = BCrypt.hashpw(registerDTO.getPassword(), salt);

        user.setPasswordHash(hashedPassword);
        user.setPasswordSalt(salt);

        userService.addUser(user);

        return new ResponseEntity<>("User registered successfully", HttpStatus.OK);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO) {
        System.out.println(loginDTO.getUsername());
        User user = userService.findByUsername(loginDTO.getUsername());

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if (!BCrypt.hashpw(loginDTO.getPassword(), user.getPasswordSalt()).equals(user.getPasswordHash())) {
            return ResponseEntity.badRequest().body("Incorrect password");
        }

        String token = jwtUtil.createToken(user);

        return new ResponseEntity<>(token, HttpStatus.OK);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<?> deleteAccount(
            @RequestHeader("Authorization") String token,
            @RequestBody LoginDTO dummyLoginDTO
    ) {
        String password = dummyLoginDTO.getPassword();
        System.out.println("Parola primita: " + password);
        Claims claims = jwtUtil.resolveClaims(token);
        String username = claims.getSubject();
        User user = userService.findByUsername(username);
        Boolean isAdmin = claims.get("admin", Boolean.class);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        boolean anyStudentWithSchool = user.getStudents().stream()
                                            .anyMatch(student -> student.getSchool() != null);
        if(anyStudentWithSchool)
            return new ResponseEntity<>(
                    "Cannot delete user because there it has children enrolled to a school",
                    HttpStatus.FORBIDDEN
            );

        if (!BCrypt.hashpw(password, user.getPasswordSalt()).equals(user.getPasswordHash()))
            return new ResponseEntity<>("Incorrect password", HttpStatus.BAD_REQUEST);

        userService.deleteUserById(user.getId());
        if(isAdmin != null && isAdmin) {
            Admin admin = adminService.findByUsername(username);
            adminService.deleteAdminById(admin.getId());
        }

        return new ResponseEntity<>("User account deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/getAllUsers")
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String token) {
        Claims adminClaim = jwtUtil.resolveClaims(token);
        Boolean isAdmin = adminClaim.get("admin", Boolean.class);

        if (!isAdmin) {
            return ResponseEntity.badRequest().body("Not an admin");
        }

        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @PutMapping("/updateUser")
    public ResponseEntity<?> updateUser(
            @RequestHeader("Authorization") String token,
            @RequestBody UserInfoDTO updatedUser
    ) {
        String username = jwtUtil.resolveClaims(token).getSubject();
        User user = userService.findByUsername(username);
        Boolean isAdmin = jwtUtil.resolveClaims(token).get("admin", Boolean.class);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());

        userService.updateUser(user);

        if(isAdmin != null && isAdmin) {
            Admin admin = adminService.findByUsername(username);
            admin.setUsername(updatedUser.getUsername());
            adminService.updateAdmin(admin);
        }

        return new ResponseEntity<>("User updated.", HttpStatus.OK);
    }

    @PutMapping("/changePassword")
    public ResponseEntity<?> changePassword(
            @RequestHeader("Authorization") String token,
            @RequestBody String newPassword
    ) {
        Claims claims = jwtUtil.resolveClaims(token);
        String username = claims.getSubject();
        User user = userService.findByUsername(username);
        Boolean isAdmin = claims.get("admin", Boolean.class);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        String salt = BCrypt.gensalt();
        String hashedPassword = BCrypt.hashpw(newPassword, salt);

        user.setPasswordHash(hashedPassword);
        user.setPasswordSalt(salt);

        userService.updateUser(user);

        if(isAdmin != null && isAdmin) {
            Admin admin = adminService.findByUsername(username);
            admin.setHash(hashedPassword);
            admin.setSalt(salt);
            adminService.updateAdmin(admin);
        }

        return new ResponseEntity<>("Password changed successfully", HttpStatus.OK);
    }

    @PostMapping("/changeRole/{role}")
    public ResponseEntity<?> changeRole(
            @RequestHeader("Authorization") String token,
            @PathVariable String role
    ) {
        String username = jwtUtil.resolveClaims(token).getSubject();
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        if(role.equals("admin") && adminService.findByUsername(username) == null)
            return new ResponseEntity<>("User is not an admin", HttpStatus.FORBIDDEN);
        else if (role.equals("teacher") && !user.isTeacher())
            return new ResponseEntity<>("User is not a teacher", HttpStatus.FORBIDDEN);
        else if(role.equals("principal") && !user.isDirector())
            return new ResponseEntity<>("User is not a principal", HttpStatus.FORBIDDEN);

        String newToken = jwtUtil.createToken(user, role);

        return new ResponseEntity<>(newToken, HttpStatus.OK);
    }

    @GetMapping("/{username}")
    public ResponseEntity<?> getUserByUsername(
            @PathVariable String username,
            @RequestHeader("Authorization") String token
    ) {
        Claims claims = jwtUtil.resolveClaims(token);
        Boolean isAdmin = claims.get("admin", Boolean.class);
        Boolean isPrincipal = claims.get("principal", Boolean.class);
        String usernameFromToken = claims.getSubject();
        if((isAdmin == null || !isAdmin) && (isPrincipal == null || !isPrincipal) && !username.equals(usernameFromToken))
            return new ResponseEntity<>("Not authorized", HttpStatus.UNAUTHORIZED);

        User user = userService.findByUsername(username);

        if (user == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        UserInfoDTO userInfoDTO = new UserInfoDTO(
                user.getUsername(),
                user.getFirstName(),
                user.getLastName(),
                user.getEmail()
        );

        return new ResponseEntity<>(userInfoDTO, HttpStatus.OK);
    }
}