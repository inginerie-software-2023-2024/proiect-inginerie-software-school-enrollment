package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.Parent;
import SchoolEnrollmentSystem.backend.repository.ParentRepository;
import SchoolEnrollmentSystem.backend.repository.StudentRepository;
import SchoolEnrollmentSystem.backend.persistence.Student;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;
    private ParentRepository parentRepository;

    public void addStudent(Student student)
    {
        studentRepository.save(student);
    }

    public void deleteStudent(Integer id)
    {
        Student student = studentRepository.getReferenceById(id);
        Parent parent = student.getParent();
        parent.getStudents().removeIf(st -> st.getId().equals(student.getId()));
        parentRepository.save(parent);
    }
}
