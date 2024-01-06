package com.fpt.scms.model.entity;

import com.fpt.scms.model.Enum.AuthProvider;
import javax.persistence.*;

import com.fpt.scms.model.Enum.Gender;
import com.fpt.scms.model.Enum.Status;
import com.sun.istack.NotNull;
import lombok.*;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "User")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "roll_number", unique = true, length = 12)
    private String rollNumber;

    @Column(name = "full_name", length = 50)
    private String fullName;

    @Column(name = "gender", length = 10)
    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Column(name = "date_of_birth")
    private Date dateOfBirth;

    @Column(name = "email", unique = true, nullable = false, length = 50)
    private String email;


    @Column(name = "phone_number", unique = true, length = 12)
    private String phoneNumber;

    @Column(name = "avatar_image", length = 255)
    private String avatarImage;

    @Column(name = "facebook_link", length = 255)
    private String facebookLink;

    @Column(name = "gitlab_token", length = 255)
    private String gitlabToken;
    @Enumerated(EnumType.STRING)
    @Column(name = "status",columnDefinition = "VARCHAR(255) DEFAULT 'ACTIVE'")
    private Status status;

    @Column(name = "created_at", updatable = false)
    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    @UpdateTimestamp
    private LocalDateTime updatedAt;
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "User_Role",
            joinColumns = @JoinColumn(name = "user_id"),
            inverseJoinColumns = @JoinColumn(name = "role_id")
    )
    private Set<Role> roles = new HashSet<>();
    @NotNull
    @Enumerated(EnumType.STRING)
    private AuthProvider provider;

    private String providerId;
}