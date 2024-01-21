package SchoolEnrollmentSystem.backend.repository;

import SchoolEnrollmentSystem.backend.persistence.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ClassRepository extends JpaRepository<Class, Integer> {
    List<Class> findBySchoolId(Integer schoolId);

    Optional<Class> findTopByTeacherId(Integer teacherId);

    @Query("SELECT c FROM Class c WHERE c.name = ?1 and c.school.id = ?2")
    Optional<Class> findByNameAndSchool(String name, Integer schoolId);
}
