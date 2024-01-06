package com.fpt.scms.repository;

import com.fpt.scms.model.entity.CheckList;

import com.fpt.scms.model.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface CheckListRepository extends JpaRepository<CheckList,Long> {
    @Override
    <S extends CheckList> S save(S entity);
    @Override
    Optional<CheckList> findById(Long id);
    @Override
    List<CheckList> findAll();

    List<CheckList> findAllByCreatedBy(User createdBy);
    Optional<CheckList> findCheckListByNameAndCreatedBy(String name, User createdBy);
    @Override
    void deleteById(Long id);
    @Query("SELECT c FROM CheckList c WHERE  c.id = ?1")
    CheckList findByID (Long Id);
}
