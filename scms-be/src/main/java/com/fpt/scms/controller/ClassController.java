package com.fpt.scms.controller;

import com.fpt.scms.model.dto.ClassResponseDTO;
import com.fpt.scms.model.dto.ClassDTO;
import com.fpt.scms.security.CurrentUser;
import com.fpt.scms.security.UserPrincipal;
import com.fpt.scms.services.ClassService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/class")
public class ClassController {

    @Autowired
    private ClassService classService;

    @GetMapping("/hod/all")
    public List<ClassResponseDTO> getAllClasses() {
        return classService.getAllClasses();
    }

    @PostMapping("/hod/create")
    public ClassResponseDTO createClass(@CurrentUser UserPrincipal userPrincipal, @RequestBody ClassDTO request) {
        return classService.createClass(request, userPrincipal.getId());
    }

    @PutMapping("/hod/update")
    public ClassResponseDTO updateClass(@CurrentUser UserPrincipal userPrincipal, @RequestBody ClassDTO request) {
        return classService.updateClass(request, userPrincipal.getId());
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @GetMapping("teacher/allByTrainer")
    public List<ClassResponseDTO> getAllClassesByTrainer(@RequestParam Long trainerId, @RequestParam Long semesterId) {
        return classService.getAllClassesByTrainer(trainerId, semesterId);
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT')")
    @GetMapping("teacher/allBySemester")
    public List<ClassResponseDTO> getAllClassBySemester(@RequestParam(required = false)  Long semesterId) {
        return classService.getAllClassesBySemester(semesterId, "ACTIVE");
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_REVIEWER')")
    @GetMapping("reviewer/allBySemester")
    public List<ClassResponseDTO> getAllClassBySemesterForReviewer(@RequestParam(required = false)  Long semesterId) {
        return classService.getAllClassesBySemesterForReviewer(semesterId, "ACTIVE");
    }
//    @PreAuthorize("hasRole('ROLE_REVIEWER')")
    @GetMapping("reviewer/allByReviewer")
    public List<ClassResponseDTO> getAllClassesByReviewer(@RequestParam Long reviewerId, @RequestParam Long semesterId) {
        return classService.getAllClassesByReviewer(reviewerId, semesterId);
    }
        @PreAuthorize("hasRole('ROLE_STUDENT')")
    @GetMapping("/student/detail/{id}")
    public ClassResponseDTO detailClass(@PathVariable Long id) {
        return classService.getDetailClass(id);
    }

}