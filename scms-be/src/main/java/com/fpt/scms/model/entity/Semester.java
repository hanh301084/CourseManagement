package com.fpt.scms.model.entity;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "Semester")
public class Semester {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "semester_id")
    private Long semesterId;
    @Column(name = "semester_name", unique = true, length = 50)
    private String semesterName;
    @Column(name = "start_date")
    private LocalDateTime startDate;
    @Column(name = "end_date")
    private  LocalDateTime endDate;
    @Column(name = "status",columnDefinition = "VARCHAR(50) DEFAULT 'ACTIVE'")
    private String status;
    @Column(name = "min_OG")
    private Double minOG;
    @Column(name = "min_og_total")
    private Double minOGTotal;
    @Column(name = "min_final")
    private Double minFinal;
}
