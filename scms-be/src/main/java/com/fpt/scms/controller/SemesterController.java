package com.fpt.scms.controller;

import com.fpt.scms.model.dto.RoleResponseDTO;
import com.fpt.scms.model.dto.SemesterResponseDTO;
import com.fpt.scms.services.SemesterService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
@RequestMapping("/api/semester")
public class SemesterController {
    @Autowired
    SemesterService semesterService;

    @RequestMapping(value = "hod/all", method = RequestMethod.GET, produces = "application/json")
    public Page<SemesterResponseDTO> getAllSemesterHOD(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword,
            @RequestParam(defaultValue = "") Integer year) {
        return semesterService.getAllSemester(page,size,keyword,year);
    }

    @RequestMapping(value = "hod/add", method = RequestMethod.POST, produces = "application/json")
    public SemesterResponseDTO createSemester(@RequestBody SemesterResponseDTO semesterDTO) {
        return semesterService.createSemester(semesterDTO);
    }
    @RequestMapping(value = "hod/update", method = RequestMethod.POST, produces = "application/json")
    public SemesterResponseDTO updateSemester( @RequestBody SemesterResponseDTO semesterDTO) {
        return semesterService.updateSemester( semesterDTO);
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT') OR hasRole('ROLE_REVIEWER')")
    @RequestMapping(value = "hod/allActive", method = RequestMethod.GET, produces = "application/json")
    public List<SemesterResponseDTO> getAllSemesterActive(){
        return  semesterService.getAllSemesterActive();
    }

    @RequestMapping(value = "hod/years", method = RequestMethod.GET, produces = "application/json")
    public List<String> getAllSemesterYear() {
        return semesterService.getAllSemesterYear();
    }

    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT') or hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @RequestMapping(value = "currentSemester", method = RequestMethod.GET, produces = "application/json")
    public SemesterResponseDTO getCurrentSemester() {
        return semesterService.findCurrentSemester();
    }

}
