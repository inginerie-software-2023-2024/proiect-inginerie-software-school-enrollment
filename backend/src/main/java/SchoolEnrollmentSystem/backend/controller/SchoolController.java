package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.service.SchoolService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/schools")
public class SchoolController {
    private final SchoolService schoolService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<School> getAllSchools() {
        return schoolService.getAllSchools();
    }

    @GetMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public School getAllSchools(@PathVariable Integer id) {
        return schoolService.getSchoolById(id);
    }

    @DeleteMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public void deleteSchool(@PathVariable Integer id) {
        schoolService.deleteSchool(id);
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public void addSchool(@RequestBody School school) {
        schoolService.addSchool(school);
    }
}
