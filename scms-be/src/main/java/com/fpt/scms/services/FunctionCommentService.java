package com.fpt.scms.services;

import com.fpt.scms.model.dto.CommentRequestDTO;
import com.fpt.scms.model.dto.FunctionCommentDTO;

import java.util.List;

public interface FunctionCommentService {
    FunctionCommentDTO findByBacklogAndIteration(Long backlogId, Long iterationId);
    List<FunctionCommentDTO> findByBacklogAndIteration(Long backlogId);
    CommentRequestDTO addOrEditComment(CommentRequestDTO commentRequestDTO);
}
