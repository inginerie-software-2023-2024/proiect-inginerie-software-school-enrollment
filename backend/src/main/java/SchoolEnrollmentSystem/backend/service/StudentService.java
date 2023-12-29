package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.ApplicationRepository;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import SchoolEnrollmentSystem.backend.repository.StudentRepository;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.persistence.Application;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.Set;

@Service
@AllArgsConstructor
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;
    private ApplicationRepository applicationRepository;
    private SchoolRepository schoolRepository;
    private UserRepository userRepository;

    public void addStudent(Student student)
    {
        studentRepository.save(student);
    }

    public void deleteStudent(Integer id)
    {
//        Optional<Student> optionalStudent = studentRepository.findById(id);
//
//        if (optionalStudent.isPresent()) {
//            Student student = optionalStudent.get();
//
//            User parent = student.getParent();
//            if (parent != null) {
//                parent.getStudents().remove(student);
//                userRepository.save(parent);
//            }
//
//            Set<Application> applications = student.getApplications();
//            for (Application application : applications) {
//                School school = application.getSchool();
//                if (school != null) {
//                    school.getApplications().remove(application);
//                    schoolRepository.save(school);
//                }
//                applicationRepository.delete(application);
//            }
//            studentRepository.deleteById(id);
//        }
    }

    public Student update(Student student) {
        return studentRepository.save(student);
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public Optional<Student> findById(Integer id) {
        return studentRepository.findById(id);
    }
}
