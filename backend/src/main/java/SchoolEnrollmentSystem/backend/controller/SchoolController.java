package SchoolEnrollmentSystem.backend.controller;

import SchoolEnrollmentSystem.backend.persistence.School;
import SchoolEnrollmentSystem.backend.service.SchoolService;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@AllArgsConstructor
@RequestMapping("/schools")
public class SchoolController {
    @Autowired
    private SchoolService schoolService;

    @GetMapping
    @ResponseStatus(HttpStatus.OK)
    public List<School> getAllSchools() {
        return schoolService.getAllSchools();
    }

    @GetMapping(path = "/{id}")
    @ResponseStatus(HttpStatus.OK)
    public ResponseEntity<?> getSchoolWithId(@PathVariable Integer id) {
        Optional<School> schoolOptional = schoolService.getSchoolById(id);
        if(schoolOptional.isEmpty())
            return new ResponseEntity<>("School not found", HttpStatus.NOT_FOUND);

        return ResponseEntity.ok(schoolOptional.get());
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
