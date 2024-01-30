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
    private String parentLastName;
    private String parentFirstName;
    private Integer requiredGrade;

    StudentDTO() {}

    public StudentDTO(Integer age, String firstName, String lastName, String cnp, String parentUsername) {
        this.age = age;
        this.firstName = firstName;
        this.lastName = lastName;
        this.cnp = cnp;
        this.parentUsername = parentUsername;
    }

    public StudentDTO(
            Integer id,
            Integer age,
            String firstName,
            String lastName,
            String cnp,
            String parentUsername,
            String parentLastName,
            String parentFirstName,
            Integer requiredGrade
    ) {
        this(age, firstName, lastName, cnp, parentUsername);
        this.id = id;
        this.parentLastName = parentLastName;
        this.parentFirstName = parentFirstName;
        this.requiredGrade = requiredGrade;
    }
}
