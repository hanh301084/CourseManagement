package com.fpt.scms.model.entity;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "function_estimate_loc")
public class FunctionEstimateLoc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    @ManyToOne
    @JoinColumn(name = "estimate_loc_id")
    private EstimateLoc estimateLoc;

    @ManyToOne
    @JoinColumn(name = "project_backlog_id")
    private ProjectBacklog projectBacklog;

    @Column(name = "number_of_input")
    private int numberOfInput;
}
