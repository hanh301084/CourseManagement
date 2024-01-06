package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.Complexity;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProjectBacklogAddDTO {
    private Long teamId;
    private String featureName;
    private String functionName;
    private String screenName;
    private String actor;
    private Complexity complexity;
    private Integer loc;
}
