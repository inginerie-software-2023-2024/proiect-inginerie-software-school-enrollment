package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.persistence.Class;
import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class SchoolService {
    @Autowired
    private SchoolRepository schoolRepository;
    private ClassRepository classRepository;

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    public void deleteSchool(Integer id) {
        schoolRepository.deleteById(id);
    }

    public void addSchool(School school) {
        schoolRepository.save(school);
    }

    public School update(School school) {
        return schoolRepository.save(school);
    }

    public List<School> findAll() {
        return schoolRepository.findAll();
    }

    public Optional<School> getSchoolById(Integer id) {
        return schoolRepository.findById(id);
    }
}
