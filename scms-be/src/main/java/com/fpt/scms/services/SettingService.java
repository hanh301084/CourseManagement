package com.fpt.scms.services;

import com.fpt.scms.model.dto.SettingDTO;
import com.fpt.scms.model.entity.Setting;

import java.util.List;

public interface SettingService {
    void createClassSetting (SettingDTO settingDTO, Long semesterId);
    public SettingDTO findSettingForClassBlock5(Long semesterId) ;
    SettingDTO findSettingForClassBlock10(Long semesterId) ;
    void updateClassSetting(SettingDTO block5SettingDTO, SettingDTO block10SettingDTO, Long semesterId);
    void updateSetting(SettingDTO settingDTO, Long typeId, com.fpt.scms.model.Enum.Setting settingTitle);
    List<SettingDTO> findIterationSettingsBySemesterId(Long semesterId);
    int getNumberIteration(Long semesterId, com.fpt.scms.model.Enum.Setting classType);

}
