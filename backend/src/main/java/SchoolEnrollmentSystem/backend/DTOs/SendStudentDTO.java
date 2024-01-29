package SchoolEnrollmentSystem.backend.DTOs;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class SendStudentDTO {
    private Integer id;
    private String firstName;
    private String lastName;
    private String cnp;
    private Integer schoolClassId;
    private String schoolClassName;
    private Integer schoolId;
    private String schoolName;
    private Integer parentId;
    private String parentFirstName;
    private String parentLastName;
    private Integer age;
}
