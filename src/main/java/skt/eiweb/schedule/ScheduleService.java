package skt.eiweb.schedule;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Profile;
import org.springframework.scheduling.annotation.EnableScheduling;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import skt.eiweb.dashboard.DashboardService;
import skt.eiweb.file.FileService;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.schedule
 * @Filename     : ScheduleService.java
 * 
 * All rights reserved. No part of this work may be reproduced, stored in a
 * retrieval system, or transmitted by any means without prior written
 * permission of SKT corp.
 * 
 * Copyright(c) 2020 SKT corp. All rights reserved
 * =================================================================================
 *  No     DATE              Description
 * =================================================================================
 *  1.0	   2020. 9. 28.      Initial Coding & Update
 * =================================================================================
 */
@EnableScheduling
@Component
@Profile({
	// "dev",
	"default",
	"local"
})
public class ScheduleService {

	@Autowired
	FileService fileService;

	@Autowired
	DashboardService dashboardService;

	// 초 분 시간 일 월 주 년도
	// 초 : 0~59 , - * /
	// 분 : 0-59 , - * /
	// 시간 : 0~23 , - * /
	// 일 : 1~31 , - * / ? L W
	// 월 : 1~12/JAN~DEC , - * /
	// 주 : 0~6/SUN~SAT , - * / ? L #
	// 연도 : empty/1970~2099 , - * /

	// * : 모든 값
	// ? : 특정 값 없음
	// - : 범위 0-4 : 0부터 4까지 실행
	// , : 특별한 값 설정 (ex) 1, 3, 7 : 1과 3과 7일 때만 실행
	// / : 시작시간/단위 (ex) 0/5 : 0부터 시작해서 5 단위로 실행
	// L : 일에서 사용하면 마지막 일, 요일에서 사용하면 마지막 요일(토요일)
	// W : 가장 가까운 평일 (ex)15W : 15에서 가장 가까운 평일(월~금)에 실행
	// # : 몇째주의 무슨 요일 (요일#주) (ex)3#2 : 2번째주 수요일

	/**
	 * 00시 매핑 되지 않은 모델 파일 삭제
	 */
	// @Scheduled(cron = "* * 0 * * ?")
	// public void removeNotMappingFiles() throws Exception {
	// 	fileService.removeNotMappingFiles();
	// }

	/**
	 * 3초 단위 cpu 사용율 저장 (연동)
	 */
	@Scheduled(cron = "*/3 * * * * ?")
	public void insCpuAvg() throws Exception {
		dashboardService.insCpuHistory();
	}

	/**
	 * 매일 하루에 한번 cpu 데이터 summary
	 */
	@Scheduled(cron = "0 0 0 * * ?")
	public void insCpuSummary() throws Exception {
		dashboardService.insCpuHistSummary();
	}

}
