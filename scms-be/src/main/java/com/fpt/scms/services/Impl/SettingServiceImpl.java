package com.fpt.scms.services.Impl;

import com.fpt.scms.model.dto.SemesterResponseDTO;
import com.fpt.scms.model.dto.SettingDTO;
import com.fpt.scms.model.entity.Semester;
import com.fpt.scms.model.entity.Setting;
import com.fpt.scms.repository.SettingRepository;
import com.fpt.scms.services.SettingService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SettingServiceImpl implements SettingService{
    @Autowired
    private SettingRepository settingRepository;
    private final ModelMapper modelMapper = new ModelMapper();
    @Override
    public void createClassSetting(SettingDTO settingDTO, Long semesterId) {
            Setting setting = modelMapper.map(settingDTO, Setting.class);
            Setting saveSetting = settingRepository.save(setting);
        modelMapper.map(saveSetting, SettingDTO.class);
    }

    @Override
    public SettingDTO findSettingForClassBlock5(Long semesterId) {

        Setting setting = settingRepository.findSettingByTypeIdAndSettingTitle(semesterId, com.fpt.scms.model.Enum.Setting.ITERATION_BLOCK5);
        if (setting != null) {
            return modelMapper.map(setting, SettingDTO.class);
        }
        return null;
    }

    @Override
    public SettingDTO findSettingForClassBlock10(Long semesterId ) {
        Setting setting = settingRepository.findSettingByTypeIdAndSettingTitle(semesterId, com.fpt.scms.model.Enum.Setting.ITERATION_BLOCK10);

        if (setting == null) {
            throw new EntityNotFoundException("Setting not found for semesterId: " + semesterId + " and type: " + com.fpt.scms.model.Enum.Setting.ITERATION_BLOCK10);
        }
        return modelMapper.map(setting, SettingDTO.class);
    }
    @Override
    public void updateClassSetting(SettingDTO block5SettingDTO, SettingDTO block10SettingDTO, Long semesterId) {
        // Update Block 5 Setting
        updateSetting(block5SettingDTO, semesterId, com.fpt.scms.model.Enum.Setting.ITERATION_BLOCK5);

        // Update Block 10 Setting
        updateSetting(block10SettingDTO, semesterId, com.fpt.scms.model.Enum.Setting.ITERATION_BLOCK10);
    }

    public void updateSetting(SettingDTO settingDTO, Long typeId, com.fpt.scms.model.Enum.Setting settingTitle) {
        Setting setting = settingRepository.findSettingByTypeIdAndSettingTitle(typeId, settingTitle);
        if (setting != null) {
            setting.setSettingValue(settingDTO.getSettingValue());
        } else {
            setting = modelMapper.map(settingDTO, Setting.class);
            setting.setTypeId(typeId);
            setting.setSettingTitle(settingTitle);
        }
        settingRepository.save(setting);
    }

    @Override
    public List<SettingDTO> findIterationSettingsBySemesterId(Long semesterId) {
        List<Setting> settings = settingRepository.findByTypeId(semesterId);
        // Convert the Setting entities to SettingDTOs
        return settings.stream()
                .map(setting -> modelMapper.map(setting, SettingDTO.class))
                .collect(Collectors.toList());
    }
    @Override
    public int getNumberIteration(Long semesterId, com.fpt.scms.model.Enum.Setting classType) {
        return settingRepository.findBySettingType(semesterId, classType);
    }
}
