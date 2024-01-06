package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.entity.CheckList;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class CheckListItemsDTO {
    private Long id;
    private String name;
    private String description;
    private CheckList checkList;
    private Status status;
}
