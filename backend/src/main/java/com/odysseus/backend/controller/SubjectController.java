package com.odysseus.backend.controller;

import com.odysseus.backend.domain.Subject;
import com.odysseus.backend.repository.SubjectRepository;
import com.odysseus.backend.service.CreditCalculationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/subjects")
@RequiredArgsConstructor
public class SubjectController {

    private final SubjectRepository subjectRepository;
    private final CreditCalculationService creditCalculationService;

    @GetMapping
    public ResponseEntity<List<Subject>> getAllSubjects() {
        return ResponseEntity.ok(subjectRepository.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Subject> getSubjectById(@PathVariable Long id) {
        return subjectRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<?> createSubject(@RequestBody Subject subject) {
        if (subjectRepository.existsBySubjectCode(subject.getSubjectCode())) {
            return ResponseEntity.badRequest().body(Map.of("error", "Subject code [" + subject.getSubjectCode() + "] already exists."));
        }
        creditCalculationService.updateSubjectCalculatedHours(subject);
        Subject saved = subjectRepository.save(subject);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateSubject(@PathVariable Long id, @RequestBody Subject subject) {
        if (!subjectRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        if (subjectRepository.existsBySubjectCodeAndIdNot(subject.getSubjectCode(), id)) {
            return ResponseEntity.badRequest().body(Map.of("error", "Subject code [" + subject.getSubjectCode() + "] is taken by another subject."));
        }
        subject.setId(id);
        creditCalculationService.updateSubjectCalculatedHours(subject);
        Subject saved = subjectRepository.save(subject);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteSubject(@PathVariable Long id) {
        return subjectRepository.findById(id).map(subject -> {
            subject.setActive(false); // Soft deactivation for relational safety
            subjectRepository.save(subject);
            return ResponseEntity.ok(Map.of("message", "Subject deactivated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PostMapping("/calculate-hours")
    public ResponseEntity<?> calculateHours(@RequestBody Map<String, Double> payload) {
        double theory = payload.getOrDefault("theoryCredits", 0.0);
        double lab = payload.getOrDefault("labCredits", 0.0);
        double tutorial = payload.getOrDefault("tutorialCredits", 0.0);

        double totalHours = creditCalculationService.calculateWeeklyHours(theory, lab, tutorial);
        return ResponseEntity.ok(Map.of(
                "theoryHours", theory,
                "labHours", lab * 2.0,
                "tutorialHours", tutorial,
                "totalWeeklyHours", totalHours
        ));
    }
}
