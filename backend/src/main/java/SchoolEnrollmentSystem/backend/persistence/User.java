package SchoolEnrollmentSystem.backend.persistence;

import com.fasterxml.jackson.annotation.JsonIgnore;
import SchoolEnrollmentSystem.backend.persistence.Class;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Setter
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator", sequenceName = "secventa", allocationSize = 1)
    @Column(name = "id")
    private Integer id;

    @Column(name = "username", unique = true, nullable = false)
    @Getter
    private String username;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Getter
    @Column(name = "email", nullable = false)
    private String email;

    @Getter
    @Column(name = "hash")
    private String passwordHash;

    @Column(name = "salt")
    private String passwordSalt;

    @Column(name = "is_parent")
    private boolean parent;

    @Column(name = "is_director")
    private boolean director;

    @Column(name = "is_teacher")
    private boolean teacher;

    @OneToMany(mappedBy = "parent", cascade = CascadeType.ALL)
    @JsonIgnore
    private Set<Student> students = new HashSet<>();

    @OneToOne(mappedBy = "teacher", cascade = CascadeType.ALL)
    @JsonIgnore
    private Class schoolClass;

    @OneToOne(mappedBy = "principal", cascade = CascadeType.ALL)
    @JsonIgnore
    private School school;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "school_id", referencedColumnName = "id")
    @JsonIgnore
    private School schoolTeacher;
}
