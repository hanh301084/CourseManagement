package com.fpt.scms.controller;

import com.fpt.scms.model.dto.PointEvaluationDTO;
import com.fpt.scms.model.entity.PointEvaluation;
import com.fpt.scms.services.PointEvaluationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pointEvaluation")
@CrossOrigin(origins = "http://localhost:3000")
public class PointEvaluationController {
    @Autowired
    PointEvaluationService pointEvaluationService;

    @RequestMapping(value = "/getPointEvaluationByTeamIdAndReviewerId/{teamId}/{reviewerId}/{isResit}", method = RequestMethod.GET, produces = "application/json")
    public PointEvaluation getPointEvaluationByTeamIdAndReviewerId(@PathVariable Long teamId, @PathVariable Long reviewerId, @PathVariable boolean isResit) {
        return pointEvaluationService.getPointEvaluationByTeamIdAndReviewerId(teamId, reviewerId, isResit);
    }

    @RequestMapping(value = "/getPointEvaluations/{teamId}/{isResit}", method = RequestMethod.GET, produces = "application/json")
    public List<PointEvaluationDTO> getPointEvaluations(@PathVariable Long teamId, @PathVariable boolean isResit) {
        return pointEvaluationService.getPointEvaluations(teamId, isResit);
    }

    @RequestMapping(value = "/save/{isResit}", method = RequestMethod.POST, produces = "application/json")
    public PointEvaluation savePointEvaluation(@PathVariable boolean isResit, @RequestBody PointEvaluationDTO pointEvaluationDTO) {
        pointEvaluationDTO.setResit(isResit);
        return pointEvaluationService.save(pointEvaluationDTO);
    }

}
