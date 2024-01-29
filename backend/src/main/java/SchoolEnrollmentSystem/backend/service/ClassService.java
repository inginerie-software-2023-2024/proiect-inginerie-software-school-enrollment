package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.DTOs.ClassDTO;
import SchoolEnrollmentSystem.backend.exception.AlreadyAssignedException;
import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.persistence.Class;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import SchoolEnrollmentSystem.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class ClassService {
    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Autowired
    private UserRepository userRepository;

    public Class addClass(Class c) throws AlreadyAssignedException
    {
        if(classRepository.findByNameAndSchoolId(c.getName(), c.getSchool().getId()).isPresent())
            throw new AlreadyAssignedException();

        return classRepository.save(c);
    }

    public void deleteClassById(Integer id) throws NotFoundException
    {
        Optional<Class> classOptional = classRepository.findById(id);
        if(classOptional.isEmpty())
            throw new NotFoundException();

        Class classToDelete = classOptional.get();
        classToDelete.getSchool().getClasses().remove(classToDelete);
        schoolRepository.save(classToDelete.getSchool());

        if(classToDelete.getTeacher() != null) {
            classToDelete.getTeacher().setSchoolClass(null);
            userRepository.save(classToDelete.getTeacher());
        }

        classToDelete.getStudents()
                .forEach(student -> student.setSchoolClass(null));
        classRepository.deleteById(id);
    }

    public Optional<Class> findById(Integer id) {
        return classRepository.findById(id);
    }

    public List<Class> getClassesBySchoolId(Integer schoolId) {
        return classRepository.findBySchoolId(schoolId);
    }

    public Optional<Class> getClassesByTeacherId(Integer teacherId) {
        return classRepository.findTopByTeacherId(teacherId);
    }

    public void updateClassDetails(Integer classId, ClassDTO classDTO) {
        Optional<Class> classOptional = classRepository.findById(classId);
        if(classOptional.isEmpty())
            throw new NotFoundException();

        Class classToUpdate = classOptional.get();
        classToUpdate.setName(classDTO.getName());
        classToUpdate.setMaxNumberOfStudents(classDTO.getMaxNumberOfStudents());
        classRepository.save(classToUpdate);
    }
}

