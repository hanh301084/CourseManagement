package com.fpt.scms.model.entity;

        import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
        import com.fasterxml.jackson.annotation.JsonManagedReference;
        import com.fpt.scms.model.Enum.Status;
        import lombok.AllArgsConstructor;
        import lombok.Getter;
        import lombok.NoArgsConstructor;
        import lombok.Setter;
        import org.hibernate.annotations.CreationTimestamp;
        import org.hibernate.annotations.UpdateTimestamp;

        import javax.persistence.*;
        import java.time.LocalDateTime;
        import java.util.Set;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "project")
@JsonIgnoreProperties("projectBacklogs")
public class Project {

    @Id
    @OrderBy
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_id")
    private Long projectId;

    @Column(name = "topic_code", nullable = false, length = 50)
    private String topicCode;

    @Column(name = "topic_name", nullable = false, length = 100)
    private String topicName;

    @Column(name = "description", columnDefinition = "TEXT")
    private String description;

    @Column(name = "created_at", updatable = false, columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP")
    @CreationTimestamp
    private LocalDateTime createdAt;
    @Column(name = "updated_at", columnDefinition = "DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @Column(name = "status")
    @Enumerated(EnumType.STRING)
    private Status status;
    @ManyToOne
    @JoinColumn(name = "created_by", nullable = false, updatable = false)
    private User createdBy;

    @ManyToOne
    @JoinColumn(name = "update_by", nullable = false)
    private User updatedBy;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    @JsonManagedReference
    private Set<ProjectBacklog> projectBacklogs;
    @Column(name = "is_lock", columnDefinition = "boolean default false")
    private boolean isLock;
}