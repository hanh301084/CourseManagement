package com.fpt.scms.repository;

import com.fpt.scms.model.entity.PointEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PointEvaluationRepository extends JpaRepository<PointEvaluation,Long> {
    @Query(value = "select pe from PointEvaluation pe where pe.team.teamId=:teamId and pe.reviewer.userId=:reviewerId and pe.isResit=:isResit")
    PointEvaluation getPointEvaluationByTeamIdAndReviewerId(@Param("teamId") Long teamId, @Param("reviewerId") Long reviewerId,@Param("isResit") boolean isResit);

    @Query(value = "select pe from PointEvaluation pe where pe.team.teamId=:teamId and pe.reviewer.userId=:reviewerId and pe.isResit=:isResit")
    PointEvaluation getPointEvaluationByTeam(@Param("teamId") Long teamId, @Param("reviewerId") Long reviewerId,@Param("isResit") boolean isResit);
    List<PointEvaluation> findAllByTeam_TeamIdAndIsResit(Long teamId, boolean isResit);
}