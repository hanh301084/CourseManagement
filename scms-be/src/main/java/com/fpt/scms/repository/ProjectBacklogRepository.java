package com.fpt.scms.repository;

import com.fpt.scms.model.Enum.FunctionChecklistStatus;
import com.fpt.scms.model.dto.ProjectWBS_DTO;
import com.fpt.scms.model.dto.TotalLocProjectBacklogDTO;
import com.fpt.scms.model.entity.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;


import java.util.List;

public interface ProjectBacklogRepository extends JpaRepository<ProjectBacklog, Long> {

    @Query("SELECT pb FROM ProjectBacklog pb " +
            "JOIN pb.team t " +
            "JOIN t.classEntity c " +
            "JOIN c.semester s " +
            "JOIN c.trainer trainer " +  // Join with the teacher relationship in Class
            "WHERE (?1 IS NULL OR s.semesterId = ?1) " +
            "AND (?2 IS NULL OR c.classId = ?2) " +
            "AND (?3 IS NULL OR t.teamId = ?3) " +
            "AND trainer.userId = ?4")  // Check if the current user is the teacher of the class
    Page<ProjectBacklog> findAllByFilters(Long semesterId, Long classId, Long teamId, Long currentUserId, Pageable pageable);

    @Query("SELECT pb FROM ProjectBacklog pb " +
            "JOIN pb.team t " +
            "JOIN t.classEntity c " +
            "JOIN c.semester s " +
            "JOIN t.classUsers cu " +
            "WHERE (?1 IS NULL OR s.semesterId = ?1) " +
            "AND (?2 IS NULL OR c.classId = ?2) " +
            "AND (?3 IS NULL OR t.teamId = ?3) " +
            "AND (?4 IS NULL OR cu.userId.userId = ?4) " + // Use the userId to filter for the student
            "AND cu.status = 'ACTIVE'")
    Page<ProjectBacklog> findAllByFiltersForStudent(Long semesterId, Long classId, Long teamId, Long userId, Pageable pageable);
    @Query("SELECT DISTINCT new com.fpt.scms.model.dto.ProjectWBS_DTO(  pb.feature.featureId, pb.functionName,pb.screenName, pb.actor, pb.complexity, pb.loc) " +
            "FROM ProjectBacklog pb " +
            "WHERE pb.project.projectId = :projectId")
    Page<ProjectWBS_DTO> findAllByProjectID(Long projectId, Pageable pageable);

    void deleteProjectBacklogsByFunctionNameAndFeature_FeatureIdAndProjectProjectId(String functionName, Long featureId, Long projectId);
    List<ProjectBacklog> findByFunctionNameAndFeatureAndActorAndProjectAndTeamAndScreenName(
            String functionName,
            Feature feature,
            String actor,
            Project project,
            Team team,
            String screenName
    );
    ProjectBacklog findByFunctionNameAndFeature_FeatureIdAndActorAndTeam_TeamId(
            String functionName,
            Long feature,
            String actor,
            Long team
    );
    List<ProjectBacklog> findAllByProject_ProjectIdAndFeature_FeatureIdAndFunctionNameAndScreenName(Long projectId, Long featureId, String functionName ,String screenName);

    @Query("SELECT cu.userId FROM ClassUser cu " +
            "WHERE cu.teamId.teamId = ?1 ")
    List<User> findAllActiveUsersByTeamId(Long teamId);
    @Query("UPDATE FunctionChecklist f SET f.status = :status WHERE f.id = :checklistItemId AND f.projectBacklog.projectBacklogId = :projectBacklogId")
    @Modifying
    int updateChecklistItemStatus(@Param("checklistItemId") Long checklistItemId,
                                  @Param("status") FunctionChecklistStatus status,
                                  @Param("projectBacklogId") Long projectBacklogId);

    @Query("select pb from ProjectBacklog pb where pb.project.projectId = :projectId and  pb.team.teamId = null ")
    List<ProjectBacklog> getByProjectId(Long projectId);
    @Query("select pb from ProjectBacklog pb where pb.team.teamId = :teamId")
    List<ProjectBacklog> getByTeamId(Long teamId);

    @Query("SELECT NEW com.fpt.scms.model.dto.TotalLocProjectBacklogDTO(pb.assignee, pb.team, SUM(pb.locIter1), SUM(pb.locIter2), SUM(pb.locIter3), SUM(pb.locIter4), SUM(pb.locIter5), SUM(pb.locIter6)) FROM ProjectBacklog pb WHERE pb.team.teamId = :teamId AND pb.assignee.userId = :userId GROUP BY pb.assignee.userId")
    TotalLocProjectBacklogDTO getTotalLocByUser(@Param("teamId") Long teamId, @Param("userId") Long userId);

    @Modifying
    @Transactional
    @Query(value = "update ProjectBacklog p set p.loc=:loc, p.teacherSetLoc=true where p.projectBacklogId=:projectBacklogId")
    int updateProjectBacklogByTeacher(@Param("loc") int loc,@Param("projectBacklogId") long projectBacklogId);

    @Modifying
    @Transactional
    @Query(value = "update ProjectBacklog p set p.loc=:loc, p.teacherSetLoc=false where p.projectBacklogId=:projectBacklogId")
    int updateProjectBacklogByStudent(@Param("loc") int loc,@Param("projectBacklogId") long projectBacklogId);
}
