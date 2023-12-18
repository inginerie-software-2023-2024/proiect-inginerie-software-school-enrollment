package SchoolEnrollmentSystem.backend.repository;

import SchoolEnrollmentSystem.backend.persistence.Principal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PrincipalRepository extends JpaRepository<Principal, Integer> {
}
