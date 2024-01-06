package com.fpt.scms.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
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
@AllArgsConstructor
@NoArgsConstructor
@Table(name = "comment_iter")
public class FunctionComment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "comment_value", nullable = false)
    private String comment;

    @ManyToOne
    @JoinColumn(name = "project_backlog_id", nullable = false)
    @JsonBackReference("project_backlog_function_comment")
    private ProjectBacklog projectBacklog;

    @ManyToOne
    @JoinColumn(name = "iteration_id", nullable = false)
    private Iteration iteration;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;

}
