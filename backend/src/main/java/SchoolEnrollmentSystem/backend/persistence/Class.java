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

    @JsonIgnoreProperties(value = { "teachingClass" }, allowSetters = true)
    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(unique = true)
    private User teacher;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "principal", "applications", "classes" }, allowSetters = true)
    private School school;

    public School getSchool() {
        return school;
    }

    public User getTeacher() {
        return teacher;
    }
}
