package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.Parent;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.repository.ParentRepository;
import SchoolEnrollmentSystem.backend.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.Optional;
import java.util.Set;

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
        Optional<Parent> optionalParent = parentRepository.findById(id);

        if (optionalParent.isPresent()) {
            Parent parent = optionalParent.get();

            Set<Student> students = parent.getStudents();
            studentRepository.deleteAll(students);
            parentRepository.deleteById(id);
        }
    }

    public Optional<Parent> findById(Integer id) {
        return parentRepository.findById(id);
    }
}
