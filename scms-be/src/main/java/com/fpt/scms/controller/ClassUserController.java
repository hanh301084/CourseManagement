package com.fpt.scms.controller;

import com.fpt.scms.model.dto.ClassUserDTO;
import com.fpt.scms.services.ClassUserService;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.List;

@RestController
//@PreAuthorize("hasRole('ROLE_TEACHER')")
@RequestMapping("/api/classUser/")
public class ClassUserController {
    @Autowired
    ClassUserService classUserService;
//    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_REVIEWER')")
//    @RequestMapping(value = "teacher/all/", method = RequestMethod.GET, produces = "application/json")
//    public List<ClassUserDTO> getAllClassUser(@RequestParam Long classId) {
//        return  classUserService.getAllClassUser(classId);
//    }

    @PreAuthorize("hasRole('ROLE_STUDENT')")
    @RequestMapping(value = "student/all/", method = RequestMethod.GET, produces = "application/json")
    public List<ClassUserDTO> getAllClassUserForStudent(@RequestParam Long classId, @RequestParam Long studentId) {
        return  classUserService.getAllClassUserForStudent(classId, studentId);
    }

    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT') OR hasRole('ROLE_REVIEWER')")
    @RequestMapping(value = "teacher/allFilter/", method = RequestMethod.GET, produces = "application/json")
    public List<ClassUserDTO> getAllClassUserFilter(
            @RequestParam(required = false) Long semesterId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long teamId) {
        return  classUserService.getAllClassUserFilter(semesterId,classId,teamId);
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT') OR hasRole('ROLE_REVIEWER')")
    @RequestMapping(value = "reviewer/allFilter/", method = RequestMethod.GET, produces = "application/json")
    public List<ClassUserDTO> getAllClassUserFilterForReviewer(
            @RequestParam(required = false) Long semesterId,
            @RequestParam(required = false) Long classId,
            @RequestParam(required = false) Long teamId) {
        return  classUserService.getAllClassUserFilterForReviewer(semesterId,classId,teamId);
    }

    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_STUDENT') OR hasRole('ROLE_REVIEWER')")
    @RequestMapping(value = "teacher/totalUser/", method = RequestMethod.GET, produces = "application/json")
    public List<Integer> getTotalUserBuClass(@RequestParam Long classId) {
        return Collections.singletonList(classUserService.getCountTotalUser(classId));
    }

    @PostMapping("/teacher/import-classUser/")
    public ResponseEntity<?> importClassUser(@RequestParam("file") MultipartFile file,@RequestParam Long classId) {
        try {
            classUserService.importFromExcel(file, classId);
            return ResponseEntity.ok().body("Import user to class successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error importing: " + e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ROLE_STUDENT')")
    @RequestMapping(value = "student/class/", method = RequestMethod.GET, produces = "application/json")
    public List<ClassUserDTO> getClassForStudent(@RequestParam Long studentId) {
        return  classUserService.getClassForStudent(studentId);
    }

    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @GetMapping("/teacher/import-student/download-template")
    public void downloadTemplate(HttpServletResponse response) {
        String resourcePath = "Template/Import_Student.xlsx";
        try (InputStream templateStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(resourcePath)) {
            if (templateStream == null) {
                throw new RuntimeException("Template file not found");
            }
            response.addHeader("Content-disposition", "attachment;filename=student-template.xlsx");
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            IOUtils.copy(templateStream, response.getOutputStream());
            response.flushBuffer();
        } catch (IOException ex) {
            throw new RuntimeException("IOError writing file to output stream", ex);
        }
    }

    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
    @PostMapping("/hod/import-classUser/")
    public ResponseEntity<?> importClassUserForHOD(@RequestParam("file") MultipartFile file,@RequestParam Long classId) {
        try {
            classUserService.importFromExcel(file, classId);
            return ResponseEntity.ok().body("Import user to class successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error importing: " + e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @RequestMapping(value = "/teacher/create", method = RequestMethod.POST, produces = "application/json")
    public ClassUserDTO create(@RequestBody ClassUserDTO classUserDTO) {
        return classUserService.create(classUserDTO);
    }

    @RequestMapping(value = "/updateFinalPresEvalByTeamId/{finalPresEval}/{teamId}",method = RequestMethod.PUT,produces = "application/json")
    public  int updateFinalPresEvalByTeamId(@PathVariable float finalPresEval,@PathVariable long teamId){
        return classUserService.updateFinalPresEvalByTeamId(finalPresEval, teamId);
    }

    @RequestMapping(value = "/updateFinalPresentationResitByTeamId/{finalPresentationResit}/{teamId}",method = RequestMethod.PUT,produces = "application/json")
    public  int updateFinalPresentationResitByTeamId(@PathVariable float finalPresentationResit,@PathVariable long teamId){
        return classUserService.updateFinalPresentationResitByTeamId(finalPresentationResit, teamId);
    }
    @GetMapping("/export/{classId}")
    public ResponseEntity<byte[]> exportClassUserGrades(@PathVariable Long classId, HttpServletResponse response) {
        byte[] excelFile = classUserService.exportClassUserGradesToExcel(classId);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=class-users-grades.xlsx");
        headers.add(HttpHeaders.CONTENT_TYPE, "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(excelFile);
    }
    @PreAuthorize("hasRole('ROLE_TEACHER') OR hasRole('ROLE_HEADOFDEPARTMENT')")
    @PutMapping("/updateFinalGrades/{classId}")
    public ResponseEntity<?> updateFinalGrades(@PathVariable Long classId) {
        try {
            classUserService.calculateAndUpdateFinalGrades(classId);
            return ResponseEntity.ok().body("Final grades updated successfully for class ID: " + classId);
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating final grades: " + e);
        }
    }
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @DeleteMapping("/teacher/deleteSelected")
    public ResponseEntity<?> deleteSelectedClassUsers(@RequestBody List<Long> classUserIds) {
        try {
            classUserService.deleteSelectedClassUsers(classUserIds);
            return ResponseEntity.ok("Selected Student deleted successfully!");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error during deletion: " + e.getMessage());
        }
    }

}
