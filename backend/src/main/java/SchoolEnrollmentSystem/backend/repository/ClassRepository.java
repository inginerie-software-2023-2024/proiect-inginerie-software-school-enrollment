package SchoolEnrollmentSystem.backend.repository;

import SchoolEnrollmentSystem.backend.persistence.Class;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ClassRepository extends JpaRepository<Class, Integer> {
    List<Class> findBySchoolId(Integer schoolId);

    Optional<Class> findTopByTeacherId(Integer teacherId);
}
