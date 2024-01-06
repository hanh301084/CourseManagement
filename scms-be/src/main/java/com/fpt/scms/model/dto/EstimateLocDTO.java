package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.FunctionType;
import com.fpt.scms.model.entity.Technology;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class EstimateLocDTO {
    private Long id;
    private Technology technology;
    private FunctionType functionType;
    private int numberOfLocPerInput;
    private String status;
}
