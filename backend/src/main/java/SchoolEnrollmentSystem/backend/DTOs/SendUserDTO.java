package SchoolEnrollmentSystem.backend.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendUserDTO {
    private Integer id;
    private String username;
    private Boolean principal;
    private Boolean teacher;
}
