package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor

public class TechnologyDTO {
    private Long id;
    private String name;
    private Status status;
}
