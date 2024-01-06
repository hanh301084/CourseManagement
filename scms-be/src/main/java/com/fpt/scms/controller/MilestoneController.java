package com.fpt.scms.controller;

import com.fpt.scms.model.dto.MilestoneDTO;
import com.fpt.scms.model.entity.Milestone;
import com.fpt.scms.services.MilestoneService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ROLE_TEACHER')")
@RequestMapping("/api/milestone")
public class MilestoneController {

    @Autowired
    MilestoneService milestoneService;

    @RequestMapping(value = "add", method = RequestMethod.POST, produces = "application/json")
    public MilestoneDTO createMilestone(@RequestBody Milestone milestone) {
        return milestoneService.createMilestone(milestone);
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @RequestMapping(value = "/findAllMilestonesByClassId/{classId}",method = RequestMethod.GET,produces = "application/json")
    public List<MilestoneDTO> findAllMilestones(@PathVariable long classId){
        return milestoneService.getAllActiveMilestone(classId);
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @RequestMapping(value = "/getMilestoneByClassId/{classId}",method = RequestMethod.GET,produces = "application/json")
    public MilestoneDTO getMilestoneByClassId(@PathVariable long classId){
        return milestoneService.getMilestoneByClassId(classId);
    }
}
