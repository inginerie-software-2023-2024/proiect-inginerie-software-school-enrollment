package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.exception.AlreadyAssignedException;
import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.exception.ResourcesNotCorrelatedException;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.persistence.Class;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.ClassRepository;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class SchoolService {
    @Autowired
    private SchoolRepository schoolRepository;
    @Autowired
    private ClassService classService;
    @Autowired
    private UserService userService;

    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }

    public void deleteSchool(Integer id) {
        schoolRepository.deleteById(id);
    }

    public void addSchool(School school) {
        schoolRepository.save(school);
    }

    public School update(School school) {
        return schoolRepository.save(school);
    }

    public List<School> findAll() {
        return schoolRepository.findAll();
    }

    public Optional<School> getSchoolById(Integer id) {
        return schoolRepository.findById(id);
    }

    public Optional<School> getSchoolByPrincipalUsername(String username) {
        return schoolRepository.findAll().stream().filter(school -> school.getPrincipal().getUsername().equals(username)).findFirst();
    }

    public Class addClass(Class c) throws AlreadyAssignedException {
        return classService.addClass(c);
    }

    public User addTeacherToSchool(String username, School school) throws AlreadyAssignedException, NotFoundException {
        User teacher = userService.findByUsername(username);
        if(teacher == null)
            throw new NotFoundException();

        if(teacher.getSchoolTeacher() != null)
            throw new AlreadyAssignedException();

        teacher.setSchoolTeacher(school);
        teacher.setTeacher(true);
        school.getTeachers().add(teacher);
        userService.updateUser(teacher);
        update(school);

        return teacher;
    }

    public void removeTeacherFromSchool(Integer teacherId, School school)
        throws NotFoundException, ResourcesNotCorrelatedException {

        User teacher = userService.getUserById(teacherId);

        if(teacher == null)
            throw new NotFoundException();

        if(teacher.getSchoolTeacher() == null || !teacher.getSchoolTeacher().getId().equals(school.getId()))
            throw new ResourcesNotCorrelatedException();


        school.getTeachers().remove(teacher);

        if(teacher.getSchoolClass() != null) {
            teacher.getSchoolClass().setTeacher(null);
            teacher.setSchoolClass(null);
        }

        teacher.setTeacher(false);
        teacher.setSchoolTeacher(null);

        userService.updateUser(teacher);
        update(school);
    }

    public void removeClassFromSchool(Integer classId, School school) throws ResourcesNotCorrelatedException {
        if(!isClassInSchool(classId, school))
            throw new ResourcesNotCorrelatedException();

        classService.deleteClassById(classId);
    }

    public boolean isClassInSchool(Integer classId, School school) {
        return school.getClasses().stream().anyMatch(c -> c.getId().equals(classId));
    }
}
