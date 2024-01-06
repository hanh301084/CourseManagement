package com.fpt.scms.model.dto;


import com.fpt.scms.model.Enum.Status;
import lombok.*;

import java.time.LocalDateTime;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class ProjectDTO {
    private Long projectId;
    private String topicCode;
    private String topicName;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private UserDTO createdBy;
    private UserDTO updatedBy;
    private Status status;
    private boolean isLock;
}
