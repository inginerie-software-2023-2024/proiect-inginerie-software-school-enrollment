package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.DTOs.SendUserDTO;
import SchoolEnrollmentSystem.backend.DTOs.SentPrincipalsDTO;
import SchoolEnrollmentSystem.backend.Utils.JwtUtil;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.service.UserService;
import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import io.jsonwebtoken.Claims;

import java.util.ArrayList;
import java.util.List;


@RestController
@AllArgsConstructor
@RequestMapping("/admin")
public class AdminController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @GetMapping(path = "/getAllUsersForAdmin")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getAllUsers(@RequestHeader("Authorization") String token) {
        Claims adminClaim = jwtUtil.resolveClaims(token);
        Boolean isAdmin = adminClaim.get("admin", Boolean.class);
        if(isAdmin == null || !isAdmin)
            return ResponseEntity.badRequest().body("Unauthorized");

        List<User> allUsers = userService.getAllUsers();
        List<SendUserDTO> sendUserDTOS = new ArrayList();

        for (User user : allUsers) {
            if (user.getUsername().equals(adminClaim.getSubject())) {
                continue;
            }
            SendUserDTO sendUserDTO = new SendUserDTO();
            sendUserDTO.setId(user.getId());
            sendUserDTO.setUsername(user.getUsername());
            sendUserDTO.setPrincipal(user.isDirector());
            sendUserDTO.setTeacher(user.isTeacher());
            sendUserDTOS.add(sendUserDTO);
        }
        return ResponseEntity.ok(sendUserDTOS);
    }

    @PostMapping(path = "/setRoles")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> changeRole(@RequestHeader("Authorization") String token, @RequestBody SendUserDTO user) {
        Claims adminClaim = jwtUtil.resolveClaims(token);
        Boolean isAdmin = adminClaim.get("admin", Boolean.class);
        if(isAdmin == null || !isAdmin)
            return ResponseEntity.badRequest().body("Unauthorized");


        User userToChange = userService.getUserById(user.getId());
        userToChange.setDirector(user.getPrincipal());
        userToChange.setTeacher(user.getTeacher());
        userService.addUser(userToChange);

        return ResponseEntity.ok("Roles changed successfully!");
    }

    @GetMapping(path = "/getPrincipals")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getPrincipals(@RequestHeader("Authorization") String token) {
        Claims adminClaim = jwtUtil.resolveClaims(token);
        Boolean isAdmin = adminClaim.get("admin", Boolean.class);
        if(isAdmin == null || !isAdmin)
            return ResponseEntity.badRequest().body("Unauthorized");

        List<User> allUsers = userService.getAllUsers();

        List<SentPrincipalsDTO> principals = new ArrayList();

        for (User user : allUsers) {
            if (user.isDirector()) {
                SentPrincipalsDTO principal = new SentPrincipalsDTO();
                principal.setId(user.getId());
                principal.setUsername(user.getUsername());
                principal.setFirstName(user.getFirstName());
                principal.setLastName(user.getLastName());
                principal.setEmail(user.getEmail());
                principal.setSchoolId(user.getSchool().getId());
                principal.setSchoolName(user.getSchool().getName());
                principals.add(principal);
            }
        }

        return ResponseEntity.ok(principals);
    }
}
