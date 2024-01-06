package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.IsBlock5;
import com.fpt.scms.model.entity.User;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClassResponseDTO {
    private Long classId;
    private String classCode;
    private UserDTO trainer;
    private UserDTO reviewer1;
    private UserDTO reviewer2;
    private UserDTO reviewer3;
    private UserDTO reviewer4;
    private UserDTO reviewerResit1;
    private UserDTO reviewerResit2;
    private UserDTO reviewerResit3;
    private UserDTO reviewerResit4;
    private SemesterResponseDTO semester;
    private IsBlock5 isBlock5;
    private String status;
    private String is_use;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private User createdBy;
    private User updatedBy;
}
