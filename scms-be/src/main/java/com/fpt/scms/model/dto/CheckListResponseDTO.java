package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CheckListResponseDTO {
    private Long id;
    private String name;
    private Status status;
    private String is_use;
    private User createdBy;
}
