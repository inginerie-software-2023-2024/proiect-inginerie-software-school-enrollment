package SchoolEnrollmentSystem.backend.persistence;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Class {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    private Integer id;

    @OneToOne()
    private User teacher;

    @ManyToOne()
    private School school;

    public School getSchool() {
        return school;
    }

    public User getTeacher() {
        return teacher;
    }
}
