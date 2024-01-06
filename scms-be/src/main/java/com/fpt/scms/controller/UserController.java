package com.fpt.scms.controller;


import com.fpt.scms.execption.ResourceNotFoundException;
import com.fpt.scms.model.dto.UserProfileDTO;
import com.fpt.scms.model.dto.UserDTO;
import com.fpt.scms.model.dto.UserUpdateDTO;
import com.fpt.scms.security.CurrentUser;
import com.fpt.scms.security.UserPrincipal;
import com.fpt.scms.services.UserService;
import org.apache.commons.compress.utils.IOUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.InputStream;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @Autowired
    UserService userService;
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
    @RequestMapping(value= "hod/all", method = RequestMethod.GET, produces = "application/json")
    public Page<UserDTO> getAllUserForAdmin(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword) {
        return userService.getAllUser(page, size, keyword);
    }
    @PreAuthorize("hasAnyRole('ROLE_HEADOFDEPARTMENT','ROLE_TEACHER','ROLE_STUDENT', 'ROLE_REVIEWER')")
    @RequestMapping("/me")
    public UserProfileDTO getCurrentUser(@CurrentUser UserPrincipal userPrincipal) {
        return userService.findByEmail(userPrincipal.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("User", "id", userPrincipal.getId()));
    }
    @PreAuthorize("hasAnyRole('ROLE_HEADOFDEPARTMENT','ROLE_TEACHER','ROLE_STUDENT', 'ROLE_REVIEWER')")
    @PutMapping("/me")
    public ResponseEntity<?> updateCurrentUser(@CurrentUser UserPrincipal userPrincipal, @RequestBody UserUpdateDTO userUpdateDTO) {
        UserProfileDTO updatedUser = userService.updateUser(userPrincipal.getId(), userUpdateDTO);
        return ResponseEntity.ok().body(updatedUser);
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
    @PostMapping("/hod/updateRoles")
    public ResponseEntity<?> updateUserRoles(@RequestBody UserDTO userResponseDTO) {
        try {
            userService.updateUserRoles(userResponseDTO, userResponseDTO.getRole());

            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            Map<String, String> errorResponse = new HashMap<>();
            errorResponse.put("message", e.getMessage());
            return new ResponseEntity<>(e.getMessage(), HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
    @PutMapping("/hod/updateStatus")
    public ResponseEntity<?> updateUserStatus(@RequestBody UserDTO userResponseDTO) {
        Map<String, String> response = new HashMap<>();
        try {
            userService.updateUserStatus(userResponseDTO, String.valueOf(userResponseDTO.getStatus()));
            response.put("message", "User status updated successfully.");
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (Exception e) {
            e.printStackTrace();
            response.put("message", "Error updating user status: " + e.getMessage());
            return new ResponseEntity<>(response, HttpStatus.BAD_REQUEST);
        }
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
    @PostMapping("/hod/import-teachers")
    public ResponseEntity<?> importTeachers(@RequestParam("file") MultipartFile file) {
        try {
            List<String> feedback = userService.importTeachersFromExcel(file);
            return ResponseEntity.ok().body(feedback);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Collections.singletonList(e.getMessage()));
        }
    }
    @PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
    @GetMapping("/hod/import-teachers/download-template")
    public void downloadTemplate(HttpServletResponse response) {
        String resourcePath = "Template/ImportTeacher.xlsx"; // Note: No leading slash for relative paths

        try (InputStream templateStream = Thread.currentThread().getContextClassLoader().getResourceAsStream(resourcePath)) {
            if (templateStream == null) {
                throw new RuntimeException("Template file not found");
            }
            response.addHeader("Content-disposition", "attachment;filename=teacher-template.xlsx");
            response.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            IOUtils.copy(templateStream, response.getOutputStream());
            response.flushBuffer();
        } catch (IOException ex) {
            throw new RuntimeException("IOError writing file to output stream", ex);
        }
    }
}