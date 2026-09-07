package com.odysseus.backend.repository;

import com.odysseus.backend.domain.SubjectOffering;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SubjectOfferingRepository extends JpaRepository<SubjectOffering, Long> {
    List<SubjectOffering> findByActiveTrue();
    List<SubjectOffering> findByBatchIdAndActiveTrue(Long batchId);
    boolean existsByBatchIdAndSubjectIdAndActiveTrue(Long batchId, Long subjectId);
}
