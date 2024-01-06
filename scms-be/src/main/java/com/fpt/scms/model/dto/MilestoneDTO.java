package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.Class;
import com.fpt.scms.model.entity.Iteration;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MilestoneDTO {
    private Long milestoneId;
    private String milestoneName;
    private Long iterationId;
    private Long classId;
    private Date fromDate;
    private Date toDate;
    private String status;
    private String nameIteration;

}
