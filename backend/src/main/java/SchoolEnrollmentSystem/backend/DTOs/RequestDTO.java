package SchoolEnrollmentSystem.backend.DTOs;

import lombok.Data;

@Data
public class RequestDTO {
    private Integer studentId;
    private Integer grade;
    private Integer schoolId;
}
