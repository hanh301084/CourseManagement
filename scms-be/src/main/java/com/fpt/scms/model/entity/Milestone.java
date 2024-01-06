package com.fpt.scms.model.entity;

import lombok.*;

import javax.persistence.*;
import java.sql.Date;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "milestone")
public class Milestone {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "milestone_id")
    private Long milestoneId;

    @Column(name = "milestone_name", length = 100)
    private String milestoneName;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "iteration_id", referencedColumnName = "iteration_id")
    private Iteration iterationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "class_id", referencedColumnName = "class_id")
    private Class classId;

    @Column(name = "from_date")
    private Date fromDate;

    @Column(name = "to_date")
    private Date toDate;

    @Column(name = "status", length = 50)
    private String status;


}
