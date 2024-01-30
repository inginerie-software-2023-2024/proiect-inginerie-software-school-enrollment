package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.enums.RequestStatus;
import SchoolEnrollmentSystem.backend.exception.AlreadyAssignedException;
import SchoolEnrollmentSystem.backend.exception.InvalidStateException;
import SchoolEnrollmentSystem.backend.exception.NullArgumentException;
import SchoolEnrollmentSystem.backend.exception.UniqueResourceExistent;
import SchoolEnrollmentSystem.backend.persistence.Request;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.persistence.Student;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.RequestRepository;
import SchoolEnrollmentSystem.backend.repository.StudentRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;

    @Autowired
    private StudentRepository studentRepository;

    private final Map<RequestStatus, List<RequestStatus>> statusValidTransitions =
            new HashMap<>(
                    Map.of(
                            RequestStatus.SENT, List.of(RequestStatus.ACCEPTED, RequestStatus.REJECTED, RequestStatus.CANCELED),
                            RequestStatus.ACCEPTED, List.of(RequestStatus.CONFIRMED, RequestStatus.DECLINED),
                            RequestStatus.REJECTED, new LinkedList<>(),
                            RequestStatus.CONFIRMED, new LinkedList<>(),
                            RequestStatus.DECLINED, new LinkedList<>(),
                            RequestStatus.CANCELED, new LinkedList<>()
                    )
            );

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

    public void addRequest(Student student, School school, Integer grade)
            throws NullArgumentException, UniqueResourceExistent ,AlreadyAssignedException {
        if(student == null || school == null)
            throw new NullArgumentException();

        Request request = new Request();
        request.setStudent(student);
        request.setSchool(school);
        request.setGrade(grade);

        // if the student is already assigned to a school, don't add the request
        if(student.getSchool() != null)
            throw new AlreadyAssignedException();

        // if there is already a request from the same student to the same school, don't add it
        long numberExistent = requestRepository.findAll().stream()
                .filter(r -> r.getStudent().getId().equals(request.getStudent().getId())
                        && r.getSchool().getId().equals(request.getSchool().getId()))
                .count();

        if(numberExistent > 0)
            throw new UniqueResourceExistent();

        requestRepository.save(request);
    }

    public boolean changeRequestStatus(Integer requestId, RequestStatus newStatus) throws InvalidStateException {
        Optional<Request> requestOptional = requestRepository.findById(requestId);
        if (requestOptional.isEmpty())
            return false;


        Request request = requestOptional.get();
        if (!statusValidTransitions.get(request.getStatus()).contains(newStatus))
            throw new InvalidStateException();

        request.setStatus(newStatus);
        requestRepository.save(request);

        if (newStatus == RequestStatus.CONFIRMED) {
            Student student = request.getStudent();
            student.setSchool(request.getSchool());
            studentRepository.save(student);

            deleteAllStudentRequestsExceptFor(student, request);
        }
        return true;
    }

    private void deleteAllStudentRequestsExceptFor(Student student, Request request) {
        List<Request> requestsToDelete = student.getRequests().stream()
                .filter(r -> !r.getId().equals(request.getId())).toList();
        requestRepository.deleteAll(requestsToDelete);

        HashSet<Request> newRequests = new HashSet<>();
        newRequests.add(request);
        student.setRequests(newRequests);
        studentRepository.save(student);
    }
}
