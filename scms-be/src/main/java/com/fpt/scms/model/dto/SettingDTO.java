package com.fpt.scms.model.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class SettingDTO {
    private Long settingId;
    private Long typeId;
    private com.fpt.scms.model.Enum.Setting settingTitle;
    private String settingValue;
    private String status;
}
