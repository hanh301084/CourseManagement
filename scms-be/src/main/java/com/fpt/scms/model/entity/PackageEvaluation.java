package com.fpt.scms.model.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Table(name = "package_evaluation")
public class PackageEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "package_evaluation_id")
    private Long packageEvaluationId;

    @ManyToOne
    @JoinColumn(name = "class_user_id", referencedColumnName = "class_user_id")
    private ClassUser classUserId;

    @ManyToOne
    @JoinColumn(name = "criteria_id", referencedColumnName = "criteria_id")
    private EvaluationCriteria evaluationCriteria;

    @Column(name = "Tracking_grade")
    private Long trackingGrade;

    @Column(name = "SRS_grade")
    private Double srsGrade;

    @Column(name = "SDS_grade")
    private Double sdsGrade;

    @Column(name = "Issue_grade")
    private Double issueGrade;

    @Column(name = "Team_grade")
    private Double teamGrade;

    @Column(name = "LOC")
    private Double loc;

    @Column(name = "Loc_grade")
    private Double locGrade;

}
