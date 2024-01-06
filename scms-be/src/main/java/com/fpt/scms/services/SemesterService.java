package com.fpt.scms.services;

import com.fpt.scms.model.dto.SemesterResponseDTO;
import org.springframework.data.domain.Page;

import java.util.List;

public interface SemesterService {
    Page<SemesterResponseDTO> getAllSemester(int page, int size, String keyword, Integer year);
    SemesterResponseDTO createSemester(SemesterResponseDTO semesterDTO);
    SemesterResponseDTO updateSemester(SemesterResponseDTO semesterDTO);
    List<String> getAllSemesterYear();
    List<Integer> findAllDistinctYears();
    List<SemesterResponseDTO> getAllSemesterActive();
    SemesterResponseDTO findCurrentSemester();
}
