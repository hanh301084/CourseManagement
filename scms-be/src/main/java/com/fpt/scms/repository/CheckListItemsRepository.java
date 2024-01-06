package com.fpt.scms.repository;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.dto.CheckListItemsDTO;
import com.fpt.scms.model.entity.CheckList;
import com.fpt.scms.model.entity.CheckListItems;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CheckListItemsRepository extends JpaRepository<CheckListItems,Long> {
    List<CheckListItems> getCheckListItemsByCheckList_IdAndStatus(Long id, Status status);
    Optional<CheckListItems> getCheckListItemsByCheckListAndName(CheckList checkList, String name);
}
