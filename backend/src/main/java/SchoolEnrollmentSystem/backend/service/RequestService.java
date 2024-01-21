package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.enums.RequestStatus;
import SchoolEnrollmentSystem.backend.exception.NullArgumentException;
import SchoolEnrollmentSystem.backend.exception.UniqueResourceExistent;
import SchoolEnrollmentSystem.backend.persistence.Request;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.RequestRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;

    public List<Request> getAllRequests() {
        return requestRepository.findAll();
    }

    public Request getRequestById(Integer id) {
        return requestRepository.findById(id).orElse(null);
    }

    public List<Request> getAllRequestsOfParent(User parent) {
        if(parent == null || !parent.isParent())
            return new LinkedList<>();

        return parent.getStudents().stream()
                .map(Student::getRequests)
                .flatMap(Set<Request>::stream)
                .collect(Collectors.toList());
    }

    public List<Request> getAllRequestsOfStudent(Student student) {
        if(student == null)
            return new LinkedList<>();

        return student.getRequests().stream().toList();
    }

    public List<Request> getAllRequestsToSchool(School school) {
        if(school == null)
            return new LinkedList<>();

        return school.getRequests().stream().toList();
    }

    public void addRequest(Student student, School school, Integer grade) throws NullArgumentException, UniqueResourceExistent{
        if(student == null || school == null)
            throw new NullArgumentException();

        Request request = new Request();
        request.setStudent(student);
        request.setSchool(school);
        request.setGrade(grade);

        // if there is already a request from the same student to the same school, don't add it
        long numberExistent = requestRepository.findAll().stream()
                .filter(r -> r.getStudent().getId().equals(request.getStudent().getId())
                        && r.getSchool().getId().equals(request.getSchool().getId()))
                .count();

        if(numberExistent > 0)
            throw new UniqueResourceExistent();

        requestRepository.save(request);
    }

    public boolean changeRequestStatus(Integer requestId, RequestStatus status) {
        Optional<Request> requestOptional = requestRepository.findById(requestId);
        if (requestOptional.isEmpty())
            return false;

        Request request = requestOptional.get();
        request.setStatus(status);
        requestRepository.save(request);
        return true;
    }
}
