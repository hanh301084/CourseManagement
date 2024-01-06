package com.fpt.scms.repository;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.FunctionTypeDTO;
import com.fpt.scms.model.entity.FunctionType;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FunctionTypeRepository extends JpaRepository<FunctionType,Long> {
    Optional<FunctionType> findByNameAndStatus(String name, Status status);
    List<FunctionType> findAllByStatus(Status status);
    boolean existsByNameAndStatus(String name, Status status);
}
