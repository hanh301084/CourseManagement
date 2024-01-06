package com.fpt.scms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ClassSettingDTO {
    private SettingDTO block5Setting;
    private SettingDTO block10Setting;
    private Long semesterId;
}
