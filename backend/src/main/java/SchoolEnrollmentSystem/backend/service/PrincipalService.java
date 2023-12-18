package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.repository.PrincipalRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PrincipalService {
    @Autowired
    private PrincipalRepository principalRepository;
}
