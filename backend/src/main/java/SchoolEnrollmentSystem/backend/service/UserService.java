package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.DTOs.LoginDTO;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public boolean existsByUsername(String username) {
        return userRepository.findAll().stream().anyMatch(user -> user.getUserName().equals(username));
    }

    public boolean existsByEmail(String email) {
        return userRepository.findAll().stream().anyMatch(user -> user.getEmail().equals(email));
    }

    public void addUser(User user)
    {
        userRepository.save(user);
    }

    public User findByUsername(String username) {
        return userRepository.findAll().stream().filter(user -> user.getUserName().equals(username)).findFirst().orElse(null);
    }

    public String getSalt(String username) {
        return userRepository.findAll().stream().filter(user -> user.getUserName().equals(username)).findFirst().orElse(null).getPasswordSalt();
    }
}
