package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.repository.TeacherRepostiory;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import SchoolEnrollmentSystem.backend.persistence.Teacher;
import SchoolEnrollmentSystem.backend.persistence.Class;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class TeacherService {
    @Autowired
    private TeacherRepostiory teacherRepostiory;
    private ClassRepository classRepository;

    public Teacher save(Teacher teacher) {
        return teacherRepostiory.save(teacher);
    }

    public Teacher update(Teacher teacher) {
        return teacherRepostiory.save(teacher);
    }

    public List<Teacher> findAll() {
        return teacherRepostiory.findAll();
    }

    public Optional<Teacher> findById(Integer id) {
        return teacherRepostiory.findById(id);
    }
    public void delete(Integer id) {
        Optional<Teacher> optionalTeacher = findById(id);
        if (optionalTeacher.isPresent()) {
            Teacher teacher = optionalTeacher.get();
            Class teachingClass = teacher.getTeachingClass();

            if (teachingClass != null) {
                teachingClass.setTeacher(null);
            }
            if (teachingClass != null)
            {
                classRepository.save(teachingClass);
            }
            teacherRepostiory.deleteById(id);
        }
    }
}
