package SchoolEnrollmentSystem.backend.persistence;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "sequenceGenerator")
    @SequenceGenerator(name = "sequenceGenerator")
    @Column(name = "id")
    private Integer id;

    @Column(name = "username", unique = true)
    private String username;

    @Column(name = "first_name")
    private String firstName;

    @Column(name = "last_name")
    private String lastName;

    @Column(name = "email")
    private String email;

    @Getter
    @Column(name = "hash")
    private String passwordHash;

    @Column(name = "salt")
    private String passwordSalt;

    @Column(name = "is_parent")
    private boolean is_parent;

    @Column(name = "is_director")
    private boolean is_director;

    @Column(name = "is_teacher")
    private boolean is_teacher;

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "teacher")
    @JsonIgnoreProperties(value = {"teacher", "school"}, allowSetters = true)
    private Class teachingClass;

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "parent")
    @JsonIgnoreProperties(value = {"applications", "parent"}, allowSetters = true)
    private Set<Student> students = new HashSet<>();

    @OneToOne(fetch = FetchType.LAZY, mappedBy = "principal")
    @JsonIgnoreProperties(value = {"principal", "applications", "cClasses"}, allowSetters = true)
    private School school;

    public String getUserName() {
        return username;
    }

    public boolean is_parent() {
        return is_parent;
    }

    public boolean is_teacher() {
        return is_teacher;
    }

    public boolean is_director() {
        return is_director;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public String getEmail() {
        return email;
    }

    public String getPasswordSalt() {
        return passwordSalt;
    }

    public Set<Student> getStudents() {
        return students;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

    public void set_parent(boolean is_parent) {
        this.is_parent = is_parent;
    }

    public void set_teacher(boolean is_teacher) {
        this.is_teacher = is_teacher;
    }

    public void set_director(boolean is_director) {
        this.is_director = is_director;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public void setPasswordSalt(String passwordSalt) {
        this.passwordSalt = passwordSalt;
    }

    public void setTeachingClass(Class teachingClass) {
        this.teachingClass = teachingClass;
    }
}
