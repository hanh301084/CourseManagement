package com.fpt.scms.services;

import com.fpt.scms.model.dto.RoleResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface RoleService {
    Page<RoleResponseDTO> getAllRole(int page, int size, String keyword);
    List<RoleResponseDTO> getAllRole();
    RoleResponseDTO createRole(RoleResponseDTO roleDTO);
    RoleResponseDTO updateRole(RoleResponseDTO roleDTO);
    List<RoleResponseDTO> getAllActiveRole();
}
