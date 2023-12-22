package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.Principal;
import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.persistence.Class;
import SchoolEnrollmentSystem.backend.persistence.Teacher;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import SchoolEnrollmentSystem.backend.repository.TeacherRepostiory;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class ClassService {
    @Autowired
    private ClassRepository classRepository;
    private TeacherRepostiory teacherRepostiory;
    private SchoolRepository schoolRepository;

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

            Teacher teacher = aClass.getTeacher();
            if (teacher != null) {
                teacher.setTeachingClass(null);
                teacherRepostiory.save(teacher);
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
