package com.fpt.scms.services.Impl;

import com.fpt.scms.model.Enum.*;
import com.fpt.scms.model.Enum.Setting;
import com.fpt.scms.model.dto.*;
import com.fpt.scms.model.entity.*;
import com.fpt.scms.model.entity.Class;
import com.fpt.scms.repository.*;
import com.fpt.scms.security.UserPrincipal;
import com.fpt.scms.services.ProjectBacklogService;
import net.bytebuddy.implementation.bytecode.Throw;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.persistence.EntityNotFoundException;
import javax.transaction.Transactional;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;
import java.util.stream.StreamSupport;

@Service
public class ProjectBacklogServiceImpl implements ProjectBacklogService {

    @Autowired
    private ProjectBacklogRepository backlogRepository;
    @Autowired
    SettingRepository settingRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private MilestoneRepository milestoneRepository;
    @Autowired
    private FeatureRepository featureRepository;
    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private TeamRepository teamRepository;
    @Autowired
    private IterationRepository iterationRepository;
    @Autowired
    private FunctionChecklistRepository functionChecklistRepository;
    @Autowired
    private CheckListItemsRepository checkListItemsRepository;
    @Autowired
    private ClassUserRepository classUserRepository;
    @Autowired
    ClassRepository classRepository;

    private final ModelMapper modelMapper = new ModelMapper();

    private static final Logger log = LoggerFactory.getLogger(ProjectBacklogServiceImpl.class);

    @Override
    public Page<ProjectBacklogDTO> getAll(Long semesterId, Long classId, Long teamId, Pageable pageable) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        return backlogRepository.findAllByFilters(semesterId, classId, teamId, currentUser.getUserId(), pageable)
                .map(entity -> modelMapper.map(entity, ProjectBacklogDTO.class));
    }

    @Override
    public Page<ProjectBacklogDTO> getAllForStudent(Long semesterId, Long classId, Long teamId, Pageable pageable) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        Long userId = currentUser.getUserId();
        return backlogRepository.findAllByFiltersForStudent(semesterId, classId, teamId, userId, pageable)
                .map(entity -> modelMapper.map(entity, ProjectBacklogDTO.class));
    }

    @Override
    public Page<ProjectWBS_DTO> getAllByProjectId(Long projectId, Pageable pageable) {
        return backlogRepository.findAllByProjectID(projectId, pageable)
                .map(entity -> modelMapper.map(entity, ProjectWBS_DTO.class));
    }

    public List<String> creates(List<ProjectBacklogDTO> projectBacklogDTOs) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));

        List<String> feedback = new ArrayList<>();
        List<ProjectBacklog> projectBacklogs = new ArrayList<>();

        for (ProjectBacklogDTO dto : projectBacklogDTOs) {
            ProjectBacklog projectBacklog = modelMapper.map(dto, ProjectBacklog.class);
            if (isDuplicate(dto)) {
                feedback.add("Duplicate Function: " + "'" + dto.getFunctionName() + "'");
                continue;
            }
            projectBacklog.setCreatedBy(currentUser);
            projectBacklogs.add(projectBacklog);
            feedback.add("Import successfully Function" + "'" + dto.getFunctionName() + "'" + "!");
        }

        Iterable<ProjectBacklog> savedBacklogs = backlogRepository.saveAll(projectBacklogs);
        StreamSupport.stream(savedBacklogs.spliterator(), false);


        return feedback;
    }

    @Override
    public String creates(ProjectBacklogAddDTO projectBacklogDTOs) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        String feedback = "";

        // Check if the project backlog already exists
        Feature feature = featureRepository.findFeatureByFeatureName(projectBacklogDTOs.getFeatureName());
        if (feature == null) {
            feature = new Feature();
            feature.setFeatureName(projectBacklogDTOs.getFeatureName());
            featureRepository.save(feature);
        }

        Team team = teamRepository.findTeamByTeamId(projectBacklogDTOs.getTeamId());
        ProjectBacklog existingBacklog = backlogRepository.findByFunctionNameAndFeature_FeatureIdAndActorAndTeam_TeamId(
                projectBacklogDTOs.getFunctionName(),
                feature.getFeatureId(),
                projectBacklogDTOs.getActor(),
                team.getTeamId()
        );

        if (existingBacklog != null) {
            throw new IllegalArgumentException("Backlog already exists");

        }
        ProjectBacklog projectBacklog = modelMapper.map(projectBacklogDTOs, ProjectBacklog.class);
        projectBacklog.setCreatedBy(currentUser);
        projectBacklog.setFeature(feature);
        projectBacklog.setTeam(team);
        projectBacklog.setProject(null);

        try {
            backlogRepository.save(projectBacklog);
            feedback = "Add backlog successfully";
            return feedback;
        } catch (RuntimeException e) {
            feedback = "Add backlog Fail: " + e;
            return feedback;
        }
    }


    public boolean isDuplicate(ProjectBacklogDTO backlogDTO) {
        List<ProjectBacklog> existingEntries = backlogRepository.findByFunctionNameAndFeatureAndActorAndProjectAndTeamAndScreenName(
                backlogDTO.getFunctionName(),
                backlogDTO.getFeature(),
                backlogDTO.getActor(),
                backlogDTO.getProject(),
                backlogDTO.getTeam(),
                backlogDTO.getScreenName()
        );
        return !existingEntries.isEmpty();
    }


    @Override
    public List<String> importFromExcel(MultipartFile file) throws Exception {
        List<String> feedback = new ArrayList<>();
        List<ProjectBacklogDTO> backlogBatch = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row firstRow = sheet.getRow(0);
            String projectName = firstRow.getCell(2).getStringCellValue();
            if (projectName == null || projectName.isEmpty()) {
                throw new RuntimeException("Missing Project Name");
            }
            UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User currentUser = userRepository.findById(currentUserPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("Current User not found"));
            Project project = projectRepository.findByUserAndProjectName(projectName.trim(), currentUser.getUserId());
            if (project == null) {
                throw new IllegalArgumentException("Not found project with name " + "'" + projectName + "'" + ". Please create first!");
            }
            Row headerRow = sheet.getRow(3);
            String header = headerRow.getCell(0).getStringCellValue()
                    + " " + headerRow.getCell(1).getStringCellValue()
                    + " " + headerRow.getCell(2).getStringCellValue()
                    + " " + headerRow.getCell(3).getStringCellValue()
                    + " " + headerRow.getCell(4).getStringCellValue()
                    + " " + headerRow.getCell(5).getStringCellValue();
            log.error(header);
            if (!header.equals("Function Name Screen Name Feature Actor(Users) Complexity LOC")) {
                throw new RuntimeException("Your file uploaded is wrong format. Please download the template!");
            }

            List<Team> teams = teamRepository.findAllByProject_ProjectIdIs(project.getProjectId());
            int firstDataRowIndex = 5;
            for (Team team : teams) {
                for (int i = firstDataRowIndex; i <= sheet.getLastRowNum(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) {
                        continue;
                    }
                    Cell functionCell = row.getCell(0);
                    Cell screenNameCell = row.getCell(1);
                    Cell featureCell = row.getCell(2);
                    Cell actorCell = row.getCell(3);
                    Cell complexityCell = row.getCell(4);
                    Cell locCell = row.getCell(5);

                    String function = functionCell.getStringCellValue();
                    String screenName = screenNameCell.getStringCellValue();
                    String featureName = featureCell.getStringCellValue();
                    String actor = actorCell.getStringCellValue();
                    String complexity = complexityCell.getStringCellValue();
                    int loc = (int) locCell.getNumericCellValue();

                    // Check if feature exists, create if not
                    Feature feature = featureRepository.findFeatureByFeatureName(featureName);
                    if (feature == null) {
                        feature = new Feature();
                        feature.setFeatureName(featureName);
                        featureRepository.save(feature);
                    }

                    ProjectBacklogDTO backlog = new ProjectBacklogDTO();
                    backlog.setFunctionName(function.trim());
                    backlog.setScreenName(screenName.trim());
                    backlog.setFeature(feature);
                    backlog.setActor(actor.trim());
                    backlog.setComplexity(Complexity.valueOf(complexity.toUpperCase().trim()));
                    backlog.setLoc(loc);
                    backlog.setProject(project);
                    backlog.setTeam(team);
                    backlogBatch.add(backlog);
                }
            }
            if (teams.isEmpty()) {
                for (int i = firstDataRowIndex; i <= sheet.getLastRowNum(); i++) {
                    Row row = sheet.getRow(i);
                    if (row == null) {
                        continue;
                    }
                    Cell functionCell = row.getCell(0);
                    Cell screenNameCell = row.getCell(1);
                    Cell featureCell = row.getCell(2);
                    Cell actorCell = row.getCell(3);
                    Cell complexityCell = row.getCell(4);
                    Cell locCell = row.getCell(5);


                    String function = functionCell.getStringCellValue();
                    String screenName = screenNameCell.getStringCellValue();
                    String featureName = featureCell.getStringCellValue();
                    String actor = actorCell.getStringCellValue();
                    String complexity = complexityCell.getStringCellValue();
                    int loc = (int) locCell.getNumericCellValue();

                    // Check if feature exists, create if not
                    Feature feature = featureRepository.findFeatureByFeatureName(featureName);
                    if (feature == null) {
                        feature = new Feature();
                        feature.setFeatureName(featureName);
                        featureRepository.save(feature);
                    }

                    ProjectBacklogDTO backlog = new ProjectBacklogDTO();
                    backlog.setFunctionName(function.trim());
                    backlog.setScreenName(screenName.trim());
                    backlog.setFeature(feature);
                    backlog.setActor(actor.trim());
                    backlog.setComplexity(Complexity.valueOf(complexity.toUpperCase().trim()));
                    backlog.setLoc(loc);
                    backlog.setProject(project);
                    backlogBatch.add(backlog);
                }
            }
            try {
                List<String> createFeedback = creates(backlogBatch);
                feedback.addAll(createFeedback);
            } catch (RuntimeException e) {
                feedback.add("Error: " + e.getMessage());
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed: " + e.getMessage());
        }

        return feedback;
    }

    public List<String> updateProjectBacklogs(
            ProjectBacklog4UpdateDTO projectBacklog4UpdateDTO,
            List<ProjectBacklog4UpdateDTO> backlog4UpdateDTOS) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        List<String> feedback = new ArrayList<>();
        Feature feature = featureRepository.findByFeatureId(Long.valueOf(projectBacklog4UpdateDTO.getFeatureId()));
        if (feature == null) {
            Feature newFeature = new Feature();
            newFeature.setFeatureName(projectBacklog4UpdateDTO.getFeatureId());
            featureRepository.save(newFeature);
            feature = newFeature;
        }
        try {
            ProjectBacklog4UpdateDTO firstDto = backlog4UpdateDTOS.get(0);

            List<ProjectBacklog> existingBacklogs = backlogRepository.findAllByProject_ProjectIdAndFeature_FeatureIdAndFunctionNameAndScreenName(
                    projectBacklog4UpdateDTO.getProjectId(), feature.getFeatureId(), projectBacklog4UpdateDTO.getFunctionName(), projectBacklog4UpdateDTO.getScreenName());

            for (ProjectBacklog backlog : existingBacklogs) {
                if (!backlog.getCreatedBy().equals(currentUser)) {
                    throw new RuntimeException("You dont have permission to update this project WBS");
                }
                mapDtoToEntity(firstDto, backlog);
            }

            List<ProjectBacklog> updatedBacklogs = existingBacklogs.stream()
                    .filter(backlog -> backlog.getCreatedBy().equals(currentUser))
                    .collect(Collectors.toList());

            backlogRepository.saveAll(updatedBacklogs);
            feedback.add("Successfully updated " + updatedBacklogs.size() + " backlogs for project ID ");
        } catch (RuntimeException e) {
            // Rethrow the exception instead of just adding it to the feedback
            throw e;
        }
        return feedback;
    }

    @Override
    public List<String> updateProjectBacklogsForTeacher(
            ProjectBacklog4UpdateDTO projectBacklog4UpdateDTO,
            List<ProjectBacklog4UpdateDTO> backlog4UpdateDTOS) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        List<String> feedback = new ArrayList<>();
        Feature feature = featureRepository.findByFeatureId(Long.valueOf(projectBacklog4UpdateDTO.getFeatureId()));
        if (feature == null) {
            Feature newFeature = new Feature();
            newFeature.setFeatureName(projectBacklog4UpdateDTO.getFeatureId());
            featureRepository.save(newFeature);
            feature = newFeature;
        }
        try {
            ProjectBacklog4UpdateDTO firstDto = backlog4UpdateDTOS.get(0);

            List<ProjectBacklog> existingBacklogs = backlogRepository.findAllByProject_ProjectIdAndFeature_FeatureIdAndFunctionNameAndScreenName(
                    projectBacklog4UpdateDTO.getProjectId(), feature.getFeatureId(), projectBacklog4UpdateDTO.getFunctionName(), projectBacklog4UpdateDTO.getScreenName());

            for (ProjectBacklog backlog : existingBacklogs) {

                mapDtoToEntity(firstDto, backlog);
            }

            List<ProjectBacklog> updatedBacklogs = existingBacklogs.stream()
                    .filter(backlog -> backlog.getCreatedBy().equals(currentUser))
                    .collect(Collectors.toList());

            backlogRepository.saveAll(updatedBacklogs);
            feedback.add("Successfully updated " + updatedBacklogs.size() + " backlogs for project ID ");
        } catch (RuntimeException e) {
            // Rethrow the exception instead of just adding it to the feedback
            throw e;
        }
        return feedback;
    }


    @Transactional
    @Override
    public void deleteProjectBacklogs(String functionName, Long featureId, Long projectId, String screenName) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));

        List<ProjectBacklog> projectBacklogs = backlogRepository.findAllByProject_ProjectIdAndFeature_FeatureIdAndFunctionNameAndScreenName(projectId, featureId, functionName, screenName);
        if (projectBacklogs.isEmpty()) {
            throw new RuntimeException("have no project backlogs to delete!");
        }
        for (ProjectBacklog projectBacklog : projectBacklogs
        ) {
            if (!Objects.equals(projectBacklog.getCreatedBy().getUserId(), currentUser.getUserId())) {
                throw new RuntimeException("You dont have permission to delete this project WBS!");
            }
        }

        backlogRepository.deleteProjectBacklogsByFunctionNameAndFeature_FeatureIdAndProjectProjectId(functionName, featureId, projectId);
    }

    @Override
    public void deleteProjectBacklog(Long id) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        ProjectBacklog projectBacklog = backlogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Backlog not found"));
        if (currentUser != projectBacklog.getCreatedBy()) {
            throw new IllegalArgumentException("You don't have permission to delete this backlog! please contact your trainer or person who created this");
        } else {
            backlogRepository.deleteById(id);
        }
    }


    private void mapDtoToEntity(ProjectBacklog4UpdateDTO dto, ProjectBacklog entity) {
        Feature feature = processFeature(dto.getFeatureId());
        entity.setFunctionName(dto.getFunctionName());
        entity.setScreenName(dto.getScreenName());
        entity.setFeature(feature);
        entity.setActor(dto.getActor());
        entity.setComplexity(dto.getComplexity());
        entity.setLoc(dto.getLoc());
    }

    public Feature processFeature(String featureIdOrName) {
        Feature feature;

        // Check if the string contains only digits (is a numeric ID)
        if (featureIdOrName.matches("\\d+")) {
            Long featureId = Long.parseLong(featureIdOrName);
            feature = featureRepository.findById(featureId)
                    .orElseThrow(() -> new RuntimeException("Feature with ID " + featureId + " not found"));
        } else {
            // If the string contains non-numeric characters, treat it as a name
            feature = featureRepository.findFeatureByFeatureName(featureIdOrName);
            if (feature == null) {
                Feature newFeature = new Feature();
                newFeature.setFeatureName(featureIdOrName);
                featureRepository.save(newFeature);
                feature = newFeature;
            }
        }
        return feature;
    }

    @Override
    public List<User> getAllUsersByTeamId(Long teamId) {
        return backlogRepository.findAllActiveUsersByTeamId(teamId);
    }

    public String updateProjectBacklog(ProjectBacklogDTO dto) {
        ProjectBacklog backlog = modelMapper.map(dto, ProjectBacklog.class);
        Team team = teamRepository.findTeamByTeamId(dto.getTeam().getTeamId());
        team.setIsLocked("YES");
        teamRepository.save(team);
        backlogRepository.save(backlog);
        return "Backlog updated successfully";
    }

    public String updatePkgStatus(Long projectBacklogId, PackageStatus srsStatus, PackageStatus sdsStatus, PackageStatus codingStatus, PackageStatus testingStatus) {
        ProjectBacklog backlog = backlogRepository.findById(projectBacklogId)
                .orElseThrow(() -> new EntityNotFoundException("ProjectBacklog not found with id: " + projectBacklogId));

        backlog.setSrsStatus(srsStatus);
        backlog.setSdsStatus(sdsStatus);
        backlog.setCodingStatus(codingStatus);
        backlog.setTestingStatus(testingStatus);
        backlog.setUpdatedAt(LocalDateTime.now());

        backlogRepository.save(backlog);
        return "Package status updated successfully";
    }

    public void evaluateChecklist(Long projectBacklogId, List<ChecklistEvaluationDTO> checklistEvaluationDTOS, boolean isEdit) {
        ProjectBacklog backlog = backlogRepository.findById(projectBacklogId)
                .orElseThrow(() -> new EntityNotFoundException("Project backlog not found"));
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));

        int passedCount = 0;
        int totalEvaluatedCount = 0;

        for (ChecklistEvaluationDTO checklistEvaluationDTO : checklistEvaluationDTOS) {
            for (FunctionChecklistDTO functionChecklistDTO : checklistEvaluationDTO.getFunctionChecklistDTOS()) {
                if (!FunctionChecklistStatus.NOT_USE.equals(functionChecklistDTO.getStatus())) {
                    totalEvaluatedCount++;
                    if (FunctionChecklistStatus.PASSED.equals(functionChecklistDTO.getStatus())) {
                        passedCount++;
                    }
                }

                CheckListItems checkListItems = checkListItemsRepository.findById(functionChecklistDTO.getCheckListItemId())
                        .orElseThrow(() -> new EntityNotFoundException("CheckList Item not found"));

                // Check if FunctionChecklist already exists
                Optional<FunctionChecklist> existingChecklist = functionChecklistRepository.findByCheckListItems_IdAndIteration_IterationIdAndProjectBacklog_ProjectBacklogId(
                        checkListItems.getId(), functionChecklistDTO.getIterationId(), projectBacklogId);

                FunctionChecklist functionChecklist;

                if (existingChecklist.isPresent()) {
                    // Update existing FunctionChecklist
                    functionChecklist = existingChecklist.get();
                    functionChecklist.setStatus(functionChecklistDTO.getStatus());
                } else {
                    // Create new FunctionChecklist
                    functionChecklist = modelMapper.map(functionChecklistDTO, FunctionChecklist.class);
                    functionChecklist.setProjectBacklog(backlog);
                    functionChecklist.setTeacher(currentUser);
                    functionChecklist.setCheckListItems(checkListItems);
                    functionChecklist.setStatus(functionChecklistDTO.getStatus());
                }

                functionChecklistRepository.save(functionChecklist);
            }
        }
        Project project = projectRepository.findByProjectId(backlog.getProject().getProjectId());
        if (project != null) {
            project.setLock(true);
            projectRepository.save(project);
        }
        updateBacklog(backlog, passedCount, totalEvaluatedCount, isEdit);
        backlogRepository.save(backlog);
    }

    private void updateBacklog(ProjectBacklog backlog, int passedCount, int totalEvaluatedCount, boolean isEdit) {
        if (totalEvaluatedCount > 0) {
            boolean allNotPassed = passedCount == 0;
            float completionPercent;
            int locIter;

            if (allNotPassed) {
                completionPercent = 0;
                locIter = 0;
            } else {
                completionPercent = ((float) passedCount / totalEvaluatedCount) * 100;
                locIter = Math.round(completionPercent * backlog.getLoc() / 100);
            }

            backlog.setCompletePercentLoc(completionPercent);

            Iteration currentIteration = getCurrentIteration(backlog);
            if (isEdit) {
                int locIterForPreviousIterations = calculateLocForPreviousIterations(backlog, currentIteration);
                int correctedLocIter = locIter - locIterForPreviousIterations;
                setLocIterForIteration(backlog, currentIteration, correctedLocIter);
                updateIterationStatus(backlog, completionPercent, currentIteration, true);
            } else {
                int additionalLocIter = calculateAdditionalLocIter(backlog, currentIteration, locIter);
                setLocIterForIteration(backlog, currentIteration, additionalLocIter);
                updateIterationStatus(backlog, completionPercent, currentIteration, false);
            }
        }
    }

    private int calculateLocForPreviousIterations(ProjectBacklog backlog, Iteration currentIteration) {
        int cumulativeLoc = 0;
        long currentIterationId = currentIteration.getIterationId();

        // Assuming you have a method to get the iteration ID for each locIter
        if (backlog.getLocIter1() != null && currentIterationId != 1) {
            cumulativeLoc += backlog.getLocIter1();
        }
        if (backlog.getLocIter2() != null && currentIterationId != 2) {
            cumulativeLoc += backlog.getLocIter2();
        }
        if (backlog.getLocIter3() != null && currentIterationId != 3) {
            cumulativeLoc += backlog.getLocIter3();
        }
        if (backlog.getLocIter4() != null && currentIterationId != 4) {
            cumulativeLoc += backlog.getLocIter4();
        }
        if (backlog.getLocIter5() != null && currentIterationId != 5) {
            cumulativeLoc += backlog.getLocIter5();
        }
        if (backlog.getLocIter6() != null && currentIterationId != 6) {
            cumulativeLoc += backlog.getLocIter6();
        }

        return cumulativeLoc;
    }


    private int calculateAdditionalLocIter(ProjectBacklog backlog, Iteration currentIteration, int locIter) {
        int cumulativeLoc = 0;

        // Sum the LOC from previous iterations
        cumulativeLoc += backlog.getLocIter1() != null ? backlog.getLocIter1() : 0;
        cumulativeLoc += backlog.getLocIter2() != null ? backlog.getLocIter2() : 0;
        cumulativeLoc += backlog.getLocIter3() != null ? backlog.getLocIter3() : 0;
        cumulativeLoc += backlog.getLocIter4() != null ? backlog.getLocIter4() : 0;
        cumulativeLoc += backlog.getLocIter5() != null ? backlog.getLocIter5() : 0;
        cumulativeLoc += backlog.getLocIter6() != null ? backlog.getLocIter6() : 0;

        // Subtract cumulative LOC from current locIter to get additional LOC for this iteration
        int additionalLocIter = locIter - cumulativeLoc;

        // Ensure the additional LOC is not negative
        return Math.max(additionalLocIter, 0);
    }

    private void updateIterationStatus(ProjectBacklog backlog, float completionPercent, Iteration currentIteration, boolean isEdit) {
        if (!isEdit) {
            if (completionPercent == 100) {
                backlog.setCompleted_iteration(currentIteration);

                backlog.setActualCodeIteration(currentIteration);
                backlog.setActualLoc(backlog.getLoc());
            } else {
                backlog.setCompleted_iteration(null);
                Iteration nextIter = iterationRepository.findNextIteration(currentIteration);
                backlog.setActualCodeIteration(nextIter);
                backlog.setActualLoc((int) ((backlog.getLoc() * backlog.getCompletePercentLoc()) / 100));
            }
        } else {
            if (completionPercent == 100) {
                backlog.setCompleted_iteration(currentIteration);
                backlog.setActualCodeIteration(currentIteration);
                backlog.setActualLoc(backlog.getLoc());
            } else {
                backlog.setCompleted_iteration(null);
                Iteration nextIter = iterationRepository.findNextIteration(currentIteration);
                backlog.setActualCodeIteration(nextIter);
                backlog.setActualLoc((int) ((backlog.getLoc() * backlog.getCompletePercentLoc()) / 100));

            }
        }
    }

    private void setLocIterForIteration(ProjectBacklog backlog, Iteration iteration, int locIter) {
        if (iteration != null) {
            switch (iteration.getIterationName()) {
                case "Iteration 1":
                    backlog.setLocIter1(locIter);
                    break;
                case "Iteration 2":
                    backlog.setLocIter2(locIter);
                    break;
                case "Iteration 3":
                    backlog.setLocIter3(locIter);
                    break;
                case "Iteration 4":
                    backlog.setLocIter4(locIter);
                    break;
                case "Iteration 5":
                    backlog.setLocIter5(locIter);
                    break;
                case "Iteration 6":
                    backlog.setLocIter6(locIter);
                    break;
                default:
                    throw new IllegalArgumentException("Unknown iteration: " + iteration.getIterationName());
            }
        }
    }

    private Iteration getCurrentIteration(ProjectBacklog backlog) {
        Milestone milestone = milestoneRepository.getMilestoneByClassId(backlog.getTeam().getClassEntity().getClassId());
        return milestone.getIterationId();
    }


    public List<FunctionChecklistDTO> getChecklistEvaluationsByProjectBacklogIdAndIterationId(Long projectBacklogId, Long iterationId) {
        List<FunctionChecklist> functionChecklists = functionChecklistRepository.findByProjectBacklog_ProjectBacklogIdAndIteration_IterationId(projectBacklogId, iterationId);

        List<FunctionChecklistDTO> functionChecklistDTOS = new ArrayList<>();
        for (FunctionChecklist checklist : functionChecklists) {
            FunctionChecklistDTO dto = getFunctionChecklistDTO(checklist);
            functionChecklistDTOS.add(dto);
        }
        Optional<ProjectBacklog> projectBacklog = backlogRepository.findById(projectBacklogId);
        if (projectBacklog.isPresent()) {
            if (projectBacklog.get().getTeam().getClassEntity().getIsBlock5() == IsBlock5.NO) {
                com.fpt.scms.model.entity.Setting setting = settingRepository.findSettingByTypeIdAndSettingTitle(projectBacklog.get().getTeam().getClassEntity().getSemester().getSemesterId(),
                        Setting.ITERATION_BLOCK10);
                setting.setStatus("LOCKED");
                settingRepository.save(setting);
            } else {
                com.fpt.scms.model.entity.Setting setting = settingRepository.findSettingByTypeIdAndSettingTitle(projectBacklog.get().getTeam().getClassEntity().getSemester().getSemesterId(),
                        Setting.ITERATION_BLOCK5);
                setting.setStatus("LOCKED");
                settingRepository.save(setting);
            }

            Class clazz = classRepository.findByClassId(projectBacklog.get().getTeam().getClassEntity().getClassId());
            clazz.setIs_use("YES");
            classRepository.save(clazz);
        }

        return functionChecklistDTOS;
    }

    private static FunctionChecklistDTO getFunctionChecklistDTO(FunctionChecklist checklist) {
        FunctionChecklistDTO dto = new FunctionChecklistDTO();
        dto.setId(checklist.getId());
        dto.setProjectBacklogId(checklist.getProjectBacklog() != null ? checklist.getProjectBacklog().getProjectBacklogId() : null);
        dto.setCheckListItemId(checklist.getCheckListItems() != null ? checklist.getCheckListItems().getId() : null);
        dto.setTeacher(checklist.getTeacher());
        dto.setStatus(checklist.getStatus());
        dto.setIterationId(checklist.getIteration() != null ? checklist.getIteration().getIterationId() : null);
        return dto;
    }

    @Override
    public TotalLocProjectBacklogDTO getTotalLocIter(Long teamId, Long userId) {
        return backlogRepository.getTotalLocByUser(teamId, userId);
    }

    @Override
    public TotalLocProjectBacklogDTO getTotalLocIterForDisPlay(Long classUserId) {
        ClassUser classUser = classUserRepository.findByClassUserId(classUserId);
        return backlogRepository.getTotalLocByUser(classUser.getTeamId().getTeamId(), classUser.getUserId().getUserId());
    }

    @Override
    public int updateProjectBacklogByTeacher(int loc, long projectBacklogId) {
        return backlogRepository.updateProjectBacklogByTeacher(loc, projectBacklogId);
    }

    @Override
    public int updateProjectBacklogByStudent(int loc, long projectBacklogId) {
        return backlogRepository.updateProjectBacklogByStudent(loc, projectBacklogId);
    }
}
