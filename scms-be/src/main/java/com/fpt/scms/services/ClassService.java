package com.fpt.scms.services;

import com.fpt.scms.model.dto.ClassResponseDTO;
import com.fpt.scms.model.dto.ClassDTO;

import java.util.List;

public interface ClassService {
    List<ClassResponseDTO> getAllClasses();
    ClassResponseDTO createClass(ClassDTO classEntity, Long userId);
    ClassResponseDTO updateClass(ClassDTO classEntity, Long userId);
    List<ClassResponseDTO> getAllClassesByTrainer(Long trainerId, Long semesterId);
    List<ClassResponseDTO> getAllClassesBySemester(Long semesterId, String status);
    List<ClassResponseDTO> getAllClassesBySemesterForReviewer(Long semesterId, String status);
    List<ClassResponseDTO> getAllClassesByReviewer(Long reviewerId, Long semesterId);
    ClassResponseDTO getDetailClass(Long id);
}
