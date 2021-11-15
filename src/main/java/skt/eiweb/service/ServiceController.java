package skt.eiweb.service;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.authority.AuthorityService;
import skt.eiweb.authority.model.User;
import skt.eiweb.base.EIProperties;
import skt.eiweb.base.model.EIResponse;
import skt.eiweb.manager.ManagerService;
import skt.eiweb.model.ModelService;
import skt.eiweb.model.model.ModelDto;
import skt.eiweb.service.model.ServiceCreHistoryDto;
import skt.eiweb.service.model.ServiceDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.service
 * @Filename     : ServiceController.java
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
@RequestMapping("/service")
@SuppressWarnings({
	"rawtypes", "unchecked", "unused"
})
public class ServiceController {

	@Autowired
	private ServiceService serviceService;

	@Autowired
	AuthorityService authorityService;

	@Autowired
	ModelService modelService;

	@Autowired
	ManagerService managerService;

	@Autowired
	private EIProperties props;

	/**
	 * service 리스트 조회
	 */
	@PostMapping("/list")
	@Secured("ROLE_ADMIN")
	public EIResponse getList(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ServiceDto sv = new ServiceDto();
		sv.setServiceId(parm.get("serviceId"));

		if (parm.get("page") != null) {
			sv.setPage(Integer.parseInt(parm.get("page")));
			// System.out.println("########### LIST PAGE : " + sv.getPage());
		}
		if (parm.get("schKey") != null) {
			sv.setSchKey(parm.get("schKey"));
			// System.out.println("########### LIST schkey : " + sv.getSchKey());
		}

		if (parm.get("modelId") != null) {
			sv.setModelId(parm.get("modelId"));
			// System.out.println("########### LIST model id : [" + sv.getModelId() + "]");
		}
		if (parm.get("serviceGroupName") != null && !"all".equalsIgnoreCase(parm.get("serviceGroupName"))) {
			sv.setServiceGroupName(parm.get("serviceGroupName"));
			// System.out.println("########### LIST service group name : [" + sv.getServiceGroupName() +"]");
		}
		// System.out.println("########### LIST page count : [" + sv.getPageCount() +"]");

		List<ServiceDto> list;
		HashMap data;
		try {
			list = serviceService.getList(sv);
			data = new HashMap();
			data.put("totalCount", serviceService.getTotalCount(sv));
			data.put("page", sv.getPage());
			data.put("pageCount", sv.getPageCount());
			data.put("totalStatus", serviceService.getTotalStatus(sv));
			res.setResult(EIResponse.SUCCESS);
			res.setList(list);
			res.setData(data);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("서비스 리스트 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * service 생성
	 */
	@PostMapping("/create")
	@Secured("ROLE_ADMIN")
	public EIResponse create(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ServiceDto sv = new ServiceDto();
		sv.setServiceName(parm.get("serviceName"));
		sv.setModelId(parm.get("modelId"));
		sv.setServiceGroupName(parm.get("serviceGroupName"));
		sv.setDagId(parm.get("dagId"));

		if (parm.get("runCycle") != null && !"".equals(parm.get("runCycle"))) {
			sv.setRunCycle(parm.get("runCycle"));
		}
		if (parm.get("serviceDesc") != null && !"".equals(parm.get("serviceDesc"))) {
			sv.setServiceDesc(parm.get("serviceDesc"));
		}

		String newServiceId = null;
		boolean modify = false;
		try {
			if (parm.get("serviceId") != null) {
				sv.setServiceId(parm.get("serviceId"));
				modify = true;
			} else {
				sv.setServiceId(serviceService.makeNextServiceId());
			}

			// DAG ID, Service Name 중복 체크
			int ret = serviceService.chkServiceName(sv);
			if (ret > 0) {
				res.setResult(EIResponse.FAIL);
				res.setMessage("동일한 서비스명이 존재합니다.");
				return res;
			}
			ret = -1; // 초기화
			ret = serviceService.chkDagId(sv);
			if (ret > 0) {
				res.setResult(EIResponse.FAIL);
				res.setMessage("DAG ID가 존재합니다.");
				return res;
			}

			// 사용자 정보 가져오기
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User usr = new User();
			usr.setPassword(auth.getCredentials().toString());
			usr = authorityService.getUserInfoByPw(usr);
			if (parm.get("developing") != null && "true".equals(parm.get("developing"))) {
				sv.setUserId("admin"); // 로컬 개발중 세ㄴ션이 없기때문에 ..
			} else {
				sv.setUserId(usr.getUserId());
			}

			if (modify) {
				// DAG ID가 변경되었을경우 기존 DAG 파일 삭제
				ServiceDto svinfo = serviceService.getServiceInfo(sv.getServiceId());
				if (!svinfo.getDagId().equals(sv.getDagId())) {
					Path path = Paths.get(props.getDagspath() + "/" + svinfo.getDagId() + ".py");
					if (Files.exists(path))
						Files.delete(path);
				}
			}
			ret = -1; // 위에서 사용했기때문에 초기화
			ret = modify ? serviceService.updateService(sv) : serviceService.createService(sv);
			if (ret > 0) {
				// DAG 파일 생성
				serviceService.createDag(sv);
				serviceService.insertServiceCreHistory(sv.getServiceId());
				res.setResult(EIResponse.SUCCESS);
				res.setMessage(modify ? "수정 되었습니다." : "생성 되었습니다.");
			} else {
				res.setResult(EIResponse.FAIL);
				res.setMessage("service 생성 실패");
			}
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("서비스 생성 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * Service명 중복체크
	 */
	@PostMapping("/chkServiceName")
	@Secured("ROLE_ADMIN")
	public EIResponse chkServiceName(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ServiceDto sv = new ServiceDto();
		sv.setServiceName(parm.get("serviceName"));

		if (parm.get("serviceName") == null || sv.getServiceName().length() < 1) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("Service명을 입력해주세요.");
			return res;
		}

		try {
			int ret = serviceService.chkServiceName(sv);
			if (ret > 0) {
				res.setResult(EIResponse.FAIL);
				res.setMessage("동일한 Service명이 존재합니다.");
			} else {
				res.setResult(EIResponse.SUCCESS);
				res.setMessage("사용 가능합니다.");
			}
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("서비스명 중복 체크 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * service 상세 조회
	 */
	@PostMapping("/serviceInfo")
	@Secured("ROLE_ADMIN")
	public EIResponse serviceInfo(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		String serviceId = parm.get("serviceId");

		try {
			ServiceDto sv = serviceService.getServiceInfo(serviceId);
			HashMap m = new HashMap();
			m.put("serviceInfo", sv);
			res.setData(m);
			res.setResult(EIResponse.SUCCESS);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("서비스 정보 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * service 이력 조회
	 */
	@PostMapping("/serviceHistInfo")
	@Secured("ROLE_ADMIN")
	public EIResponse serviceHistInfo(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		String serviceId = parm.get("serviceId");

		try {
			ServiceCreHistoryDto sv = serviceService.getServiceHistInfo(serviceId);
			HashMap m = new HashMap();
			m.put("serviceInfo", sv);
			res.setData(m);
			res.setResult(EIResponse.SUCCESS);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("서비스 이력 정보 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * service 삭제
	 */
	@PostMapping("/delete")
	@Secured("ROLE_ADMIN")
	public EIResponse delete(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		int chk = 0;
		int ichk = 0;

		try {
			String pServiceIds = parm.get("serviceIds");
			String[] serviceIds = pServiceIds.split(",");
			for (int i = 0; i < serviceIds.length; i++) {
				ichk = serviceService.deleteService(serviceIds[i]);
				if (ichk > 0) {
					try {
						serviceService.deleteDag(serviceIds[i]);
					} catch (Exception e) {
						e.printStackTrace();
					}
				}
				chk += ichk;
			}
			if (chk > 0) {
				res.setResult(EIResponse.SUCCESS);
				res.setMessage("service 삭제 성공");
			} else {
				res.setResult(EIResponse.FAIL);
				res.setMessage("service 삭제 실패");
			}
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("서비스 삭제 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * airflow job 중지 (연동)
	 */
	@PostMapping("/kill")
	@Secured({
		"ROLE_ADMIN", "ROLE_MODELER"
	})
	public EIResponse kill(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();

		try {
			String serviceId = parm.get("serviceId");
			String result = managerService.serviceKill(serviceId);
			res.setResult(EIResponse.SUCCESS);
			res.setMessage(result);

		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	@PostMapping("/play")
	@Secured({
		"ROLE_ADMIN", "ROLE_MODELER"
	})
	public EIResponse play(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();

		try{
			String dagId = parm.get("dagId");
			String result = managerService.servicePlay(dagId);

			res.setResult(EIResponse.SUCCESS);
			res.setMessage(result);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

}
