package com.fpt.scms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.Date;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class UserUpdateDTO {
    private String fullName;
    private String gender;
    private Date dateOfBirth;
    private String phoneNumber;
    private String facebookLink;
    private String gitlabToken;
}
