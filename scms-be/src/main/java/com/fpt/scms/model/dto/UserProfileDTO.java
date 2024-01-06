package com.fpt.scms.model.dto;

import com.fpt.scms.model.Enum.Gender;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.List;
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class UserProfileDTO {
    private Long userId;              // ID
    private String fullName;     // Full Name
    private String email;        // Email
    private String image;        // Image (assuming it's a URL to the image)
    private List<String> role;
    private String rollNumber;
    private Gender gender;
    private Date dateOfBirth;
    private String phoneNumber;
    private String facebookLink;
    private String gitlabToken;

}
