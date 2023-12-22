package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.Principal;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.repository.PrincipalRepository;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class PrincipalService {
    @Autowired
    private PrincipalRepository principalRepository;
    private SchoolRepository schoolRepository;

    public Principal addPrincipal(Principal pPrincipal) {
        return principalRepository.save(pPrincipal);
    }

    public Principal update(Principal pPrincipal) {
        return principalRepository.save(pPrincipal);
    }

    public List<Principal> findAll() {
        return principalRepository.findAll();
    }

    public Optional<Principal> findById(Integer id) {
        return principalRepository.findById(id);
    }

    public void deletePrincipal(Integer id) {
        Optional<Principal> optionalPrincipal = principalRepository.findById(id);

        if (optionalPrincipal.isPresent()) {
            Principal principal = optionalPrincipal.get();

            School school = principal.getSchool();

            if (school != null) {
                school.setPrincipal(null);
                schoolRepository.save(school);
            }

            principalRepository.deleteById(id);
        }
    }
}
