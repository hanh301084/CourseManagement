package com.fpt.scms.model.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "evaluation_criteria")
public class EvaluationCriteria {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "criteria_id")
    private Long criteriaId;

    @ManyToOne
    @JoinColumn(name = "semester_id", referencedColumnName = "semester_id")
    private Semester semester;

    @ManyToOne
    @JoinColumn(name = "iteration_id", referencedColumnName = "iteration_id")
    private Iteration iteration;

    @Column(name = "class_type")
    private String classType;

    @Column(name = "evaluation_weight")
    private Double evaluationWeight;

    @Column(name = "ongoing_SRS_weight")
    private Double ongoingSRSWeight;

    @Column(name = "ongoing_SDS_weight")
    private Double ongoingSDSWeight;

    @Column(name = "ongoing_coding_weight")
    private Double ongoingCodingWeight;

    @Column(name = "max_loc")
    private Double maxLoc;

    @Column(name = "project_introduction")
    private Double projectIntroduction;

    @Column(name = "project_implementation")
    private Double projectImplementation;


    @Column(name = "final_SRS_weight")
    private Double finalSRSWeight;

    @Column(name = "final_SDS_weight")
    private Double finalSDSWeight;

    @Column(name = "team_working_weight")
    private Double teamWorkingWeight;

    @Column(name = "q_and_a")
    private Double qAndA;

    @Column(name = "final_max_loc")
    private Double finalMaxLoc;

    @Column(name = "total_ongoing_weight")
    private Double totalOngoingWeight;

    @Column(name = "final_weight")
    private Double finalWeight;

    @Column(name = "status", columnDefinition = "VARCHAR(50) DEFAULT 'ACTIVE'")
    private String status;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;
}
