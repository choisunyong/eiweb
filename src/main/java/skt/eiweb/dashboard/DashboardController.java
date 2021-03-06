package skt.eiweb.dashboard;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.base.model.EIResponse;
import skt.eiweb.dashboard.model.CpuHistoryDto;
import skt.eiweb.dashboard.model.DashboardScaleInOutDto;
import skt.eiweb.dashboard.model.DashboardScaleInOutDto7;
import skt.eiweb.dashboard.model.DashboardServiceDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.dashboard
 * @Filename     : DashboardController.java
 * 
 * All rights reserved. No part of this work may be reproduced, stored in a
 * retrieval system, or transmitted by any means without prior written
 * permission of SKT corp.
 * 
 * Copyright(c) 2020 SKT corp. All rights reserved
 * =================================================================================
 *  No     DATE              Description
 * =================================================================================
 *  1.0	   2020. 9. 29.      Initial Coding & Update
 * =================================================================================
 */
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/dashboard")
@SuppressWarnings({
	"rawtypes", "unchecked", "unused"
})
public class DashboardController {

	@Autowired
	DashboardService dashboardService;

	/**
	 * 대시보드 리소스 데이터 조회
	 */
	@PostMapping("/dashboardResourceData")
	public EIResponse dashboardResourceData(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		HashMap data = new HashMap();

		long startOrigin = System.currentTimeMillis();
		try {
			// scale in/out 최근 일주일
			//data.put("scaleInOutSummary", dashboardService.getScaleInOutSummary());
			long start = System.currentTimeMillis();
			data.put("scaleInOutSummary", getScaleInOutInfo(dashboardService.getScaleInOutSummary()));
			// System.out.println("########## scaleInOutSummary elapsed [" + (System.currentTimeMillis() - start) + "]");

			// container 현황 (연동)
			try {
				start = System.currentTimeMillis();
				data.put("containerInfo", dashboardService.getContainerInfo());
				// System.out.println("########## containerInfo elapsed [" + (System.currentTimeMillis() - start) + "]");
			} catch (Exception e) {
				data.put("containerInfo", new ArrayList<HashMap<String, String>>());
				e.printStackTrace();
			}

			// 최근 cpu 데이터
			start = System.currentTimeMillis();
			data.put("cpuAvgList", dashboardService.getCpuAvgList());
			// System.out.println("########## cpuAvgList elapsed [" + (System.currentTimeMillis() - start) + "]");

			// cpu 금일 시간대별/일자별/월별 현황
			// CpuHistoryDto cpuHistoryDto;
			HashMap<String, HashMap> recvDateTmpMap = new HashMap();
			HashMap<String, String> recvDateServerCpuAvgDetailMap;
			String serverNames = "";

			// cpu 일자별 현황
			start = System.currentTimeMillis();
			// List<CpuHistoryDto> cpuHistoryDtoList = dashboardService.getCpuSummListForDay();
			List<CpuHistoryDto> cpuHistoryDtoList = makeCpuSumListInfo(dashboardService.getCpuSummListForDay());
			// System.out.println("########## cpuHistoryDtoList elapsed [" + (System.currentTimeMillis() - start) + "]");
			List<String> recvDateArrayList = new ArrayList<String>();
			List<HashMap> cpuHistoryArraryList = new ArrayList<HashMap>();

			start = System.currentTimeMillis();
			for (CpuHistoryDto cpuHistoryDto : cpuHistoryDtoList) {
				if (recvDateTmpMap.get(cpuHistoryDto.getReceiveDate()) == null) {
					recvDateServerCpuAvgDetailMap = new HashMap();
					recvDateServerCpuAvgDetailMap.put("receiveDate", cpuHistoryDto.getReceiveDate());
					recvDateServerCpuAvgDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
					recvDateTmpMap.put(cpuHistoryDto.getReceiveDate(), recvDateServerCpuAvgDetailMap);
					recvDateArrayList.add(cpuHistoryDto.getReceiveDate());
					if (serverNames.indexOf(cpuHistoryDto.getServerName()) == -1) {
						if (serverNames.length() > 0) {
							serverNames += ",";
						}
						serverNames += cpuHistoryDto.getServerName();
					}
				} else {
					recvDateServerCpuAvgDetailMap = recvDateTmpMap.get(cpuHistoryDto.getReceiveDate());
					recvDateServerCpuAvgDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
					if (serverNames.indexOf(cpuHistoryDto.getServerName()) == -1) {
						if (serverNames.length() > 0) {
							serverNames += ",";
						}
						serverNames += cpuHistoryDto.getServerName();
					}
				}
			}

			for (int j = 0; j < recvDateArrayList.size(); j++) {
				recvDateServerCpuAvgDetailMap = recvDateTmpMap.get(recvDateArrayList.get(j));
				cpuHistoryArraryList.add(recvDateServerCpuAvgDetailMap);
			}
			data.put("serverNames", serverNames.split(","));
			data.put("cpuSummListForDay", cpuHistoryArraryList);
			// System.out.println("########## cpuSummListForDay elapsed [" + (System.currentTimeMillis() - start) + "]");

			// cpu 월별 현황
			start = System.currentTimeMillis();
			// cpuHistoryDtoList = (dashboardService.getCpuSummListForMonth();
			cpuHistoryDtoList = makeCpuSumListInfo(dashboardService.getCpuSummListForMonth());
			// System.out.println("########## getCpuSummListForMonth elapsed [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			recvDateArrayList = new ArrayList<String>();
			cpuHistoryArraryList = new ArrayList<HashMap>();

			for (CpuHistoryDto cpuHistoryDto : cpuHistoryDtoList) {
				if (recvDateTmpMap.get(cpuHistoryDto.getReceiveDate()) == null) {
					recvDateServerCpuAvgDetailMap = new HashMap();
					recvDateServerCpuAvgDetailMap.put("receiveDate", cpuHistoryDto.getReceiveDate());
					recvDateServerCpuAvgDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
					recvDateTmpMap.put(cpuHistoryDto.getReceiveDate(), recvDateServerCpuAvgDetailMap);
					recvDateArrayList.add(cpuHistoryDto.getReceiveDate());
				} else {
					recvDateServerCpuAvgDetailMap = recvDateTmpMap.get(cpuHistoryDto.getReceiveDate());
					recvDateServerCpuAvgDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
				}
			}

			for (int j = 0; j < recvDateArrayList.size(); j++) {
				recvDateServerCpuAvgDetailMap = recvDateTmpMap.get(recvDateArrayList.get(j));
				cpuHistoryArraryList.add(recvDateServerCpuAvgDetailMap);
			}
			data.put("cpuSummListForMonth", cpuHistoryArraryList);
			// System.out.println("########## cpuSummListForMonth elapsed [" + (System.currentTimeMillis() - start) + "]");

			// 금일 cpu 시간대별 현황
			start = System.currentTimeMillis();
			// cpuHistoryDtoList = dashboardService.getCpuSummListForHour();
			cpuHistoryDtoList = makeCpuSumListInfo(dashboardService.getCpuSummListForHour());
			// System.out.println("########## getCpuSummListForHour elapsed [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			recvDateArrayList = new ArrayList<String>();
			cpuHistoryArraryList = new ArrayList<HashMap>();

			for (CpuHistoryDto cpuHistoryDto : cpuHistoryDtoList) {
				if (recvDateTmpMap.get(cpuHistoryDto.getReceiveDate()) == null) {
					recvDateServerCpuAvgDetailMap = new HashMap();
					recvDateServerCpuAvgDetailMap.put("receiveDate", cpuHistoryDto.getReceiveDate());
					recvDateServerCpuAvgDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
					recvDateTmpMap.put(cpuHistoryDto.getReceiveDate(), recvDateServerCpuAvgDetailMap);
					recvDateArrayList.add(cpuHistoryDto.getReceiveDate());
				} else {
					recvDateServerCpuAvgDetailMap = recvDateTmpMap.get(cpuHistoryDto.getReceiveDate());
					recvDateServerCpuAvgDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
				}
			}

			for (int j = 0; j < recvDateArrayList.size(); j++) {
				recvDateServerCpuAvgDetailMap = recvDateTmpMap.get(recvDateArrayList.get(j));
				cpuHistoryArraryList.add(recvDateServerCpuAvgDetailMap);
			}
			data.put("cpuSummListForHour", cpuHistoryArraryList);
			// System.out.println("########## cpuSummListForHour elapsed [" + (System.currentTimeMillis() - start) + "]");

			// 금일 시간대별 cpu 평균
			start = System.currentTimeMillis();
			cpuHistoryDtoList = dashboardService.getCpuAvgListForHour();
			// System.out.println("########## getCpuAvgListForHour elapsed [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			recvDateArrayList = new ArrayList<String>();
			cpuHistoryArraryList = new ArrayList<HashMap>();

			for (CpuHistoryDto cpuHistoryDto : cpuHistoryDtoList) {
			// for (int i = 0; i < cpuHistoryDtoList.size(); i++) {
			// 	cpuHistoryDto = cpuHistoryDtoList.get(i);
				if (recvDateTmpMap.get(cpuHistoryDto.getHour().toString()) == null) {
					recvDateServerCpuAvgDetailMap = new HashMap();
					recvDateServerCpuAvgDetailMap.put("hour", cpuHistoryDto.getHour().toString());
					recvDateServerCpuAvgDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
					recvDateTmpMap.put(cpuHistoryDto.getHour().toString(), recvDateServerCpuAvgDetailMap);
					recvDateArrayList.add(cpuHistoryDto.getHour().toString());
				} else {
					recvDateServerCpuAvgDetailMap = recvDateTmpMap.get(cpuHistoryDto.getHour().toString());
					recvDateServerCpuAvgDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
				}
			}
			
			for (int j = 0; j < recvDateArrayList.size(); j++) {
				recvDateServerCpuAvgDetailMap = recvDateTmpMap.get(recvDateArrayList.get(j));
				cpuHistoryArraryList.add(recvDateServerCpuAvgDetailMap);
			}
			data.put("cpuAvgListForHour", cpuHistoryArraryList);
			// System.out.println("########## cpuAvgListForHour elapsed [" + (System.currentTimeMillis() - start) + "]");

			// 금일 현재 cpu 평균
			start = System.currentTimeMillis();
			CpuHistoryDto todayCpuAvg = dashboardService.getTodayCpuAvg();
			// System.out.println("########## getTodayCpuAvg elapsed [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			if (todayCpuAvg == null) {
				todayCpuAvg = new CpuHistoryDto();
				todayCpuAvg.setCpuAverage("0");
			}
			data.put("todayCpuAvg", todayCpuAvg);
			// System.out.println("########## todayCpuAvg elapsed [" + (System.currentTimeMillis() - start) + "]");

			res.setResult(EIResponse.SUCCESS);
			res.setData(data);
		} catch (Exception e) {
			// System.out.println("########## 대시보드 리소스 데이터 가져오기 실패");
			res.setResult(EIResponse.FAIL);
			res.setMessage("대시보드 리소스 데이터 가져오기 실패");
			e.printStackTrace();
		}

		// System.out.println("########## dashboardResourceData elapsed [" + (System.currentTimeMillis() - startOrigin) + "]");
		return res;
	}

	/**
	 * Scale In/Out 데이터를 받고 올바른 형태로 가공
	 */
	public List<DashboardScaleInOutDto> getScaleInOutInfo(List<DashboardScaleInOutDto7> data7) throws Exception {
		List<DashboardScaleInOutDto> data = new ArrayList<>();

		for (DashboardScaleInOutDto7 tempData : data7) {
			DashboardScaleInOutDto temp = new DashboardScaleInOutDto();
			temp.setServerRole(tempData.getServerRole());
			temp.setV1(tempData.getV1());
			temp.setV2(tempData.getV2());
			temp.setV3(tempData.getV3());
			temp.setV4(tempData.getV4());
			temp.setV5(tempData.getV5());
			temp.setV6(tempData.getV6());
			temp.setV7(tempData.getV7());

			if (temp.getV1() == null && tempData.getV0() != null) {
				if (!"0".equals(tempData.getV0())) {
					temp.setV1(tempData.getV0());
				}
			}
			if (temp.getV2() == null && temp.getV1() != null && temp.getV1().equals("1")) {
				temp.setV2(temp.getV1());
			}
			if (temp.getV3() == null && temp.getV2() != null && temp.getV2().equals("1")) {
				temp.setV3(temp.getV2());
			}
			if (temp.getV4() == null && temp.getV3() != null && temp.getV3().equals("1")) {
				temp.setV4(temp.getV3());
			}
			if (temp.getV5() == null && temp.getV4() != null && temp.getV4().equals("1")) {
				temp.setV5(temp.getV4());
			}
			if (temp.getV6() == null && temp.getV5() != null && temp.getV5().equals("1")) {
				temp.setV6(temp.getV5());
			}
			if (temp.getV7() == null && temp.getV6() != null && temp.getV6().equals("1")) {
				temp.setV7(temp.getV6());
			}
			data.add(temp);
		}
		return data;
	}

	/**
	 * cpu data sum 처리
	 * @param cpuHistoryDtoList
	 * @throws Exception
	 */
	public List<CpuHistoryDto> makeCpuSumListInfo(List<CpuHistoryDto> datas) throws Exception {
		List<CpuHistoryDto> finalData = new ArrayList<>();
		List<CpuHistoryDto> addData = new ArrayList<>();

		finalData.addAll(datas);

		String recieveTime = "";
		CpuHistoryDto temp = null;

		for (CpuHistoryDto data : datas) {
			String tempTime = "";
			
			if (data.getReceiveDate() != null) {
				tempTime = data.getReceiveDate();
			} else {
				tempTime = data.getHour();
			}

			if (temp != null && recieveTime.equals(tempTime)) {
				Float tempAvg = Float.parseFloat(temp.getCpuAverage()) + Float.parseFloat(data.getCpuAverage());
				temp.setCpuAverage( String.format("%.2f", tempAvg) );
			} else {
				if (temp != null) {
					addData.add(temp);
				}
				if (data.getReceiveDate() != null) {
					recieveTime = data.getReceiveDate();
				} else {
					recieveTime = data.getHour();
				}
				temp = new CpuHistoryDto();
				temp.setHour(data.getHour());
				temp.setCpuAverage(data.getCpuAverage());
				temp.setCpuUnit(data.getCpuUnit());
				temp.setInstance("total");
				temp.setReceiveDate(data.getReceiveDate());
				temp.setServerName("Total");
			}
		}
		if (temp != null) {
			addData.add(temp);
		}

		finalData.addAll(addData);

		return finalData;
	}

	/**
	 * 대시보드 서비스 데이터 조회
	 */
	@PostMapping("/dashboardServiceData")
	public EIResponse dashboardServiceData(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		HashMap data = new HashMap();

		long startOrigin = System.currentTimeMillis();
		try {
			
			long start = System.currentTimeMillis();
			DashboardServiceDto dashboardServiceDto = null;
			HashMap<String, HashMap> hourTmpMap = new HashMap();
			HashMap<String, String> hourServiceGroupCountDetailMap;

			// 금일 그룹별, 시간대별 서비스 실행 현황
			List<DashboardServiceDto> dashboardServiceDtoList = dashboardService.getServiceExecStatusForToday();
			// System.out.println("########## getServiceExecStatusForToday elapsed [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			List<String> hourArrayList = new ArrayList<String>();
			List<HashMap> dashboardServiceArrayList = new ArrayList<HashMap>();

			for (int i = 0; i < dashboardServiceDtoList.size(); i++) {
				dashboardServiceDto = dashboardServiceDtoList.get(i);
				if (hourTmpMap.get(dashboardServiceDto.getHour().toString()) == null) {
					hourServiceGroupCountDetailMap = new HashMap();
					hourServiceGroupCountDetailMap.put("hour", dashboardServiceDto.getHour().toString());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName(), dashboardServiceDto.getExecCount());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName() + "_success", dashboardServiceDto.getSuccess());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName() + "_fail", dashboardServiceDto.getFail());
					hourTmpMap.put(dashboardServiceDto.getHour().toString(), hourServiceGroupCountDetailMap);
					hourArrayList.add(dashboardServiceDto.getHour().toString());
				} else {
					hourServiceGroupCountDetailMap = hourTmpMap.get(dashboardServiceDto.getHour().toString());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName(), dashboardServiceDto.getExecCount());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName() + "_success", dashboardServiceDto.getSuccess());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName() + "_fail", dashboardServiceDto.getFail());
				}
			}

			for (int j = 0; j < hourArrayList.size(); j++) {
				hourServiceGroupCountDetailMap = hourTmpMap.get(hourArrayList.get(j));
				dashboardServiceArrayList.add(hourServiceGroupCountDetailMap);
			}
			data.put("serviceExecStatusForToday", dashboardServiceArrayList);
			// System.out.println("########## serviceExecStatusForToday elapsed [" + (System.currentTimeMillis() - start) + "]");

			// 금일 서비스 실행 이력 리스트
			start = System.currentTimeMillis();
			data.put("serviceExecHistory", dashboardService.getServiceExecHistory());
			// System.out.println("########## serviceExecHistory elapsed [" + (System.currentTimeMillis() - start) + "]");

			// 금일 서비스 실행 현황
			start = System.currentTimeMillis();
			dashboardServiceDto = new DashboardServiceDto();
			dashboardServiceDto.setIsToday("Y");
			data.put("serviceTodayExecSummForGroup", dashboardService.getServiceExecStatus(dashboardServiceDto));
			// System.out.println("########## serviceTodayExecSummForGroup elapsed [" + (System.currentTimeMillis() - start) + "]");

			// 전체 서비스 실행 현황
			start = System.currentTimeMillis();
			data.put("serviceTotalExecSummForGroup", dashboardService.getServiceExecStatus());
			// System.out.println("########## serviceTotalExecSummForGroup elapsed [" + (System.currentTimeMillis() - start) + "]");

			// 그룹별 서비스 실행 현황 리스트
			start = System.currentTimeMillis();
			data.put("serviceExecSummListForGroup", dashboardService.getServiceExecSummForGroup());
			// System.out.println("########## serviceExecSummListForGroup elapsed [" + (System.currentTimeMillis() - start) + "]");

			res.setResult(EIResponse.SUCCESS);
			res.setData(data);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("대시보드 서비스 데이터 가져오기 실패 Main");
			e.printStackTrace();
		}

		// System.out.println("########## dashboardServiceData elapsed [" + (System.currentTimeMillis() - startOrigin) + "]");
		return res;
	}

	/**
	 * 대시보드 실시간 데이터 조회 (3초 마다)
	 */
	@PostMapping("/dashboardRealData")
	public EIResponse dashboardRealData(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		HashMap data = new HashMap();

		try {
			// container 현황 (연동)
			try {
				data.put("containerInfo", dashboardService.getContainerInfo());
			} catch (Exception e) {
				data.put("containerInfo", new ArrayList<HashMap<String, String>>());
				e.printStackTrace();
			}

			// 최근 cpu 데이터
			data.put("cpuAvgList", dashboardService.getCpuAvgList());

			// 금일 현재 cpu 평균
			CpuHistoryDto todayCpuAvg = dashboardService.getTodayCpuAvg();
			if (todayCpuAvg == null) {
				todayCpuAvg = new CpuHistoryDto();
				todayCpuAvg.setCpuAverage("0");
			}
			data.put("todayCpuAvg", todayCpuAvg);

			res.setResult(EIResponse.SUCCESS);
			res.setData(data);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("대시보드 실시간 데이터 가져오기 실패 3sec");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 대시보드 실시간 데이터 조회 (30초 마다)
	 */
	@PostMapping("/dashboardRealData2")
	public EIResponse dashboardRealData2(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		HashMap data = new HashMap();

		long startOrign = System.currentTimeMillis();
		long start = System.currentTimeMillis();
		try {
			DashboardServiceDto dashboardServiceDto = null;
			HashMap<String, HashMap> hourTmpMap = new HashMap();
			HashMap<String, String> hourServiceGroupCountDetailMap;

			// 금일 시간대별 서비스 실행 현황
			List<DashboardServiceDto> dashboardServiceDtoList = dashboardService.getServiceExecStatusForToday();
			// System.out.println("########## getServiceExecStatusForToday elapsed2 [" + (System.currentTimeMillis() - start) + "]");
			start = System.currentTimeMillis();
			List<String> hourArrayList = new ArrayList<String>();
			List<HashMap> dashboardServiceArrayList = new ArrayList<HashMap>();

			for (int i = 0; i < dashboardServiceDtoList.size(); i++) {
				dashboardServiceDto = dashboardServiceDtoList.get(i);
				if (hourTmpMap.get(dashboardServiceDto.getHour().toString()) == null) {
					hourServiceGroupCountDetailMap = new HashMap();
					hourServiceGroupCountDetailMap.put("hour", dashboardServiceDto.getHour().toString());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName(), dashboardServiceDto.getExecCount());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName() + "_success", dashboardServiceDto.getSuccess());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName() + "_fail", dashboardServiceDto.getFail());
					hourTmpMap.put(dashboardServiceDto.getHour().toString(), hourServiceGroupCountDetailMap);
					hourArrayList.add(dashboardServiceDto.getHour().toString());
				} else {
					hourServiceGroupCountDetailMap = hourTmpMap.get(dashboardServiceDto.getHour().toString());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName(), dashboardServiceDto.getExecCount());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName() + "_success", dashboardServiceDto.getSuccess());
					hourServiceGroupCountDetailMap.put(dashboardServiceDto.getServiceGroupName() + "_fail", dashboardServiceDto.getFail());
				}
			}

			for (int j = 0; j < hourArrayList.size(); j++) {
				hourServiceGroupCountDetailMap = hourTmpMap.get(hourArrayList.get(j));
				dashboardServiceArrayList.add(hourServiceGroupCountDetailMap);
			}
			data.put("serviceExecStatusForToday", dashboardServiceArrayList);
			// System.out.println("########## serviceExecStatusForToday elapsed2 [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			// 금일 cpu 시간대별 현황
			// CpuHistoryDto cpuHistoryDto = null;
			// List<CpuHistoryDto> cpuHistoryDtoList = dashboardService.getCpuSummListForHour();
			List<CpuHistoryDto> cpuHistoryDtoList = makeCpuSumListInfo(dashboardService.getCpuSummListForHour());
			List<String> hourArrayList2 = new ArrayList<String>();
			dashboardServiceArrayList = new ArrayList<HashMap>();
			hourTmpMap = new HashMap();
			
			for (CpuHistoryDto cpuHistoryDto : cpuHistoryDtoList) {
			// for (int i = 0; i < cpuHistoryDtoList.size(); i++) {
			// 	cpuHistoryDto = cpuHistoryDtoList.get(i);
				if (hourTmpMap.get(cpuHistoryDto.getReceiveDate()) == null) {
					hourServiceGroupCountDetailMap = new HashMap();
					hourServiceGroupCountDetailMap.put("receiveDate", cpuHistoryDto.getReceiveDate());

					hourServiceGroupCountDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
					hourTmpMap.put(cpuHistoryDto.getReceiveDate(), hourServiceGroupCountDetailMap);
					hourArrayList.add(cpuHistoryDto.getReceiveDate());
					hourArrayList2.add(cpuHistoryDto.getReceiveDate());
				} else {
					hourServiceGroupCountDetailMap = hourTmpMap.get(cpuHistoryDto.getReceiveDate());
					hourServiceGroupCountDetailMap.put(cpuHistoryDto.getServerName(), cpuHistoryDto.getCpuAverage());
				}
			}

			for (int j = 0; j < hourArrayList2.size(); j++) {
				hourServiceGroupCountDetailMap = hourTmpMap.get(hourArrayList2.get(j));
				dashboardServiceArrayList.add(hourServiceGroupCountDetailMap);
			}
			data.put("cpuSummListForHour", dashboardServiceArrayList);
			// System.out.println("########## cpuSummListForHour elapsed2 [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			// scale in/out 최근 일주일;
			data.put("scaleInOutSummary", getScaleInOutInfo(dashboardService.getScaleInOutSummary()));
			// System.out.println("########## scaleInOutSummary elapsed2 [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			// 금일 서비스 실행 이력 리스트
			data.put("serviceExecHistory", dashboardService.getServiceExecHistory());
			// System.out.println("########## serviceExecHistory elapsed2 [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			// 금일 서비스 실행 현황
			dashboardServiceDto = new DashboardServiceDto();
			dashboardServiceDto.setIsToday("Y");
			data.put("serviceTodayExecSummForGroup", dashboardService.getServiceExecStatus(dashboardServiceDto));
			// System.out.println("########## serviceTodayExecSummForGroup elapsed2 [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			// 전체 서비스 실행 현황
			data.put("serviceTotalExecSummForGroup", dashboardService.getServiceExecStatus());
			// System.out.println("########## serviceTotalExecSummForGroup elapsed2 [" + (System.currentTimeMillis() - start) + "]");

			start = System.currentTimeMillis();
			// 그룹별 서비스 실행 현황 리스트
			data.put("serviceExecSummListForGroup", dashboardService.getServiceExecSummForGroup());
			// System.out.println("########## serviceExecSummListForGroup elapsed2 [" + (System.currentTimeMillis() - start) + "]");

			res.setResult(EIResponse.SUCCESS);
			res.setData(data);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("대시보드 실시간 데이터 가져오기 실패 30sec");
			e.printStackTrace();
		}

		return res;
	}

}
