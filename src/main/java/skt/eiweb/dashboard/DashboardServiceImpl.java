package skt.eiweb.dashboard;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import skt.eiweb.dashboard.mapper.DashboardMapper;
import skt.eiweb.dashboard.model.CpuHistory;
import skt.eiweb.dashboard.model.CpuHistoryDto;
import skt.eiweb.dashboard.model.DashboardScaleInOutDto7;
import skt.eiweb.dashboard.model.DashboardServiceDto;
import skt.eiweb.manager.ManagerService;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.dashboard
 * @Filename     : DashboardServiceImpl.java
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
@Service
public class DashboardServiceImpl implements DashboardService {

	@Autowired
	DashboardMapper dashboardMapper;

	@Autowired
	ManagerService managerService;

	@Override
	public List<DashboardServiceDto> getServiceExecSummForGroup() throws Exception {
		return dashboardMapper.selectDashboardServiceExecSummForGroup();
	}

	@Override
	public DashboardServiceDto getServiceExecStatus() throws Exception {
		DashboardServiceDto dto = new DashboardServiceDto();
		return this.getServiceExecStatus(dto);
	}

	@Override
	public DashboardServiceDto getServiceExecStatus(DashboardServiceDto dto) throws Exception {
		return dashboardMapper.selectDashboardServiceExecStatus(dto);
	}

	@Override
	public List<DashboardServiceDto> getServiceExecHistory() throws Exception {
		return dashboardMapper.selectDashboardServiceExecHistory();
	}

	@Override
	public List<DashboardServiceDto> getServiceExecStatusForToday() throws Exception {
		return dashboardMapper.selectDashboardServiceExecStatusForToday();
	}

	@Override
	public List<DashboardScaleInOutDto7> getScaleInOutSummary() throws Exception {
		return dashboardMapper.selectDashboardScaleInOutSummary();
	}

	@Override
	public int insCpuHistory() throws Exception {
		int ret = 0;
		List<HashMap<String, String>> list = managerService.realAllCpu();
		HashMap<String, String> item;
		CpuHistory cpuHistory;
		for (int i = 0; i < list.size(); i++) {
			item = list.get(i);
			cpuHistory = new CpuHistory();
			cpuHistory.setCpuAverage(item.get("cpu"));
			cpuHistory.setServerName(item.get("serverName"));
			cpuHistory.setInstance(item.get("instance"));
			ret += dashboardMapper.insertCpuHistory(cpuHistory);
		}
		return ret;
	}

	@Override
	public int insCpuHistSummary() throws Exception {
		dashboardMapper.insertCpuHistSummary();
		return 1;
	}

	@Override
	public List<HashMap<String, String>> getContainerInfo() throws Exception {
		return managerService.containerInfo();
	}

	@Override
	public List<CpuHistoryDto> getCpuAvgList() throws Exception {
		return dashboardMapper.selectCpuAvgList();
	}

	@Override
	public List<CpuHistoryDto> getCpuSummListForMonth() throws Exception {
		return dashboardMapper.selectCpuSummListForMonth();
	}

	@Override
	public List<CpuHistoryDto> getCpuSummListForDay() throws Exception {
		return dashboardMapper.selectCpuSummListForDay();
	}

	@Override
	public List<CpuHistoryDto> getCpuSummListForHour() throws Exception {
		return dashboardMapper.selectCpuSummListForHour();
	}

	@Override
	public List<CpuHistoryDto> getCpuAvgListForHour() throws Exception {
		return dashboardMapper.selectTodayCpuHour();
	}

	@Override
	public CpuHistoryDto getTodayCpuAvg() throws Exception {
		return dashboardMapper.selectTodayCpuAvg();
	}

}
