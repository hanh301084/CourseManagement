package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.ClassUser;
import com.fpt.scms.model.entity.EvaluationCriteria;
import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class OngoingDataDTO {
    private String iterationName;
    private double srsGrade;
    private double sdsGrade;
    private double locGrade;
    private Long classUserId ;
    private  String classType;
    private Long semesterId;
}
