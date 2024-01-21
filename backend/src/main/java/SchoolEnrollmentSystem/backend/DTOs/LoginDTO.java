package SchoolEnrollmentSystem.backend.DTOs;

import lombok.Getter;

public class LoginDTO {
    private String username;
    private String password;

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }
}
