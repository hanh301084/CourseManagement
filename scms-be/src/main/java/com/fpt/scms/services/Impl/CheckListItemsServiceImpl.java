package com.fpt.scms.services.Impl;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.CheckListItemsDTO;
import com.fpt.scms.model.dto.CheckListResponseDTO;
import com.fpt.scms.model.entity.CheckList;
import com.fpt.scms.model.entity.CheckListItems;
import com.fpt.scms.repository.CheckListItemsRepository;
import com.fpt.scms.services.CheckListItemsService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
@Service
public class CheckListItemsServiceImpl implements CheckListItemsService {
    @Autowired
    private CheckListItemsRepository checkListItemsRepository;
    ModelMapper modelMapper = new ModelMapper();
    @Override
    public List<CheckListItemsDTO> getAllCheckListItems() {
        List<CheckListItems> checkListItems = checkListItemsRepository.findAll();
        return checkListItems.stream().map(checkListItems1 -> modelMapper.map(checkListItems1, CheckListItemsDTO.class)).collect(Collectors.toList());
    }

    @Override
    public List<CheckListItemsDTO> getCheckListItemsByCheckListId(Long id) {
        List<CheckListItems> checkListItems = checkListItemsRepository.getCheckListItemsByCheckList_IdAndStatus(id, Status.ACTIVE);
        return checkListItems.stream().map(checkListItems1 -> modelMapper.map(checkListItems1, CheckListItemsDTO.class)).collect(Collectors.toList());
    }


    @Override
    public CheckListItemsDTO createCheckListItems(CheckListItemsDTO checkListItemsDTO) {

        if (checkListItemsRepository.getCheckListItemsByCheckListAndName(checkListItemsDTO.getCheckList(),checkListItemsDTO.getName()).isPresent()){
            throw new RuntimeException("This checklist item already exist!");
        }
            CheckListItems checkListItems = modelMapper.map(checkListItemsDTO, CheckListItems.class);
            checkListItems.setStatus(Status.ACTIVE);
            CheckListItems saveCheckListItems = checkListItemsRepository.save(checkListItems);
        return modelMapper.map(saveCheckListItems,CheckListItemsDTO.class);
    }

    @Override
    public CheckListItemsDTO updateCheckListItems(CheckListItemsDTO checkListItemsDTO) {
        Optional<CheckListItems> optionalCheckList = checkListItemsRepository.findById(checkListItemsDTO.getId());
        if(optionalCheckList.isPresent()){
            CheckListItems checkListItems = optionalCheckList.get();
            modelMapper.map(checkListItemsDTO,checkListItems);
            CheckListItems updateCheckListItems = checkListItemsRepository.save(checkListItems);
            return modelMapper.map(updateCheckListItems, CheckListItemsDTO.class);
        }

        throw new IllegalArgumentException("Role not found with ID: " + checkListItemsDTO.getId());
    }

    @Override
    public CheckListItemsDTO updateChecklistItemStatus(Long id, String status) {
        CheckListItems checkListItems = checkListItemsRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("CheckList not found with ID: " + id));

        checkListItems.setStatus(Status.valueOf(status));
        CheckListItems updatedCheckList = checkListItemsRepository.save(checkListItems);

        return modelMapper.map(updatedCheckList, CheckListItemsDTO.class);
    }
}
