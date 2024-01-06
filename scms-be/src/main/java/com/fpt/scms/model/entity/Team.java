package com.fpt.scms.model.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "team")
@JsonIgnoreProperties({"projectBacklogs", "classUser"})
public class Team {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "team_id")
    private Long teamId;

    @Column(name = "team_name", length = 50)
    private String teamName;

    @ManyToOne
    @JoinColumn(name = "class_id", referencedColumnName = "class_id")
    private Class classEntity;

    @ManyToOne
    @JoinColumn(name = "project_id", referencedColumnName = "project_id")
    private Project project;

    @ManyToOne
    @JoinColumn(name = "check_list_id", referencedColumnName = "check_list_id")
    private CheckList checkList;

    @Column(name = "gitlab_url", length = 255)
    private String gitlabUrl;

    @Column(name = "document_url_1")
    private String documentUrl1;

    @Column(name = "document_url_2")
    private String documentUrl2;

    @Column(name = "document_url_3")
    private String documentUrl3;

    @Column(name = "document_url_4")
    private String documentUrl4;

    @Column(name = "document_url_5")
    private String documentUrl5;

    @Column(name = "status")
    private String status;
    @Column(name = "is_locked")
    private String isLocked;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;
    @ManyToOne
    @JoinColumn(name = "technology")
    private Technology technology;

    @OneToMany(mappedBy = "teamId")
    @JsonIgnore
    private Set<ClassUser> classUsers;

}
