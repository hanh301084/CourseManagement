package com.fpt.scms.services;

import com.fpt.scms.model.dto.CheckListItemsDTO;
import com.fpt.scms.model.dto.CheckListResponseDTO;

import java.util.List;

public interface CheckListItemsService {
    List<CheckListItemsDTO> getAllCheckListItems();
    List<CheckListItemsDTO> getCheckListItemsByCheckListId(Long id);
    CheckListItemsDTO createCheckListItems(CheckListItemsDTO checkListItemsDTO);
    CheckListItemsDTO updateCheckListItems(CheckListItemsDTO checkListItemsDTO);
    CheckListItemsDTO updateChecklistItemStatus(Long id, String status);

}
