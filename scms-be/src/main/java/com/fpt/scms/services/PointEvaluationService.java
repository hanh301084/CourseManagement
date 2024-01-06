package com.fpt.scms.services;

import com.fpt.scms.model.dto.PointEvaluationDTO;
import com.fpt.scms.model.entity.ClassUser;
import com.fpt.scms.model.entity.PointEvaluation;

import java.util.List;

public interface PointEvaluationService {
    PointEvaluation getPointEvaluationByTeamIdAndReviewerId( Long teamId, Long reviewerId,boolean isResit);

    PointEvaluation save(PointEvaluationDTO pointEvaluationDTO);
    List<PointEvaluationDTO> getPointEvaluations(Long teamId, boolean isResit);
}
