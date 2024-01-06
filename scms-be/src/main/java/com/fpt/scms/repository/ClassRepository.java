package com.fpt.scms.repository;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.entity.Class;
import com.fpt.scms.model.entity.User;
import com.fpt.scms.services.UserService;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class,Long> {

    @Override
    <S extends Class> S save(S entity);

    @Override
    Optional<Class> findById(Long id);

    @Override
    void deleteById(Long id);

    @Query("SELECT c FROM Class c WHERE  c.trainer.userId = :trainerId AND c.status LIKE  'ACTIVE'")
    List<Class> findAllByTrainerId(@Param("trainerId") Long trainerId);

    List<Class> findBySemester_SemesterIdAndStatusAndTrainer(Long semester_semesterId, String status, User user);
    @Query("SELECT c FROM Class c WHERE c.semester.semesterId = ?1 AND c.status = ?2 " +
            "AND (c.reviewer1 = ?3 OR c.reviewer2 = ?3 OR c.reviewer3 = ?3 OR c.reviewer4 = ?3 OR c.reviewerResit1 =?3 OR c.reviewerResit2 =?3 OR c.reviewerResit3 =?3 OR c.reviewerResit4 =?3)")
    List<Class> findBySemesterAndStatusAndReviewer(Long semesterId, String status, User user);

    @Query("SELECT c FROM Class c WHERE  c.trainer.userId = :trainerId AND c.semester.semesterId = :semesterId AND c.status LIKE  'ACTIVE'")
    List<Class> findAllByTrainerAndSemester(@Param("trainerId") Long trainerId, @Param("semesterId") Long semesterId);

    @Query("SELECT c FROM Class c WHERE  c.reviewer1.userId = :reviewerId OR c.reviewer2.userId = :reviewerId AND c.status LIKE  'ACTIVE'")
    List<Class> findAllByReviewerId(@Param("reviewerId") Long reviewerId);

    @Query("SELECT c FROM Class c WHERE  (c.reviewer1.userId = :reviewerId OR c.reviewer2.userId = :reviewerId) AND c.semester.semesterId = :semesterId AND c.status LIKE  'ACTIVE'")
    List<Class> findAllByReviewerAndSemester(@Param("reviewerId") Long reviewerId, @Param("semesterId") Long semesterId);

    @Query(value = "select c from Class c where c.classId=:classId")
    Class findByClassId(@Param("classId") Long classId) ;
}
