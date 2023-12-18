package SchoolEnrollmentSystem.backend.persistence;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Teacher {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    private String username;

    private String firstName;

    private String lastName;

    private String email;

    private String phoneNumber;

    private String password;

    @OneToOne
    private Class teachingClass;
}
