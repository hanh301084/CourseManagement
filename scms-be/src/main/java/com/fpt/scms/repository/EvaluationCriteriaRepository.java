package com.fpt.scms.repository;

import com.fpt.scms.model.entity.EvaluationCriteria;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface EvaluationCriteriaRepository extends JpaRepository<EvaluationCriteria, Long> {
    @Query("SELECT ec from EvaluationCriteria ec where ec.semester.semesterId = :semesterId AND ec.classType = :classType")
    List<EvaluationCriteria> findAllBySemesterId(Long semesterId, String classType);

    @Query("SELECT ec from EvaluationCriteria ec where ec.semester.semesterId = :semesterId")
    List<EvaluationCriteria> findAllBySemesterIdFinal(Long semesterId);

    @Query("SELECT ec from EvaluationCriteria ec where ec.semester.semesterId = :semesterId and ec.iteration.iterationId = :iterationId and  ec.classType = :classType")
    EvaluationCriteria findByIterationIdAndSemesterId(Long semesterId, String classType, Long iterationId);

    @Query("SELECT ec from EvaluationCriteria ec where ec.semester.semesterId = :semesterId and ec.iteration.iterationName = :iterationName and  ec.classType = :classType")
    EvaluationCriteria findByIterationNameAndSemesterId(Long semesterId, String classType, String iterationName);

    @Query(nativeQuery = true,value = "select * from evaluation_criteria ec where ec.semester_id=:semesterId order by ec.criteria_id desc limit 1")
    EvaluationCriteria findEvaluationCriteriaBySemesterId(@Param("semesterId") Long semesterId);

    EvaluationCriteria findFirstBySemesterSemesterIdAndClassType(Long semesterId, String classType);

    @Query("SELECT ec FROM EvaluationCriteria ec WHERE ec.semester.semesterId = (SELECT MAX(ec.semester.semesterId) FROM EvaluationCriteria ec)")
    List<EvaluationCriteria> findAllByLastSemester();
    List<EvaluationCriteria> findAllBySemester_SemesterId(Long semesterId);
}