package com.odysseus.backend.repository;

import com.odysseus.backend.domain.Subject;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface SubjectRepository extends JpaRepository<Subject, Long> {
    List<Subject> findByActiveTrue();
    Optional<Subject> findBySubjectCode(String subjectCode);
    boolean existsBySubjectCode(String subjectCode);
    boolean existsBySubjectCodeAndIdNot(String subjectCode, Long id);
}
