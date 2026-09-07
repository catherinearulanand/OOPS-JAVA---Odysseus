package com.odysseus.backend.controller;

import com.odysseus.backend.domain.Batch;
import com.odysseus.backend.domain.Faculty;
import com.odysseus.backend.domain.Subject;
import com.odysseus.backend.domain.SubjectOffering;
import com.odysseus.backend.repository.BatchRepository;
import com.odysseus.backend.repository.FacultyRepository;
import com.odysseus.backend.repository.SubjectOfferingRepository;
import com.odysseus.backend.repository.SubjectRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/offerings")
@RequiredArgsConstructor
public class OfferingController {

    private final SubjectOfferingRepository offeringRepository;
    private final BatchRepository batchRepository;
    private final SubjectRepository subjectRepository;
    private final FacultyRepository facultyRepository;

    @GetMapping
    public ResponseEntity<List<SubjectOffering>> getAllOfferings() {
        return ResponseEntity.ok(offeringRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<?> createOffering(@RequestBody Map<String, Object> payload) {
        Long batchId = ((Number) payload.get("batchId")).longValue();
        Long subjectId = ((Number) payload.get("subjectId")).longValue();
        Long assignedFacultyId = payload.get("assignedFacultyId") != null ? ((Number) payload.get("assignedFacultyId")).longValue() : null;

        if (offeringRepository.existsByBatchIdAndSubjectIdAndActiveTrue(batchId, subjectId)) {
            return ResponseEntity.badRequest().body(Map.of("error", "This batch is already assigned to this subject."));
        }

        Batch batch = batchRepository.findById(batchId).orElseThrow(() -> new IllegalArgumentException("Batch not found"));
        Subject subject = subjectRepository.findById(subjectId).orElseThrow(() -> new IllegalArgumentException("Subject not found"));
        Faculty assignedFaculty = assignedFacultyId != null ? facultyRepository.findById(assignedFacultyId).orElse(null) : null;

        SubjectOffering offering = SubjectOffering.builder()
                .batch(batch)
                .subject(subject)
                .assignedFaculty(assignedFaculty)
                .academicYear((String) payload.get("academicYear"))
                .semester(payload.get("semester") != null ? ((Number) payload.get("semester")).intValue() : batch.getSemester())
                .active(true)
                .build();

        SubjectOffering saved = offeringRepository.save(offering);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteOffering(@PathVariable Long id) {
        return offeringRepository.findById(id).map(o -> {
            o.setActive(false);
            offeringRepository.save(o);
            return ResponseEntity.ok(Map.of("message", "Subject offering deactivated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
