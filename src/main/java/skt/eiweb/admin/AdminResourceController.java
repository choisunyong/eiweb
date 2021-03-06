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
import skt.eiweb.admin.model.Device;
import skt.eiweb.admin.model.ResourceGroup;
import skt.eiweb.admin.model.ResourceGroupDto;
import skt.eiweb.authority.AuthorityService;
import skt.eiweb.authority.model.User;
import skt.eiweb.base.model.EIResponse;
import skt.eiweb.code.CommonCodeService;
import skt.eiweb.code.model.CommonCodeDto;
import skt.eiweb.manager.ManagerService;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.admin
 * @Filename     : AdminResourceController.java
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
public class AdminResourceController {

	@Autowired
	private AdminService adminService;

	@Autowired
	private AuthorityService userService;

	@Autowired
	private ManagerService managerService;

	@Autowired
	private CommonCodeService commonCodeService;

	/**
	 * ?????? ?????? ????????? ??????
	 */
	@PostMapping("/resourceGroupList")
	@Secured("ROLE_ADMIN")
	public EIResponse resourceGroupList(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ResourceGroup resourceGroup = new ResourceGroup();

		if (parm.get("schKey") != null) {
			resourceGroup.setSchKey(parm.get("schKey"));
		}

		try {
			List<ResourceGroupDto> list;
			if (parm.get("page") == null)
				list = adminService.resourceGroupAllList(resourceGroup);
			else {
				resourceGroup.setPage(Integer.parseInt(parm.get("page")));
				list = adminService.resourceGroupList(resourceGroup);
			}
			HashMap data = new HashMap();
			data.put("totalCount", adminService.resourceGroupListTotalCount(resourceGroup));
			data.put("page", resourceGroup.getPage());
			data.put("pageCount", resourceGroup.getPageCount());
			res.setResponse(EIResponse.SUCCESS, list, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? ?????? ??????
	 */
	@PostMapping("/createResourceGroup")
	@Secured("ROLE_ADMIN")
	public EIResponse createResourceGroup(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		ResourceGroup resourceGroup = new ResourceGroup();
		resourceGroup.setResourceGroupName(parm.get("resourceGroupName"));
		resourceGroup.setResourceCpu(parm.get("resourceCpu"));
		boolean modify = false;

		try {
			if (parm.get("resourceGroupId") != null) {
				resourceGroup.setResourceGroupId(parm.get("resourceGroupId"));
				modify = true;
			}

			// ????????? ?????? ????????????
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User usr = new User();
			usr.setPassword(auth.getCredentials().toString());
			usr = userService.getUserInfoByPw(usr);
			if (parm.get("developing") != null && "true".equals(parm.get("developing"))) {
				resourceGroup.setUserId("admin"); // ?????? ????????? ????????? ??????????????? ..
			} else {
				resourceGroup.setUserId(usr.getUserId());
			}

			int ret = modify ? adminService.updateResourceGroup(resourceGroup) : adminService.createResourceGroup(resourceGroup);
			if (ret > 0) {
				res.setResponse(EIResponse.SUCCESS, modify ? "?????? ?????? ?????? ???????????????." : "?????? ?????? ?????? ???????????????.");
			} else {
				res.setResponse(EIResponse.FAIL, "?????? ?????? ?????? ??????");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? ?????? ?????? ??????
	 */
	@PostMapping("/resourceGroupInfo")
	@Secured("ROLE_ADMIN")
	public EIResponse resourceGroupInfo(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		String resourceGroupId = parm.get("resourceGroupId");

		try {
			ResourceGroupDto resourceGroup = adminService.getResourceGroupInfo(resourceGroupId);
			HashMap data = new HashMap();
			data.put("resourceInfo", resourceGroup);
			res.setResponse(EIResponse.SUCCESS, null, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? ?????? ??????
	 */
	@PostMapping("/deleteResourceGroup")
	@Secured("ROLE_ADMIN")
	public EIResponse deleteResourceGroup(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		int chk = 0;

		try {
			String pResourceIds = parm.get("resourceIds");
			String[] resourceIds = pResourceIds.split(",");
			for (int i = 0; i < resourceIds.length; i++) {
				chk += adminService.deleteResourceGroup(resourceIds[i]);
			}
			if (resourceIds.length == chk) {
				res.setResponse(EIResponse.SUCCESS, "?????? ?????? ?????? ??????");
			} else {
				res.setResponse(EIResponse.FAIL, "?????? ?????? ?????? ??????");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? ????????? ??????
	 */
	@PostMapping("/deviceList")
	@Secured("ROLE_ADMIN")
	public EIResponse deviceList(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		Device device = new Device();

		if (parm.get("schKey") != null) {
			device.setSchKey(parm.get("schKey"));
		}

		try {
			List<Device> devices = adminService.deviceList(device);
			res.setResponse(EIResponse.SUCCESS, devices, null);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "?????? ????????? ??????");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? scale in (?????? off ??????)
	 */
	@PostMapping("/scaleIn")
	@Secured("ROLE_ADMIN")
	public EIResponse scaleIn(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		// ?????? ScaleIn ?????? (Manager??????)
		String callResult = "";

		try {
			// ????????? ?????? ????????????
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User usr = new User();
			usr.setPassword(auth.getCredentials().toString());
			usr = userService.getUserInfoByPw(usr);

			HashMap<String, String> p = new HashMap<String, String>();
			p.put("req_type", "user_stop");
			p.put("server", parm.get("server"));
			if (parm.get("developing") != null && "true".equals(parm.get("developing"))) {
				p.put("user", "SYSTEM"); // ?????? ????????? ????????? ??????????????? ..
			} else {
				p.put("user", usr.getUserId());
			}
			callResult = managerService.scaleInOut(p);
			if (callResult.indexOf("success") > 0) {
				// 3. ????????? ?????? ??????
				// ScaleHistory scaleHistory = new ScaleHistory();
				// if (parm.get("developing") != null && "true".equals( parm.get("developing") ))
				// scaleHistory.setServerName("EI WEB(DEVELOPING)");
				// scaleHistory.setAction(SCALE.SCALE_IN.toString());

				// if (parm.get("developing") != null && "true".equals( parm.get("developing") ))
				// scaleHistory.setUserId("admin"); // ?????? ????????? ????????? ??????????????? ..
				// else
				// scaleHistory.setUserId( usr.getUserId() );

				// int ret = service.saveScaleHistory(scaleHistory);
				// if (ret > 0) {
				// res.setResult(EIResponse.SUCCESS);
				// } else {
				// res.setResult(EIResponse.FAIL);
				// res.setMessage("Scale In History ?????? ??????");
				// }
				res.setResponse(EIResponse.SUCCESS, callResult);
			} else {
				res.setResponse(EIResponse.FAIL, callResult);
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "Scale In ?????? - " + e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? scale out (?????? on ??????)
	 */
	@PostMapping("/scaleOut")
	@Secured("ROLE_ADMIN")
	public EIResponse scaleOut(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		// ?????? ScaleOut ??????(Manager??????)
		String callResult = "";

		try {
			// ????????? ?????? ????????????
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User usr = new User();
			usr.setPassword(auth.getCredentials().toString());
			usr = userService.getUserInfoByPw(usr);

			HashMap<String, String> p = new HashMap<String, String>();
			p.put("req_type", "user_start");
			p.put("server", parm.get("server"));
			if (parm.get("developing") != null && "true".equals(parm.get("developing"))) {
				p.put("user", "SYSTEM"); // ?????? ????????? ??? ??????????????? ..
			} else {
				p.put("user", usr.getUserId());
			}
			callResult = managerService.scaleInOut(p);

			if (callResult.indexOf("success") > 0) {
				// 3. ????????? ?????? ??????
				// ScaleHistory scaleHistory = new ScaleHistory();
				// scaleHistory.setAction(SCALE.SCALE_OUT.toString());

				// if (parm.get("developing") != null && "true".equals( parm.get("developing") ))
				// scaleHistory.setUserId("admin"); // ?????? ????????? ????????? ??????????????? ..
				// else
				// scaleHistory.setUserId( usr.getUserId() );

				// int ret = service.saveScaleHistory(scaleHistory);
				// if (ret > 0) {
				// res.setResult(EIResponse.SUCCESS);
				// } else {
				// res.setResult(EIResponse.FAIL);
				// res.setMessage("Scale Out History ?????? ??????");
				// }
				res.setResponse(EIResponse.SUCCESS, callResult);
			} else {
				res.setResponse(EIResponse.FAIL, callResult);
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "Scale Out ?????? - " + e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * Scale In/Out Rule ??????
	 */
	@PostMapping("/saveScaleInOutRule")
	@Secured("ROLE_ADMIN")
	public EIResponse saveScaleInOutRule(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		CommonCodeDto dto = new CommonCodeDto();
		int ret = -1;

		if (parm.get("type") == null && !"scaleIn".equals(parm.get("type")) && !"scaleOut".equals(parm.get("type"))) {
			res.setResponse(EIResponse.FAIL, "type ?????? ?????????????????????.");
			return res;
		}
		if ("scaleIn".equals(parm.get("type"))) {
			dto.setGroupCode("SCALE_IN_RULE");
		} else if ("scaleOut".equals(parm.get("type"))) {
			dto.setGroupCode("SCALE_OUT_RULE");
		}
		if (parm.get("cpuPercent") == null && parm.get("durationMin") == null && parm.get("ruleEnable") == null) {
			res.setResponse(EIResponse.FAIL, "????????? ????????? ????????????.");
			return res;
		}

		try {
			if (parm.get("cpuPercent") != null && !"".equals(parm.get("cpuPercent"))) {
				dto.setCode("CPU_PERCENT");
				dto.setValue(parm.get("cpuPercent"));
				if (0 < commonCodeService.updateCode(dto)) {
					ret = 1;
				}
			}
			if (parm.get("durationMin") != null && !"".equals(parm.get("durationMin"))) {
				dto.setCode("DURATION_MIN");
				dto.setValue(parm.get("durationMin"));
				if (0 < commonCodeService.updateCode(dto)) {
					ret = 1;
				}
			}
			if (parm.get("ruleEnable") != null && !"".equals(parm.get("ruleEnable"))) {
				dto.setCode("RULE_ENABLE");
				dto.setValue(parm.get("ruleEnable"));
				if (0 < commonCodeService.updateCode(dto)) {
					ret = 1;
				}
			}
			if (ret > 0) {
				res.setResponse(EIResponse.SUCCESS, "Scale Out Rule ?????? ???????????????.");
			} else {
				res.setResponse(EIResponse.FAIL, "Scale Out Rule ???????????? ???????????????.");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "Scale Out Rule ?????? ?????? - " + e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * Scale In/Out Rule ?????? ??????
	 */
	@PostMapping("/scaleInOutRuleInfo")
	@Secured("ROLE_ADMIN")
	public EIResponse scaleInOutRuleInfo(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		HashMap data = new HashMap();

		try {
			CommonCodeDto dto = new CommonCodeDto();
			dto.setGroupCode("SCALE_OUT_RULE");
			data.put("scaleOutRule", commonCodeService.getList(dto));
			dto.setGroupCode("SCALE_IN_RULE");
			data.put("scaleInRule", commonCodeService.getList(dto));
			res.setResponse(EIResponse.SUCCESS, null, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

}
