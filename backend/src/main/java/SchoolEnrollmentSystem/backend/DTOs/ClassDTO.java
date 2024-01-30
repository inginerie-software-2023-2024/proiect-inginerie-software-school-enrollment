package SchoolEnrollmentSystem.backend.DTOs;

import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.persistence.Class;
import lombok.Data;

import java.util.Set;

@Data
public class ClassDTO {
    private Integer id;
    private String name;
    private Integer maxNumberOfStudents;
    private User teacher;
    private School school;
    private Set<Student> students;

    public ClassDTO() {
    }

    public ClassDTO(Class classEntity) {
        this.id = classEntity.getId();
        this.name = classEntity.getName();
        this.maxNumberOfStudents = classEntity.getMaxNumberOfStudents();
        this.teacher = classEntity.getTeacher();
        this.school = classEntity.getSchool();
        this.students = classEntity.getStudents();
    }
}
