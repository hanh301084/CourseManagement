package com.fpt.scms.services.Impl;

import com.fpt.scms.model.dto.RoleResponseDTO;
import com.fpt.scms.model.entity.Role;
import com.fpt.scms.repository.RoleRepository;
import com.fpt.scms.services.RoleService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class RoleServiceImpl implements RoleService {
    @Autowired
    private RoleRepository roleRepository;

    private final ModelMapper modelMapper = new ModelMapper();

    @Override
    public List<RoleResponseDTO> getAllRole() {
        List<Role> roles = roleRepository.findAll();
        return roles.stream()
                .map(role -> modelMapper.map(role, RoleResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public Page<RoleResponseDTO> getAllRole(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size);
        Page<Role> rolesPage = roleRepository.searchByName(keyword, pageable);
        return rolesPage.map(role -> modelMapper.map(role, RoleResponseDTO.class));
    }


    @Override
    public RoleResponseDTO createRole(RoleResponseDTO roleDTO) {
        Role role = modelMapper.map(roleDTO, Role.class);
        Role savedRole = roleRepository.save(role);
        return modelMapper.map(savedRole, RoleResponseDTO.class);
    }

    @Override
    public RoleResponseDTO updateRole(RoleResponseDTO roleDTO) {
        Optional<Role> roleOptional = roleRepository.findById(roleDTO.getRoleId());
        if (roleOptional.isPresent()) {
            Role role = roleOptional.get();
            modelMapper.map(roleDTO, role);
            Role updatedRole = roleRepository.save(role);
            return modelMapper.map(updatedRole, RoleResponseDTO.class);
        }
        throw new IllegalArgumentException("Role not found with ID: " + roleDTO.getRoleId());
    }

    @Override
    public List<RoleResponseDTO> getAllActiveRole() {
        List<Role> roles = roleRepository.getActiveRole();
        return roles.stream()
                .map(role -> modelMapper.map(role, RoleResponseDTO.class))
                .collect(Collectors.toList());
    }
}
