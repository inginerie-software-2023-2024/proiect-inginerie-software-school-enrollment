package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.DTOs.StudentDTO;
import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.exception.UniqueResourceExistent;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import SchoolEnrollmentSystem.backend.repository.StudentRepository;
import SchoolEnrollmentSystem.backend.persistence.Student;
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
    @Autowired
    private SchoolRepository schoolRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;


    public void addStudent(StudentDTO studentDTO) throws UniqueResourceExistent
    {
        if(studentRepository.findByCnp(studentDTO.getCnp()) != null)
            throw new UniqueResourceExistent();

        User parent = userService.findByUsername(studentDTO.getParentUsername());
        if(parent == null)
            throw new NotFoundException();

        Student student = new Student();
        student.setAge(studentDTO.getAge());
        student.setFirstName(studentDTO.getFirstName());
        student.setLastName(studentDTO.getLastName());
        student.setCnp(studentDTO.getCnp());
        student.setParent(parent);
        studentRepository.save(student);
    }

    public void deleteStudent(Integer id) throws NotFoundException
    {
        if(studentRepository.findById(id).isEmpty())
            throw new NotFoundException();
        studentRepository.deleteById(id);
    }

    public void update(StudentDTO studentDTO) throws NotFoundException, UniqueResourceExistent {
       addStudent(studentDTO);
    }

    public List<Student> findAll() {
        return studentRepository.findAll();
    }

    public List<Student> findByParentUsername(String parentUsername) throws NotFoundException {
        User parent = userService.findByUsername(parentUsername);

        if (parent == null)
            throw new NotFoundException();

        return studentRepository.findAll().stream()
                .filter(student -> student.getParent().getUsername().equals(parentUsername))
                .toList();
    }

    public Optional<Student> findById(Integer id) {
        return studentRepository.findById(id);
    }
}
