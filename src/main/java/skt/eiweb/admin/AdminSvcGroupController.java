package skt.eiweb.admin;

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
import skt.eiweb.admin.model.ServiceGroup;
import skt.eiweb.admin.model.ServiceGroupDto;
import skt.eiweb.authority.AuthorityService;
import skt.eiweb.authority.model.User;
import skt.eiweb.base.EIProperties;
import skt.eiweb.base.model.EIResponse;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.admin
 * @Filename     : AdminSvcGroupController.java
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
	"rawtypes", "unchecked"
})
public class AdminSvcGroupController {

	@Autowired
	private AdminService adminService;

	@Autowired
	private AuthorityService userService;

	@Autowired
	private EIProperties props;

	/**
	 * ????????? ?????? ????????? ??????
	 */
	@PostMapping("/serviceGroupList")
	@Secured("ROLE_ADMIN")
	public EIResponse serviceGroupList(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ServiceGroup serviceGroup = new ServiceGroup();

		if (parm.get("schKey") != null) {
			serviceGroup.setSchKey(parm.get("schKey"));
		}

		try {
			List<ServiceGroupDto> list;
			if (parm.get("page") == null) {
				// service management/history ?????? ??????
				list = adminService.serviceGroupAllList(serviceGroup);
			} else {
				// admin???????????? ??????
				serviceGroup.setPage(Integer.parseInt(parm.get("page")));
				list = adminService.serviceGroupList(serviceGroup);
			}
			HashMap data = new HashMap();
			data.put("totalCount", adminService.serviceGroupListTotalCount(serviceGroup));
			data.put("page", serviceGroup.getPage());
			data.put("pageCount", serviceGroup.getPageCount());
			res.setResponse(EIResponse.SUCCESS, list, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ????????? ?????? ??????
	 */
	@PostMapping("/createServiceGroup")
	@Secured("ROLE_ADMIN")
	public EIResponse createServiceGroup(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ServiceGroup serviceGroup = new ServiceGroup();
		serviceGroup.setServiceGroupName(parm.get("serviceGroupName"));

		if (parm.get("serviceGroupName") == null || serviceGroup.getServiceGroupName().length() < 1) {
			res.setResponse(EIResponse.FAIL, "????????? ???????????? ??????????????????.");
			return res;
		}
		if (parm.get("description") != null && !"".equals(parm.get("description"))) {
			serviceGroup.setDescription(parm.get("description"));
		}

		try {
			// validation
			int ret = adminService.chkServiceGroupName(serviceGroup);
			if (ret > 0) {
				res.setResponse(EIResponse.FAIL, "????????? ????????? ???????????? ???????????????.");
				return res;
			}

			// ????????? ?????? ????????????
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = new User();
			user.setPassword(auth.getCredentials().toString());
			if (props.isDeveloping()) {
				user.setUserId("admin");
			} else {
				user = userService.getUserInfoByPw(user);
			}
			log.debug("user={}", user.getUserId());
			serviceGroup.setUserId(user.getUserId());

			// List<ServiceGroupDto> list = service.serviceGroupList(serviceGroup);
			boolean modify = false;
			if (parm.get("saveType") == null || (parm.get("saveType") != null && "ins".equals(parm.get("saveType")))) {
				modify = false;
			} else {
				modify = true;
			}

			// upsert
			ret = modify ? adminService.updateServiceGroup(serviceGroup) : adminService.createServiceGroup(serviceGroup);
			if (ret > 0) {
				res.setResponse(EIResponse.SUCCESS, modify ? "????????? ?????? ?????? ???????????????." : "????????? ?????? ?????? ???????????????.");
			} else {
				res.setResponse(EIResponse.FAIL, "????????? ?????? ?????? ??????");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ????????? ?????? ?????? ??????
	 */
	@PostMapping("/serviceGroupInfo")
	@Secured("ROLE_ADMIN")
	public EIResponse serviceGroupInfo(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		String resourceGroupName = parm.get("serviceGroupName");

		try {
			ServiceGroupDto serviceGroup = adminService.getServiceGroupInfo(resourceGroupName);
			HashMap data = new HashMap();
			data.put("serviceGroupInfo", serviceGroup);
			res.setResponse(EIResponse.SUCCESS, null, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ????????? ????????? ?????? ??????
	 */
	@PostMapping("/chkServiceGroupName")
	@Secured("ROLE_ADMIN")
	public EIResponse chkServiceGroupName(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ServiceGroupDto sv = new ServiceGroupDto();
		sv.setServiceGroupName(parm.get("serviceGroupName"));

		if (parm.get("serviceGroupName") == null || sv.getServiceGroupName().length() < 1) {
			res.setResponse(EIResponse.FAIL, "????????? ???????????? ??????????????????.");
			return res;
		}

		try {
			int ret = adminService.chkServiceGroupName(sv);
			if (ret > 0) {
				res.setResponse(EIResponse.FAIL, "????????? ????????? ???????????? ???????????????.");
			} else {
				res.setResponse(EIResponse.SUCCESS, "?????? ???????????????.");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "????????? ????????? ?????? ??????");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ????????? ?????? ??????
	 */
	@PostMapping("/deleteServiceGroup")
	@Secured("ROLE_ADMIN")
	public EIResponse deleteServiceGroup(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		int chk = 0;

		try {
			String pServiceGroupNames = parm.get("serviceGroupNames");
			String[] serviceGroupNames = pServiceGroupNames.split(",");
			for (int i = 0; i < serviceGroupNames.length; i++) {
				chk = 0;
				chk = adminService.useServiceGroup(serviceGroupNames[i]);
				if (chk > 0) {
					res.setResponse(EIResponse.FAIL, "????????? ????????? ???????????? ???????????? ???????????????.(".concat(serviceGroupNames[i]).concat(")"));
					return res;
				}
			}
			chk = 0;
			for (int i = 0; i < serviceGroupNames.length; i++) {
				chk += adminService.deleteServiceGroup(serviceGroupNames[i]);
			}
			if (serviceGroupNames.length == chk) {
				res.setResponse(EIResponse.SUCCESS, "????????? ?????? ?????? ??????");
			} else {
				res.setResponse(EIResponse.FAIL, "????????? ?????? ?????? ??????");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

}
