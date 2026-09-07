package com.odysseus.backend.controller;

import com.odysseus.backend.dto.DataReadinessResult;
import com.odysseus.backend.dto.SchedulerInputContractDto;
import com.odysseus.backend.service.DataReadinessService;
import com.odysseus.backend.service.SchedulerDataService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/scheduler")
@RequiredArgsConstructor
public class SchedulerController {

    private final SchedulerDataService schedulerDataService;
    private final DataReadinessService readinessService;

    @GetMapping("/input")
    public ResponseEntity<SchedulerInputContractDto> getSchedulerInput() {
        return ResponseEntity.ok(schedulerDataService.buildSchedulerInputPayload());
    }

    @PostMapping("/generate")
    public ResponseEntity<?> triggerTimetableGeneration() {
        DataReadinessResult readiness = readinessService.checkDataReadiness();

        if (!readiness.isReady()) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "status", "VALIDATION_FAILED",
                    "message", "Cannot generate timetable due to validation errors.",
                    "readiness", readiness
            ));
        }

        // Integration boundary check for Person B's scheduling engine
        boolean isPersonBSchedulerConnected = false;

        if (!isPersonBSchedulerConnected) {
            return ResponseEntity.ok(Map.of(
                    "status", "SCHEDULER_NOT_CONNECTED",
                    "message", "Scheduler service not connected yet. Data validation passed.",
                    "readyForScheduler", true,
                    "readiness", readiness
            ));
        }

        return ResponseEntity.status(HttpStatus.NOT_IMPLEMENTED).body(Map.of("message", "Person B solver invocation placeholder"));
    }
}
