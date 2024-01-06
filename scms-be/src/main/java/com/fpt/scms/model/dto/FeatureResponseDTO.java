package com.fpt.scms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Data;


@Data
@AllArgsConstructor
public class FeatureResponseDTO {
    private Long no;
    private Long featureId;
    private String featureName;
    private String description;
}
