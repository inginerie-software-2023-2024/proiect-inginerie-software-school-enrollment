package SchoolEnrollmentSystem.backend.DTOs;

import lombok.Data;

@Data
public class StudentDTO {
    private Integer id;
    private Integer age;
    private String firstName;
    private String lastName;
    private String cnp;
    private String parentUsername;

    public StudentDTO(Integer age, String firstName, String lastName, String cnp, String parentUsername) {
        this.age = age;
        this.firstName = firstName;
        this.lastName = lastName;
        this.cnp = cnp;
        this.parentUsername = parentUsername;
    }
}
