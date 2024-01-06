package com.fpt.scms.services;

import com.fpt.scms.model.dto.ClassUserDTO;
import com.fpt.scms.model.entity.ClassUser;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Map;

public interface ClassUserService {
    int getCountTotalUser( Long classId);
    //    List<ClassUserDTO> getAllClassUser(Long classId);
    List<ClassUserDTO> getAllClassUserForStudent(Long classId, Long studentId);
    List<ClassUserDTO> getAllClassUserFilter(Long semesterId, Long classId, Long teamId);
    List<ClassUserDTO> getAllClassUserFilterForReviewer(Long semesterId, Long classId, Long teamId);
    void importFromExcel(MultipartFile file, Long classId) throws Exception;
    List<ClassUserDTO> getClassForStudent(Long id);
    ClassUserDTO create(ClassUserDTO classUserDTO);
    ClassUser getClassUserById(Long classUserId);
    @Transactional
    void deleteSelectedClassUsers(List<Long> classUserIds);
    int updateFinalPresEvalByTeamId(float finalPresEval,Long teamId);
    int updateFinalPresentationResitByTeamId(float finalPresentationResit, Long teamId);
    byte[] exportClassUserGradesToExcel(Long classId);
    void calculateAndUpdateFinalGrades(Long classId);
    List<Map<String, Object>> getPassFailData(int year);
}
