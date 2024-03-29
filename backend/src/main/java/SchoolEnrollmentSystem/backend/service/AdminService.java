package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.Admin;
import SchoolEnrollmentSystem.backend.repository.AdminRepository;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class AdminService {
    @Autowired
    private AdminRepository adminRepository;

    public void addAdmin(Admin admin)
    {
        adminRepository.save(admin);
    }

    public void updateAdmin(Admin admin)
    {
        adminRepository.save(admin);
    }
    public void deleteAdminById(Integer id)
    {
        adminRepository.deleteById(id);
    }

    public List<Admin> findAll() {
        return adminRepository.findAll();
    }

    public Optional<Admin> findById(Integer id) {
        return adminRepository.findById(id);
    }

    public Admin findByUsername(String username) {
        return adminRepository.findAll().stream().filter(admin -> admin.getUsername().equals(username)).findFirst().orElse(null);
    }
}
