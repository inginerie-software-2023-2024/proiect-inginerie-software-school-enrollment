package SchoolEnrollmentSystem.backend.persistence;

import SchoolEnrollmentSystem.backend.enums.RequestStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
@Table(name="requests")
public class Request {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @ManyToOne
    @JoinColumn(name = "student_id", referencedColumnName = "id")
    private Student student;

    @Column(name="grade" , nullable = false)
    private Integer grade;

    @ManyToOne
    @JoinColumn(name = "school_id", referencedColumnName = "id")
    private School school;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private RequestStatus status = RequestStatus.SENT;

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Request request = (Request) o;

        if (!id.equals(request.id)) return false;
        if (!grade.equals(request.grade)) return false;
        return status == request.status;
    }

    @Override
    public int hashCode() {
        int result = id.hashCode();
        result = 31 * result + grade.hashCode();
        result = 31 * result + status.hashCode();
        return result;
    }
}
