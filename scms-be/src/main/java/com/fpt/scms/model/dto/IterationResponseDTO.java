package com.fpt.scms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class IterationResponseDTO {

    private Long iterationId;
    private String iterationName;
    private int duration;
    private int durationBlock5;
    private String status;

}
