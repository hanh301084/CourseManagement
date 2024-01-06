package com.fpt.scms.services;

import com.fpt.scms.model.dto.OngoingDataDTO;
import com.fpt.scms.model.dto.PackageEvaluationDTO;
import com.fpt.scms.model.entity.ClassUser;
import com.fpt.scms.model.entity.PackageEvaluation;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PackageEvaluationService {
    List<PackageEvaluation> getAllEvaluationCriteria(Long semesterId);
    void updateIterationWeights(List<PackageEvaluationDTO> packageEvaluationDTOS);

    void updatePackageEvaluationOG(OngoingDataDTO ongoingDataDTO);

    double getupdateOgGrade(double ogGrade);

    PackageEvaluation getPackageWeightByClassUser(Long semesterId,String classType,String iterationName,Long classUserId);

    List<PackageEvaluation> getPackageEvaluationByClassUserId(Long classUserId);

    float calculatePresentationByClassUserId(Long classUserId, boolean isPresentation, Long teamId, Long semesterId, String classType);
    List<ClassUser> updateFinalGrade(Long semesterId, String classType);
    List<ClassUser> updateFinalGradeResit(Long semesterId, String classType);
}
