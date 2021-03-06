package skt.eiweb.service;

import java.io.BufferedReader;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import skt.eiweb.admin.mapper.AdminMapper;
import skt.eiweb.base.EIProperties;
import skt.eiweb.code.CommonCodeService;
import skt.eiweb.code.model.CommonCodeDto;
import skt.eiweb.service.airflowMapper.AirflowMapper;
import skt.eiweb.service.mapper.ServiceMapper;
import skt.eiweb.service.model.DagRun;
import skt.eiweb.service.model.ServiceCreHistory;
import skt.eiweb.service.model.ServiceCreHistoryDto;
import skt.eiweb.service.model.ServiceDto;
import skt.eiweb.service.model.ServiceExecHistory;
import skt.eiweb.service.model.ServiceExecHistoryDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.service
 * @Filename     : ServiceServiceImpl.java
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
public class ServiceServiceImpl implements ServiceService {

	private static final Logger logger = LogManager.getLogger(ServiceServiceImpl.class);

	@Autowired
	private ServiceMapper mapper;

	@Autowired
	private AdminMapper adminMapper;

	@Autowired
	private AirflowMapper airflowMapper;

	@Autowired
	private EIProperties props;

	@Autowired
	private CommonCodeService commonCodeService;

	/**
	 * Service ?????????
	 */
	@Override
	public List<ServiceDto> getList(ServiceDto service) throws Exception {
		List<ServiceDto> list = mapper.selectService(service);
		ServiceDto dto;
		DagRun dagRun;

		for (int i = 0; i < list.size(); i++) {
			dto = list.get(i);
			dagRun = new DagRun();
			dagRun.setDagId(dto.getDagId());
			dagRun = airflowMapper.selectDagState(dagRun);

			if (dagRun != null) {
				dto.setState(dagRun.getState());
				dto.setStartDate(dagRun.getStartDate());
				dto.setEndDate(dagRun.getEndDate());
				dto.setElapsed(dagRun.getElapsed());
			}
		}

		return list;
	}

	/**
	 * ????????? ?????? ??????
	 */
	@Override
	public HashMap<String, Integer> getTotalStatus(ServiceDto service) throws Exception {
		List<ServiceDto> list = mapper.selectServiceAll(service);
		ServiceDto dto;
		DagRun dagRun;
		HashMap<String, Integer> ret = new HashMap<String, Integer>();
		ret.put("total", list.size());

		for (int i = 0; i < list.size(); i++) {
			dto = list.get(i);
			dagRun = new DagRun();
			dagRun.setDagId(dto.getDagId());
			dagRun = airflowMapper.selectDagState(dagRun);
			String key = "";

			if (dagRun != null) {
				if ("running".equals(dagRun.getState())) {
					if (ret.get(dagRun.getState()) == null) {
						ret.put(dagRun.getState(), 1);
					} else {
						ret.put(dagRun.getState(), ret.get(dagRun.getState()) + 1);
					}
				} else if (dto.getRunCycle() == null || "None".toLowerCase().equals(dto.getRunCycle().toLowerCase()) || "".toLowerCase().equals(dto.getRunCycle().toLowerCase())) {
					key = "unscheduled";
					if (ret.get(key) == null) {
						ret.put(key, 1);
					} else {
						ret.put(key, ret.get(key) + 1);
					}
				} else {
					key = "standby";
					// @dayly...
					if (ret.get(key) == null) {
						ret.put(key, 1);
					} else {
						ret.put(key, ret.get(key) + 1);
					}
				}
			} else {
				logger.info(dto);
				if (dto.getRunCycle() == null || "None".toLowerCase().equals(dto.getRunCycle().toLowerCase()) || "".toLowerCase().equals(dto.getRunCycle().toLowerCase())) {
					key = "unscheduled";
					if (ret.get(key) == null) {
						ret.put(key, 1);
					} else {
						ret.put(key, ret.get(key) + 1);
					}
				} else {
					key = "standby";
					// @dayly...
					if (ret.get(key) == null) {
						ret.put(key, 1);
					} else {
						ret.put(key, ret.get(key) + 1);
					}
				}
			}
		}

		return ret;
	}

	/**
	 * Service ????????? ?????? ?????????
	 */
	@Override
	public int getTotalCount(ServiceDto model) throws Exception {
		return mapper.selectServiceTotalCount(model);
	}

	/**
	 * Service ????????? ??????
	 */
	@Override
	public String makeNextServiceId() throws Exception {
		return mapper.makeNextServiceId();
	}

	/**
	 * Service ??????
	 */
	@Override
	public int createService(ServiceDto service) throws Exception {
		return mapper.insertService(service);
	}

	/**
	 * Service ??????
	 */
	@Override
	public int updateService(ServiceDto service) throws Exception {
		return mapper.updateService(service);
	}

	/**
	 * Service??? ?????? ??????
	 */
	@Override
	public int chkServiceName(ServiceDto service) throws Exception {
		return mapper.countServiceByServiceName(service);
	}

	/**
	 * DAG ID ?????? ??????
	 */
	@Override
	public int chkDagId(ServiceDto service) throws Exception {
		return mapper.countServiceByDagId(service);
	}

	/**
	 * Service ??????
	 */
	@Override
	public ServiceDto getServiceInfo(String serviceId) throws Exception {
		ServiceDto sv = new ServiceDto();
		sv.setServiceId(serviceId);
		List<ServiceDto> list = mapper.selectService(sv);
		ServiceDto ret = null;
		if (list.size() > 0) {
			ret = list.get(0);
		}

		return ret;
	}

	/**
	 * Service ??????
	 */
	@Override
	public int deleteService(String serviceId) throws Exception {
		ServiceDto sv = new ServiceDto();
		sv.setServiceId(serviceId);
		return mapper.deleteService(sv);
	}

	/**
	 * Service ?????? ?????? ??????
	 */
	@Override
	public int insertServiceCreHistory(String serviceId) throws Exception {
		ServiceDto service = new ServiceDto();
		service.setServiceId(serviceId);
		return mapper.insertServiceCreHistory(service);
	}

	/**
	 * DAG ?????? ??????
	 */
	@Override
	public int createDag(ServiceDto service) throws Exception {
		int ret = 0;
		String content = "";
		CommonCodeDto dagCode = commonCodeService.getCode("DAG_TEMPLATE", "DAG_TEMPLATE_FILE");
		String filename = dagCode.getValue();
		// ?????? ??????
		Path p = Paths.get(props.getDagtmplpath() + "/" + filename);

		// ????????? ?????? ??????
		BufferedReader reader = Files.newBufferedReader(p, Charset.forName("UTF-8"));
		String currentLine = null;
		while ((currentLine = reader.readLine()) != null) {// while there is content on the current line
			// getUserId
			if (currentLine.indexOf("{userId}") > 0) {
				currentLine = currentLine.replaceAll("[$][{]userId[}]", service.getUserId() != null ? service.getUserId() : "?????????");
			}

			// DAG ID
			if (currentLine.indexOf("{dagId}") > 0) {
				currentLine = currentLine.replaceAll("[$][{]dagId[}]", service.getDagId() != null ? service.getDagId() : "DAG ID");
			}

			// runCycle : None, @once, @hourly, @daily, @weekly, @monthly, @yearly
			// String airflowFixCycle = "None, @once, @hourly, @daily, @weekly, @monthly, @yearly";
			if (currentLine.indexOf("{runCycle}") > 0) {
				if ("None".indexOf(service.getRunCycle()) > -1) {
					currentLine = currentLine.replaceAll("[$][{]runCycle[}]", service.getRunCycle() != null ? service.getRunCycle() : "None");
				} else {
					currentLine = currentLine.replaceAll("[$][{]runCycle[}]", service.getRunCycle() != null ? "'" + service.getRunCycle() + "'" : "None");
				}
			} else {
				currentLine = currentLine.replaceAll("[$][{]runCycle[}]", "None");
			}
			content += currentLine + "\r\n";
		}

		// write file
		Path path = Paths.get(props.getDagspath() + "/" + service.getDagId() + ".py");
		if (Files.exists(path)) {
			Files.delete(path);
		}
		Files.write(path, content.getBytes());

		return ret;
	}

	/**
	 * DAG ?????? ??????
	 */
	@Override
	public int deleteDag(String serviceId) throws Exception {
		int ret = 0;
		Path p = Paths.get(props.getDagspath() + "/" + serviceId + ".py");

		if (Files.exists(p)) {
			Files.delete(p);
		}

		return ret;
	}

	/**
	 * Service ?????? ??????
	 */
	@Override
	public ServiceCreHistoryDto getServiceHistInfo(String serviceId) throws Exception {
		ServiceCreHistory sv = new ServiceCreHistory();
		sv.setServiceId(serviceId);
		List<ServiceCreHistoryDto> list = adminMapper.selectServiceCreHistory(sv);
		ServiceCreHistoryDto ret = null;

		if (list.size() > 0) {
			ret = list.get(0);
		}

		return ret;
	}

	/**
	 * Service ?????? ??????
	 */
	@Override
	public HashMap<String, Integer> getTotalHistStatus(ServiceExecHistory serviceExecHistory) throws Exception {
		ServiceExecHistoryDto dto = mapper.selectServiceExecHistoryStatus(serviceExecHistory);
		HashMap<String, Integer> ret = new HashMap<String, Integer>();
		ret.put("success", dto.getSuccess());
		ret.put("warning", dto.getWarning());

		return ret;
	}

}
