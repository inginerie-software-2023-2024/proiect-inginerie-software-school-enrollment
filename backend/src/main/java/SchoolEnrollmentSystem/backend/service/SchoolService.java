package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SchoolService {
    private final SchoolRepository schoolRepository;

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    public School getSchoolById(Integer id) {
        Optional<School> optionalSchool = schoolRepository.findById(id);

        return optionalSchool.orElseThrow(NotFoundException::new);
    }

    public void deleteSchool(Integer id) {
        schoolRepository.delete(getSchoolById(id));
    }

    public void addSchool(School school) {
        schoolRepository.save(school);
    }
}
