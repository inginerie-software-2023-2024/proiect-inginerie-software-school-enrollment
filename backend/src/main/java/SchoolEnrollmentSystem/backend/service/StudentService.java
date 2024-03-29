package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.DTOs.StudentDTO;
import SchoolEnrollmentSystem.backend.exception.*;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.repository.RequestRepository;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import SchoolEnrollmentSystem.backend.repository.StudentRepository;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.persistence.Class;
import lombok.AllArgsConstructor;
import org.antlr.v4.runtime.misc.LogManager;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
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
    @Autowired
    private RequestRepository requestRepository;
    @Autowired
    private SchoolRepository schoolRepository;


    public Student addStudent(StudentDTO studentDTO) throws UniqueResourceExistent
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
        return student;
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
        student.setId(studentDTO.getId());
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
        removeStudentFromClass(studentId, currentStudentClassId);

        try {
            assignStudentToClass(studentId, classId);
        } catch (Exception e) {
            assignStudentToClass(studentId, currentStudentClassId);
        }
    }

    public Integer getRequiredGrade(Student student) {
        if(student == null || student.getSchool() == null)
            return -1;

        return student.getRequests().stream().toList().getFirst().getGrade();
    }

    public boolean parentHasStudentWithCNP(String parentUsername, String cnp) {
        return studentRepository.findAll().stream()
                .filter(student -> student.getParent().getUsername().equals(parentUsername))
                .anyMatch(student -> student.getCnp().equals(cnp));
    }

    public void deleteStudentByCNP(String cnp)
            throws NoSuchElementException {
        Student studentToDelete = studentRepository.findAll().stream()
                .filter(student -> student.getCnp().equals(cnp))
                .toList().getFirst();
        System.out.println("Am trecut de student");

        requestRepository.deleteAll(studentToDelete.getRequests());
        System.out.println("Am trecut de requesturi");
        if (studentToDelete.getSchool() != null) {
            studentToDelete.getSchool().getStudents().remove(studentToDelete);
            schoolRepository.save(studentToDelete.getSchool());
        }
        System.out.println("Am trecut de scoala");
        if (studentToDelete.getSchoolClass() != null) {
            studentToDelete.getSchoolClass().getStudents().remove(studentToDelete);
            classRepository.save(studentToDelete.getSchoolClass());
        }

        System.out.println("Am trecut de clasa");
        studentRepository.delete(studentToDelete);
        System.out.println("Am trecut de student");
    }
}
