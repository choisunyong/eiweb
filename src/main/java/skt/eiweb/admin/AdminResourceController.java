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
	 * 자원 그룹 리스트 조회
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
	 * 자원 그룹 생성
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

			// 사용자 정보 가져오기
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User usr = new User();
			usr.setPassword(auth.getCredentials().toString());
			usr = userService.getUserInfoByPw(usr);
			if (parm.get("developing") != null && "true".equals(parm.get("developing"))) {
				resourceGroup.setUserId("admin"); // 로컬 개발중 세션이 없기때문에 ..
			} else {
				resourceGroup.setUserId(usr.getUserId());
			}

			int ret = modify ? adminService.updateResourceGroup(resourceGroup) : adminService.createResourceGroup(resourceGroup);
			if (ret > 0) {
				res.setResponse(EIResponse.SUCCESS, modify ? "자원 그룹 수정 되었습니다." : "자원 그룹 추가 되었습니다.");
			} else {
				res.setResponse(EIResponse.FAIL, "자원 그룹 저장 실패");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 자원 그룹 상세 조회
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
	 * 자원 그룹 삭제
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
				res.setResponse(EIResponse.SUCCESS, "자원 그룹 삭제 성공");
			} else {
				res.setResponse(EIResponse.FAIL, "자원 그룹 삭제 실패");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 장비 리스트 조회
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
			res.setResponse(EIResponse.FAIL, "장비 리스트 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 장비 scale in (장비 off 연동)
	 */
	@PostMapping("/scaleIn")
	@Secured("ROLE_ADMIN")
	public EIResponse scaleIn(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		// 서버 ScaleIn 호출 (Manager호출)
		String callResult = "";

		try {
			// 사용자 정보 가져오기
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User usr = new User();
			usr.setPassword(auth.getCredentials().toString());
			usr = userService.getUserInfoByPw(usr);

			HashMap<String, String> p = new HashMap<String, String>();
			p.put("req_type", "user_stop");
			p.put("server", parm.get("server"));
			if (parm.get("developing") != null && "true".equals(parm.get("developing"))) {
				p.put("user", "SYSTEM"); // 로컬 개발중 세션이 없기때문에 ..
			} else {
				p.put("user", usr.getUserId());
			}
			callResult = managerService.scaleInOut(p);
			if (callResult.indexOf("success") > 0) {
				// 3. 성공시 이력 저장
				// ScaleHistory scaleHistory = new ScaleHistory();
				// if (parm.get("developing") != null && "true".equals( parm.get("developing") ))
				// scaleHistory.setServerName("EI WEB(DEVELOPING)");
				// scaleHistory.setAction(SCALE.SCALE_IN.toString());

				// if (parm.get("developing") != null && "true".equals( parm.get("developing") ))
				// scaleHistory.setUserId("admin"); // 로컬 개발중 세션이 없기때문에 ..
				// else
				// scaleHistory.setUserId( usr.getUserId() );

				// int ret = service.saveScaleHistory(scaleHistory);
				// if (ret > 0) {
				// res.setResult(EIResponse.SUCCESS);
				// } else {
				// res.setResult(EIResponse.FAIL);
				// res.setMessage("Scale In History 저장 실패");
				// }
				res.setResponse(EIResponse.SUCCESS, callResult);
			} else {
				res.setResponse(EIResponse.FAIL, callResult);
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "Scale In 실패 - " + e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 장비 scale out (장비 on 연동)
	 */
	@PostMapping("/scaleOut")
	@Secured("ROLE_ADMIN")
	public EIResponse scaleOut(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		// 서버 ScaleOut 호출(Manager호출)
		String callResult = "";

		try {
			// 사용자 정보 가져오기
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User usr = new User();
			usr.setPassword(auth.getCredentials().toString());
			usr = userService.getUserInfoByPw(usr);

			HashMap<String, String> p = new HashMap<String, String>();
			p.put("req_type", "user_start");
			p.put("server", parm.get("server"));
			if (parm.get("developing") != null && "true".equals(parm.get("developing"))) {
				p.put("user", "SYSTEM"); // 로컬 개발중 이 없기때문에 ..
			} else {
				p.put("user", usr.getUserId());
			}
			callResult = managerService.scaleInOut(p);

			if (callResult.indexOf("success") > 0) {
				// 3. 성공시 이력 저장
				// ScaleHistory scaleHistory = new ScaleHistory();
				// scaleHistory.setAction(SCALE.SCALE_OUT.toString());

				// if (parm.get("developing") != null && "true".equals( parm.get("developing") ))
				// scaleHistory.setUserId("admin"); // 로컬 개발중 새션이 없기때문에 ..
				// else
				// scaleHistory.setUserId( usr.getUserId() );

				// int ret = service.saveScaleHistory(scaleHistory);
				// if (ret > 0) {
				// res.setResult(EIResponse.SUCCESS);
				// } else {
				// res.setResult(EIResponse.FAIL);
				// res.setMessage("Scale Out History 저장 실패");
				// }
				res.setResponse(EIResponse.SUCCESS, callResult);
			} else {
				res.setResponse(EIResponse.FAIL, callResult);
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "Scale Out 실패 - " + e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * Scale In/Out Rule 저장
	 */
	@PostMapping("/saveScaleInOutRule")
	@Secured("ROLE_ADMIN")
	public EIResponse saveScaleInOutRule(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		CommonCodeDto dto = new CommonCodeDto();
		int ret = -1;

		if (parm.get("type") == null && !"scaleIn".equals(parm.get("type")) && !"scaleOut".equals(parm.get("type"))) {
			res.setResponse(EIResponse.FAIL, "type 값이 잘못되었습니다.");
			return res;
		}
		if ("scaleIn".equals(parm.get("type"))) {
			dto.setGroupCode("SCALE_IN_RULE");
		} else if ("scaleOut".equals(parm.get("type"))) {
			dto.setGroupCode("SCALE_OUT_RULE");
		}
		if (parm.get("cpuPercent") == null && parm.get("durationMin") == null && parm.get("ruleEnable") == null) {
			res.setResponse(EIResponse.FAIL, "저장할 내용이 없습니다.");
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
				res.setResponse(EIResponse.SUCCESS, "Scale Out Rule 저장 되었습니다.");
			} else {
				res.setResponse(EIResponse.FAIL, "Scale Out Rule 저장되지 않았습니다.");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "Scale Out Rule 저장 실패 - " + e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * Scale In/Out Rule 상세 조회
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
