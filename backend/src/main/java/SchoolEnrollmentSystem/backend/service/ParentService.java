package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.Parent;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.repository.ParentRepository;
import SchoolEnrollmentSystem.backend.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@AllArgsConstructor
public class ParentService {
    @Autowired
    private ParentRepository parentRepository;
    private StudentRepository studentRepository;

    private void addParent(Parent parent)
    {
        parentRepository.save(parent);
    }

    private void deleteParent(Integer id)
    {
        Parent parent = parentRepository.getReferenceById(id);

        for (Student student : parent.getStudents())
        {
            studentRepository.deleteById(student.getId());
        }

        parentRepository.deleteById(parent.getId());
    }
}
