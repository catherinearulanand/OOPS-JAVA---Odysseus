package com.odysseus.backend.repository;

import com.odysseus.backend.domain.AcademicCalendar;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface AcademicCalendarRepository extends JpaRepository<AcademicCalendar, Long> {
    List<AcademicCalendar> findByActiveTrue();
    Optional<AcademicCalendar> findFirstByActiveTrueOrderByIdDesc();
}
