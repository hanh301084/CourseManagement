package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.Complexity;
import com.fpt.scms.model.entity.Feature;
import com.fpt.scms.model.entity.Project;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode
public class ProjectWBS_DTO {
    private Long feature;
    private String functionName;
    private String screenName;
    private String actor;
    private Complexity complexity;
    private Integer loc;
}
