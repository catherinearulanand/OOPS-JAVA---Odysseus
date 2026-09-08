package com.odysseus.backend.dto;

import com.odysseus.backend.domain.LessonPlanSession;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class SessionUpdateResponseDto {
    private LessonPlanSession original;
    private LessonPlanSession replacement; // null unless status = RESCHEDULED
}
