package com.fpt.scms.repository;

import com.fpt.scms.model.entity.Iteration;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IterationRepository extends JpaRepository<Iteration, Long> {
    @Query("SELECT i FROM Iteration i WHERE i.iterationName LIKE %?1% ")
    Page<Iteration> searchByName(String keyword, Pageable pageable);
    @Query("SELECT DISTINCT i FROM Iteration i WHERE i.status = 'ACTIVE' ORDER BY i.iterationId ASC")
    List<Iteration> findActiveIterations();

    @Query(nativeQuery = true,value = "select iteration_name from iteration i where iteration_id=:iterationId")
    String getIterationNameById(@Param("iterationId") long iterationId);
    @Query("SELECT i FROM  Iteration i WHERE i.iterationId = :iterationId")
    Iteration findBy(Long iterationId);
    @Query("SELECT i FROM Iteration i WHERE i.iterationName > :currentIterationName ORDER BY i.iterationName ASC")
    List<Iteration> findNextIterations(@Param("currentIterationName") String currentIterationName, Pageable pageable);

    default Iteration findNextIteration(Iteration currentIteration) {
        List<Iteration> nextIterations = findNextIterations(currentIteration.getIterationName(), Pageable.ofSize(1));
        return nextIterations.isEmpty() ? null : nextIterations.get(0);
    }
}
