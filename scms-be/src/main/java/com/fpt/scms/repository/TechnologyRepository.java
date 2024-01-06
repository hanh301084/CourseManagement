package com.fpt.scms.repository;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.entity.Technology;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TechnologyRepository extends JpaRepository<Technology,Long> {
    Optional<Technology> findByNameAndStatus(String name, Status status);
    List<Technology> findAllByStatus(Status status);
    boolean existsByNameAndStatus(String name, Status status);
}
