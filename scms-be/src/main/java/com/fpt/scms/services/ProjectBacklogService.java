package com.fpt.scms.services;

import com.fpt.scms.model.Enum.PackageStatus;
import com.fpt.scms.model.dto.*;
import com.fpt.scms.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.List;

public interface ProjectBacklogService {
    Page<ProjectBacklogDTO> getAll(Long semesterId, Long classId, Long teamId, Pageable pageable);

    Page<ProjectBacklogDTO> getAllForStudent(Long semesterId, Long classId, Long teamId, Pageable pageable);

    Page<ProjectWBS_DTO> getAllByProjectId(Long projectId, Pageable pageable);

    List<String> creates(List<ProjectBacklogDTO> projectBacklogDTOs);

    String creates(ProjectBacklogAddDTO projectBacklogAddDTO);

    List<String> importFromExcel(MultipartFile file) throws Exception;

    List<String> updateProjectBacklogs(
            ProjectBacklog4UpdateDTO projectBacklog4UpdateDTO,
            List<ProjectBacklog4UpdateDTO> backlog4UpdateDTOS);
    List<String> updateProjectBacklogsForTeacher(
            ProjectBacklog4UpdateDTO projectBacklog4UpdateDTO,
            List<ProjectBacklog4UpdateDTO> backlog4UpdateDTOS);

    @Transactional
    void deleteProjectBacklogs(String functionName, Long featureId, Long projectId, String screenName);

    void deleteProjectBacklog(Long id);

    List<User> getAllUsersByTeamId(Long teamId);

    String updateProjectBacklog(ProjectBacklogDTO dto);

    String updatePkgStatus(Long projectBacklogId, PackageStatus srsStatus, PackageStatus sdsStatus, PackageStatus codingStatus, PackageStatus testingStatus);

    void evaluateChecklist(Long projectBacklogId, List<ChecklistEvaluationDTO> checklistEvaluationDTOS, boolean isEdit);

    List<FunctionChecklistDTO> getChecklistEvaluationsByProjectBacklogIdAndIterationId(Long projectBacklogId, Long iterationId);

    TotalLocProjectBacklogDTO getTotalLocIter(Long teamId, Long userId);

    TotalLocProjectBacklogDTO getTotalLocIterForDisPlay(Long classUserId);

    int updateProjectBacklogByTeacher(int loc, long projectBacklogId);
    int updateProjectBacklogByStudent(int loc, long projectBacklogId);
}
