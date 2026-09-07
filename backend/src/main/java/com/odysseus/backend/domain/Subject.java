package com.odysseus.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "subjects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Subject {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String subjectCode;

    @Column(nullable = false)
    private String subjectName;

    @Column(nullable = false)
    private String department;

    private Integer semester;

    @Column(nullable = false)
    private String subjectType; // THEORY, LAB, TUTORIAL, THEORY_AND_LAB

    private double theoryCredits;
    private double labCredits;
    private double tutorialCredits;

    private boolean requiresLab;
    private Integer labDuration; // Continuous periods required (e.g., 2 or 3)

    private double calculatedWeeklyHours;

    @Builder.Default
    private boolean active = true;
}
