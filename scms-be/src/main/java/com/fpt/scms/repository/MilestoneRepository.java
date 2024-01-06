package com.fpt.scms.repository;

import com.fpt.scms.model.entity.Milestone;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Date;
import java.util.List;

public interface MilestoneRepository extends JpaRepository<Milestone, Long> {

    @Query(nativeQuery = true,value = "select * from milestone where class_id=:classId and (from_date<=CURDATE()and to_date>=CURDATE())")
    Milestone getMilestoneByClassId(@Param("classId") long classId);

    @Query(value = "select m from Milestone m where m.classId.classId=:classId order by m.fromDate asc ")
    List<Milestone> getAllMilestonesByClassId(@Param("classId") long classId);

    @Query(nativeQuery = true,value = "select * from milestone where class_id=:classId order by from_date asc limit 1")
    Milestone getMilestoneNearest(@Param("classId") long classId);
}
