package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.persistence.User;
import SchoolEnrollmentSystem.backend.service.UserService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.springframework.test.web.servlet.MockMvc;

import java.util.List;

import static org.mockito.Mockito.when;
import static org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors.jwt;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@ExtendWith(SpringExtension.class)
@WebMvcTest(controllers = AdminController.class)
class AdminControllerTest {
    @Autowired
    private MockMvc mockMvc;

    @MockBean
    UserService userService;

    @Test
    void givenInvalidCredentials_whenGetAllRequests_thenBadRequestIsReturned() throws Exception {
        mockMvc.perform(get("/admin/getAllUsersForAdmin"))
                .andExpect(status().isBadRequest());
    }

    @Test
    void givenValidCredentials_whenGetAllRequests_thenOkIsReturned() throws Exception {
        User mockUser = new User();
        mockUser.setId(1);
        mockUser.setDirector(false);
        mockUser.setTeacher(true);
        mockUser.setUsername("test");
        when(userService.getAllUsers()).thenReturn(List.of(mockUser));

        mockMvc.perform(get("/admin/getAllUsersForAdmin")
                        .with(jwt().authorities(new SimpleGrantedAuthority("admin"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.[0].id").value(mockUser.getId()))
                .andExpect(jsonPath("$.[0].principal").value(mockUser.isDirector()))
                .andExpect(jsonPath("$.[0].teacher").value(mockUser.isTeacher()))
                .andExpect(jsonPath("$.[0].userName").value(mockUser.getUsername()));
    }
}
