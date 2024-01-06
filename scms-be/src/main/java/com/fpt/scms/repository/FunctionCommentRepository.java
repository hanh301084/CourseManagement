package com.fpt.scms.repository;

import com.fpt.scms.model.dto.FunctionCommentDTO;
import com.fpt.scms.model.entity.FunctionComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FunctionCommentRepository extends JpaRepository<FunctionComment, Long> {
    FunctionComment findByProjectBacklog_ProjectBacklogIdAndIteration_IterationId(Long backlogId, Long iterationId);
    List<FunctionComment> findByProjectBacklog_ProjectBacklogId(Long backlogId);
    boolean existsByProjectBacklog_ProjectBacklogIdAndIteration_IterationId(Long backlogId, Long iterationId);
}
