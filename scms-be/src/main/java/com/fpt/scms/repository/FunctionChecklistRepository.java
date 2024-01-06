package com.fpt.scms.repository;

import com.fpt.scms.model.entity.CheckListItems;
import com.fpt.scms.model.entity.FunctionChecklist;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface FunctionChecklistRepository extends JpaRepository<FunctionChecklist, Long> {
    List<FunctionChecklist> findAllByProjectBacklog_ProjectBacklogId(Long projectBacklogId);
    Optional<FunctionChecklist> findByCheckListItems_IdAndIteration_IterationIdAndProjectBacklog_ProjectBacklogId(Long checkListItemId, Long iterationId, Long projectBacklogId);
    List<FunctionChecklist> findByProjectBacklog_ProjectBacklogIdAndIteration_IterationId(Long projectBacklogId, Long iterationId);
}