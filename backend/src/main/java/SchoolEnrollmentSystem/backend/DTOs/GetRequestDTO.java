package SchoolEnrollmentSystem.backend.DTOs;

import SchoolEnrollmentSystem.backend.enums.RequestStatus;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class GetRequestDTO {
    private Integer id;
    private Integer studentId;

    private Integer grade;

    private Integer schoolId;

    private RequestStatus status;
}
