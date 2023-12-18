package SchoolEnrollmentSystem.backend.repository;

import SchoolEnrollmentSystem.backend.persistence.Teacher;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TeacherRepostiory extends JpaRepository<Teacher, Integer> {
}
