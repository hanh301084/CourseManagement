package com.fpt.scms.controller;

import com.fpt.scms.model.dto.CheckListItemsDTO;

import com.fpt.scms.model.dto.CheckListResponseDTO;
import com.fpt.scms.services.CheckListItemsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@CrossOrigin(origins = "http://localhost:3000")
@PreAuthorize("hasRole('ROLE_TEACHER')")
@RequestMapping("/api/checklistitems")
public class CheckListItemsController {

    @Autowired
    private CheckListItemsService checkListItemsService;

    @GetMapping("teacher/all")
    public List<CheckListItemsDTO> getAllCheckList(){
        return checkListItemsService.getAllCheckListItems();
    }
    @GetMapping("teacher/getById")
    public List<CheckListItemsDTO> getCheckListById(@RequestParam(required = false)  Long id){
        return checkListItemsService.getCheckListItemsByCheckListId(id);
    }
    @PostMapping("teacher/create")
    public CheckListItemsDTO createCheckList(@RequestBody CheckListItemsDTO responseDTO){
        return checkListItemsService.createCheckListItems(responseDTO);
    }
    @PutMapping("teacher/update")
    public CheckListItemsDTO updateCheckList(@RequestBody CheckListItemsDTO responseDTO){
        return checkListItemsService.updateCheckListItems(responseDTO);
    }

    @PutMapping("teacher/updateStatus/{id}")
    public CheckListItemsDTO updateCheckListStatus(@PathVariable Long id, @RequestParam("status") String status) {
        return checkListItemsService.updateChecklistItemStatus(id, status);
    }

}
