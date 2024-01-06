DROP DATABASE IF EXISTS scms;
CREATE DATABASE scms;
USE scms;


CREATE TABLE role(
    role_id     TINYINT      PRIMARY KEY 	auto_increment, 
    role_name   NVARCHAR(50) NOT NULL 		UNIQUE,
    status		VARCHAR(15) default 'ACTIVE'
);

CREATE TABLE user(
	user_id 		BIGINT      	PRIMARY KEY 	auto_increment,
    roll_number 	VARCHAR(12) 	,
    full_name 		NVARCHAR(255) 	NOT NULL,
    gender   		NVARCHAR(10),
    date_of_birth	DATE,
    email 			NVARCHAR(255) 	NOT NULL 		UNIQUE,
    phone_number    VARCHAR(12) ,
    avatar_image	NVARCHAR(255),
    provider_id		NVARCHAR(255),
    facebook_link	NVARCHAR(255),
    gitlab_token	NVARCHAR(255)	default null, -- nếu có chức năng đồng bộ issue từ giblab thì cần 
    created_at    	DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    	DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status 			VARCHAR(20) default 'ACTIVE',
    provider		VARCHAR(20) 
);
CREATE TABLE user_role(
	id			BIGINT 	PRIMARY KEY 	auto_increment,
    user_id     BIGINT          NOT NULL,
    role_id     TINYINT     	NOT NULL,
    FOREIGN KEY (user_id) REFERENCES user(user_id),
    FOREIGN KEY (role_id) REFERENCES role(role_id)
);
create table setting (
	setting_id 			BIGINT 		PRIMARY KEY 	auto_increment,
	type_id 			INT,
	setting_title 		VARCHAR(255),
	setting_value 		VARCHAR(255),
	status 				VARCHAR(255) 			default "ACTIVE"
);
CREATE TABLE semester(
    semester_id     BIGINT 			auto_increment PRIMARY KEY,
    semester_name   NVARCHAR(20) 	NOT NULL UNIQUE,
    start_date      DATETIME 		NOT NULL,
    end_date        DATETIME 		NOT NULL,
    CHECK (start_date < end_date),
    status			VARCHAR(50) 			default "ACTIVE"
);

CREATE TABLE class (
    class_id      BIGINT 			auto_increment PRIMARY KEY,
    class_code    NVARCHAR(50) 		NOT NULL UNIQUE,
    trainer_id    BIGINT 			NOT NULL,
    reviewer1	  BIGINT,
	reviewer2	  BIGINT,
	reviewer3	  BIGINT,
	reviewer4	  BIGINT,
	reviewer_resit1	BIGINT,
	reviewer_resit2	BIGINT,
	reviewer_resit3	BIGINT,
	reviewer_resit4	BIGINT,
    semester_id   BIGINT 			NOT NULL,
    is_block5     VARCHAR(20)		NOT NULL, 
    status        VARCHAR(50) 		default "ACTIVE",
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by    BIGINT			NOT NULL,
	update_by     BIGINT			NOT NULL,
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id),
    FOREIGN KEY (trainer_id) REFERENCES user(user_id),
    FOREIGN KEY (reviewer1) REFERENCES user(user_id),
	FOREIGN KEY (reviewer2) REFERENCES user(user_id),
	FOREIGN KEY (reviewer3) REFERENCES user(user_id),
	FOREIGN KEY (reviewer4) REFERENCES user(user_id),
    FOREIGN KEY (reviewer_resit1) REFERENCES user(user_id),
	FOREIGN KEY (reviewer_resit2) REFERENCES user(user_id),
	FOREIGN KEY (reviewer_resit3) REFERENCES user(user_id),
	FOREIGN KEY (reviewer_resit4) REFERENCES user(user_id),
    FOREIGN KEY (created_by) REFERENCES user(user_id),
    FOREIGN KEY (update_by) REFERENCES user(user_id)
);

ALTER TABLE class ADD COLUMN 
is_use        VARCHAR(50) 		default "NO";
CREATE TABLE project (
    project_id    BIGINT 		auto_increment PRIMARY KEY,
    topic_code    VARCHAR(50) 	NOT NULL UNIQUE,
    topic_name    VARCHAR(100) 	NOT NULL,
    description   text,
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by    BIGINT			NOT NULL,
	update_by     BIGINT			NOT NULL,
    FOREIGN KEY (created_by) REFERENCES user(user_id),
    FOREIGN KEY (created_by) REFERENCES user(user_id)
);
ALTER TABLE project
DROP INDEX topic_code;
ALTER TABLE project
ADD COLUMN STATUS VARCHAR(50) DEFAULT 'ACTIVE';
create table feature (
	feature_id 			BIGINT 		PRIMARY KEY auto_increment,
	feature_name 		VARCHAR(255),
    description 		TEXT DEFAULT NULL
);
-- nếu SV  làm đề tài tự chọn thì phải tự thêm feature, function 
Create table check_list(
	check_list_id 		BIGINT PRIMARY KEY   auto_increment,
    check_list_name		NVARCHAR(255) NOT NULL UNIQUE
);
ALTER TABLE check_list
ADD COLUMN status Varchar(50) default 'ACTIVE',
DROP INDEX check_list_name;
ALTER TABLE check_list
ADD COLUMN created_by BIGINT,
ADD FOREIGN KEY (created_by) REFERENCES user(user_id);
ALTER TABLE check_list
ADD COLUMN is_use Varchar(50) default 'NO';

create table technology(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);
create table function_type(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50)
);

CREATE TABLE team (
    team_id       BIGINT auto_increment PRIMARY KEY,
    team_name    VARCHAR(50),
    class_id      BIGINT NOT NULL,
	project_id	  BIGINT DEFAULT NULL, -- default null vì có team sẽ làm đề tài tự do
    check_list_id BIGINT DEFAULT NULL, -- default null vì có team sẽ ko dùng
    gitlab_url    NVARCHAR(255),
    document_url_1  NVARCHAR(255),
    document_url_2  NVARCHAR(255),
    document_url_3  NVARCHAR(255),
    document_url_4  NVARCHAR(255),
    document_url_5  NVARCHAR(255),
    status        VARCHAR(50) 			default "ACTIVE",
    created_at    DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (check_list_id) REFERENCES check_list(check_list_id) ,
    FOREIGN KEY (project_id) REFERENCES project(project_id) , 
    FOREIGN KEY (class_id) REFERENCES class(class_id)  
);
ALTER TABLE team ADD COLUMN is_locked VARCHAR(50) DEFAULT 'NO';
create table iteration(
	iteration_id 		BIGINT 		auto_increment 		PRIMARY KEY,
    iteration_name 		VARCHAR(50),
    duration 			int,
    status 				VARCHAR(50) 			default "ACTIVE"
);
ALTER TABLE iteration ADD COLUMN duration_block5 int;
create table milestone(
	milestone_id 		BIGINT auto_increment PRIMARY KEY,
	milestone_name 		VARCHAR(100),
    iteration_id 		BIGINT,
    class_id 			BIGINT,
    from_date 			DATETIME,
    to_date 			DATETIME,
	status 				VARCHAR(50),
    FOREIGN KEY (iteration_id) REFERENCES iteration(iteration_id),
    FOREIGN KEY (class_id) REFERENCES class(class_id)
);
create table project_backlog(
	project_backlog_id  BIGINT auto_increment PRIMARY KEY,
    assignee_id 		BIGINT  DEFAULT NULL,
    team_id 			BIGINT,
    project_id			BIGINT,
    feature_id 			BIGINT,
	function_name 		NVARCHAR(50),
    actor 		 		NVARCHAR(50),
	complexity	 		VARCHAR(50), -- simple, medium, complex 
    loc 				int DEFAULT NULL,
	priority 			VARCHAR(50), -- low, medium, high...
    planned_code_iteration BIGINT DEFAULT NULL,
    actual_code_iteration BIGINT DEFAULT NULL,
	completed_iteration BIGINT DEFAULT NULL,
	srs_status 	  		VARCHAR(50), -- doing, pending, done
    sds_status 	  		VARCHAR(50),  -- doing, pending, done
    coding_status 		VARCHAR(50),    -- doing, pending, done
    testing_status 		VARCHAR(50), -- doing, pending, done
    complete_percent_loc FLOAT,  
    loc_iter1			INT,  -- = (complete_percent_loc) * LOC / 100
	loc_iter2			INT,
	loc_iter3			INT,
	loc_iter4			INT,
	loc_iter5			INT,
	loc_iter6			INT,
    created_by 			BIGINT,
    created_at    		DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    		DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
	FOREIGN KEY (feature_id) REFERENCES feature(feature_id),
    FOREIGN KEY (created_by) REFERENCES user(user_id),
	FOREIGN KEY (project_id) REFERENCES project(project_id) ON DELETE CASCADE,
    FOREIGN KEY (assignee_id) REFERENCES user(user_id),
    FOREIGN KEY (team_id) REFERENCES team(team_id),
    FOREIGN KEY (planned_code_iteration) REFERENCES iteration(iteration_id),
    FOREIGN KEY (actual_code_iteration) REFERENCES iteration(iteration_id),
    FOREIGN KEY (completed_iteration) REFERENCES iteration(iteration_id)
);
ALTER TABLE project_backlog ADD COLUMN screen_name VARCHAR(255);
create table estimate_loc(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    function_type_id BIGINT,
    technology_id BIGINT,
    number_of_loc_per_input int,
	FOREIGN KEY (function_type_id) REFERENCES function_type(id),
    FOREIGN KEY (technology_id) REFERENCES technology(id)
);

create table function_estimate_loc(
	id BIGINT  AUTO_INCREMENT PRIMARY KEY,
    estimate_loc_id BIGINT,
    project_backlog_id BIGINT,
    number_of_input int,
    FOREIGN KEY (estimate_loc_id) REFERENCES estimate_loc(id),
     FOREIGN KEY (project_backlog_id) REFERENCES project_backlog(project_backlog_id)
);
create table class_user (
	class_user_id 		BIGINT  		auto_increment  		PRIMARY KEY ,
	class_id 			BIGINT, 
	team_id 			BIGINT,
	user_id			 	BIGINT,
    team_lead			VARCHAR(10), -- yes , no 
	user_notes 			VARCHAR(50),
    ongoing_eval1		float,
    ongoing_eval2		FLOAT,
    ongoing_eval3 		FLOAT,
    ongoing_eval4 		FLOAT,
    ongoing_eval5 		FLOAT,
    ongoing_eval6 		FLOAT,
	total_ongoing_eval 		FLOAT, -- điểm on-going (iter 1 2 3)
	final_pres_eval 	FLOAT, -- điểm hội đồng (iter 4)
    final_presentation_resit		FLOAT,
	final_grade		 	FLOAT, -- điểm final môn học
	status 				VARCHAR(50) 			default "ACTIVE",
	FOREIGN KEY (class_id) REFERENCES class(class_id),
    FOREIGN KEY (team_id) REFERENCES team(team_id),
	FOREIGN KEY (user_id) REFERENCES user(user_id)
);
ALTER TABLE class_user 
MODIFY COLUMN user_notes 			VARCHAR(50) DEFAULT 'NO' ,
ADD COLUMN is_submited VARCHAR(50) DEFAULT 'NO',
ADD COLUMN pass_status VARCHAR(50) 
;

Create table check_list_items(
	id			 		BIGINT PRIMARY KEY   auto_increment,
    name				NVARCHAR(50),
    description			TEXT,
    check_list_id		BIGINT,
    FOREIGN KEY (check_list_id) REFERENCES check_list(check_list_id) ON DELETE CASCADE
);
ALTER TABLE check_list_items
ADD COLUMN status Varchar(50) default 'ACTIVE';
ALTER TABLE check_list_items
MODIFY COLUMN name NVARCHAR(500);
create table  function_checklist(
	id					BIGINT  AUTO_INCREMENT PRIMARY KEY,
	project_backlog_id   BIGINT,
    check_list_items_id	 BIGINT, 
    teacher_id    		 BIGINT, 
    status				 VARCHAR(25), -- passed -- not passed 
    iteration_id         BIGINT,
    created_at    		 DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at   		 DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (teacher_id) REFERENCES user(user_id),
    FOREIGN KEY (iteration_id) REFERENCES iteration(iteration_id),
    FOREIGN KEY (check_list_items_id) REFERENCES check_list_items(id) ON DELETE CASCADE,
	FOREIGN KEY (project_backlog_id) REFERENCES project_backlog(project_backlog_id) ON DELETE CASCADE
);
CREATE TABLE evaluation_criteria (
    criteria_id BIGINT AUTO_INCREMENT PRIMARY KEY,
    semester_id BIGINT,
    iteration_id BIGINT,
    class_type VARCHAR(255),  -- Điều chỉnh độ dài tùy theo nhu cầu
    evaluation_weight DOUBLE,
    ongoing_SRS_weight DOUBLE,
    ongoing_SDS_weight DOUBLE,
    ongoing_coding_weight DOUBLE,
    max_loc DOUBLE,
    project_introduction DOUBLE,
    project_implementation DOUBLE, 
    final_SRS_weight DOUBLE,
    final_SDS_weight DOUBLE,
    q_and_a DOUBLE,
    team_working_weight DOUBLE,
    final_max_loc DOUBLE,
    status VARCHAR(50) DEFAULT 'NOT LOCK',
    description TEXT,
    FOREIGN KEY (semester_id) REFERENCES semester(semester_id),
    FOREIGN KEY (iteration_id) REFERENCES iteration(iteration_id)
);

create table package_evaluation(
	package_evaluation_id    BIGINT PRIMARY KEY   auto_increment,
    class_user_id			BIGINT NOT NULL,
    criteria_id 			BIGINT,
    -- iteration 1 2 3 
    Tracking_grade			BIGINT, 
    SRS_grade				FLOAT,
    SDS_grade 				FLOAT,
    Issue_grade             FLOAT,
    Team_grade				FLOAT,
    LOC						FLOAT,
    Loc_grade				FLOAT,
    FOREIGN KEY (class_user_id) REFERENCES class_user(class_user_id),
	FOREIGN KEY (criteria_id) REFERENCES evaluation_criteria(criteria_id)
)
;
create table comment_iter(
	id BIGINT AUTO_INCREMENT PRIMARY KEY,
    comment_value  text,
    project_backlog_id BIGINT,
    iteration_id BIGINT,
	created_at    		DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at    		DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (project_backlog_id) REFERENCES project_backlog(project_backlog_id) ON DELETE CASCADE,
    FOREIGN KEY (iteration_id) REFERENCES iteration(iteration_id)
);

insert into role(role_name) values("HeadOfDepartment");
insert into role(role_name) values("TEACHER");
insert into role(role_name) values("STUDENT");
insert into role(role_name) values("REVIEWER");
