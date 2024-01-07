package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.persistence.Class;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import SchoolEnrollmentSystem.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ClassService {
    @Autowired
    private ClassRepository classRepository;
    private SchoolRepository schoolRepository;
    private UserRepository userRepository;

    public void addClass(Class c)
    {
        classRepository.save(c);
    }

    private void deleteClass(Integer id)
    {

    }

    public Optional<Class> findById(Integer id) {
        return classRepository.findById(id);
    }

    public List<Class> getClassesBySchoolId(Integer schoolId) {
        return classRepository.findBySchoolId(schoolId);
    }

    public Optional<Class> getClassesByTeacherId(Integer teacherId) {
        return classRepository.findTopByTeacherId(teacherId);
    }
}

