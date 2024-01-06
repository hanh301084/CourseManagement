package com.fpt.scms.repository;

import com.fpt.scms.model.dto.ClassUserDTO;
import com.fpt.scms.model.entity.Class;
import com.fpt.scms.model.entity.ClassUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Map;

public interface ClassUserRepository extends JpaRepository<ClassUser, Long> {
    @Query("SELECT COUNT(cu) FROM ClassUser cu WHERE cu.classId.classId = :classId")
    int countByClassId(@Param("classId") Long classId);
    //    @Query("SELECT new com.fpt.scms.model.dto.ClassUserDTO(cu.classUserId, cu.classId.classId, cu.teamId.teamId, cu.userId.userId, cu.teamLead, cu.userNotes, cu.ongoingEval1, cu.ongoingEval2, cu.ongoingEval3,cu.ongoingEval4,cu.ongoingEval5,cu.ongoingEval6, cu.totalOngoingEval, cu.finalPresEval, cu.finalGrade, cu.status, u.rollNumber, u.fullName, t.teamName, c.classCode,cu.finalPresentationResit) " +
//            "FROM ClassUser cu " +
//            "JOIN cu.userId u " +
//            "LEFT JOIN cu.teamId t " +
//            "LEFT JOIN cu.classId c " +
//            "WHERE cu.classId.classId = :classId")
//    List<ClassUserDTO> getAllByClassId(@Param("classId") Long classId);
    @Query("SELECT new com.fpt.scms.model.dto.ClassUserDTO(cu.classUserId, cu.classId.classId, cu.teamId.teamId, cu.userId.userId, cu.teamLead, cu.userNotes, cu.ongoingEval1, cu.ongoingEval2, cu.ongoingEval3,cu.ongoingEval4,cu.ongoingEval5,cu.ongoingEval6, cu.totalOngoingEval, cu.finalPresEval, cu.finalGrade, cu.status, cu.passStatus,cu.isSubmited, u.rollNumber, u.fullName, t.teamName, c.classCode,cu.finalPresentationResit) " +
            "FROM ClassUser cu " +
            "JOIN cu.userId u " +
            "LEFT JOIN cu.teamId t " +
            "LEFT JOIN cu.classId c " +
            "WHERE  t.status = 'ACTIVE' AND c.status = 'ACTIVE' AND cu.classId.classId = :classId AND cu.teamId.teamId = :teamId AND t.status = 'ACTIVE' AND c.status = 'ACTIVE'")
    List<ClassUserDTO> getAllByClassIdAndTeam(@Param("classId") Long classId, Long teamId);
    @Query("SELECT new com.fpt.scms.model.dto.ClassUserDTO(cu.classUserId, cu.classId.classId, cu.teamId.teamId, cu.userId.userId, cu.teamLead, cu.userNotes, cu.ongoingEval1, cu.ongoingEval2, cu.ongoingEval3,cu.ongoingEval4,cu.ongoingEval5,cu.ongoingEval6, cu.totalOngoingEval, cu.finalPresEval, cu.finalGrade, cu.status, cu.passStatus, cu.isSubmited,u.rollNumber, u.fullName, t.teamName, c.classCode, cu.finalPresentationResit) " +
            "FROM ClassUser cu " +
            "JOIN cu.userId u " +
            "LEFT JOIN cu.teamId t " +
            "LEFT JOIN cu.classId c " +
            "JOIN c.trainer trainer " + // Join with the teacher relationship in Class
            "WHERE ((?1 IS NULL OR c.semester.semesterId = ?1) " +
            "AND (?2 IS NULL OR cu.classId.classId = ?2) " +
            "AND (?3 IS NULL OR cu.teamId.teamId = ?3)) " +
            "AND trainer.userId = ?4") // Check if the current user is the teacher of the class
    List<ClassUserDTO> getAllBySemesterIdClassIdTeamId(@Param("semesterId") Long semesterId, @Param("classId") Long classId, @Param("teamId") Long teamId, @Param("teacherId") Long teacherId);
    @Query("SELECT new com.fpt.scms.model.dto.ClassUserDTO(cu.classUserId, cu.classId.classId, cu.teamId.teamId, cu.userId.userId, cu.teamLead, cu.userNotes, cu.ongoingEval1, cu.ongoingEval2, cu.ongoingEval3,cu.ongoingEval4,cu.ongoingEval5,cu.ongoingEval6, cu.totalOngoingEval, cu.finalPresEval, cu.finalGrade, cu.status, cu.passStatus, cu.isSubmited, u.rollNumber, u.fullName, t.teamName, c.classCode, cu.finalPresentationResit) " +
            "FROM ClassUser cu " +
            "JOIN cu.userId u " +
            "LEFT JOIN cu.teamId t " +
            "LEFT JOIN cu.classId c " +
            "WHERE ((?1 IS NULL OR c.semester.semesterId = ?1) " +
            "AND (?2 IS NULL OR cu.classId.classId = ?2) " +
            "AND (?3 IS NULL OR cu.teamId.teamId = ?3)) " +
            "AND (c.reviewer1.userId = ?4 " +
            "OR c.reviewer2.userId = ?4 " +
            "OR c.reviewer3.userId = ?4 " +
            "OR c.reviewer4.userId = ?4" +
            "OR c.reviewerResit1.userId = ?4"+
            "OR c.reviewerResit2.userId = ?4"+
            "OR c.reviewerResit3.userId = ?4"+
            "OR c.reviewerResit4.userId = ?4)"
    )
    List<ClassUserDTO> getAllBySemesterIdClassIdTeamIdAndReviewer(@Param("semesterId") Long semesterId, @Param("classId") Long classId, @Param("teamId") Long teamId, @Param("reviewerId") Long reviewerId);

    @Query("SELECT cu FROM ClassUser cu WHERE cu.userId = :userId AND cu.classId = :classId")
    ClassUser findByClassIdAndUserId(Long classId,Long userId);

    @Query("SELECT cu FROM ClassUser cu WHERE cu.classUserId = :classUserId")
    ClassUser findByClassUserId(Long classUserId);

    @Query("SELECT new com.fpt.scms.model.dto.ClassUserDTO(cu.classUserId, cu.classId.classId, cu.teamId.teamId, cu.userId.userId, cu.teamLead, cu.userNotes, cu.ongoingEval1, cu.ongoingEval2, cu.ongoingEval3,cu.ongoingEval4,cu.ongoingEval5,cu.ongoingEval6, cu.totalOngoingEval, cu.finalPresEval, cu.finalGrade, cu.status,cu.passStatus, cu.isSubmited, u.rollNumber, u.fullName, t.teamName, c.classCode,cu.finalPresentationResit) " +
            "FROM ClassUser cu " +
            "JOIN cu.userId u " +
            "LEFT JOIN cu.teamId t " +
            "LEFT JOIN cu.classId c " +
            "WHERE t.status = 'ACTIVE' AND c.status = 'ACTIVE' AND cu.userId.userId = :studentId")
    List<ClassUserDTO> findClassByStudentId(@Param("studentId") Long studentId);

    void deleteAllByClassUserIdIn(List<Long> ids);

    @Transactional
    @Modifying
    @Query("update ClassUser c set c.finalPresEval=:finalPresEval where c.teamId.teamId=:teamId")
    int updateFinalPresEvalByTeamId( @Param("finalPresEval") double finalPresEval,@Param("teamId") Long teamId);


    @Transactional
    @Modifying
    @Query("update ClassUser c set c.finalPresentationResit=:finalPresentationResit where c.teamId.teamId=:teamId")
    int updateFinalPresentationResitByTeamId(@Param("finalPresentationResit") double finalPresentationResit,@Param("teamId") Long teamId);

    @Query("SELECT cu FROM ClassUser cu WHERE cu.classId.classId = :classId AND cu.userId.email = :email")
    ClassUser findClassUserExist(Long classId, String email);

    @Query(value = "select cu.classId.classId from ClassUser cu WHERE cu.classUserId = :classUserId")
    Long findClassIdByClassUserId(@Param("classUserId") Long classUserId);

    @Query(value = "select cu.classId from ClassUser cu where cu.classUserId=:classUserId")
    Class findClassByClassUserId(@Param("classUserId") Long classUserId);
    List<ClassUser> findAllByClassId_ClassId(Long classId);
    ClassUser findFirstByClassId_ClassIdAndTeamId_TeamId(Long classId, Long teamId);
    @Modifying
    @Transactional
    @Query("UPDATE ClassUser cu SET cu.finalPresentationResit = ?3 WHERE cu.classId.classId = ?1 AND cu.teamId.teamId = ?2")
    void updateFinalPresEvalResit(Long classId, Long teamId, double finalPresEval);

    @Modifying
    @Transactional
    @Query("UPDATE ClassUser cu SET cu.finalPresEval = ?3 WHERE cu.classId.classId = ?1 AND cu.teamId.teamId = ?2")
    void updateFinalPresEval(Long classId, Long teamId, double finalPresEvalResit);

    @Query("SELECT new map(c.semester.semesterName as semester, " +
            "sum(case when cu.passStatus = 'PASSED' then 1 else 0 end) as passed, " +
            "sum(case when cu.passStatus = 'NOT PASSED' then 1 else 0 end) as notPassed) " +
            "FROM ClassUser cu JOIN cu.classId c " +
            "WHERE YEAR(c.semester.startDate) = :year " +
            "GROUP BY c.semester.semesterName")
    List<Map<String, Object>> countPassedAndNotPassedStudentsByYear(@Param("year") int year);


}
