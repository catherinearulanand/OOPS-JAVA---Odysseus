package com.odysseus.backend.controller;

import com.odysseus.backend.domain.CourseObjective;
import com.odysseus.backend.domain.CourseOutcome;
import com.odysseus.backend.domain.Subject;
import com.odysseus.backend.domain.SyllabusUnit;
import com.odysseus.backend.repository.CourseObjectiveRepository;
import com.odysseus.backend.repository.CourseOutcomeRepository;
import com.odysseus.backend.repository.SubjectRepository;
import com.odysseus.backend.repository.SyllabusUnitRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Implements LESSON_PLAN_CONTRACT.md section 6.1 — CRUD for a subject's
 * SyllabusUnit / CourseOutcome / CourseObjective rows.
 */
@RestController
@RequestMapping("/api/lesson-plan/subjects/{subjectId}")
@RequiredArgsConstructor
public class SyllabusController {

    private final SubjectRepository subjectRepository;
    private final SyllabusUnitRepository syllabusUnitRepository;
    private final CourseOutcomeRepository courseOutcomeRepository;
    private final CourseObjectiveRepository courseObjectiveRepository;

    // ---------------------------------------------------------------- units

    @GetMapping("/units")
    public ResponseEntity<?> getUnits(@PathVariable Long subjectId,
                                       @RequestParam(required = false) String sessionType) {
        if (!subjectRepository.existsById(subjectId)) {
            return ResponseEntity.notFound().build();
        }
        List<SyllabusUnit> units = (sessionType != null)
                ? syllabusUnitRepository.findBySubjectIdAndSessionTypeAndActiveTrueOrderByUnitNumberAsc(subjectId, sessionType)
                : syllabusUnitRepository.findBySubjectIdAndActiveTrueOrderByUnitNumberAsc(subjectId);
        return ResponseEntity.ok(units);
    }

    @PostMapping("/units")
    public ResponseEntity<?> createUnit(@PathVariable Long subjectId, @RequestBody SyllabusUnit unit) {
        Subject subject = subjectRepository.findById(subjectId).orElse(null);
        if (subject == null) {
            return ResponseEntity.notFound().build();
        }
        if (syllabusUnitRepository.existsBySubjectIdAndSessionTypeAndUnitNumberAndActiveTrue(
                subjectId, unit.getSessionType(), unit.getUnitNumber())) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "An active SyllabusUnit already exists for (subject, sessionType=" + unit.getSessionType()
                            + ", unitNumber=" + unit.getUnitNumber() + ")."));
        }
        unit.setId(null);
        unit.setSubject(subject);
        unit.setActive(true);
        SyllabusUnit saved = syllabusUnitRepository.save(unit);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/units/{unitId}")
    public ResponseEntity<?> updateUnit(@PathVariable Long subjectId, @PathVariable Long unitId, @RequestBody SyllabusUnit unit) {
        SyllabusUnit existing = syllabusUnitRepository.findById(unitId).orElse(null);
        if (existing == null || !existing.getSubject().getId().equals(subjectId)) {
            return ResponseEntity.notFound().build();
        }
        if (syllabusUnitRepository.existsBySubjectIdAndSessionTypeAndUnitNumberAndActiveTrueAndIdNot(
                subjectId, unit.getSessionType(), unit.getUnitNumber(), unitId)) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Another active SyllabusUnit already occupies (sessionType=" + unit.getSessionType()
                            + ", unitNumber=" + unit.getUnitNumber() + ") for this subject."));
        }
        unit.setId(unitId);
        unit.setSubject(existing.getSubject());
        SyllabusUnit saved = syllabusUnitRepository.save(unit);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/units/{unitId}")
    public ResponseEntity<?> deleteUnit(@PathVariable Long subjectId, @PathVariable Long unitId) {
        SyllabusUnit existing = syllabusUnitRepository.findById(unitId).orElse(null);
        if (existing == null || !existing.getSubject().getId().equals(subjectId)) {
            return ResponseEntity.notFound().build();
        }
        existing.setActive(false);
        syllabusUnitRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Syllabus unit deactivated successfully"));
    }

    // ------------------------------------------------------------- outcomes

    @GetMapping("/outcomes")
    public ResponseEntity<?> getOutcomes(@PathVariable Long subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(courseOutcomeRepository.findBySubjectIdAndActiveTrueOrderByCoNumberAsc(subjectId));
    }

    @PostMapping("/outcomes")
    public ResponseEntity<?> createOutcome(@PathVariable Long subjectId, @RequestBody CourseOutcome outcome) {
        Subject subject = subjectRepository.findById(subjectId).orElse(null);
        if (subject == null) {
            return ResponseEntity.notFound().build();
        }
        if (courseOutcomeRepository.existsBySubjectIdAndCoNumberAndActiveTrue(subjectId, outcome.getCoNumber())) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "An active CourseOutcome with coNumber=" + outcome.getCoNumber() + " already exists for this subject."));
        }
        outcome.setId(null);
        outcome.setSubject(subject);
        outcome.setActive(true);
        CourseOutcome saved = courseOutcomeRepository.save(outcome);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/outcomes/{id}")
    public ResponseEntity<?> updateOutcome(@PathVariable Long subjectId, @PathVariable Long id, @RequestBody CourseOutcome outcome) {
        CourseOutcome existing = courseOutcomeRepository.findById(id).orElse(null);
        if (existing == null || !existing.getSubject().getId().equals(subjectId)) {
            return ResponseEntity.notFound().build();
        }
        if (courseOutcomeRepository.existsBySubjectIdAndCoNumberAndActiveTrueAndIdNot(subjectId, outcome.getCoNumber(), id)) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Another active CourseOutcome already uses coNumber=" + outcome.getCoNumber() + " for this subject."));
        }
        outcome.setId(id);
        outcome.setSubject(existing.getSubject());
        CourseOutcome saved = courseOutcomeRepository.save(outcome);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/outcomes/{id}")
    public ResponseEntity<?> deleteOutcome(@PathVariable Long subjectId, @PathVariable Long id) {
        CourseOutcome existing = courseOutcomeRepository.findById(id).orElse(null);
        if (existing == null || !existing.getSubject().getId().equals(subjectId)) {
            return ResponseEntity.notFound().build();
        }
        existing.setActive(false);
        courseOutcomeRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Course outcome deactivated successfully"));
    }

    // ----------------------------------------------------------- objectives

    @GetMapping("/objectives")
    public ResponseEntity<?> getObjectives(@PathVariable Long subjectId) {
        if (!subjectRepository.existsById(subjectId)) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(courseObjectiveRepository.findBySubjectIdAndActiveTrueOrderBySequenceNumberAsc(subjectId));
    }

    @PostMapping("/objectives")
    public ResponseEntity<?> createObjective(@PathVariable Long subjectId, @RequestBody CourseObjective objective) {
        Subject subject = subjectRepository.findById(subjectId).orElse(null);
        if (subject == null) {
            return ResponseEntity.notFound().build();
        }
        if (courseObjectiveRepository.existsBySubjectIdAndSequenceNumberAndActiveTrue(subjectId, objective.getSequenceNumber())) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "An active CourseObjective with sequenceNumber=" + objective.getSequenceNumber() + " already exists for this subject."));
        }
        objective.setId(null);
        objective.setSubject(subject);
        objective.setActive(true);
        CourseObjective saved = courseObjectiveRepository.save(objective);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/objectives/{id}")
    public ResponseEntity<?> updateObjective(@PathVariable Long subjectId, @PathVariable Long id, @RequestBody CourseObjective objective) {
        CourseObjective existing = courseObjectiveRepository.findById(id).orElse(null);
        if (existing == null || !existing.getSubject().getId().equals(subjectId)) {
            return ResponseEntity.notFound().build();
        }
        if (courseObjectiveRepository.existsBySubjectIdAndSequenceNumberAndActiveTrueAndIdNot(subjectId, objective.getSequenceNumber(), id)) {
            return ResponseEntity.badRequest().body(Map.of("error",
                    "Another active CourseObjective already uses sequenceNumber=" + objective.getSequenceNumber() + " for this subject."));
        }
        objective.setId(id);
        objective.setSubject(existing.getSubject());
        CourseObjective saved = courseObjectiveRepository.save(objective);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/objectives/{id}")
    public ResponseEntity<?> deleteObjective(@PathVariable Long subjectId, @PathVariable Long id) {
        CourseObjective existing = courseObjectiveRepository.findById(id).orElse(null);
        if (existing == null || !existing.getSubject().getId().equals(subjectId)) {
            return ResponseEntity.notFound().build();
        }
        existing.setActive(false);
        courseObjectiveRepository.save(existing);
        return ResponseEntity.ok(Map.of("message", "Course objective deactivated successfully"));
    }
}
