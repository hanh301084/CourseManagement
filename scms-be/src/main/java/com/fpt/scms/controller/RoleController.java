package com.fpt.scms.controller;

import com.fpt.scms.model.dto.RoleResponseDTO;
import com.fpt.scms.services.RoleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@PreAuthorize("hasRole('ROLE_HEADOFDEPARTMENT')")
@RequestMapping("/api/role")
public class RoleController {

    @Autowired
    RoleService roleService;

    @RequestMapping(value = "hod/all", method = RequestMethod.GET, produces = "application/json")
    public Page<RoleResponseDTO> getAllRoleForHOD(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword) {
        return roleService.getAllRole(page,size,keyword);
    }

    @RequestMapping(value = "hod/active", method = RequestMethod.GET, produces = "application/json")
    public List<RoleResponseDTO> getAllRoleActive() {
        return roleService.getAllActiveRole();
    }

    @RequestMapping(value = "hod/add", method = RequestMethod.POST, produces = "application/json")
    public RoleResponseDTO createRole(@RequestBody RoleResponseDTO roleDTO) {
        return roleService.createRole(roleDTO);
    }

    @RequestMapping(value = "hod/update", method = RequestMethod.POST, produces = "application/json")
    public RoleResponseDTO updateRole(@RequestBody RoleResponseDTO roleDTO) {
        return roleService.updateRole(roleDTO);
    }

}
