package com.fpt.scms.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.*;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "class_user")
public class ClassUser {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_user_id")
    private Long classUserId;

    @ManyToOne
    @JoinColumn(name = "class_id", referencedColumnName = "class_id")
    private Class classId;

    @ManyToOne
    @JoinColumn(name = "team_id")
    @JsonBackReference
    private Team teamId;

    @ManyToOne
    @JsonBackReference
    @JoinColumn(name = "user_id", referencedColumnName = "user_id")
    private User userId;

    @Column(name = "team_lead")
    private String teamLead;

    @Column(name = "user_notes")
    private String userNotes;

    @Column(name = "ongoing_eval1")
    private Double ongoingEval1;

    @Column(name = "ongoing_eval2")
    private Double ongoingEval2;

    @Column(name = "ongoing_eval3")
    private Double ongoingEval3;

    @Column(name = "ongoing_eval4")
    private Double ongoingEval4;

    @Column(name = "ongoing_eval5")
    private Double ongoingEval5;

    @Column(name = "ongoing_eval6")
    private Double ongoingEval6;

    @Column(name = "total_ongoing_eval")
    private Double totalOngoingEval;

    @Column(name = "final_pres_eval")
    private Double finalPresEval;

    @Column(name = "final_grade")
    private Double finalGrade;

    @Column(name = "status", columnDefinition = "VARCHAR(250) DEFAULT 'ACTIVE'")
    private String status;

    @Column(name = "pass_status")
    private String passStatus;

    @Column(name = "is_submited")
    private String isSubmited;

    @Column(name = "final_presentation_resit")
    private Double finalPresentationResit;
}
