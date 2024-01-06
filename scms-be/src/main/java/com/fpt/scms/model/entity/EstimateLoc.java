package com.fpt.scms.model.entity;

import lombok.*;

import javax.persistence.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "estimate_loc")
public class EstimateLoc {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;

    @ManyToOne
    @JoinColumn(name = "technology_id")
    private Technology technology;

    @ManyToOne
    @JoinColumn(name = "function_type")
    private FunctionType functionType;

    @Column(name = "number_of_loc_per_input")
    private int numberOfLocPerInput;
    @Column(name = "status")
    private String status;
}
