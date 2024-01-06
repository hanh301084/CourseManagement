package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.Status;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserDTO {
    private Long userId;         // ID
    private String fullName;     // Full Name
    private String email;        // Email
    private String image;        // Image (assuming it's a URL or path to the image)
    private Status status;       // Status
    private String rollNumber;
    private List<String> role;
}
