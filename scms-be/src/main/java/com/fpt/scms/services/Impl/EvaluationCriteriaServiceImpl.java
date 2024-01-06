package com.fpt.scms.services.Impl;

import com.fpt.scms.model.Enum.Setting;
import com.fpt.scms.model.dto.EvaluationCriteriaDTO;
import com.fpt.scms.model.entity.EvaluationCriteria;
import com.fpt.scms.model.entity.Semester;
import com.fpt.scms.repository.EvaluationCriteriaRepository;
import com.fpt.scms.repository.IterationRepository;
import com.fpt.scms.repository.SemesterRepository;
import com.fpt.scms.services.EvaluationCriteriaService;
import com.fpt.scms.services.SettingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EvaluationCriteriaServiceImpl implements EvaluationCriteriaService {

    @Autowired
    private EvaluationCriteriaRepository evaluationCriteriaRepository;
    ModelMapper modelMapper = new ModelMapper();
    @Autowired
    private IterationRepository iterationRepository;
    @Autowired
    private SettingService settingService;
    @Autowired
    private SemesterRepository semesterRepository;
    @Override
    public List<EvaluationCriteriaDTO> getAllEvaluationCriteria(Long semesterId, String classType) {
        List<EvaluationCriteria> evaluationCriterias = evaluationCriteriaRepository.findAllBySemesterId(semesterId, classType);
        return evaluationCriterias.stream()
                .map(evaluationCriteria -> modelMapper.map(evaluationCriteria, EvaluationCriteriaDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public List<EvaluationCriteriaDTO> getAllEvaluationCriteriaOG(Long semesterId, String classType) {
        List<EvaluationCriteria> evaluationCriterias = evaluationCriteriaRepository.findAllBySemesterId(semesterId, classType);
        int endIndex = Math.max(0, evaluationCriterias.size() - 1);
        List<EvaluationCriteria> subList = evaluationCriterias.subList(0, endIndex);
        return subList.stream()
                .map(evaluationCriteria -> modelMapper.map(evaluationCriteria, EvaluationCriteriaDTO.class))
                .collect(Collectors.toList());
    }

    public void updateIterationWeights(List<EvaluationCriteriaDTO> evaluationCriteriaDTOS) {
        for (EvaluationCriteriaDTO weightDTO : evaluationCriteriaDTOS) {
            Long iterationId = weightDTO.getIteration().getIterationId();
            Double evaluationWeight = weightDTO.getEvaluationWeight();
            Semester semester = weightDTO.getSemester();
            String status = weightDTO.getStatus();
            String description = weightDTO.getDescription();
            String classType = weightDTO.getClassType();
            Double ongoingSRSWeight = weightDTO.getOngoingSRSWeight();
            Double ongoingSDSWeight = weightDTO.getOngoingSDSWeight();
            Double ongoingCodingWeight = weightDTO.getOngoingCodingWeight();
            Double maxLoc = weightDTO.getMaxLoc();
            Double projectImplementation = weightDTO.getProjectImplementation();
            Double finalSRSWeight = weightDTO.getFinalSRSWeight();
            Double finalSDSWeight = weightDTO.getFinalSDSWeight();
            Double teamWorkingWeight = weightDTO.getTeamWorkingWeight();
            Double finalMaxLoc = weightDTO.getFinalMaxLoc();
            Double finalWeight = weightDTO.getFinalWeight();
            Long semesterId = semester != null ? semester.getSemesterId() : null;

            if (iterationId != null && semesterId != null && classType != null) {
                EvaluationCriteria iterationSetting = evaluationCriteriaRepository.findByIterationIdAndSemesterId(semesterId, classType, iterationId);
                if (iterationSetting != null) {
                    updateEvaluationCriteria(iterationSetting, evaluationWeight, ongoingSRSWeight, ongoingSDSWeight, ongoingCodingWeight, maxLoc, projectImplementation, finalSRSWeight, finalSDSWeight, teamWorkingWeight, finalMaxLoc, finalWeight);
                } else {
                    EvaluationCriteria newCriteria = createNewEvaluationCriteria(iterationId, semesterId, status, description, classType, evaluationWeight, ongoingSRSWeight, ongoingSDSWeight, ongoingCodingWeight, maxLoc, projectImplementation, finalSRSWeight, finalSDSWeight, teamWorkingWeight, finalMaxLoc, finalWeight);
                    evaluationCriteriaRepository.save(newCriteria);
                }
            }
        }
    }



    private void updateEvaluationCriteria(EvaluationCriteria criteria, Double evaluationWeight, Double ongoingSRSWeight, Double ongoingSDSWeight, Double ongoingCodingWeight, Double maxLoc, Double projectImplementation, Double finalSRSWeight, Double finalSDSWeight, Double teamWorkingWeight, Double finalMaxLoc, Double finalWeight) {
        criteria.setEvaluationWeight(evaluationWeight);
        criteria.setOngoingSRSWeight(ongoingSRSWeight);
        criteria.setOngoingSDSWeight(ongoingSDSWeight);
        criteria.setOngoingCodingWeight(ongoingCodingWeight);
        criteria.setMaxLoc(maxLoc);
        criteria.setProjectImplementation(projectImplementation);
        criteria.setFinalSRSWeight(finalSRSWeight);
        criteria.setFinalSDSWeight(finalSDSWeight);
        criteria.setTeamWorkingWeight(teamWorkingWeight);
        criteria.setFinalMaxLoc(finalMaxLoc);
        criteria.setFinalWeight(finalWeight);
        evaluationCriteriaRepository.save(criteria);
    }

    private EvaluationCriteria createNewEvaluationCriteria(Long iterationId, Long semesterId, String status, String description, String classType, Double evaluationWeight, Double ongoingSRSWeight, Double ongoingSDSWeight, Double ongoingCodingWeight, Double maxLoc, Double projectImplementation, Double finalSRSWeight, Double finalSDSWeight, Double teamWorkingWeight, Double finalMaxLoc, Double finalWeight) {
        EvaluationCriteria newCriteria = new EvaluationCriteria();
        newCriteria.setIteration(iterationRepository.findBy(iterationId));
        newCriteria.setSemester(semesterRepository.findBy(semesterId));
        newCriteria.setStatus(status);
        newCriteria.setDescription(description);
        newCriteria.setClassType(classType);
        newCriteria.setEvaluationWeight(evaluationWeight);
        newCriteria.setOngoingSRSWeight(ongoingSRSWeight);
        newCriteria.setOngoingSDSWeight(ongoingSDSWeight);
        newCriteria.setOngoingCodingWeight(ongoingCodingWeight);
        newCriteria.setMaxLoc(maxLoc);
        newCriteria.setProjectImplementation(projectImplementation);
        newCriteria.setFinalSRSWeight(finalSRSWeight);
        newCriteria.setFinalSDSWeight(finalSDSWeight);
        newCriteria.setTeamWorkingWeight(teamWorkingWeight);
        newCriteria.setFinalMaxLoc(finalMaxLoc);
        newCriteria.setFinalWeight(finalWeight);
        return newCriteria;
    }

    @Override
    public EvaluationCriteriaDTO getAllEvaluationCriteriaEachIter(Long semesterId, String classType, Long iterationId) {
        EvaluationCriteria evaluationCriteria = evaluationCriteriaRepository.findByIterationIdAndSemesterId(semesterId, classType, iterationId);

        if (evaluationCriteria != null) {
            return modelMapper.map(evaluationCriteria, EvaluationCriteriaDTO.class);
        } else {
            return null;
        }
    }

    @Override
    public void updateIterationCriteriaOngoing(EvaluationCriteriaDTO evaluationCriteriaDTO) {
        EvaluationCriteria iterationSetting = evaluationCriteriaRepository.findByIterationIdAndSemesterId(
                evaluationCriteriaDTO.getSemester().getSemesterId(),
                evaluationCriteriaDTO.getClassType(),
                evaluationCriteriaDTO.getIteration().getIterationId()
        );
        if (iterationSetting != null) {
            iterationSetting.setOngoingSRSWeight(evaluationCriteriaDTO.getOngoingSRSWeight());
            iterationSetting.setOngoingSDSWeight(evaluationCriteriaDTO.getOngoingSDSWeight());
            iterationSetting.setOngoingCodingWeight(evaluationCriteriaDTO.getOngoingCodingWeight());
            iterationSetting.setMaxLoc(evaluationCriteriaDTO.getMaxLoc());
            evaluationCriteriaRepository.save(iterationSetting);
        }
    }

    public void updateEvaluationCriteriaFinal(List<EvaluationCriteriaDTO> evaluationCriteriaDTOS) {
        List<EvaluationCriteria> updatedCriteriaList = new ArrayList<>();
        for (EvaluationCriteriaDTO weightDTO : evaluationCriteriaDTOS) {
            Double projectIntroduction = weightDTO.getProjectIntroduction();
            Double projectImplementation = weightDTO.getProjectImplementation();
            Double finalSRSWeight = weightDTO.getFinalSRSWeight();
            Double finalSDSWeight = weightDTO.getFinalSDSWeight();
            Double qAndA = weightDTO.getQAndA();
            Double teamWorkingWeight = weightDTO.getTeamWorkingWeight();
            Double finalMaxLoc = weightDTO.getFinalMaxLoc();
            Long semesterId = weightDTO.getSemester().getSemesterId();

            if (semesterId != null) {
                List<EvaluationCriteria> evaluationCriteria = evaluationCriteriaRepository.findAllBySemesterIdFinal(semesterId);
                if (evaluationCriteria != null) {
                    for (EvaluationCriteria criteria : evaluationCriteria) {
                        criteria.setProjectIntroduction(projectIntroduction);
                        criteria.setProjectImplementation(projectImplementation);
                        criteria.setFinalSRSWeight(finalSRSWeight);
                        criteria.setFinalSDSWeight(finalSDSWeight);
                        criteria.setTeamWorkingWeight(teamWorkingWeight);
                        criteria.setQAndA(qAndA);
                        criteria.setFinalMaxLoc(finalMaxLoc);
                        updatedCriteriaList.add(criteria);
                    }
                }
            }
        }
        evaluationCriteriaRepository.saveAll(updatedCriteriaList);
    }

    public void updateEvaluationCriteriaFinal2(List<EvaluationCriteriaDTO> evaluationCriteriaDTOS) {
        List<EvaluationCriteria> updatedCriteriaList = new ArrayList<>();
        for (EvaluationCriteriaDTO weightDTO : evaluationCriteriaDTOS) {
            Double totalOngoingWeight = weightDTO.getTotalOngoingWeight();
            Double finalWeight = weightDTO.getFinalWeight();
            Long semesterId = weightDTO.getSemester().getSemesterId();

            if (semesterId != null) {
                List<EvaluationCriteria> evaluationCriteria = evaluationCriteriaRepository.findAllBySemesterIdFinal(semesterId);
                if (evaluationCriteria != null) {
                    for (EvaluationCriteria criteria : evaluationCriteria) {
                        criteria.setTotalOngoingWeight(totalOngoingWeight);
                        criteria.setFinalWeight(finalWeight);
                        updatedCriteriaList.add(criteria);
                    }
                }
            }
        }
        evaluationCriteriaRepository.saveAll(updatedCriteriaList);
    }
    @Override
    public EvaluationCriteria getEvaluationCriteriaCalculate(Long semesterId, String classType, String iterationName) {
        EvaluationCriteria evaluationCriteria = evaluationCriteriaRepository.findByIterationNameAndSemesterId(semesterId, classType, iterationName);
        if (evaluationCriteria != null) {
            return evaluationCriteria;
        } else {
            return null;
        }
    }

    @Override
    public EvaluationCriteriaDTO findEvaluationCriteriaBySemesterId(Long semesterId) {
        EvaluationCriteria evaluationCriteria=evaluationCriteriaRepository.findEvaluationCriteriaBySemesterId(semesterId);
        if(evaluationCriteria!=null){
            return modelMapper.map(evaluationCriteria,EvaluationCriteriaDTO.class);
        }
        return null;
    }

    public List<EvaluationCriteriaDTO>getAllEvaluationCriteriaFinal(Long semesterId){
        List<EvaluationCriteria> evaluationCriterias = evaluationCriteriaRepository.findAllBySemesterIdFinal(semesterId);
        return evaluationCriterias.stream()
                .map(evaluationCriteria -> modelMapper.map(evaluationCriteria, EvaluationCriteriaDTO.class))
                .collect(Collectors.toList());
    }
    public List<EvaluationCriteriaDTO>getAllEvaluationCriteriaFinal2(Long semesterId){
        List<EvaluationCriteria> evaluationCriterias = evaluationCriteriaRepository.findAllBySemesterIdFinal(semesterId);
        return evaluationCriterias.stream()
                .map(evaluationCriteria -> modelMapper.map(evaluationCriteria, EvaluationCriteriaDTO.class))
                .collect(Collectors.toList());
    }

}