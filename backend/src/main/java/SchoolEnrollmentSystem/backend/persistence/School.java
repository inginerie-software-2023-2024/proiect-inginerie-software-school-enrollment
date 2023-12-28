package SchoolEnrollmentSystem.backend.persistence;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String name;

    private String location;

    private Integer points;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "school")
    @JsonIgnoreProperties(value = { "teacher", "school" }, allowSetters = true)
    private List<Class> classes;

    @OneToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties(value = { "school" }, allowSetters = true)
    @JoinColumn(unique = true)
    private User principal;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "school")
    @JsonIgnoreProperties(value = { "student", "school" }, allowSetters = true)
    private Set<Application> applications = new HashSet<>();

    public List<Class> getClasses() {
        return classes;
    }

    public Set<Application> getApplications() {
        return applications;
    }
}
