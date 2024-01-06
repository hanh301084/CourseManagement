package com.fpt.scms.controller;

import com.fpt.scms.model.dto.IterationResponseDTO;
import com.fpt.scms.services.IterationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/iteration")
public class IterationController {

    @Autowired
    IterationService iterationService;

    @RequestMapping(value = "hod/all", method = RequestMethod.GET, produces = "application/json")
    public Page<IterationResponseDTO> getAllIterationHOD(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "") String keyword) {
        return iterationService.getAllIterations(page, size, keyword);
    }

    @RequestMapping(value = "hod/add", method = RequestMethod.POST, produces = "application/json")
    public IterationResponseDTO createIteration(@RequestBody IterationResponseDTO iterationDTO) {
        return iterationService.createIteration(iterationDTO);
    }

    @RequestMapping(value = "hod/update", method = RequestMethod.POST, produces = "application/json")
    public IterationResponseDTO updateIteration(@RequestBody IterationResponseDTO iterationDTO) {
        return iterationService.updateIteration(iterationDTO);
    }

    @RequestMapping(value = "active/first/{count}", method = RequestMethod.GET, produces = "application/json")
    public ResponseEntity<List<IterationResponseDTO>> getFirstNActiveIterations(@PathVariable int count) {
        List<IterationResponseDTO> iterations = iterationService.getFirstNActiveIterations(count);
        return ResponseEntity.ok(iterations);
    }

    @RequestMapping(value = "active", method = RequestMethod.GET, produces = "application/json")
    public List<IterationResponseDTO> getAllActiveIterations(@RequestParam Long semesterId, @RequestParam com.fpt.scms.model.Enum.Setting classType) {
        return iterationService.getAllIterationActive( semesterId,classType);
    }
    @RequestMapping(value = "activeOG", method = RequestMethod.GET, produces = "application/json")
    public List<IterationResponseDTO> getAllActiveIterationsOG(@RequestParam Long semesterId, @RequestParam com.fpt.scms.model.Enum.Setting classType) {
        return iterationService.getAllIterationActiveOG( semesterId,classType);
    }

    @RequestMapping(value = "getAllIterationBySettingClass/{semesterId}/{classId}", method = RequestMethod.GET, produces = "application/json")
    public List<IterationResponseDTO> getAllIterationBySemesterAndClass(@PathVariable Long semesterId,@PathVariable Long classId) {
        return iterationService.getAllIterationBySemesterAndClass( semesterId,classId);
    }
}
