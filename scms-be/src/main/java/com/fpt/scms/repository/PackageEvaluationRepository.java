package com.fpt.scms.repository;

import com.fpt.scms.model.entity.PackageEvaluation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface PackageEvaluationRepository extends JpaRepository<PackageEvaluation, Long> {

    List<PackageEvaluation> getPackageEvaluationByClassUserId(@Param("classUserId") Long classUserId);

    @Query(value = "select p from PackageEvaluation p where p.classUserId.classUserId = :classUserId and p.evaluationCriteria.criteriaId = :criteriaId")
    PackageEvaluation findByClassUserIdAndCriteriaId(Long classUserId, Long criteriaId);

//    @Transactional
//    @Modifying
//    @Query(value = "update PackageEvaluation pe set pe.grade_rv1=:presentation where pe.classUserId.classUserId=:classUserId")
//    int updatePresentation1(@Param("presentation") float presentation, @Param("classUserId") Long classUserId);
//
//    @Transactional
//    @Modifying
//    @Query(value = "update PackageEvaluation pe set pe.grade_rv2=:presentation where pe.classUserId.classUserId=:classUserId")
//    int updatePresentation2(@Param("presentation") float presentation, @Param("classUserId") Long classUserId);
//
//    @Transactional
//    @Modifying
//    @Query(value = "update PackageEvaluation pe set pe.grade_rv3=:presentation where pe.classUserId.classUserId=:classUserId")
//    int updatePresentation3(@Param("presentation") float presentation, @Param("classUserId") Long classUserId);
//
//    @Transactional
//    @Modifying
//    @Query(value = "update PackageEvaluation pe set pe.grade_rv4=:presentation where pe.classUserId.classUserId=:classUserId")
//    int updatePresentation4(@Param("presentation") float presentation, @Param("classUserId") Long classUserId);
//    @Transactional
//    @Modifying
//    @Query(value = "update PackageEvaluation pe set pe.grade_resit_rv1=:presentation where pe.classUserId.classUserId=:classUserId")
//    int updatePresentationResit1(@Param("presentation") float presentation, @Param("classUserId") Long classUserId);
//
//    @Transactional
//    @Modifying
//    @Query(value = "update PackageEvaluation pe set pe.grade_resit_rv2=:presentation where pe.classUserId.classUserId=:classUserId")
//    int updatePresentationResit2(@Param("presentation") float presentation, @Param("classUserId") Long classUserId);
//
//    @Transactional
//    @Modifying
//    @Query(value = "update PackageEvaluation pe set pe.grade_resit_rv3=:presentation where pe.classUserId.classUserId=:classUserId")
//    int updatePresentationResit3(@Param("presentation") float presentation, @Param("classUserId") Long classUserId);
//
//    @Transactional
//    @Modifying
//    @Query(value = "update PackageEvaluation pe set pe.grade_resit_rv4=:presentation where pe.classUserId.classUserId=:classUserId")
//    int updatePresentationResit4(@Param("presentation") float presentation, @Param("classUserId") Long classUserId);

    @Query(nativeQuery = true,value = "select * from package_evaluation where class_user_id=:classUserId order by package_evaluation_id desc limit 1")
    PackageEvaluation findPackageEvaluationByClassUserId(@Param("classUserId") Long classUserId);

}
