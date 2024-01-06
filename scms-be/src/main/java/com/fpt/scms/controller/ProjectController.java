package com.fpt.scms.controller;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.ProjectDTO;
import com.fpt.scms.services.ProjectService;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.HashMap;
import java.util.Map;
@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "http://localhost:3000")

public class ProjectController {
    @Autowired
    private ProjectService projectService;
    @GetMapping("/teacher/all")
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    public ResponseEntity<Page<ProjectDTO>> getAllProjects(
            Pageable pageable,
            @RequestParam(name = "search", required = false) String searchText,
            @RequestParam(name = "status", required = false) Status status) {
        return ResponseEntity.ok(projectService.findAll(pageable, searchText, status));
    }

    @GetMapping("/student/all")
    public ResponseEntity<Page<ProjectDTO>> getAllProjectsForStudent(
            Pageable pageable,
            @RequestParam(name = "search", required = false) String searchText) {
        return ResponseEntity.ok(projectService.findAllForStudent(pageable, searchText));
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') or hasRole('ROLE_STUDENT')")
    @PostMapping("teacher/create")
    public ResponseEntity<?> createProject(@RequestBody ProjectDTO projectDTO) {
        try {
            return ResponseEntity.ok(projectService.createProject(projectDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @PutMapping("teacher/update")
    public ResponseEntity<?> updateProject(@RequestBody ProjectDTO projectDTO) {
        try {
            return ResponseEntity.ok(projectService.updateProject(projectDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    @PutMapping("student/update")
    public ResponseEntity<?> updateProjectForStudent(@RequestBody ProjectDTO projectDTO) {
        try {
            return ResponseEntity.ok(projectService.updateForStudent(projectDTO));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @DeleteMapping("teacher/delete")
    public ResponseEntity<Void> deleteProject(@RequestBody ProjectDTO projectDTO) {
        try {

        projectService.delete(projectDTO.getProjectId());
        return ResponseEntity.ok().build();
        }catch (RuntimeException e){
            return ResponseEntity.badRequest().build();
        }
    }
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    @DeleteMapping("student/delete")
    public ResponseEntity<?> deleteProjectForStudent(@RequestBody ProjectDTO projectDTO) {
        try {
            projectService.deleteForStudent(projectDTO.getProjectId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @PostMapping("/teacher/import-project")
    public ResponseEntity<?> importProjects(@RequestParam("file") MultipartFile file) {
        try {
            List<String> feedback = projectService.importFromExcel(file);
            return ResponseEntity.ok().body(feedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(" "+e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') or hasRole('ROLE_STUDENT')")
    @GetMapping("/details")
    public ResponseEntity<ProjectDTO> getProjectById(@RequestParam("id") Long projectId) {
        ProjectDTO projectDTO = projectService.findById(projectId);
        if (projectDTO != null) {
            return ResponseEntity.ok(projectDTO);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') or hasRole('ROLE_STUDENT')")
    @GetMapping("/hod/import-project/download-template")
    public void downloadTemplate(HttpServletResponse response) {
        String resourcePath = "Template/Import_Project.xlsx";
        try (InputStream templateStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(resourcePath)) {
            if (templateStream == null) {
                throw new RuntimeException("Template file not found");
            }
            response.addHeader("Content-disposition", "attachment;filename=project-template.xlsx");
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            IOUtils.copy(templateStream, response.getOutputStream());
            response.flushBuffer();
        } catch (IOException ex) {
            throw new RuntimeException("IOError writing file to output stream", ex);
        }
    }
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @PutMapping("/teacher/activate")
    public ResponseEntity<?> activateProject(@RequestBody ProjectDTO projectDTO) {
        try {
            projectService.activateProject(projectDTO.getProjectId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @PutMapping("/teacher/deactivate")
    public ResponseEntity<?> deactivateProject(@RequestBody ProjectDTO projectDTO) {
        try {
            projectService.deactivateProject(projectDTO.getProjectId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
