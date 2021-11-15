package skt.eiweb.dashboard;

import java.util.HashMap;
import java.util.List;

import skt.eiweb.dashboard.model.CpuHistoryDto;
import skt.eiweb.dashboard.model.DashboardScaleInOutDto7;
import skt.eiweb.dashboard.model.DashboardServiceDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.dashboard
 * @Filename     : DashboardService.java
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
public interface DashboardService {

	public List<DashboardServiceDto> getServiceExecSummForGroup() throws Exception;

	public DashboardServiceDto getServiceExecStatus() throws Exception;

	public DashboardServiceDto getServiceExecStatus(DashboardServiceDto dto) throws Exception;

	public List<DashboardServiceDto> getServiceExecHistory() throws Exception;

	public List<DashboardServiceDto> getServiceExecStatusForToday() throws Exception;

	public List<DashboardScaleInOutDto7> getScaleInOutSummary() throws Exception;

	public int insCpuHistory() throws Exception;

	public int insCpuHistSummary() throws Exception;

	public List<HashMap<String, String>> getContainerInfo() throws Exception;

	public List<CpuHistoryDto> getCpuAvgList() throws Exception;

	public List<CpuHistoryDto> getCpuSummListForMonth() throws Exception;

	public List<CpuHistoryDto> getCpuSummListForDay() throws Exception;

	public List<CpuHistoryDto> getCpuSummListForHour() throws Exception;

	public List<CpuHistoryDto> getCpuAvgListForHour() throws Exception;

	public CpuHistoryDto getTodayCpuAvg() throws Exception;

}
