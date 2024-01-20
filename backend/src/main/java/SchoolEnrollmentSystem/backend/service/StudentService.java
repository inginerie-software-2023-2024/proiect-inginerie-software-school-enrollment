package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.DTOs.StudentDTO;
import SchoolEnrollmentSystem.backend.exception.*;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.repository.StudentRepository;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.persistence.Class;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class StudentService {
    @Autowired
    private StudentRepository studentRepository;
    @Autowired
    private ClassRepository classRepository;
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
        Student studentTemp = studentRepository.findByCnp(studentDTO.getCnp());
        if(studentRepository.findByCnp(studentDTO.getCnp()) != null && !studentTemp.getId().equals(studentDTO.getId()))
            throw new UniqueResourceExistent();

        if(studentRepository.findById(studentDTO.getId()).isEmpty())
            throw new NotFoundException();

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

    public void assignStudentToClass(Integer studentId, Integer classId)
            throws NotFoundException, ResourcesNotCorrelatedException, AlreadyAssignedException {
        Optional<Student> studentOptional = studentRepository.findById(studentId);
        Optional<Class> classOptional = classRepository.findById(classId);

        if(studentOptional.isEmpty() || classOptional.isEmpty())
            throw new NotFoundException();

        Student student = studentOptional.get();
        Class myClass = classOptional.get();

        if(student.getSchool() == null || !student.getSchool().getId().equals(myClass.getSchool().getId()))
            throw new ResourcesNotCorrelatedException();

        if(student.getSchoolClass() != null)
            throw new AlreadyAssignedException();

        student.setSchoolClass(myClass);
        myClass.getStudents().add(student);
        studentRepository.save(student);
        classRepository.save(myClass);
    }

    public void removeStudentFromClass(Integer studentId, Integer classId)
            throws NotFoundException, ResourcesNotCorrelatedException {
        Optional<Student> studentOptional = studentRepository.findById(studentId);
        Optional<Class> classOptional = classRepository.findById(classId);

        if(studentOptional.isEmpty() || classOptional.isEmpty())
            throw new NotFoundException();

        Student student = studentOptional.get();
        Class myClass = classOptional.get();

        if(!myClass.getStudents().contains(student))
            throw new ResourcesNotCorrelatedException();

        student.setSchoolClass(null);
        myClass.getStudents().remove(student);
        studentRepository.save(student);
        classRepository.save(myClass);
    }

    public void changeStudentClass(Integer studentId, Integer classId) throws Exception {

        Student student = findById(studentId).orElseThrow(NotFoundException::new);

        if(student.getSchoolClass() == null)
            throw new NullArgumentException();

        Integer currentStudentClassId = student.getSchoolClass().getId();
        try {
            removeStudentFromClass(studentId, currentStudentClassId);
        }
        finally {
            assignStudentToClass(studentId, currentStudentClassId);
        }

        assignStudentToClass(studentId, classId);
    }
}
