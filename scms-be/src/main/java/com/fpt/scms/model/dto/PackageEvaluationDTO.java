package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.EvaluationCriteria;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
    public class PackageEvaluationDTO {
        private Long packageEvaluationId;
        private ClassUserDTO classUser;
        private EvaluationCriteriaDTO evaluationCriteria;
        private Long trackingGrade;
        private Double srsGrade;
        private Double sdsGrade;
        private Double issueGrade;
        private Double teamGrade;
        private Double loc;
        private Double locGrade;
        private Long finalTrackingGrade;
        private Double finalSrsGrade;
        private Double finalSdsGrade;
        private Double finalIssueGrade;
        private Double finalTeamGrade;
        private Double finalLoc;
        private Double finalLocGrade;
        private Double presentation1;
        private Double presentation2;
}
