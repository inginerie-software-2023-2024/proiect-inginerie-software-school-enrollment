package SchoolEnrollmentSystem.backend.repository;

import SchoolEnrollmentSystem.backend.persistence.Parent;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ParentRepository extends JpaRepository<Parent, Integer> {
}
