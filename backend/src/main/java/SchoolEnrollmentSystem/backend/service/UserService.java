package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@AllArgsConstructor
public class UserService {
    @Autowired
    private UserRepository userRepository;

    public List<User> getAllUsers()
    {
        return userRepository.findAll();
    }

    public User getUserById(Integer id)
    {
        Optional<User> optionalUser = userRepository.findById(id);

        return optionalUser.orElseThrow(NotFoundException::new);
    }

    public void addUser(User user)
    {
        userRepository.save(user);
    }

    public void deleteUser(Integer id)
    {
        userRepository.delete(getUserById(id));
    }
}
