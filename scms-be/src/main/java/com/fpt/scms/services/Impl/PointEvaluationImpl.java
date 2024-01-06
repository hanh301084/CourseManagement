package com.fpt.scms.services.Impl;

import com.fpt.scms.model.dto.PointEvaluationDTO;
import com.fpt.scms.model.dto.ProjectDTO;
import com.fpt.scms.model.entity.*;
import com.fpt.scms.model.entity.Class;
import com.fpt.scms.repository.*;
import com.fpt.scms.services.PointEvaluationService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Transactional
public class PointEvaluationImpl implements PointEvaluationService {
    @Autowired
    PointEvaluationRepository pointEvaluationRepository;
    @Autowired
    ClassUserRepository classUserRepository;
    @Autowired
    SemesterRepository semesterRepository;
    @Autowired
    EvaluationCriteriaRepository evaluationCriteriaRepository;
    @Autowired
    TeamRepository teamRepository;
    ModelMapper modelMapper = new ModelMapper();

    @Override
    public PointEvaluation getPointEvaluationByTeamIdAndReviewerId(Long teamId, Long reviewerId, boolean isResit) {
        return pointEvaluationRepository.getPointEvaluationByTeamIdAndReviewerId(teamId, reviewerId, isResit);
    }

    @Override
    public PointEvaluation save(PointEvaluationDTO pointEvaluationDTO) {
        Semester currentSemester = semesterRepository.findActiveSemester()
                .orElseThrow(() -> new RuntimeException("Semester not found"));
        EvaluationCriteria evaluationCriteria = evaluationCriteriaRepository
                .findEvaluationCriteriaBySemesterId(currentSemester.getSemesterId());

        PointEvaluation pointEvaluation = modelMapper.map(pointEvaluationDTO, PointEvaluation.class);
        pointEvaluationRepository.save(pointEvaluation);
        // Fetch team and classUser
        Team team = fetchTeam(pointEvaluation);
        ClassUser classUser = fetchClassUser(team);

        // Recalculate average grade
        float recalculatedAverageGrade = recalculateAverageGradeForTeam(team.getTeamId(), pointEvaluationDTO.isResit(), evaluationCriteria);

        // Update ClassUser with the new average grade
        if (pointEvaluationDTO.isResit()) {
            classUserRepository.updateFinalPresEvalResit(classUser.getClassId().getClassId(), team.getTeamId(), recalculatedAverageGrade);
        } else {
            classUserRepository.updateFinalPresEval(classUser.getClassId().getClassId(), team.getTeamId(), recalculatedAverageGrade);
        }

        // Save PointEvaluation entity
        return pointEvaluation;
    }

    @Override
    public List<PointEvaluationDTO> getPointEvaluations(Long teamId, boolean isResit) {
        List<PointEvaluation> evaluations = pointEvaluationRepository.findAllByTeam_TeamIdAndIsResit(teamId, isResit);
        return evaluations.stream()
                .map(evaluation -> modelMapper.map(evaluation, PointEvaluationDTO.class))
                .collect(Collectors.toList());
    }


    private Team fetchTeam(PointEvaluation pointEvaluation) {
        return Optional.ofNullable(teamRepository.findTeamByTeamId(pointEvaluation.getTeam().getTeamId()))
                .orElseThrow(() -> new RuntimeException("Team not found"));
    }

    private ClassUser fetchClassUser(Team team) {
        return Optional.ofNullable(classUserRepository.findFirstByClassId_ClassIdAndTeamId_TeamId(
                        team.getClassEntity().getClassId(), team.getTeamId()))
                .orElseThrow(() -> new RuntimeException("Class user not found"));
    }
    private float calculateFinalGrade(PointEvaluationDTO dto, EvaluationCriteria criteria) {
        return (float) (Optional.ofNullable(dto.getProjectIntroduction()).orElse(0f) * criteria.getProjectIntroduction() / 100
                + Optional.ofNullable(dto.getFinalSRSWeight()).orElse(0f) * criteria.getFinalSRSWeight() / 100
                + Optional.ofNullable(dto.getFinalSDSWeight()).orElse(0f) * criteria.getFinalSDSWeight() / 100
                + Optional.ofNullable(dto.getProjectImplementation()).orElse(0f) * criteria.getProjectImplementation() / 100
                + Optional.ofNullable(dto.getTeamWorkingWeight()).orElse(0f) * criteria.getTeamWorkingWeight() / 100
                + Optional.ofNullable(dto.getQandA()).orElse(0f) * criteria.getQAndA() / 100);
    }


    private float recalculateAverageGradeForTeam(Long teamId, boolean isResit, EvaluationCriteria evaluationCriteria) {
        List<PointEvaluation> evaluations = pointEvaluationRepository.findAllByTeam_TeamIdAndIsResit(teamId, isResit);

        if (evaluations.isEmpty()) {
            return 0;
        }

        float sum = 0;
        for (PointEvaluation evaluation : evaluations) {
            PointEvaluationDTO dto = createDTOFromEntity(evaluation);
            sum += calculateFinalGrade(dto, evaluationCriteria);
        }

        // Fetch the class entity to determine the number of reviewers
        Class classEntity = teamRepository.findById(teamId)
                .map(Team::getClassEntity)
                .orElseThrow(() -> new RuntimeException("Class entity not found for team"));

        // Get the number of reviewers based on resit status
        int numberOfReviewers = isResit ?
                getNumberReviewerResitOfClass(classEntity) : getNumberReviewerOfClass(classEntity);

        // Avoid division by zero
        if (numberOfReviewers == 0) {
            return 0;
        }

        return sum / numberOfReviewers;
    }

    private PointEvaluationDTO createDTOFromEntity(PointEvaluation evaluation) {
        PointEvaluationDTO dto = new PointEvaluationDTO();
        dto.setProjectIntroduction(evaluation.getProjectIntroduction());
        dto.setFinalSRSWeight(evaluation.getFinalSRSWeight());
        dto.setFinalSDSWeight(evaluation.getFinalSDSWeight());
        dto.setProjectImplementation(evaluation.getProjectImplementation());
        dto.setTeamWorkingWeight(evaluation.getTeamWorkingWeight());
        dto.setQandA(evaluation.getQandA());
        return dto;
    }
    int getNumberReviewerResitOfClass(Class cl) {
        int count = 0;
        if (cl.getReviewerResit1() != null) {
            count++;
        }
        if (cl.getReviewerResit2() != null) {
            count++;
        }
        if (cl.getReviewerResit3() != null) {
            count++;
        }
        if (cl.getReviewerResit4() != null) {
            count++;
        }
        return count;
    }
    int getNumberReviewerOfClass(Class cl) {
        int count = 0;
        if (cl.getReviewer1() != null) {
            count++;
        }
        if (cl.getReviewer2() != null) {
            count++;
        }
        if (cl.getReviewer3() != null) {
            count++;
        }
        if (cl.getReviewer4() != null) {
            count++;
        }
        return count;
    }
}
