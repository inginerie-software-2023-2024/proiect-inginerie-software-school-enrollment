package SchoolEnrollmentSystem.backend.DTOs;

import lombok.Getter;

@Getter
public class AddTeacherToClassDTO {
    private Integer teacherId;
    private Integer classId;
}
