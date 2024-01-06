package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.CheckList;
import com.fpt.scms.model.entity.Class;
import com.fpt.scms.model.entity.Project;
import com.fpt.scms.model.entity.Technology;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class TeamDTO {
    private Long teamId;
    private String teamName;
    private Class classEntity;
    private Project project;
    private CheckList checkList;
    private String gitlabUrl;
    private String documentUrl1;
    private String documentUrl2;
    private String documentUrl3;
    private String documentUrl4;
    private String documentUrl5;
    private String status;
    private String isLocked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Technology technology;
}
