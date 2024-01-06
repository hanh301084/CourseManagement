package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.Iteration;
import com.fpt.scms.model.entity.Semester;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class EvaluationCriteriaDTO {
    private Long criteriaId;
    private Semester semester;
    private Iteration iteration;
    private String classType;
    private Double evaluationWeight;
    private Double ongoingSRSWeight;
    private Double ongoingSDSWeight;
    private Double ongoingCodingWeight;
    private Double maxLoc;
    private Double projectIntroduction;
    private Double projectImplementation;
    private Double finalSRSWeight;
    private Double finalSDSWeight;
    private Double teamWorkingWeight;
    private Double qAndA;
    private Double finalMaxLoc;
    private Double totalOngoingWeight;
    private Double finalWeight;
    private String status;
    private String description;
}
