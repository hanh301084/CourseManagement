package com.fpt.scms.controller;


import com.fpt.scms.services.ClassUserService;
import com.fpt.scms.services.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chart")
@PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
public class ChartController {
    @Autowired
    private UserService userService;

    @Autowired
    private ClassUserService classUserService;

    @GetMapping("/user-enrollment")
    public ResponseEntity<?> getUserEnrollmentData() {
        return ResponseEntity.ok(userService.getUserEnrollmentData());
    }

    @GetMapping("/passFailByYear/{year}")
    public ResponseEntity<?> getPassFailByYear(@PathVariable int year){
        return ResponseEntity.ok(classUserService.getPassFailData(year));
    }
}
