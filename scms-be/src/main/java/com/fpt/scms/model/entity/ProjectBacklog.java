package com.fpt.scms.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.fpt.scms.model.Enum.Complexity;
import com.fpt.scms.model.Enum.PackageStatus;
import com.fpt.scms.model.Enum.Priority;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@ToString
@Table(name = "project_backlog")
public class ProjectBacklog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_backlog_id")
    private Long projectBacklogId;

    @ManyToOne
    @JoinColumn(name = "assignee_id")
    private User assignee;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "team_id")
    private Team team;

    @ManyToOne
    @JoinColumn(name = "project_id")
    @JsonBackReference
    private Project project;

    @ManyToOne
    @JoinColumn(name = "feature_id")
    private Feature feature;

    @Column(name = "function_name")
    private String functionName;
    @Column(name = "screen_name")
    private String screenName;

    @Column(name = "actor")
    private String actor;

    @Column(name = "complexity")
    @Enumerated(EnumType.STRING)
    private Complexity complexity;

    @Column(name = "loc")
    private Integer loc;
    @Column(name = "actual_loc")
    private Integer actualLoc;
    @Enumerated(EnumType.STRING)
    @Column(name = "priority")
    private Priority priority;

    @ManyToOne
    @JoinColumn(name = "planned_code_iteration")
    private Iteration plannedCodeIteration;

    @ManyToOne
    @JoinColumn(name = "actual_code_iteration")
    private Iteration actualCodeIteration;

    @ManyToOne
    @JoinColumn(name = "completed_iteration")
    private Iteration completed_iteration;

    @Column(name = "complete_percent_loc")
    private Float completePercentLoc;

    @Column(name = "loc_iter1")
    private Integer locIter1;
    @Column(name = "loc_iter2")
    private Integer locIter2;
    @Column(name = "loc_iter3")
    private Integer locIter3;

    @Column(name = "loc_iter4")
    private Integer locIter4;

    @Column(name = "loc_iter5")
    private Integer locIter5;

    @Column(name = "loc_iter6")
    private Integer locIter6;
    @Column(name = "srs_status")
    @Enumerated(EnumType.STRING)
    private PackageStatus srsStatus;

    @Column(name = "sds_status")
    @Enumerated(EnumType.STRING)
    private PackageStatus sdsStatus;

    @Column(name = "coding_status")
    @Enumerated(EnumType.STRING)
    private PackageStatus codingStatus;

    @Column(name = "testing_status")
    @Enumerated(EnumType.STRING)
    private PackageStatus testingStatus;

    @ManyToOne
    @JoinColumn(name = "created_by")
    private User createdBy;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "projectBacklog", cascade = CascadeType.ALL)
    @JsonManagedReference("project_backlog_function-checklist")
    private Set<FunctionChecklist> functionChecklists;

    @OneToMany(mappedBy = "projectBacklog", cascade = CascadeType.ALL)
    @JsonManagedReference("project_backlog_function_comment")
    private Set<FunctionComment> functionComments;

    @Column(name = "teacher_set_loc", columnDefinition = "boolean default false")
    private boolean teacherSetLoc;
}