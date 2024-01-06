package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.Team;
import com.fpt.scms.model.entity.User;
import lombok.*;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
public class TotalLocProjectBacklogDTO {
    private User assignee;
    private Team team;
    private Long sumLocIter1;
    private Long sumLocIter2;
    private Long sumLocIter3;
    private Long sumLocIter4;
    private Long sumLocIter5;
    private Long sumLocIter6;

}
