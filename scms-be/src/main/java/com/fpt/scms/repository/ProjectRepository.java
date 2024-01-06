package com.fpt.scms.repository;

import com.fpt.scms.model.Enum.Status;
import com.fpt.scms.model.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    @Query("SELECT p FROM Project p WHERE p.createdBy.userId = ?1 AND (p.topicName LIKE %?2% OR p.description LIKE %?2% OR p.topicCode LIKE %?2%) AND (p.status = ?3 OR ?3 IS NULL)")
    Page<Project> findByCreatedByWithParams(Long userId, String searchText, Status status, Pageable pageable);
    @Query("SELECT p FROM Project p WHERE p.createdBy.userId = :userId OR p.createdBy.userId IN (SELECT u.userId FROM User u JOIN Class c ON u.userId = c.trainer.userId  JOIN ClassUser cu ON c.classId = cu.classId.classId WHERE cu.userId = :userId) and p.status = :status")
    Page<Project> findProjectsByUserOrTeachers(@Param("userId") Long userId, @Param("status") Status status, Pageable pageable);
    @Query("SELECT p FROM Project p WHERE p.createdBy.userId = ?1 OR p.createdBy.userId IN (SELECT u.userId FROM User u JOIN Class c ON u.userId = c.trainer.userId  JOIN ClassUser cu ON c.classId = cu.classId.classId) AND (p.topicName LIKE %?2% OR p.description LIKE %?2% OR p.topicCode LIKE %?2%) and p.status =?3")
    Page<Project> findProjectsByCreatorOrTeachersAndSearchText( Long userId, String searchText,Status status, Pageable pageable);
    @Query("SELECT p FROM Project p JOIN p.createdBy u LEFT JOIN ClassUser cu ON u = cu.userId LEFT JOIN Class c ON cu.classId = c WHERE (u.userId = ?1 OR c.trainer.userId = ?1) AND (p.status = ?2 OR ?2 IS NULL)")
    Page<Project> findByTeacherAndStudentsInClass(Long userId, Status status, Pageable pageable);

    @Query("SELECT p FROM Project p WHERE p.createdBy.userId = ?3 AND (p.topicName LIKE ?2  OR p.topicCode LIKE ?1)")
    Optional<Project> findExistProjectByUser(String topicCode, String topicName, Long userId);
    @Query("SELECT p FROM Project p WHERE p.createdBy.userId = ?2 AND p.topicName LIKE ?1 ")
    Project findByUserAndProjectName(String topicName, Long userId);
    Project findByProjectId(Long projectId);

}

