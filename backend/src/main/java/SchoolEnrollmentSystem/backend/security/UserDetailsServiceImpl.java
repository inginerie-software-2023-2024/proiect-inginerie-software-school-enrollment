package SchoolEnrollmentSystem.backend.security;

import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.repository.UserRepository;
import SchoolEnrollmentSystem.backend.service.AdminService;
import SchoolEnrollmentSystem.backend.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.bcrypt.BCrypt;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {
    @Autowired
    private UserService userService;

    @Autowired
    private AdminService adminService;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userService.findByUsername(username);

        if (user == null) {
            throw new UsernameNotFoundException("User not found with username: " + username);
        }
        return new org.springframework.security.core.userdetails.User(
                user.getUserName(),
                user.getPasswordHash(),
                getAuthorities(user)
        );
    }

    private Set<GrantedAuthority> getAuthorities(User user) {
        Set<GrantedAuthority> authorities = new HashSet<>();
        if (user.is_parent()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_PARENT"));
        }

        if (adminService.findByUsername(user.getUserName()) != null) {
            authorities.add(new SimpleGrantedAuthority("ROLE_ADMIN"));
        }

        if (user.is_teacher())
        {
            authorities.add(new SimpleGrantedAuthority("ROLE_TEACHER"));
        }

        if (user.is_director()) {
            authorities.add(new SimpleGrantedAuthority("ROLE_DIRECTOR"));
        }

        return authorities;
    }
}
