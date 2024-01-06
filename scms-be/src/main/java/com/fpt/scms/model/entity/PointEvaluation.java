package com.fpt.scms.model.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class PointEvaluation {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long pointEvaluationId;
    @ManyToOne
    private Team team;
    @ManyToOne
    private User reviewer;
    private boolean isResit;
    private Float projectIntroduction;
    private Float finalSRSWeight;
    private Float finalSDSWeight;
    private Float projectImplementation;
    private Float teamWorkingWeight;
    private Float qandA;
}
