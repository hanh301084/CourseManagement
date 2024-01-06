package com.fpt.scms.services;

import com.fpt.scms.model.dto.MilestoneDTO;
import com.fpt.scms.model.entity.Milestone;

import java.sql.Date;
import java.util.List;

public interface MilestoneService {
    List<MilestoneDTO> getAllMilestone();
    MilestoneDTO createMilestone(Milestone milestone);
    MilestoneDTO updateMilestone(MilestoneDTO milestoneDTO);
    List<MilestoneDTO> getAllActiveMilestone(long classId);
    MilestoneDTO getMilestoneByClassId(long classId);
}
