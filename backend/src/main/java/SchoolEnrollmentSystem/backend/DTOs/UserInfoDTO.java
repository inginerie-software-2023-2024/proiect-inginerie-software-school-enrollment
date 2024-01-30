package SchoolEnrollmentSystem.backend.DTOs;

import lombok.Data;

@Data
public class UserInfoDTO {
    private String username;
    private String firstName;
    private String lastName;
    private String email;

    public UserInfoDTO(String username, String firstName, String lastName, String email) {
        this.username = username;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
    }
}
