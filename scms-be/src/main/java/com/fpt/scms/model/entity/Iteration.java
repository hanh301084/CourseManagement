package com.fpt.scms.model.entity;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Column;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "Iteration")
public class Iteration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "iteration_id")
    private Long iterationId;

    @Column(name = "iteration_name")
    private String iterationName;

    @Column(name = "duration")
    private int duration;
    @Column(name = "duration_block5")
    private int durationBlock5;

    @Column(name = "status")
    private String status;
}