package com.fpt.scms.services.Impl;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.CheckListItemsDTO;
import com.fpt.scms.model.dto.CheckListResponseDTO;
import com.fpt.scms.model.dto.ProjectDTO;
import com.fpt.scms.model.entity.CheckList;
import com.fpt.scms.model.entity.Project;
import com.fpt.scms.model.entity.User;
import com.fpt.scms.repository.CheckListRepository;
import com.fpt.scms.repository.UserRepository;
import com.fpt.scms.security.UserPrincipal;
import com.fpt.scms.services.CheckListItemsService;
import com.fpt.scms.services.CheckListService;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CheckListServiceImpl implements CheckListService {
    @Autowired
    private CheckListRepository checkListRepository;
    @Autowired
    private UserRepository userRepository;
    private final ModelMapper modelMapper = new ModelMapper();
    @Autowired
    private CheckListItemsService checkListItemsService;
    @Override
    public List<CheckListResponseDTO> getAllCheckLists() {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));

        List<CheckList> checkLists = checkListRepository.findAllByCreatedBy(currentUser);

        return checkLists.stream()
                .map(checkList -> modelMapper.map(checkList, CheckListResponseDTO.class))
                .collect(Collectors.toList());
    }

    @Override
    public CheckListResponseDTO createCheckList(CheckListResponseDTO checkListResponseDTO) {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        String name = checkListResponseDTO.getName();
        if (checkListRepository.findCheckListByNameAndCreatedBy(name, currentUser).isPresent()){
            throw new RuntimeException("This checklist already exist!");
        }
        CheckList checkList = modelMapper.map(checkListResponseDTO,CheckList.class);
        checkList.setCreatedBy(currentUser);
        checkList.setStatus(Status.ACTIVE);
        CheckList saveCheckList = checkListRepository.save(checkList);

        return modelMapper.map(saveCheckList, CheckListResponseDTO.class);
    }

    @Override
    public CheckListResponseDTO updateCheckList(CheckListResponseDTO checkListResponseDTO) {
        Optional<CheckList> optionalCheckList = checkListRepository.findById(checkListResponseDTO.getId());
        if(optionalCheckList.isPresent()){
            CheckList checkList = optionalCheckList.get();
            UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
            User currentUser = userRepository.findById(currentUserPrincipal.getId())
                    .orElseThrow(() -> new RuntimeException("Current User not found"));
            String name = checkListResponseDTO.getName();
            if (checkListRepository.findCheckListByNameAndCreatedBy(name, currentUser).isPresent()){
                throw new RuntimeException("Checklist already exist!");
            }
            modelMapper.map(checkListResponseDTO,checkList);
            CheckList updateCheckList = checkListRepository.save(checkList);
            return modelMapper.map(updateCheckList, CheckListResponseDTO.class);
        }

    throw new IllegalArgumentException("Role not found with ID: " + checkListResponseDTO.getId());

    }
    @Override
    public CheckListResponseDTO updateCheckListStatus(Long id, String status) {
        CheckList checkList = checkListRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("CheckList not found with ID: " + id));

        checkList.setStatus(Status.valueOf(status));
        CheckList updatedCheckList = checkListRepository.save(checkList);

        return modelMapper.map(updatedCheckList, CheckListResponseDTO.class);
    }

    @Override
    public List<String> importFromExcel(MultipartFile file) throws Exception {
        UserPrincipal currentUserPrincipal = (UserPrincipal) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        User currentUser = userRepository.findById(currentUserPrincipal.getId())
                .orElseThrow(() -> new RuntimeException("Current User not found"));
        ArrayList<String> feedback = new ArrayList<>();
        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            Row firstRow = sheet.getRow(0);
            Row secondRow = sheet.getRow(1);
            String formatFile = secondRow.getCell(0).getStringCellValue() + " " + secondRow.getCell(1).getStringCellValue();

            String checklistName = firstRow.getCell(1).getStringCellValue().trim();
            Optional<CheckList> existingCheckListOpt = checkListRepository.findCheckListByNameAndCreatedBy(checklistName, currentUser);

            CheckList checkList;
            if (existingCheckListOpt.isPresent()) {
                checkList = existingCheckListOpt.get();
                feedback.add("Import to checklist: " + checklistName);
            } else {
                if (!"No Name".equals(formatFile)) {
                    throw new RuntimeException("Your file uploaded has the wrong format");
                }
                checkList = new CheckList();
                checkList.setName(checklistName);
                checkList.setCreatedBy(currentUser);
                checkList.setStatus(Status.ACTIVE);
                checkListRepository.save(checkList);
                feedback.add("Created new checklist: " + checklistName);
            }

            int firstDataRowIndex = 2;
            for (int i = firstDataRowIndex; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) {
                    continue;
                }
                Cell cellChecklistItems = row.getCell(1);
                CheckListItemsDTO checkListItemsDTO = getChecklistDTO(cellChecklistItems, checkList);
                String checklistItemName = checkListItemsDTO.getName();
                try {
                    checkListItemsService.createCheckListItems(checkListItemsDTO);
                    feedback.add("Added checklist item: " + checklistItemName);
                } catch (RuntimeException e) {
                    feedback.add("Duplicate or already exist checklist item: " + checklistItemName);
                }
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to import checklist: " + e.getMessage());
        }
        return feedback;
    }

    private static CheckListItemsDTO getChecklistDTO(Cell cellChecklistItems, CheckList checkList ) {
        String checklistItem = cellChecklistItems.getStringCellValue();
        CheckListItemsDTO checkListItemsDTO = new CheckListItemsDTO();
        checkListItemsDTO.setName(checklistItem);
        checkListItemsDTO.setCheckList(checkList);
        return checkListItemsDTO;
    }
}
