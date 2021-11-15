USE EI;

CREATE TABLE IF NOT EXISTS EI.USER (
 signup_date timestamp not null DEFAULT CURRENT_TIMESTAMP COMMENT '가입일'
 ,user_id varchar(20) not null primary key COMMENT '유저 아이디'
 ,password varchar(100) not null COMMENT '유저 비밀번호'
 ,user_name varchar(20) not null COMMENT '유저 이름'
 ,user_email varchar(100) not null COMMENT '유저 이메일'
 ,user_permission varchar(20) not null COMMENT '유저 권한(admin / modeler)'
 ,activate TINYINT(1) not null COMMENT '활성 여부(유저 로그인 승인/차단 상태 표시)'
);


CREATE TABLE IF NOT EXISTS EI.LOGIN_HISTORY (
 login_date timestamp not null DEFAULT CURRENT_TIMESTAMP COMMENT '로그인 일시'
 ,user_id varchar(20) not null COMMENT '유저 아이디'
 ,session varchar(50) not null COMMENT '유저 세션(유저가 현재 로그인 상태인지 확인)'
);


CREATE TABLE IF NOT EXISTS EI.MODEL (
 reg_date timestamp not null DEFAULT CURRENT_TIMESTAMP COMMENT '등록일'
 ,user_id varchar(20) not null COMMENT '등록 유저'
 ,model_name varchar(50) not null COMMENT '모델 이름'
 ,model_id varchar(10) not null primary key COMMENT '모델 id'
 ,priority int(4) not null COMMENT '실행 우선순위(표현할 때는 상중하로 표현되지만 숫자로는 4096, 1024, 512로 표시)'
 ,cpu_cores int(4) COMMENT '사용 cpu core수(모델에서 사용하는 Core 개수)'
 ,mem float(7,1) COMMENT '사용 MEMORY양(모델에서 사용하는 MEMORY)'
 ,elapsed float(7,1) COMMENT '모델 테스트 시간(모델 수행 시간)'
 ,base_image varchar(20) not null COMMENT '기본 사용 이미지(모델 실행 환경 설정(R, Python))'
 ,model_desc varchar(500) COMMENT '모델 설명(모델에 관한 코멘트)'
 ,limit_runtime int(4) not null DEFAULT 0 COMMENT '모델 실행 제한 시간(0 : 무한, 나머지는 제한 시간(분단위))'
 ,evaluation_status varchar(10) not null DEFAULT 'init' COMMENT '모델 평가 상태(init : 등록, testing : 평가중, tested: 평가 끝)'
 ,file_name varchar(100) not null COMMENT '파일 이름'
 ,file_size int(4) not null COMMENT '파일 사이즈'
);



CREATE TABLE IF NOT EXISTS EI.MODEL_REG_HISTORY (
 reg_date timestamp not null DEFAULT CURRENT_TIMESTAMP COMMENT '등록일'
 ,user_id varchar(20) not null COMMENT '등록 유저'
 ,model_name varchar(50) not null COMMENT '모델 이름'
 ,model_id varchar(10) not null COMMENT '모델 id'
 ,priority int(4) not null COMMENT '실행 우선순위(표현할 때는 상중하로 표현되지만 숫자로는 4096, 1024, 512로 표시)'
 ,cpu_cores int(4) COMMENT '사용 cpu core수(모델에서 사용하는 Core 개수)'
 ,mem float(7,1) COMMENT '사용 MEMORY양(모델에서 사용하는 MEMORY)'
 ,elapsed float(7,1) COMMENT '모델 테스트 시간(모델 수행 시간)'
 ,base_image varchar(20) not null COMMENT '기본 사용 이미지(모델 실행 환경 설정(R, Python))'
 ,model_desc varchar(500) COMMENT '모델 설명(모델에 관한 코멘트)'
 ,limit_runtime int(4) DEFAULT 0 COMMENT '모델 실행 제한 시간(0 : 무한, 나머지는 제한 시간(분단위))'
 ,evaluation_status varchar(10) not null DEFAULT 'init' COMMENT '모델 평가 상태(init : 등록, testing : 평가중, tested: 평가 끝)'
 ,file_name varchar(100) not null COMMENT '파일 이름'
 ,file_size int(4) not null COMMENT '파일 사이즈'
 ,created TINYINT(1) not null COMMENT '생성/수정'
);


CREATE TABLE IF NOT EXISTS EI.SERVICE (
 creation_date timestamp not null DEFAULT CURRENT_TIMESTAMP COMMENT '생성일'
 ,user_id varchar(20) not null COMMENT '생성 유저 id'
 ,service_id varchar(20) not null primary key COMMENT 'service id(service 검색용 id)'
 ,service_name varchar(50) not null COMMENT 'service 이름'
 ,dag_id varchar(50) not null COMMENT 'dag id(airflow에서 dag_id를 이용 service_id를 검색하기 위함)'
 ,model_id varchar(50) not null COMMENT '사용 모델 id'
 ,run_cycle varchar(100) COMMENT '실행 주기(언제 실행되는지에 대한 정의)'
 ,service_group_name varchar(50) not null COMMENT '서비스 그룹 이름(서비스 그룹 이름)'
 ,service_desc varchar(500) COMMENT '서비스 설명(서비스 설명)'
);


CREATE TABLE IF NOT EXISTS EI.SERVICE_CRE_HISTORY (
 creation_date timestamp not null DEFAULT CURRENT_TIMESTAMP COMMENT '생성일'
 ,user_id varchar(20) not null COMMENT '생성 유저 id'
 ,service_id varchar(20) not null COMMENT 'service id(service 검색용 id)'
 ,service_name varchar(50) not null COMMENT 'service 이름'
 ,dag_id varchar(50) not null COMMENT 'dag id(airflow에서 dag_id를 이용 service_id를 검색하기 위함)'
 ,model_id varchar(50) not null COMMENT '사용 모델 id'
 ,run_cycle varchar(100) COMMENT '실행 주기(언제 실행되는지에 대한 정의)'
 ,service_group_name varchar(50) not null COMMENT '서비스 그룹 이름(서비스 그룹 이름)'
 ,service_desc varchar(500) COMMENT '서비스 설명(서비스 설명)'
);


CREATE TABLE IF NOT EXISTS EI.SERVICE_EXEC_HISTORY (
 execute_date timestamp not null DEFAULT CURRENT_TIMESTAMP COMMENT '실행일'
 ,user_id varchar(20) not null COMMENT '생성 유저 id'
 ,service_id varchar(20) not null COMMENT 'service id(service 검색용 id)'
 ,service_name varchar(50) not null COMMENT 'service 이름'
 ,model_id varchar(50) not null COMMENT '사용 모델 id'
 ,run_cycle varchar(100) COMMENT '실행 주기(언제 실행되는지에 대한 정의)'
 ,service_group_name varchar(50) not null COMMENT '서비스 그룹 이름(서비스 그룹 이름)'
 ,transaction_id varchar(20) not null COMMENT '트랜잭션 id(YYYYMMDDHHmmssSSS (밀리초 단위 문자))'
 ,service_desc varchar(500) COMMENT '서비스 설명(서비스 설명)'
 ,service_status varchar(20) not null COMMENT '서비스 종료 상태(success, warning, error, user_killed)'
 ,start_date timestamp not null COMMENT '서비스 실행 시작 시간(서비스 시작 시간)'
 ,end_date timestamp not null COMMENT '서비스 종료 시간(서비스 종료 시간)'
 ,result_path varchar(200) not null COMMENT '서비스 실행 결과 위치',
 PRIMARY KEY (execute_date, transaction_id)
);



CREATE TABLE IF NOT EXISTS EI.SERVICE_GROUP (
 creation_date timestamp not null DEFAULT CURRENT_TIMESTAMP COMMENT '생성일'
 ,service_group_name varchar(50) not null COMMENT '서비스 그룹 이름'
 ,description varchar(500) COMMENT 'description'
);


CREATE TABLE IF NOT EXISTS EI.REST_EXEC_HISTORY (
 execute_date timestamp not null DEFAULT CURRENT_TIMESTAMP COMMENT '실행일시'
 ,user_id varchar(20) not null COMMENT '실행 유저 id'
 ,server_name varchar(20) COMMENT '서버 이름(Scale In/Out시 서버 이름 그 외에는 공백)'
 ,action varchar(20) not null COMMENT '실행 내용(start, stop, status)'
 ,success TINYINT(1) not null DEFAULT FALSE COMMENT '성공 실패 여부(작업 성공 실패)'
 ,elapsed_time varchar(20) not null COMMENT '수행 시간(작성 수행에 소요된 시간)'
);


CREATE TABLE IF NOT EXISTS EI.COMMON_GROUP (
 group_code varchar(50) not null primary key COMMENT '그룹코드'
 ,group_name varchar(50) not null COMMENT '그룹코드명'
 ,use_yn varchar(1) not null DEFAULT 'Y' COMMENT '사용유무'
);


CREATE TABLE IF NOT EXISTS EI.COMMON_CODE (
 group_code varchar(50) not null COMMENT '그룹코드(common group의 그룹 코드)', foreign key(group_code) REFERENCES COMMON_GROUP(group_code) ON UPDATE CASCADE
 ,code varchar(50) not null COMMENT '코드'
 ,code_name varchar(100) not null COMMENT '코드명'
 ,value varchar(100) COMMENT '코드값'
 ,use_yn varchar(1) not null DEFAULT 'Y' COMMENT '사용유무'
 ,sort int(3) not null DEFAULT 1 COMMENT '순서'
);

CREATE TABLE IF NOT EXISTS EI.SEQUENCE (
 ID INT(11) not null COMMENT '그룹코드'
 ,REMARK varchar(50) COMMENT '비고(구분)(사용하는곳(model))'
);


CREATE TABLE IF NOT EXISTS EI.CPU_HISTORY (
 receive_date timestamp not null DEFAULT CURRENT_TIMESTAMP primary key COMMENT '수집일시(데이터 수집일시)'
 ,instance varchar(20) not null primary key COMMENT '서버 instance(NCP)(instance)'
 ,server_name varchar(20) not null COMMENT '서버 이름(서버 이름)'
 ,cpu_average float not null DEFAULT 0 COMMENT 'CPU 평균(CPU 평균)'
 ,cpu_unit varchar(20) not null DEFAULT 'Percent' COMMENT 'CPU 단위(CPU 평균값 단위)'
 ,primary key(receive_date, instance)
);

CREATE TABLE IF NOT EXISTS EI.CPU_HIST_SUMMARY (
 receive_date varchar(8) not null primary key COMMENT '수집일시(데이터 수집일시)'
 ,instance varchar(20) not null primary key COMMENT '서버 instance(NCP)(instance)'
 ,server_name varchar(20) not null COMMENT '서버 이름(서버 이름)'
 ,cpu_average float not null DEFAULT 0 COMMENT 'CPU 평균(CPU 평균)'
 ,cpu_unit varchar(20) not null DEFAULT 'Percent' COMMENT 'CPU 단위(CPU 평균값 단위)'
 ,primary key(receive_date, instance)
);

