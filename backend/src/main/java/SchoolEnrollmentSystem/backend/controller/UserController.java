package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.LoginDTO;
import SchoolEnrollmentSystem.backend.DTOs.RegisterDTO;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.security.UserDetailsServiceImpl;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import SchoolEnrollmentSystem.backend.service.UserService;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import java.io.Console;

@RestController
@AllArgsConstructor
@RequestMapping("/users")
public class UserController {
    @Bean
    private BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
    @Lazy
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;


    @Autowired
    private UserService userService;

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
        user.set_parent(true);

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

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginDTO.getUsername(),
                        loginDTO.getPassword()
                )
        );

        return new ResponseEntity<>("User logged in successfully", HttpStatus.OK);
    }
}