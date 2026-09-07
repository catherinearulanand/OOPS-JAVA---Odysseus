package com.odysseus.backend.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "batches")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Batch {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String batchName;

    private String section;

    @Column(nullable = false)
    private String department;

    private Integer semester;

    @Column(nullable = false)
    private Integer strength;

    private String academicYear;

    @Builder.Default
    private boolean active = true;
}
