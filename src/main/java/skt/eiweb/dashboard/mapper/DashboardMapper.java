package skt.eiweb.dashboard.mapper;

import java.util.List;

import skt.eiweb.dashboard.model.CpuHistory;
import skt.eiweb.dashboard.model.CpuHistoryDto;
import skt.eiweb.dashboard.model.DashboardScaleInOutDto7;
import skt.eiweb.dashboard.model.DashboardServiceDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.dashboard.mapper
 * @Filename     : DashboardMapper.java
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
public interface DashboardMapper {

	public List<DashboardServiceDto> selectDashboardServiceExecSummForGroup() throws Exception;

	public DashboardServiceDto selectDashboardServiceExecStatus(DashboardServiceDto dto) throws Exception;

	public List<DashboardServiceDto> selectDashboardServiceExecHistory() throws Exception;

	public List<DashboardServiceDto> selectDashboardServiceExecStatusForToday() throws Exception;

	public List<DashboardScaleInOutDto7> selectDashboardScaleInOutSummary() throws Exception;

	public int insertCpuHistory(CpuHistory cpuHistory) throws Exception;

	public int insertCpuHistSummary() throws Exception;

	public List<CpuHistoryDto> selectTodayCpuHour() throws Exception;

	public CpuHistoryDto selectTodayCpuAvg() throws Exception;

	public List<CpuHistoryDto> selectCpuSummListForHour() throws Exception;

	public List<CpuHistoryDto> selectCpuSummListForDay() throws Exception;

	public List<CpuHistoryDto> selectCpuSummListForMonth() throws Exception;

	public List<CpuHistoryDto> selectCpuAvgList() throws Exception;

}
