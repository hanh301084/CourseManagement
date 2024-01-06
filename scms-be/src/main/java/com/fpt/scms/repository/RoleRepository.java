package com.fpt.scms.repository;

import com.fpt.scms.model.entity.Role;
import com.fpt.scms.model.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;
import java.util.Set;

public interface RoleRepository extends JpaRepository<Role, Integer> {
    @Query("SELECT r FROM Role r WHERE r.status LIKE 'ACTIVE'")
    List<Role> getActiveRole();
    Set<Role> findByRoleNameIn(List<String> roleNames);
    Optional<Role> findRoleByRoleName(String roleName);
    @Query("SELECT r FROM Role r WHERE r.roleName LIKE %?1% ")
    Page<Role> searchByName(String keyword, Pageable pageable);
}
