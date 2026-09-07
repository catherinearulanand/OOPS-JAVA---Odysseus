package com.odysseus.backend.controller;

import com.odysseus.backend.domain.Faculty;
import com.odysseus.backend.domain.Subject;
import com.odysseus.backend.repository.FacultyRepository;
import com.odysseus.backend.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

@RestController
@RequestMapping("/api/admin/faculty")
@RequiredArgsConstructor
public class FacultyController {

    private final FacultyRepository facultyRepository;
    private final SubjectRepository subjectRepository;

    @GetMapping
    public ResponseEntity<List<Faculty>> getAllFaculty() {
        return ResponseEntity.ok(facultyRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Faculty> getFacultyById(@PathVariable Long id) {
        return facultyRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createFaculty(@RequestBody Map<String, Object> payload) {
        String employeeId = (String) payload.get("employeeId");
        if (facultyRepository.existsByEmployeeId(employeeId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Employee ID [" + employeeId + "] already exists."));
        }

        Faculty faculty = Faculty.builder()
                .employeeId(employeeId)
                .name((String) payload.get("name"))
                .email((String) payload.get("email"))
                .department((String) payload.get("department"))
                .maxWeeklyLoad(payload.get("maxWeeklyLoad") != null ? ((Number) payload.get("maxWeeklyLoad")).intValue() : 18)
                .active(payload.get("active") != null ? (Boolean) payload.get("active") : true)
                .build();

        if (payload.containsKey("subjectIds")) {
            @SuppressWarnings("unchecked")
            List<Number> subIds = (List<Number>) payload.get("subjectIds");
            Set<Subject> subjects = new HashSet<>();
            for (Number sId : subIds) {
                subjectRepository.findById(sId.longValue()).ifPresent(subjects::add);
            }
            faculty.setEligibleSubjects(subjects);
        }

        Faculty saved = facultyRepository.save(faculty);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateFaculty(@PathVariable Long id, @RequestBody Map<String, Object> payload) {
        return facultyRepository.findById(id).map(faculty -> {
            String employeeId = (String) payload.get("employeeId");
            if (facultyRepository.existsByEmployeeIdAndIdNot(employeeId, id)) {
                return ResponseEntity.badRequest().body(Map.of("error", "Employee ID [" + employeeId + "] is taken by another faculty member."));
            }

            faculty.setEmployeeId(employeeId);
            faculty.setName((String) payload.get("name"));
            faculty.setEmail((String) payload.get("email"));
            faculty.setDepartment((String) payload.get("department"));
            if (payload.get("maxWeeklyLoad") != null) {
                faculty.setMaxWeeklyLoad(((Number) payload.get("maxWeeklyLoad")).intValue());
            }
            if (payload.get("active") != null) {
                faculty.setActive((Boolean) payload.get("active"));
            }

            if (payload.containsKey("subjectIds")) {
                @SuppressWarnings("unchecked")
                List<Number> subIds = (List<Number>) payload.get("subjectIds");
                Set<Subject> subjects = new HashSet<>();
                for (Number sId : subIds) {
                    subjectRepository.findById(sId.longValue()).ifPresent(subjects::add);
                }
                faculty.setEligibleSubjects(subjects);
            }

            Faculty saved = facultyRepository.save(faculty);
            return ResponseEntity.ok(saved);
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteFaculty(@PathVariable Long id) {
        return facultyRepository.findById(id).map(f -> {
            f.setActive(false);
            facultyRepository.save(f);
            return ResponseEntity.ok(Map.of("message", "Faculty member deactivated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
