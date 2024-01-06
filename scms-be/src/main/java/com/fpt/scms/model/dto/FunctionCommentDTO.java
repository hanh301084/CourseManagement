package com.fpt.scms.model.dto;

import com.fpt.scms.model.entity.Iteration;
import com.fpt.scms.model.entity.ProjectBacklog;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class FunctionCommentDTO {
    private Long id;
    private String comment;
    private ProjectBacklog projectBacklog;
    private Iteration iteration;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
