package com.fpt.scms.repository;

import com.fpt.scms.model.dto.EstimateLocDTO;
import com.fpt.scms.model.entity.EstimateLoc;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface EstimateLocRepository extends JpaRepository<EstimateLoc,Long> {
    EstimateLoc findEstimateLocByTechnology_IdAndFunctionType_Id(Long typeId, Long techId);

}
