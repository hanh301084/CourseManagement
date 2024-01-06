package com.fpt.scms.services;

import com.fpt.scms.model.dto.IterationResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface IterationService {

    Page<IterationResponseDTO> getAllIterations(int page, int size, String keyword);

    IterationResponseDTO createIteration(IterationResponseDTO iterationDTO);

    IterationResponseDTO updateIteration(IterationResponseDTO iterationDTO);

    List<IterationResponseDTO> getFirstNActiveIterations(int count);

    List<IterationResponseDTO> getAllIterationActive(Long semesterId, com.fpt.scms.model.Enum.Setting classType);
    List<IterationResponseDTO> getAllIterationActiveOG(Long semesterId, com.fpt.scms.model.Enum.Setting classType);

    List<IterationResponseDTO> getAllIterationBySemesterAndClass(Long semesterId,Long classId);
}
