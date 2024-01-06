package com.fpt.scms.services;

import com.fpt.scms.model.dto.EvaluationCriteriaDTO;
import com.fpt.scms.model.entity.EvaluationCriteria;

import java.util.List;

public interface EvaluationCriteriaService {
    List<EvaluationCriteriaDTO>getAllEvaluationCriteriaFinal(Long semesterId);
    List<EvaluationCriteriaDTO>getAllEvaluationCriteriaFinal2(Long semesterId);
    List<EvaluationCriteriaDTO> getAllEvaluationCriteria(Long semesterId, String classType);
    List<EvaluationCriteriaDTO> getAllEvaluationCriteriaOG(Long semesterId, String classType);
    void updateIterationWeights(List<EvaluationCriteriaDTO> evaluationCriteriaDTOS);
    EvaluationCriteriaDTO getAllEvaluationCriteriaEachIter(Long semesterId, String classType, Long iterationId);
    void updateIterationCriteriaOngoing(EvaluationCriteriaDTO evaluationCriteriaDTO);
    void updateEvaluationCriteriaFinal(List<EvaluationCriteriaDTO> evaluationCriteriaDTOS);
    void updateEvaluationCriteriaFinal2(List<EvaluationCriteriaDTO> evaluationCriteriaDTOS);
    EvaluationCriteria getEvaluationCriteriaCalculate(Long semesterId, String classType, String iterationName);
    EvaluationCriteriaDTO findEvaluationCriteriaBySemesterId(Long semesterId);
}
