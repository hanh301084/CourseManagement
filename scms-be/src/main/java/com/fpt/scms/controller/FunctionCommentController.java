package com.fpt.scms.controller;

import com.fpt.scms.model.dto.CommentRequestDTO;
import com.fpt.scms.model.dto.FunctionCommentDTO;
import com.fpt.scms.services.FunctionCommentService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/function-comment")
public class FunctionCommentController {
    private static final Logger log = LoggerFactory.getLogger(FunctionCommentController.class);
    @Autowired
    FunctionCommentService service;
    @GetMapping("/find")
    public ResponseEntity<FunctionCommentDTO> findByBacklogAndIteration(@RequestParam Long backlogId, @RequestParam Long iterationId) {
        FunctionCommentDTO functionCommentDTO = service.findByBacklogAndIteration(backlogId, iterationId);
            return ResponseEntity.ok(functionCommentDTO);
    }
    @GetMapping("/findByBacklog")
    public List<FunctionCommentDTO> findByBacklog(@RequestParam Long backlogId) {

       return service.findByBacklogAndIteration(backlogId);
    }
    @PostMapping("/add-edit")
    public ResponseEntity<CommentRequestDTO> addOrEditComment(@RequestBody CommentRequestDTO functionCommentDTO) {
        log.error(functionCommentDTO+"");
        CommentRequestDTO savedComment = service.addOrEditComment(functionCommentDTO);

        return ResponseEntity.ok(savedComment);
    }
}
