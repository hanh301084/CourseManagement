package com.fpt.scms.model.entity;

import com.fpt.scms.model.Enum.IsBlock5;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "class")
public class Class {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Long classId;

    @Column(name = "class_code", unique = true, nullable = false)
    private String classCode;

    @ManyToOne
    @JoinColumn(name = "trainer_id", nullable = false)
    private User trainer;

    @ManyToOne
    @JoinColumn(name = "reviewer1")
    private User reviewer1;

    @ManyToOne
    @JoinColumn(name = "reviewer2")
    private User reviewer2;

    @ManyToOne
    @JoinColumn(name = "reviewer3")
    private User reviewer3;

    @ManyToOne
    @JoinColumn(name = "reviewer4")
    private User reviewer4;

    @ManyToOne
    @JoinColumn(name = "reviewer_resit1")
    private User reviewerResit1;

    @ManyToOne
    @JoinColumn(name = "reviewer_resit2")
    private User reviewerResit2;

    @ManyToOne
    @JoinColumn(name = "reviewer_resit3")
    private User reviewerResit3;

    @ManyToOne
    @JoinColumn(name = "reviewer_resit4")
    private User reviewerResit4;

    @ManyToOne
    @JoinColumn(name = "semester_id", nullable = false)
    private Semester semester;

    @Enumerated(EnumType.STRING)
    @Column(name = "is_block5", columnDefinition = "VARCHAR(50) default 'NO'")
    private IsBlock5 isBlock5;

    @Column(name = "status", nullable = false, columnDefinition = "VARCHAR(50) default 'ACTIVE'")
    private String status;
    @Column(name = "is_use", nullable = false, columnDefinition = "VARCHAR(50) default 'NO'")
    private String is_use;

    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "update_by", nullable = false)
    private User updatedBy;
}
