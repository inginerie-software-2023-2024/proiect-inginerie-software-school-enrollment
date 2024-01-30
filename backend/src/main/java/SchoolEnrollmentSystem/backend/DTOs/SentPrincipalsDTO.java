package SchoolEnrollmentSystem.backend.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SentPrincipalsDTO {
    private Integer id;
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private Integer SchoolId;
    private String schoolName;
}
