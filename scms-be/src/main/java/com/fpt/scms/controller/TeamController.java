package com.fpt.scms.controller;

import com.fpt.scms.model.dto.CheckListResponseDTO;
import com.fpt.scms.model.dto.ClassResponseDTO;
import com.fpt.scms.model.dto.ProjectDTO;
import com.fpt.scms.model.dto.TeamDTO;
import com.fpt.scms.services.CheckListService;
import com.fpt.scms.services.ProjectService;
import com.fpt.scms.services.TeamService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ROLE_TEACHER')")
@RequestMapping("/api/team")
public class TeamController {

    @Autowired
    private TeamService teamService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private CheckListService checkListService;

    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @GetMapping("student")
    public TeamDTO getTeamByStudent(@RequestParam Long studentId, @RequestParam Long classId){
        return teamService.getTeamByStudentId(studentId, classId);
    }

    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @RequestMapping(value = "/update", method = RequestMethod.POST, produces = "application/json")
    public TeamDTO updateSTeam(@RequestBody TeamDTO teamDTO) {
        return teamService.updateTeam(teamDTO);
    }

    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @RequestMapping(value = "/getAllProject", method = RequestMethod.GET, produces = "application/json")
    public List<ProjectDTO> getAllProject() {
        return projectService.getAllProject();
    }

    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @RequestMapping(value = "/getAllChecklist", method = RequestMethod.GET, produces = "application/json")
    public List<CheckListResponseDTO> getAllChecklist() {
        return checkListService.getAllCheckLists();
    }

    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @GetMapping("teacher/allByClass")
    public List<TeamDTO> getAllClassBySemester(@RequestParam(required = false)  Long classId) {
        return teamService.getTeamByClass(classId);
    }

}
