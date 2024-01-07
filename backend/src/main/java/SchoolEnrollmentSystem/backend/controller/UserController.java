package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.LoginDTO;
import SchoolEnrollmentSystem.backend.DTOs.RegisterDTO;
import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
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
    public ResponseEntity<?> deleteAccount(@RequestHeader("Authorization") String token) {
        String username = jwtUtil.resolveClaims(token).getSubject();
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        userService.deleteUserById(user.getId());

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

    @PostMapping("/updateUser")
    public ResponseEntity<?> updateUser(@RequestHeader("Authorization") String token, @RequestBody RegisterDTO updatedUser) {
        String username = jwtUtil.resolveClaims(token).getSubject();
        User user = userService.findByUsername(username);

        if (user == null) {
            return ResponseEntity.badRequest().body("User not found");
        }

        user.setUsername(updatedUser.getUsername());
        user.setEmail(updatedUser.getEmail());
        user.setFirstName(updatedUser.getFirstName());
        user.setLastName(updatedUser.getLastName());

        User databaseUser = userService.findByUsername(updatedUser.getUsername());
        if (BCrypt.hashpw(updatedUser.getPassword(), databaseUser.getPasswordSalt()).equals(databaseUser.getPasswordHash())) {
            user.setPasswordSalt(databaseUser.getPasswordSalt());
            user.setPasswordHash(databaseUser.getPasswordHash());
        } else {
            String salt = BCrypt.gensalt();
            String hashedPassword = BCrypt.hashpw(updatedUser.getPassword(), salt);

            user.setPasswordHash(hashedPassword);
            user.setPasswordSalt(salt);
        }


        userService.updateUser(user.getId(), user);
        return new ResponseEntity<>("User updated.", HttpStatus.OK);
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
}