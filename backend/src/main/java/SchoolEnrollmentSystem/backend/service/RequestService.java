package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.repository.RequestRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class RequestService {
    @Autowired
    private RequestRepository requestRepository;
}
