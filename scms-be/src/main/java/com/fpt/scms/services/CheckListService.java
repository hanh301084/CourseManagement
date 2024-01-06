package com.fpt.scms.services;

import com.fpt.scms.model.dto.CheckListResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface CheckListService {
    List<CheckListResponseDTO> getAllCheckLists();
    CheckListResponseDTO createCheckList(CheckListResponseDTO checkListResponseDTO );
    CheckListResponseDTO updateCheckList(CheckListResponseDTO checkListResponseDTO);
    CheckListResponseDTO updateCheckListStatus(Long id, String status);
    List<String> importFromExcel(MultipartFile file) throws Exception;
}
