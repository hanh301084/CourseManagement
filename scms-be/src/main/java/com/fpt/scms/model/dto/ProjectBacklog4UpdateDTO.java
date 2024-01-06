package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.Complexity;
import lombok.*;

@Getter
@Setter
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class ProjectBacklog4UpdateDTO {
    private Long projectId;
    private String featureId;
    private String functionName;
    private String screenName;
    private String actor;
    private Complexity complexity;
    private Integer loc;
}
