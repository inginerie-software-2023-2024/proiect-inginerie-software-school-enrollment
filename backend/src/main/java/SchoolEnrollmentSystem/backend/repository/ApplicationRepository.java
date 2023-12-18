package SchoolEnrollmentSystem.backend.repository;

import SchoolEnrollmentSystem.backend.persistence.Application;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ApplicationRepository extends JpaRepository<Application, Integer> {
}
