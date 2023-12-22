package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.persistence.Principal;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.persistence.Class;
import SchoolEnrollmentSystem.backend.persistence.Application;
import SchoolEnrollmentSystem.backend.repository.ApplicationRepository;
import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.repository.PrincipalRepository;
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
    private PrincipalRepository principalRepository;
    private ClassRepository classRepository;
    private ApplicationRepository applicationRepository;

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    public School getSchoolById(Integer id) {
        Optional<School> optionalSchool = schoolRepository.findById(id);

        return optionalSchool.orElseThrow(NotFoundException::new);
    }

    public void deleteSchool(Integer id) {
        Optional<School> optionalSchool = schoolRepository.findById(id);
        if (optionalSchool.isPresent()) {
            School school = optionalSchool.get();

            List<Class> classes = school.getClasses();
            classRepository.deleteAll(classes);

            Set<Application> applications = school.getApplications();
            applicationRepository.deleteAll(applications);

            schoolRepository.deleteById(id);
        }
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

    public Optional<School> findById(Integer id) {
        return schoolRepository.findById(id);
    }
}
