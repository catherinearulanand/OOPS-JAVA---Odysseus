package com.odysseus.backend.repository;

import com.odysseus.backend.domain.Batch;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface BatchRepository extends JpaRepository<Batch, Long> {
    List<Batch> findByActiveTrue();
}
