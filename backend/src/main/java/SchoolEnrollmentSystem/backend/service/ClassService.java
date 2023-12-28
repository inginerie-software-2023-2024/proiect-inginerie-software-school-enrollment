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

import java.util.Optional;

@Service
@AllArgsConstructor
public class ClassService {
    @Autowired
    private ClassRepository classRepository;
    private SchoolRepository schoolRepository;
    private UserRepository userRepository;

    private void addClass(Class c)
    {
        classRepository.save(c);
    }

    private void deleteClass(Integer id)
    {
        Optional<Class> optionalClass = classRepository.findById(id);

        if (optionalClass.isPresent()) {
            Class aClass = optionalClass.get();

            School school = aClass.getSchool();

            User teacher = aClass.getTeacher();
            if (teacher != null) {
                teacher.setTeachingClass(null);
                userRepository.save(teacher);
            }

            if (school != null) {
                school.getClasses().remove(aClass);
                schoolRepository.save(school);
            }

            classRepository.deleteById(id);
        }
    }

    public Optional<Class> findById(Integer id) {
        return classRepository.findById(id);
    }
}
