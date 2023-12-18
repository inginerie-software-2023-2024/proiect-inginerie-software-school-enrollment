package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.persistence.Class;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class ClassService {
    @Autowired
    private ClassRepository classRepository;

    private void addClass(Class c)
    {
        classRepository.save(c);
    }

    private void deleteClass(Integer id)
    {
        classRepository.deleteById(id);
    }
}
