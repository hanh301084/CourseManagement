package com.fpt.scms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CombinedBacklogDTO {
    private ProjectBacklog4UpdateDTO projectBacklog4UpdateDTO;
    private List<ProjectBacklog4UpdateDTO> projectBacklogDTOs;
}
