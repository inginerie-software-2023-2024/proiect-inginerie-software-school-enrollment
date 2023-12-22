package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.repository.ApplicationRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import SchoolEnrollmentSystem.backend.persistence.Application;

import java.util.List;
import java.util.Optional;


@Service
@AllArgsConstructor
public class ApplicationService {
    @Autowired
    private ApplicationRepository applicationRepository;

    public Application addApplication(Application application) {
        return applicationRepository.save(application);
    }

    public List<Application> findAll() {
        return applicationRepository.findAll();
    }

    public Optional<Application> findById(Integer id) {
        return applicationRepository.findById(id);
    }

    public void delete(Integer id) {
        applicationRepository.deleteById(id);
    }
}
