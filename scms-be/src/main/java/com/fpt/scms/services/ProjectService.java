package com.fpt.scms.services;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.ProjectDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ProjectService {
    ProjectDTO findById(Long id);
    Page<ProjectDTO> findAll(Pageable pageable, String searchText, Status status);
    Page<ProjectDTO> findAllForStudent(Pageable pageable, String searchText);
    ProjectDTO createProject(ProjectDTO projectDTO);
    ProjectDTO updateProject(ProjectDTO projectDTO);

    ProjectDTO updateForStudent(ProjectDTO projectDTO);

    void delete(Long id);

    void deleteForStudent(Long id);

    List<String> importFromExcel(MultipartFile file) throws Exception;

    List<ProjectDTO> getAllProject();

    void activateProject(Long projectId);

    void deactivateProject(Long projectId);
}
