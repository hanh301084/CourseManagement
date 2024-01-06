package com.fpt.scms.model.dto;

import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ChecklistEvaluationDTO {
    private Long projectBacklogId;
    private List<FunctionChecklistDTO> functionChecklistDTOS;
}
