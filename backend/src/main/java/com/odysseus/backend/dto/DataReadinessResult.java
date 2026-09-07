package com.odysseus.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataReadinessResult {
    private boolean ready;
    private int issueCount;
    private List<String> issues;
    private String summaryMessage;
}
