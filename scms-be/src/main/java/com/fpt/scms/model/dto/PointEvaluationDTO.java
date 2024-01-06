package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.Team;
import com.fpt.scms.model.entity.User;
import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class PointEvaluationDTO {
    private Long pointEvaluationId;
    private Team team;
    private User reviewer;
    private boolean isResit;
    private Float projectIntroduction;
    private Float finalSRSWeight;
    private Float finalSDSWeight;
    private Float projectImplementation;
    private Float teamWorkingWeight;
    private Float qandA;
}
