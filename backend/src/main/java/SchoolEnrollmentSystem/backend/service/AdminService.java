package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.Admin;
import SchoolEnrollmentSystem.backend.repository.AdminRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    private void addAdmin(Admin admin)
    {
        adminRepository.save(admin);
    }

    private void deleteAdmin(Integer id)
    {
        adminRepository.deleteById(id);
    }
}
