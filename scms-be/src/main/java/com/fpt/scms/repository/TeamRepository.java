package com.fpt.scms.repository;

import com.fpt.scms.model.entity.Team;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TeamRepository extends JpaRepository<Team, Long> {
    @Query("SELECT t FROM Team t JOIN ClassUser cu ON t.teamId = cu.teamId.teamId WHERE cu.classId.classId = :classId AND cu.userId.userId = :studentId")
    Team findByStudentId(Long studentId, Long classId);
    @Query("SELECT t FROM Team t  WHERE t.teamName = :teamName AND t.classEntity.classId = :classId")
    Team findByTeamName(String teamName, Long classId);
    List<Team> findAllByClassEntity_ClassIdAndStatusIs (Long classId, String status);
    List<Team> findAllByProject_ProjectIdIs (Long projectId);
    Team findTeamByTeamId(Long teamId);

}
