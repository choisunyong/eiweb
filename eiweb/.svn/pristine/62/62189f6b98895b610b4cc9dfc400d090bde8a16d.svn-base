package skt.eiweb.base;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import skt.eiweb.base.model.EIResponse;
import skt.eiweb.dashboard.DashboardService;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.base
 * @Filename     : BaseController.java
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
@RestController
public class BaseController {

	@Autowired
	BaseService service;

	@Autowired
	DashboardService dashboardService;

	/**
	 * 서버 상태 확인
	 */
	@GetMapping("/nock")
	public EIResponse nock() throws Exception {
		EIResponse res = new EIResponse();
		res.setResult(EIResponse.SUCCESS);
		res.setMessage("가동중");

		// res.setData( service.nock() );
		// String command = "calc"; // String.format("netstat -nat | grep LISTEN|grep %d", port);
		// String[] shell = {command};
		// Runtime.getRuntime().exec(shell);
		// dashboardService.insCpuHistory();

		return res;
	}

	// ----------------------------------------------------
	// 내부 연동 _ begin

	/**
	 * 시험 용도
	 */
	@RequestMapping(value = "/docker",
			method = {
				RequestMethod.POST, RequestMethod.GET
			},
			produces = MediaType.APPLICATION_JSON_VALUE)
	public String docker() throws Exception {
		return "{\"res\": {\"master\": 3, \"worker1\": 2, \"worker2\": 2}}";
	}

	@RequestMapping(value = "/machine",
			method = {
				RequestMethod.POST, RequestMethod.GET
			},
			produces = MediaType.APPLICATION_JSON_VALUE)
	public String machine() throws Exception {
		return "{\"res\": {\"esp-ei-001\": \"0.8\", \"esp-ei-002\": \"0.8\", \"esp-ei-003\": \"0.8\"}}";
	}

	@RequestMapping(value = "/model",
			method = {
				RequestMethod.POST, RequestMethod.GET
			},
			produces = MediaType.APPLICATION_JSON_VALUE)
	public String model() throws Exception {
		return "{\"res\": \"success\"}";
	}

	@RequestMapping(value = "/server",
			method = {
				RequestMethod.POST, RequestMethod.GET
			},
			produces = MediaType.APPLICATION_JSON_VALUE)
	public String server() throws Exception {
		return "{\"res\": \"success\"}";
	}

	@RequestMapping(value = "/kill",
			method = {
				RequestMethod.POST, RequestMethod.GET
			},
			produces = MediaType.APPLICATION_JSON_VALUE)
	public String kill() throws Exception {
		return "{\"res\": \"success\"}";
	}

	// 내부 연동 _ end
	// ----------------------------------------------------

}
