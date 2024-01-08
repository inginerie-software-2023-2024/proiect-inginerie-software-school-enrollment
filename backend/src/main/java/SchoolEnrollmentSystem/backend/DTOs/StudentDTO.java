package SchoolEnrollmentSystem.backend.DTOs;

import lombok.Data;

@Data
public class StudentDTO {
    private Integer age;
    private String firstName;
    private String lastName;
    private String cnp;
    private String parentUsername;
}
