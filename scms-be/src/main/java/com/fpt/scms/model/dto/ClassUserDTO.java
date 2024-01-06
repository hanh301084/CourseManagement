package com.fpt.scms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClassUserDTO {
    private Long classUserId;
    private Long classId;
    private Long teamId;
    private Long userId;
    private String teamLead;
    private String userNotes;
    private Double ongoingEval1;
    private Double ongoingEval2;
    private Double ongoingEval3;
    private Double ongoingEval4;
    private Double ongoingEval5;
    private Double ongoingEval6;
    private Double totalOngoingEval;
    private Double finalPresEval;
    private Double finalGrade;
    private String status;
    private String passStatus;
    private String isSubmited;
    private String rollNumber;
    private String studentName;
    private String teamName;
    private String classCode;
    private Double finalPresentationResit;
}
