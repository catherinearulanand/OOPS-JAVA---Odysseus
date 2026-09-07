package com.odysseus.backend.controller;

import com.odysseus.backend.domain.Batch;
import com.odysseus.backend.repository.BatchRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/batches")
@RequiredArgsConstructor
public class BatchController {

    private final BatchRepository batchRepository;

    @GetMapping
    public ResponseEntity<List<Batch>> getAllBatches() {
        return ResponseEntity.ok(batchRepository.findAll());
    }

    @PostMapping
    public ResponseEntity<Batch> createBatch(@RequestBody Batch batch) {
        Batch saved = batchRepository.save(batch);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Batch> updateBatch(@PathVariable Long id, @RequestBody Batch batch) {
        if (!batchRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        batch.setId(id);
        Batch saved = batchRepository.save(batch);
        return ResponseEntity.ok(saved);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteBatch(@PathVariable Long id) {
        return batchRepository.findById(id).map(b -> {
            b.setActive(false);
            batchRepository.save(b);
            return ResponseEntity.ok(Map.of("message", "Batch deactivated successfully"));
        }).orElse(ResponseEntity.notFound().build());
    }
}
