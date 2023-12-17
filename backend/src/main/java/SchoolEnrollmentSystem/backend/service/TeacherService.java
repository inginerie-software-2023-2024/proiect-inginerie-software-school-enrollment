package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.repository.TeacherRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class TeacherService {
    @Autowired
    private TeacherRepository teacherRepository;
}
