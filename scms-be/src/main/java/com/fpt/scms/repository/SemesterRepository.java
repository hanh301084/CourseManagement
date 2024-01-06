package com.fpt.scms.repository;

import com.fpt.scms.model.entity.Role;
import com.fpt.scms.model.entity.Semester;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface SemesterRepository  extends JpaRepository<Semester, Long> {
    @Query("SELECT s FROM Semester s WHERE s.semesterName LIKE %?1% ")
    Page<Semester> searchByName(String keyword, Pageable pageable);

    @Query("SELECT s FROM Semester s WHERE s.semesterName LIKE %?1% AND (?2 IS NULL OR YEAR(s.startDate) = ?2 OR YEAR(s.endDate) = ?2) ORDER BY CASE WHEN s.status = 'ACTIVE' THEN 1 ELSE 2 END, s.semesterId DESC")
    Page<Semester> searchByNameAndYear(String keyword, Integer year, Pageable pageable);

    @Query("SELECT s FROM  Semester s WHERE s.status like 'ACTIVE' ORDER BY s.semesterId DESC")
    List<Semester> findAllActive();

    @Query("SELECT DISTINCT YEAR(s.startDate) FROM Semester s  ")
    List<Integer> findAllDistinctStartYears();

    @Query("SELECT DISTINCT YEAR(s.endDate) FROM Semester s")
    List<Integer> findAllDistinctEndYears();
    @Query("SELECT s FROM  Semester s WHERE s.semesterId = :semesterId ")
    Semester findBy(Long semesterId);

    @Query("SELECT s FROM Semester s WHERE s.startDate <= CURRENT_DATE AND s.endDate >= CURRENT_DATE AND s.status = 'ACTIVE'")
    Optional<Semester> findActiveSemester();
    Optional<Semester> findBySemesterName(String semesterName);
}
