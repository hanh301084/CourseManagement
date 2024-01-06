package com.fpt.scms.services.Impl;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.ProjectDTO;
import com.fpt.scms.model.dto.UserDTO;
import com.fpt.scms.model.entity.Project;
import com.fpt.scms.model.entity.User;
import com.fpt.scms.repository.ProjectRepository;
import com.fpt.scms.repository.UserRepository;
import com.fpt.scms.security.UserPrincipal;
import com.fpt.scms.services.ProjectService;
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

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class ProjectServiceImpl implements ProjectService {

    @Autowired
    private ProjectRepository projectRepository;
    @Autowired
    private UserRepository userRepository;
    ModelMapper modelMapper = new ModelMapper();
    private static final Logger log = LoggerFactory.getLogger(ProjectServiceImpl.class);

    @Override
    public ProjectDTO findById(Long id) {
        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));
        return modelMapper.map(project, ProjectDTO.class);
    }
    public List<ProjectDTO> getAllProject() {
        List<Project> projects = projectRepository.findAll();
        return projects.stream()
                .map(project -> modelMapper.map(project, ProjectDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public Page<ProjectDTO> findAll(Pageable pageable, String searchText, Status status) {
        Page<Project> projects;
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));

        if (searchText == null || searchText.trim().isEmpty()) {
            projects = projectRepository.findByTeacherAndStudentsInClass(currentUser.getUserId(), status,pageable);
        } else {
            projects = projectRepository.findByCreatedByWithParams(currentUser.getUserId(), searchText,status, pageable);
        }

        return projects.map(project -> {
            ProjectDTO dto = modelMapper.map(project, ProjectDTO.class);
            dto.setCreatedBy(createUserResponseFromUser(project.getCreatedBy()));
            dto.setUpdatedBy(createUserResponseFromUser(project.getUpdatedBy()));
            return dto;
        });
    }
    @Override
    public Page<ProjectDTO> findAllForStudent(Pageable pageable, String searchText) {
        Page<Project> projects;
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        if (searchText == null || searchText.trim().isEmpty()) {
            projects = projectRepository.findProjectsByUserOrTeachers(currentUser.getUserId(), Status.ACTIVE, pageable);
        } else {
            projects = projectRepository.findProjectsByCreatorOrTeachersAndSearchText(currentUser.getUserId(), searchText, Status.ACTIVE, pageable);
        }

        return projects.map(project -> {
            ProjectDTO dto = modelMapper.map(project, ProjectDTO.class);
            dto.setCreatedBy(createUserResponseFromUser(project.getCreatedBy()));
            dto.setUpdatedBy(createUserResponseFromUser(project.getUpdatedBy()));
            return dto;
        });
    }

    private UserDTO createUserResponseFromUser(User user) {
        if (user == null) {
            return null;
        }

        UserDTO userResponse = new UserDTO();
        userResponse.setUserId(user.getUserId());
        userResponse.setFullName(user.getFullName());
        return userResponse;
    }

    @Override
    public ProjectDTO createProject(ProjectDTO projectDTO) {
        UserPrincipal currentUserPrincipal = (UserPrincipal)
                SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        Optional<Project> existingProject = projectRepository.findExistProjectByUser(projectDTO.getTopicCode(),
                projectDTO.getTopicName(), currentUser.getUserId());

        if(existingProject.isPresent()) {
            throw new RuntimeException("Project with this topicCode or topicName already exists!");
        }
        Project project = modelMapper.map(projectDTO, Project.class);
        project.setCreatedBy(currentUser);
        project.setUpdatedBy(currentUser);
        project.setStatus(Status.ACTIVE);
        project = projectRepository.save(project);

        return modelMapper.map(project, ProjectDTO.class);
    }

    @Override
    public ProjectDTO updateProject(ProjectDTO projectDTO) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        Optional<Project> existingProject = projectRepository.findExistProjectByUser(projectDTO.getTopicCode(), projectDTO.getTopicName(), currentUser.getUserId());
        Project project = projectRepository.findById(projectDTO.getProjectId()).orElseThrow(() -> new RuntimeException("Project not found"));
        if(existingProject.isPresent() && !existingProject.get().getProjectId().equals(projectDTO.getProjectId())) {
            throw new RuntimeException("Project with this topicCode or topicName already exists!");
        }
        if (projectDTO.getTopicCode().isEmpty() || projectDTO.getTopicName().isEmpty()){
            throw new RuntimeException("Topic code and topic name can't not be null");
        }
        project.setTopicCode(projectDTO.getTopicCode());
        project.setTopicName(projectDTO.getTopicName());
        project.setDescription(projectDTO.getDescription());
        project.setCreatedBy(currentUser);
        project.setUpdatedBy(currentUser);
        project = projectRepository.save(project);
        return modelMapper.map(project, ProjectDTO.class);
    }
    @Override
    public ProjectDTO updateForStudent(ProjectDTO projectDTO) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));


        Project project = projectRepository.findById(projectDTO.getProjectId()).orElseThrow(() -> new RuntimeException("Project not found"));
        Optional<Project> existingProject = projectRepository.findExistProjectByUser(projectDTO.getTopicCode(), projectDTO.getTopicName(), currentUser.getUserId());
        if (!Objects.equals(project.getCreatedBy().getUserId(), currentUser.getUserId())){
            throw new RuntimeException("You dont have permission to update this project!");
        }
        if(existingProject.isPresent() && !existingProject.get().getProjectId().equals(projectDTO.getProjectId())) {
            throw new RuntimeException("Project with this topicCode or topicName already exists!");
        }
        project.setTopicCode(projectDTO.getTopicCode());
        project.setTopicName(projectDTO.getTopicName());
        project.setDescription(projectDTO.getDescription());
        project.setCreatedBy(currentUser);
        project.setUpdatedBy(currentUser);
        project = projectRepository.save(project);
        return modelMapper.map(project, ProjectDTO.class);
    }

    @Override
    public void delete(Long id) {
        projectRepository.deleteById(id);
    }
    @Override
    public void deleteForStudent(Long id) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));


        Project project = projectRepository.findById(id).orElseThrow(() -> new RuntimeException("Project not found"));

        if (!Objects.equals(project.getCreatedBy().getUserId(), currentUser.getUserId())){
            throw new RuntimeException("You dont have permission to delete this project!");
        }
        projectRepository.deleteById(id);
    }

    @Override
    public List<String> importFromExcel(MultipartFile file) throws Exception {
        List<String> feedback = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row firstRow = sheet.getRow(0);
            String formatFile = firstRow.getCell(0).getStringCellValue() +" "+ firstRow.getCell(1).getStringCellValue()+ " "+firstRow.getCell(2).getStringCellValue()+" "+firstRow.getCell(3).getStringCellValue();

            if (!"No Project Name Project Code Description".equals(formatFile)) {
                throw new RuntimeException("Your file uploaded has the wrong format");
            }
            int firstDataRowIndex = 1;

            for (int i = firstDataRowIndex; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }
                
                Cell cellTopicName = row.getCell(1);
                Cell cellTopicCode = row.getCell(2);
                Cell cellDescription = row.getCell(3);

                ProjectDTO projectDTO = getProjectDTO(cellTopicCode, cellTopicName, cellDescription);
                    String topicName = projectDTO.getTopicName();
                    String topicCode = projectDTO.getTopicCode();
                try {
                    createProject(projectDTO);
                    feedback.add("Added project: " + topicName + "("+topicCode+")");
                } catch (RuntimeException e) {
                    feedback.add("Duplicate or already exist topic: " + topicName +"("+topicCode+")");
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to import Projects: " + e.getMessage());
        }
        return  feedback;
    }
    @Override
    public void activateProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setStatus(Status.ACTIVE);
        projectRepository.save(project);
    }

    @Override
    public void     deactivateProject(Long projectId) {
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() -> new RuntimeException("Project not found"));
        project.setStatus(Status.INACTIVE);
        projectRepository.save(project);
    }

    private static ProjectDTO getProjectDTO(Cell cellTopicCode, Cell cellTopicName, Cell cellDescription) {
        String topicCode = cellTopicCode.getStringCellValue();
        String topicName = cellTopicName.getStringCellValue();
        DataFormatter formatter = new DataFormatter();
        String description = formatter.formatCellValue(cellDescription);
        ProjectDTO projectDTO = new ProjectDTO();
        projectDTO.setTopicCode(topicCode);
        projectDTO.setTopicName(topicName);
        projectDTO.setDescription(description);
        return projectDTO;
    }

}
