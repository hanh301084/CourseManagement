package com.fpt.scms.services.Impl;

import com.fpt.scms.model.dto.ClassResponseDTO;
import com.fpt.scms.model.dto.CommentRequestDTO;
import com.fpt.scms.model.dto.FunctionCommentDTO;
import com.fpt.scms.model.entity.FunctionComment;
import com.fpt.scms.model.entity.Project;
import com.fpt.scms.repository.FunctionCommentRepository;
import com.fpt.scms.repository.IterationRepository;
import com.fpt.scms.repository.ProjectBacklogRepository;
import com.fpt.scms.services.FunctionCommentService;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class FunctionCommentServiceImpl implements FunctionCommentService {
    private final ModelMapper modelMapper = new ModelMapper();
    @Autowired
    FunctionCommentRepository functionCommentRepository;
    @Autowired
    ProjectBacklogRepository backlogRepository;
    @Autowired
    IterationRepository iterationRepository;
    @Override
    public FunctionCommentDTO findByBacklogAndIteration(Long backlogId, Long iterationId) {
        FunctionComment functionComment = functionCommentRepository.findByProjectBacklog_ProjectBacklogIdAndIteration_IterationId(backlogId, iterationId);
        if (functionComment != null) {
            return modelMapper.map(functionComment, FunctionCommentDTO.class);
        } else {
            return null;
        }
    }

    @Override
    public List<FunctionCommentDTO> findByBacklogAndIteration(Long backlogId) {
        List<FunctionComment> functionComment = functionCommentRepository.findByProjectBacklog_ProjectBacklogId(backlogId);
        if (functionComment != null) {
            return functionComment.stream()
                    .map(classEntity -> modelMapper.map(classEntity, FunctionCommentDTO.class))
                    .collect(Collectors.toList());
        } else {
            return null;
        }
    }

    @Override
    public CommentRequestDTO addOrEditComment(CommentRequestDTO commentRequestDTO) {
        FunctionComment functionComment;
        boolean exists = functionCommentRepository.existsByProjectBacklog_ProjectBacklogIdAndIteration_IterationId(
                commentRequestDTO.getProjectBacklog(),
                commentRequestDTO.getIteration()
        );

        if (exists) {
            functionComment = functionCommentRepository.findByProjectBacklog_ProjectBacklogIdAndIteration_IterationId(
                    commentRequestDTO.getProjectBacklog(),
                    commentRequestDTO.getIteration()
            );
        } else {
            functionComment = new FunctionComment();
            functionComment.setProjectBacklog(backlogRepository.findById(commentRequestDTO.getProjectBacklog()).orElse(null));
            functionComment.setIteration(iterationRepository.findById(commentRequestDTO.getIteration()).orElse(null));
        }

        functionComment.setComment(commentRequestDTO.getComment());
        functionComment = functionCommentRepository.save(functionComment);

        // Manually creating and returning FunctionCommentDTO

        return getCommentRequestDTO(functionComment);
    }

    private static CommentRequestDTO getCommentRequestDTO(FunctionComment functionComment) {
        CommentRequestDTO functionCommentDTO = new CommentRequestDTO();
        functionCommentDTO.setId(functionComment.getId());
        functionCommentDTO.setComment(functionComment.getComment());
        functionCommentDTO.setProjectBacklog(functionComment.getProjectBacklog().getProjectBacklogId());
        functionCommentDTO.setIteration(functionComment.getIteration().getIterationId());
        functionCommentDTO.setCreatedAt(functionComment.getCreatedAt());
        functionCommentDTO.setUpdatedAt(functionComment.getUpdatedAt());
        return functionCommentDTO;
    }
}
