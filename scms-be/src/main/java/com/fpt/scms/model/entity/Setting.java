package com.fpt.scms.model.entity;

import lombok.*;
import javax.persistence.*;
@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@ToString
@Table(name = "setting")
public class Setting {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        @Column(name = "setting_id")
        private Long settingId;
        @Column(name = "type_id" )
        private Long typeId;
        @Column(name = "setting_title" )
        @Enumerated(EnumType.STRING)
        private com.fpt.scms.model.Enum.Setting settingTitle;
        @Column(name = "setting_value" )
        private String settingValue;
        @Column(name = "status",columnDefinition = "VARCHAR(50) DEFAULT 'ACTIVE'")
        private String status;
}
