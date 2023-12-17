package SchoolEnrollmentSystem.backend.service;

import SchoolEnrollmentSystem.backend.exception.NotFoundException;
import SchoolEnrollmentSystem.backend.persistence.Director;
import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.DirectorRepository;
import SchoolEnrollmentSystem.backend.repository.SchoolRepository;
import SchoolEnrollmentSystem.backend.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class DirectorService {
    @Autowired
    private DirectorRepository directorRepository;
    private UserRepository userRepository;
    private SchoolRepository schoolRepository;

    public Director getDirectorById(Integer id)
    {
        Optional<Director> optionalDirector = directorRepository.findById(id);

        return optionalDirector.orElseThrow(NotFoundException::new);
    }

    public void deleteDirector(Integer id)
    {
        Optional<Director> optionalDirector = directorRepository.findById(id);
        if (optionalDirector.isPresent())
        {
            Director director = optionalDirector.get();
            User user = director.getUser();
            userRepository.deleteById(user.getId());

            School school = director.getSchool();
            school.setDirector(null);
            schoolRepository.save(school);
        }
        directorRepository.deleteById(id);
    }

    public void addDirector(Director director)
    {
        // presupun ca user-ul este deja creeat
        directorRepository.save(director);
    }

    public void setSchool(Integer id, School school)
    {
        Director director = getDirectorById(id);
        director.setSchool(school);
        directorRepository.save(director);
    }
}
