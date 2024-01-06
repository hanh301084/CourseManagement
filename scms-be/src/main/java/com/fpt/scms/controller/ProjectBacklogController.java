package com.fpt.scms.controller;

import com.fpt.scms.model.dto.*;
import com.fpt.scms.services.ProjectBacklogService;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.beans.factory.annotation.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import com.fpt.scms.model.entity.*;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


@RestController
@CrossOrigin(origins = "http://localhost:3000")
@RequestMapping("/api/project-backlog")
public class ProjectBacklogController {

    @Autowired
    private ProjectBacklogService service;

    @GetMapping("/teacher/all")
    public ResponseEntity<Page<ProjectBacklogDTO>> getAll(
            @RequestParam(required = false) Long semesterId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long teamId,
            Pageable pageable) {

        Page<ProjectBacklogDTO> projectBacklogDTOS = service.getAll(semesterId, classId, teamId, pageable);
        return ResponseEntity.ok().body(projectBacklogDTOS);
    }
    @GetMapping("/student/all")
    public ResponseEntity<Page<ProjectBacklogDTO>> getAllForStudent(
            @RequestParam(required = false) Long semesterId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long teamId,
            Pageable pageable) {

        Page<ProjectBacklogDTO> projectBacklogDTOS = service.getAllForStudent(semesterId, classId, teamId, pageable);
        return ResponseEntity.ok().body(projectBacklogDTOS);
    }
    @GetMapping("/teacher/allByProject")
    public ResponseEntity<Page<ProjectWBS_DTO>> getAllByProject(
            @RequestParam Long projectId, Pageable pageable) {

        Page<ProjectWBS_DTO> projectWBSDtos = service.getAllByProjectId(projectId, pageable);
        return ResponseEntity.ok().body(projectWBSDtos);
    }

    @PostMapping("/teacher/import-project-backlog")
    public ResponseEntity<?> importProjects(@RequestParam("file") MultipartFile file) {
        try {
            List<String> feedback = service.importFromExcel(file);
            return ResponseEntity.ok().body(feedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(" " + e.getMessage());
        }
    }
    @PutMapping("/update-backlogs")
    public ResponseEntity<List<String>> updateProjectBacklogs(@RequestBody CombinedBacklogDTO combinedDTO) {
        List<String> feedback = service.updateProjectBacklogs(
                combinedDTO.getProjectBacklog4UpdateDTO(), combinedDTO.getProjectBacklogDTOs());
        return ResponseEntity.ok(feedback);
    }
    @PutMapping("/teacher/update-backlogs")
    public ResponseEntity<List<String>> updateProjectBacklogsForTeacher(@RequestBody CombinedBacklogDTO combinedDTO) {
        List<String> feedback = service.updateProjectBacklogs(
                combinedDTO.getProjectBacklog4UpdateDTO(), combinedDTO.getProjectBacklogDTOs());
        return ResponseEntity.ok(feedback);
    }
    @PutMapping(value = "/update-backlog", consumes = "application/json")
    public ResponseEntity<?> updateProjectBacklog(@RequestBody ProjectBacklogDTO projectBacklogDTO) {
        try {
            String feedback = service.updateProjectBacklog(projectBacklogDTO);
            return ResponseEntity.ok(feedback);
        } catch (RuntimeException e) {
            return ResponseEntity
                    .status(HttpStatus.FORBIDDEN) // or any other appropriate status
                    .body("Error: " + e.getMessage());
        }
    }

    @PostMapping("/add-backlog")
    public ResponseEntity<String> addBacklog(
            @RequestBody ProjectBacklogAddDTO projectBacklogDTO) {
        String feedback = service.creates(projectBacklogDTO);
        return ResponseEntity.ok(feedback);
    }
    @DeleteMapping("/delete")
    public ResponseEntity<Void> deleteProjectBacklogs(
            @RequestParam String functionName,
            @RequestParam Long featureId,
            @RequestParam Long projectId,
            @RequestParam String screenName)

    {
         service.deleteProjectBacklogs(functionName, featureId, projectId, screenName);
        return ResponseEntity.noContent().build();
    }
    @DeleteMapping("student/delete")
    public ResponseEntity<?> deleteProject(@RequestBody ProjectBacklogDTO dto) {
        try {
            service.deleteProjectBacklog(dto.getProjectBacklogId());
            return ResponseEntity.ok().build();
        } catch (RuntimeException e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(errorResponse);
        }
    }

    @GetMapping("/{teamId}/users")
    public ResponseEntity<List<User>> getUsersByTeamId(@PathVariable Long teamId) {
        List<User> users = service.getAllUsersByTeamId(teamId);
        return ResponseEntity.ok(users);
    }
    @PutMapping("/{id}/pkg-status")
    public ResponseEntity<String> updatePkgStatus(
            @PathVariable Long id,
            @RequestBody ProjectBacklogDTO backlogDTO) {
        String response = service.updatePkgStatus(
                id,
                backlogDTO.getSrsStatus(),
                backlogDTO.getSdsStatus(),
                backlogDTO.getCodingStatus(),
                backlogDTO.getTestingStatus()
        );
        return ResponseEntity.ok(response);
    }
    @GetMapping("/hod/import-projectWBS/download-template")
    public void downloadTemplate(HttpServletResponse response) {
        String resourcePath = "Template/ProjectWBS_Template.xlsx";

        try (InputStream templateStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(resourcePath)) {
            if (templateStream == null) {
                throw new RuntimeException("Template file not found");
            }
            response.addHeader("Content-disposition", "attachment;filename=projectWBS-template.xlsx");
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            IOUtils.copy(templateStream, response.getOutputStream());
            response.flushBuffer();
        } catch (IOException ex) {
            throw new RuntimeException("IOError writing file to output stream", ex);
        }
    }
    @PostMapping("/{projectBacklogId}/evaluate-checklist")
    public ResponseEntity<?> evaluateChecklist(@PathVariable Long projectBacklogId,
                                               @RequestBody List<ChecklistEvaluationDTO> checklistEvaluationDTOS,
                                               @RequestParam(required = false, defaultValue = "true") boolean isEdit) {
        service.evaluateChecklist(projectBacklogId, checklistEvaluationDTOS, isEdit);
        return ResponseEntity.ok().build();
    }
    @GetMapping("/evaluation/{projectBacklogId}/{iterationId}")
    public ResponseEntity<List<FunctionChecklistDTO>> getChecklistEvaluations(@PathVariable Long projectBacklogId, @PathVariable Long iterationId) {
        try {
            List<FunctionChecklistDTO> evaluations = service.getChecklistEvaluationsByProjectBacklogIdAndIterationId(projectBacklogId, iterationId);
            return new ResponseEntity<>(evaluations, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace(); // Add this to log the exception
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @RequestMapping(value = "/getToalLocByClassUser", method = RequestMethod.GET, produces = "application/json")
    public TotalLocProjectBacklogDTO getTotalLocIterForDisPlay(
            @RequestParam Long classUserId)

    {
        return service.getTotalLocIterForDisPlay(classUserId);
    }
    @RequestMapping(value = "/updateProjectBacklogByTeacher/{loc}/{projectBacklogId}", method = RequestMethod.GET, produces = "application/json")
    public int updateProjectBacklogByTeacher(@PathVariable int loc, @PathVariable long projectBacklogId)
        {
        return service.updateProjectBacklogByTeacher(loc,projectBacklogId);
    }
    @RequestMapping(value = "/updateProjectBacklogByStudent/{loc}/{projectBacklogId}", method = RequestMethod.GET, produces = "application/json")
    public int  updateProjectBacklogByStudent(@PathVariable int loc, @PathVariable long projectBacklogId)
    {
        return service.updateProjectBacklogByStudent(loc,projectBacklogId);
    }
}