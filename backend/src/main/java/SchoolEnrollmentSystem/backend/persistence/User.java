package SchoolEnrollmentSystem.backend.persistence;

import com.fasterxml.jackson.annotation.JsonIgnore;
import SchoolEnrollmentSystem.backend.persistence.Class;
import jakarta.persistence.*;
import lombok.*;

import java.util.HashSet;
import java.util.Objects;
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
    @JsonIgnore
    private String passwordHash;

    @Column(name = "salt")
    @JsonIgnore
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

    @ManyToOne(cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JoinColumn(name = "school_id", referencedColumnName = "id")
    @JsonIgnore
    private School schoolTeacher;

    @Override
    public int hashCode() {
        final int prime = 31;
        int result = 1;
        result = prime * result + ((id == null) ? 0 : id.hashCode());
        result = prime * result + ((username == null) ? 0 : username.hashCode());
        result = prime * result + ((firstName == null) ? 0 : firstName.hashCode());
        result = prime * result + ((lastName == null) ? 0 : lastName.hashCode());
        result = prime * result + ((email == null) ? 0 : email.hashCode());
        result = prime * result + ((passwordHash == null) ? 0 : passwordHash.hashCode());
        result = prime * result + ((passwordSalt == null) ? 0 : passwordSalt.hashCode());
        result = prime * result + ((!teacher) ? 0 : 1);
        result = prime * result + ((!director) ? 0 : 1);
        result = prime * result + ((!parent) ? 0 : 1);


        return result;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", username='" + username +
                ", firstName='" + firstName +
                ", lastName='" + lastName +
                ", email='" + email;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        User user = (User) o;

        if (parent != user.parent) return false;
        if (director != user.director) return false;
        if (teacher != user.teacher) return false;
        if (!Objects.equals(id, user.id)) return false;
        if (!Objects.equals(username, user.username)) return false;
        if (!Objects.equals(firstName, user.firstName)) return false;
        if (!Objects.equals(lastName, user.lastName)) return false;
        if (!Objects.equals(email, user.email)) return false;
        if (!Objects.equals(passwordHash, user.passwordHash)) return false;
        return Objects.equals(passwordSalt, user.passwordSalt);
    }
}
