package skt.eiweb.admin;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.admin.model.LoginHistoryDto;
import skt.eiweb.admin.model.RestExecHistory;
import skt.eiweb.admin.model.RestExecHistoryDto;
import skt.eiweb.admin.model.ScaleHistory;
import skt.eiweb.admin.model.ScaleHistoryDto;
import skt.eiweb.base.model.EIResponse;
import skt.eiweb.service.ServiceService;
import skt.eiweb.service.model.ServiceCreHistory;
import skt.eiweb.service.model.ServiceCreHistoryDto;
import skt.eiweb.service.model.ServiceExecHistory;
import skt.eiweb.service.model.ServiceExecHistoryDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.admin
 * @Filename     : AdminHistController.java
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
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/admin")
@SuppressWarnings({
	"rawtypes", "unchecked", "unused"
})
public class AdminHistController {

	@Autowired
	private AdminService adminService;

	@Autowired
	private ServiceService serviceService;

	/**
	 * ????????? ????????? ?????? ????????? ??????
	 */
	@PostMapping("/userLoginHistory")
	@Secured("ROLE_ADMIN")
	public EIResponse userLoginHistory(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		LoginHistoryDto loginHist = new LoginHistoryDto();

		if (parm.get("page") != null) {
			loginHist.setPage(Integer.parseInt(parm.get("page")));
		}
		if (parm.get("schKey") != null && !"".equals(parm.get("schKey"))) {
			loginHist.setSchKey(parm.get("schKey"));
		}
		if (parm.get("userPermission") != null && !"all".equals(parm.get("userPermission"))) {
			loginHist.setUserPermission(parm.get("userPermission"));
		}
		loginHist.setStartDate(parm.get("startDate"));
		loginHist.setEndDate(parm.get("endDate"));

		try {
			List<LoginHistoryDto> list = adminService.userLoginHistory(loginHist);
			HashMap data = new HashMap();
			data.put("totalCount", adminService.userLoginHistoryTotalCount(loginHist));
			data.put("page", loginHist.getPage());
			data.put("pageCount", loginHist.getPageCount());
			res.setResponse(EIResponse.SUCCESS, list, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ????????? ?????? ?????? ????????? ??????
	 */
	@PostMapping("/serviceCreHistory")
	@Secured("ROLE_ADMIN")
	public EIResponse serviceCreHistory(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ServiceCreHistory serviceCreHistory = new ServiceCreHistory();

		if (parm.get("page") != null) {
			serviceCreHistory.setPage(Integer.parseInt(parm.get("page")));
		}
		if (parm.get("schKey") != null) {
			serviceCreHistory.setSchKey(parm.get("schKey"));
		}

		try {
			List<ServiceCreHistoryDto> list = adminService.serviceCreHistory(serviceCreHistory);
			HashMap data = new HashMap();
			data.put("totalCount", adminService.serviceCreHistoryTotalCount(serviceCreHistory));
			data.put("page", serviceCreHistory.getPage());
			data.put("pageCount", serviceCreHistory.getPageCount());
			res.setResponse(EIResponse.SUCCESS, list, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ????????? ?????? ?????? ????????? ??????
	 */
	@PostMapping("/serviceExecHistory")
	@Secured({
		"ROLE_ADMIN", "ROLE_MODELER"
	})
	public EIResponse serviceExecHistory(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ServiceExecHistory serviceExecHistory = new ServiceExecHistory();

		if (parm.get("page") != null) {
			serviceExecHistory.setPage(Integer.parseInt(parm.get("page")));
		}
		if (parm.get("schKey") != null && !"".equals(parm.get("schKey"))) {
			serviceExecHistory.setSchKey(parm.get("schKey"));
		}
		if (parm.get("serviceGroupName") != null && !"all".equalsIgnoreCase(parm.get("serviceGroupName"))) {
			serviceExecHistory.setServiceGroupName(parm.get("serviceGroupName"));
		}
		if (parm.get("serviceStatus") != null && !"all".equals(parm.get("serviceStatus"))) {
			serviceExecHistory.setServiceStatus(parm.get("serviceStatus"));
		}
		if (parm.get("startDate") != null && !"".equals(parm.get("startDate"))) {
			serviceExecHistory.setStartDate(parm.get("startDate"));
		}
		if (parm.get("endDate") != null && !"".equals(parm.get("endDate"))) {
			serviceExecHistory.setEndDate(parm.get("endDate"));
		}


		try {
			List<ServiceExecHistoryDto> list = adminService.serviceExecHistory(serviceExecHistory);
			HashMap data = new HashMap();
			data.put("totalCount", adminService.serviceExecHistoryTotalCount(serviceExecHistory));
			data.put("page", serviceExecHistory.getPage());
			data.put("pageCount", serviceExecHistory.getPageCount());
			data.put("totalStatus", serviceService.getTotalHistStatus(serviceExecHistory));
			res.setResponse(EIResponse.SUCCESS, list, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ????????? ?????? ?????? ?????? ??????
	 */
	@Secured({
		"ROLE_ADMIN", "ROLE_MODELER"
	})
	@PostMapping("/serviceExecHistoryResult")
	public EIResponse serviceExecHistoryResult(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();

		try {
			ServiceExecHistory seh = new ServiceExecHistory();
			seh.setServiceId(parm.get("serviceId"));
			seh.setTransactionId(parm.get("transactionId"));
			HashMap<String, String> info = adminService.getServiceExecResult(seh);
			info.put("png", info.get("png"));
			info.put("html", info.get("html"));
			// info.put("csv", info.get("csv"));
			info.put("log", info.get("log"));
			
			res.setResponse(EIResponse.SUCCESS, null, info);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * REST ?????? ?????? ????????? ??????
	 */
	@PostMapping("/restExecHistory")
	@Secured("ROLE_ADMIN")
	public EIResponse restExecHistory(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		RestExecHistory restExecHistory = new RestExecHistory();

		if (parm.get("page") != null) {
			restExecHistory.setPage(Integer.parseInt(parm.get("page")));
		}
		if (parm.get("schKey") != null) {
			restExecHistory.setSchKey(parm.get("schKey"));
		}

		try {
			List<RestExecHistoryDto> list = adminService.restExecHistory(restExecHistory);
			HashMap data = new HashMap();
			data.put("totalCount", adminService.restExecHistoryTotalCount(restExecHistory));
			data.put("page", restExecHistory.getPage());
			data.put("pageCount", restExecHistory.getPageCount());
			res.setResponse(EIResponse.SUCCESS, list, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * Scale In/Out ?????? ????????? ??????
	 */
	@PostMapping("/scaleHistory")
	@Secured("ROLE_ADMIN")
	public EIResponse scaleHistory(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ScaleHistory scaleHistory = new ScaleHistory();

		if (parm.get("page") != null) {
			scaleHistory.setPage(Integer.parseInt(parm.get("page")));
		}
		if (parm.get("scaleInOutType") != null && !"".equals(parm.get("scaleInOutType"))) {
			scaleHistory.setScaleInOutType('%'+parm.get("scaleInOutType"));
		}
		if (parm.get("serverName") != null && !"".equals(parm.get("serverName"))) {
			scaleHistory.setServerName(parm.get("serverName"));
		}
		if (parm.get("startDate") != null && !"".equals(parm.get("startDate"))) {
			scaleHistory.setStartDate(parm.get("startDate"));
		}
		if (parm.get("endDate") != null && !"".equals(parm.get("endDate"))) {
			scaleHistory.setEndDate(parm.get("endDate"));
		}

		try {
			List<ScaleHistoryDto> list = adminService.scaleHistory(scaleHistory);
			HashMap data = new HashMap();
			data.put("totalCount", adminService.scaleHistoryTotalCount(scaleHistory));
			data.put("page", scaleHistory.getPage());
			data.put("pageCount", scaleHistory.getPageCount());
			res.setResponse(EIResponse.SUCCESS, list, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

}
