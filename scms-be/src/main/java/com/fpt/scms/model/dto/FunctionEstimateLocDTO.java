package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.EstimateLoc;
import com.fpt.scms.model.entity.ProjectBacklog;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class FunctionEstimateLocDTO {
    private Long id;
    private EstimateLoc estimateLoc;
    private ProjectBacklog projectBacklog;
    private int numberOfInput;
}
