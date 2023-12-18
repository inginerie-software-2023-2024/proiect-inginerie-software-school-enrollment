package SchoolEnrollmentSystem.backend.repository;

import SchoolEnrollmentSystem.backend.persistence.Class;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClassRepository extends JpaRepository<Class, Integer> {
}
