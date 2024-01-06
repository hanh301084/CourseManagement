package com.fpt.scms.repository;

import com.fpt.scms.model.entity.FunctionEstimateLoc;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FunctionEstimateLocRepository extends JpaRepository<FunctionEstimateLoc,Long> {
    FunctionEstimateLoc findByProjectBacklog_ProjectBacklogId(Long id);

}
