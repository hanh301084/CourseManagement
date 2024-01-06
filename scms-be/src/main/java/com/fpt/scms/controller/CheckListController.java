package com.fpt.scms.controller;

import com.fpt.scms.model.dto.CheckListResponseDTO;
import com.fpt.scms.services.CheckListService;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.List;

@RestController
@PreAuthorize("hasRole('ROLE_TEACHER')")
@RequestMapping("/api/checklist")
public class CheckListController {
    @Autowired
    private CheckListService checkListService;

    @GetMapping("teacher/all")
    public List<CheckListResponseDTO> getAllCheckList(){
        return checkListService.getAllCheckLists();
    }

    @PostMapping("teacher/create")
    public CheckListResponseDTO createCheckList(@RequestBody CheckListResponseDTO responseDTO){
        return checkListService.createCheckList(responseDTO);
    }
    @PutMapping("teacher/update")
    public CheckListResponseDTO updateCheckList(@RequestBody CheckListResponseDTO responseDTO){
        return checkListService.updateCheckList(responseDTO);
    }
    @PutMapping("teacher/updateStatus/{id}")
    public CheckListResponseDTO updateCheckListStatus(@PathVariable Long id, @RequestParam("status") String status) {
        return checkListService.updateCheckListStatus(id, status);
    }
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @PostMapping("/teacher/import-checklist")
    public ResponseEntity<?> importProjects(@RequestParam("file") MultipartFile file) {
        try {
            List<String> feedback = checkListService.importFromExcel(file);
            return ResponseEntity.ok().body(feedback);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(" "+e.getMessage());
        }
    }
    @PreAuthorize("hasRole('ROLE_TEACHER')")
    @GetMapping("/teacher/download-template")
    public void downloadTemplate(HttpServletResponse response) {
        String resourcePath = "Template/Import_Checklist.xlsx";
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

}
