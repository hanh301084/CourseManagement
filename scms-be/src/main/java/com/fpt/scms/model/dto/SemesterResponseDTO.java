package com.fpt.scms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import javax.persistence.Column;
import java.time.LocalDateTime;
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SemesterResponseDTO {
    private Long semesterId;
    private String semesterName;
    private LocalDateTime startDate;
    private LocalDateTime endDate;
    private String status;
    private Double minOG;
    private Double minOGTotal;
    private Double minFinal;
}
