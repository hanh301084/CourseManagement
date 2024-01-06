package com.fpt.scms.model.dto;

import lombok.Getter;
import lombok.Setter;
import lombok.ToString;


import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.util.List;

@Getter
@Setter
@ToString
public class ClassDTO {
    private Long classId;
    @NotBlank
    private String classCode;
    private String isBlock5;
    @NotNull
    private Long trainerId;
    private Long semesterId;
    private List<Long> reviewers;
    private List<Long> reviewerResits;
    private String status;
    private String is_use;
}
