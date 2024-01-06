package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.Complexity;
import com.fpt.scms.model.Enum.PackageStatus;
import com.fpt.scms.model.Enum.Priority;
import com.fpt.scms.model.entity.*;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectBacklogDTO {
    private Long projectBacklogId;
    private User assignee;
    private Team team;
    private Project project;
    private Feature feature;
    private String functionName;
    private String screenName;
    private String actor;
    private Complexity complexity;
    private Integer loc;
    private Priority priority;
    private Integer actualLoc;
    private Iteration plannedCodeIteration;
    private Iteration actualCodeIteration;
    private Iteration completedIteration;
    private Float completePercentLoc;
    private Integer locIter1;
    private Integer locIter2;
    private Integer locIter3;
    private Integer locIter4;
    private Integer locIter5;
    private Integer locIter6;
    private PackageStatus srsStatus;
    private PackageStatus sdsStatus;
    private PackageStatus codingStatus;
    private PackageStatus testingStatus;
    private User createdBy;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int rowNumber;
    private boolean teacherSetLoc;
}
