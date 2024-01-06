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
public class CommentRequestDTO {
    private Long id;
    private String comment;
    private Long projectBacklog;
    private Long iteration;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
