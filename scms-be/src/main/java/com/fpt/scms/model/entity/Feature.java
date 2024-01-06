package com.fpt.scms.model.entity;

import lombok.Data;

import javax.persistence.*;

@Entity
@Data
public class Feature {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feature_id")
    private Long featureId;
    @Column(name = "feature_name", length = 50)
    private String featureName;
    @Column(name = "description",columnDefinition = "TEXT" )
    private String description;
}
