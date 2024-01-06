package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.FunctionChecklistStatus;
import com.fpt.scms.model.entity.CheckListItems;
import com.fpt.scms.model.entity.Iteration;
import com.fpt.scms.model.entity.ProjectBacklog;
import com.fpt.scms.model.entity.User;
import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FunctionChecklistDTO {
    private Long id;
    private Long projectBacklogId;
    private Long checkListItemId;
    private User teacher;
    private FunctionChecklistStatus status;
    private Long iterationId;
}
