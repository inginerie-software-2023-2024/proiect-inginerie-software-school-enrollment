package SchoolEnrollmentSystem.backend.DTOs;

import SchoolEnrollmentSystem.backend.persistence.User;
import lombok.Data;

@Data
public class TeacherGetDTO {
    private String username;
    private String firstName;
    private String lastName;
    private String email;
    private String schoolName;
    private String className;

    public TeacherGetDTO(User user) {
        username = user.getUsername();
        firstName = user.getFirstName();
        lastName = user.getLastName();
        email = user.getEmail();
        schoolName = user.getSchoolTeacher().getName();
        className = (user.getSchoolClass() == null)? "N/A" : user.getSchoolClass().getName();
    }
}
