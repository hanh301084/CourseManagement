package com.fpt.scms.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fpt.scms.model.Enum.FunctionChecklistStatus;
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
@Table(name = "function_checklist")
public class FunctionChecklist {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "project_backlog_id",  updatable = false)
    @JsonBackReference("project_backlog_function-checklist")
    private ProjectBacklog projectBacklog;

    @ManyToOne
    @JoinColumn(name = "check_list_items_id")
    private CheckListItems checkListItems;

    @ManyToOne
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @Enumerated(EnumType.STRING)
    @Column(name = "status")
    private FunctionChecklistStatus status;

    @ManyToOne
    @JoinColumn(name = "iteration_id")
    private Iteration iteration;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
}