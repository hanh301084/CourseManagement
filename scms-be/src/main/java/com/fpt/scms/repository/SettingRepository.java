package com.fpt.scms.repository;

import com.fpt.scms.model.dto.SettingDTO;
import com.fpt.scms.model.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface SettingRepository extends JpaRepository<Setting, Integer> {
    Setting findSettingByTypeIdAndSettingTitle(Long typeId, com.fpt.scms.model.Enum.Setting settingTitle);
    List<Setting> findByTypeId(Long typeId);
    @Query("SELECT s.settingValue FROM Setting  s WHERE s.typeId = :semesterId AND s.settingTitle = :classType")
    int findBySettingType(Long semesterId, com.fpt.scms.model.Enum.Setting classType);

    @Query("SELECT s.settingValue FROM Setting s WHERE s.typeId = (SELECT MAX(s.typeId) FROM Setting s) AND s.settingTitle = :classType")
    String findSettingValueBySettingType(com.fpt.scms.model.Enum.Setting classType);

}
