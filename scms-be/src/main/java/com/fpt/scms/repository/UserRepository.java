package com.fpt.scms.repository;

import com.fpt.scms.model.entity.User;
//import com.nimbusds.openid.connect.sdk.assurance.evidences.attachment.Attachment;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);

    @Query("SELECT u FROM User u WHERE u.fullName LIKE %?1% OR u.email LIKE %?1% OR u.rollNumber LIKE %?1% ")
    Page<User> searchByNameOrEmail(String keyword, Pageable pageable);

    @Query("SELECT u FROM User u WHERE u.rollNumber LIKE :rollNumber")
    Optional<User> findByRollNumber(String rollNumber);

    @Query("SELECT u from User u where u.email = :email")
    User findUserByEmail(String email);
    @Query("SELECT new map(date(u.createdAt) as date, count(u) as count) FROM User u GROUP BY date(u.createdAt)")
    List<Map<String, Object>> countUsersGroupedByDate();
}