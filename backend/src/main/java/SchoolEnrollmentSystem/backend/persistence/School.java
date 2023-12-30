package SchoolEnrollmentSystem.backend.persistence;

import com.fasterxml.jackson.annotation.JsonIgnore;
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
@Table(name = "schools")
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false)
    private String name;

    private String description;

    @Column(name="principal_id", nullable = false, insertable = false, updatable = false)
    private Integer principalId;

    @OneToOne()
    @JsonIgnore
    private User principal;

    @OneToMany(mappedBy = "school", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Request> requests = new HashSet<>();
}
