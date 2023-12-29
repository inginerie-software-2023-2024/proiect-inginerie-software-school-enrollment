package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public boolean existsByUsername(String username) {
        return !userRepository.findAll().stream().filter(user -> user.getUsername().equals(username)).toList().isEmpty();
    }

    public boolean existsByEmail(String email) {
        return !userRepository.findAll().stream().filter(user -> user.getEmail().equals(email)).toList().isEmpty();
    }

    public void addUser(User user)
    {
        userRepository.save(user);
    }

    public User findByUsername(String username) {
        if (existsByUsername(username)) {
            return userRepository.findAll().stream().filter(user -> user.getUsername().equals(username)).toList().get(0);
        } else {
            return null;
        }
    }
    public void deleteUserById(Integer id)
    {
        userRepository.deleteById(id);
    }

    public List<User> getAllUsers()
    {
        return userRepository.findAll();
    }

    public void updateUser(Integer id, User user)
    {
        userRepository.save(user);
    }
}
