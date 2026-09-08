package com.odysseus.backend.repository;

import com.odysseus.backend.domain.LessonPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface LessonPlanRepository extends JpaRepository<LessonPlan, Long> {
    Optional<LessonPlan> findBySubjectOfferingIdAndAcademicCalendarIdAndActiveTrue(Long subjectOfferingId, Long academicCalendarId);
    Optional<LessonPlan> findFirstBySubjectOfferingIdAndActiveTrueOrderByGeneratedAtDesc(Long subjectOfferingId);
    List<LessonPlan> findBySubjectOffering_AssignedFaculty_IdAndActiveTrue(Long facultyId);
}
