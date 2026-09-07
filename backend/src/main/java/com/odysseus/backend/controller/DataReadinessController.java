package com.odysseus.backend.controller;

import com.odysseus.backend.dto.DataReadinessResult;
import com.odysseus.backend.service.DataReadinessService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/readiness")
@RequiredArgsConstructor
public class DataReadinessController {

    private final DataReadinessService readinessService;

    @GetMapping
    public ResponseEntity<DataReadinessResult> checkReadiness() {
        return ResponseEntity.ok(readinessService.checkDataReadiness());
    }
}
