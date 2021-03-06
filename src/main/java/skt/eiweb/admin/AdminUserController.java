package skt.eiweb.admin;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.authority.AuthorityService;
import skt.eiweb.authority.model.User;
import skt.eiweb.base.model.EIResponse;
import skt.eiweb.email.EmailService;
import skt.eiweb.email.model.EmailModel;
import skt.eiweb.utils.RandomPassword;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.admin
 * @Filename     : AdminUserController.java
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
public class AdminUserController {

	@Autowired
	private AdminService adminService;

	@Autowired
	private AuthorityService userService;

	@Autowired
	private EmailService emailService;

	/**
	 * 사용자 아이디 찾기
	 */
	@PostMapping("/searchId")
	public EIResponse searchId(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		User user = new User();
		user.setUserName(parm.get("userName"));
		user.setUserEmail(parm.get("userEmail"));

		try {
			List<User> list = userService.getUserInfo(user);
			HashMap data = new HashMap();

			if (list.size() > 0) {
				for (User usr : list) {
					data.put("userId", usr.getUserId());
				}
				res.setResponse(EIResponse.SUCCESS, null, data);
			} else {
				res.setResponse(EIResponse.FAIL, "사용자가 없습니다.");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 사용자 비밀번호 랜덤생성 / 이메일 발송
	 */
	@PostMapping("/searchPw")
	public EIResponse searchPw(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		User user = new User();
		user.setUserId(parm.get("userId"));
		user.setUserEmail(parm.get("userEmail"));

		try {
			List<User> list = userService.getUserInfo(user);
			if (list.size() > 0) {
				for (User usr : list) {
					user.setUserName(usr.getUserName());
					user.setUserEmail(usr.getUserEmail());
				}

				// 사용자 비밀번호 업데이트
				String newPw = RandomPassword.make("C", 8); // 소문자, 숫자형 8자리 비밀번호 생성
				user.setPassword(newPw);
				int ret = userService.changePassword(user);

				if (ret > 0) {
					// 사용자 비밀번호 이메일 발송
					HashMap<String, String> vals = new HashMap<String, String>();
					vals.put("title", "비밀번호 초기화");
					vals.put("content", user.getUserName() + " 님의 비밀번호가 " + newPw + "로 초기화 되었습니다.");
					EmailModel vo = new EmailModel();
					vo.setSubject("[EI] 비밀번호 재설정 알림");
					vo.setTemplate("mail-initPw");
					vo.setToEmail(user.getUserEmail());
					vo.setVariable(vals);
					int emailResult = emailService.send(vo);
					if (emailResult > 0) {
						res.setResponse(EIResponse.SUCCESS, "비밀번호 초기화 되어 이메일로 발송해드렸습니다.");
					} else {
						res.setResponse(EIResponse.FAIL, "비밀번호 초기화 되었으나 이메일 발송 실패했습니다. 관리자에게 문의해주세요.");
					}
				} else {
					res.setResponse(EIResponse.FAIL, "비밀번호 재설정 실패");
				}

			} else {
				res.setResponse(EIResponse.FAIL, "사용자가 없습니다.");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 사용자 리스트 조회
	 */
	@PostMapping("/userList")
	@Secured("ROLE_ADMIN")
	public EIResponse userList(@RequestParam HashMap<String, String> parm, HttpServletRequest request, Authentication authentication) throws Exception {
		EIResponse res = new EIResponse();

		// if (ObjectUtils.isEmpty(authentication)) {
		// res.setResponse(EIResponse.FAIL, "다시 로그인이 필요합니다.");
		// return res;
		// }

		User user = new User();
		if (parm.get("page") != null) {
			user.setPage(Integer.parseInt(parm.get("page")));
		}
		if (parm.get("userPermission") != null) {
			user.setUserPermission(parm.get("userPermission"));
		}
		if (parm.get("schKey") != null) {
			user.setSchKey(parm.get("schKey"));
		}

		try {
			List<User> list = adminService.getUserList(user);
			HashMap data = new HashMap();
			data.put("totalCount", adminService.getUserListTotalCount(user));
			data.put("page", user.getPage());
			data.put("pageCount", user.getPageCount());
			res.setResponse(EIResponse.SUCCESS, list, data);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 사용자 생성
	 */
	@PostMapping("/save")
	@Secured("ROLE_ADMIN")
	public EIResponse save(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();

		User user = new User();
		user.setUserId(parm.get("userId"));
		if (parm.get("userName") != null) {
			user.setUserName(parm.get("userName"));
		}
		if (parm.get("pw") != null && parm.get("pw").length() > 0) {
			user.setPassword(parm.get("pw"));
		}
		if (parm.get("userPermission") != null && parm.get("userPermission").length() > 0) {
			user.setUserPermission(parm.get("userPermission").toUpperCase());
		}
		if (parm.get("activate") != null && parm.get("activate").length() > 0) {
			user.setActivate(parm.get("activate"));
		}
		user.setSchType(parm.get("schType"));
		user.setUserEmail(parm.get("userEmail"));

		try {
			User condition = new User();
			condition.setUserId(user.getUserId());
			List<User> list = userService.getUserInfo(condition);
			int ret = 0;

			if ("new".equals(user.getSchType()) && list.size() > 0) { // 새로운 사용자 일경우 아이디 중복체크
				res.setResponse(EIResponse.FAIL, "중복되는 아이디가 존재합니다.");
				return res;
			} else {
				if ("new".equals(user.getSchType())) { // 새로운 사용자 비밀번호 입력여부 재확인
					if (parm.get("pw") == null) {
						res.setResponse(EIResponse.FAIL, "비밀번호를 입력해 주세요.");
						return res;
					}
				}
				ret = userService.save(user);
				if (ret > 0) {
					res.setResult(EIResponse.SUCCESS);
					if (list.size() > 0) {
						res.setMessage("사용자 정보 수정되었습니다.");
					} else {
						res.setMessage("사용자 정보 추가되었습니다.");
					}
				} else {
					res.setResponse(EIResponse.FAIL, "사용자 정보 저장 실패!!");
				}
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 사용자 삭제
	 */
	@PostMapping("/deleteUser")
	@Secured({
		"ROLE_ADMIN"
	})
	public EIResponse deleteUser(@RequestParam HashMap<String, String> param, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();

		try {
			String userId = param.get("userId");

			int result = 0;
			result = adminService.deleteUser(userId);
			if (result > 0) {
				res.setResult(EIResponse.SUCCESS);
				res.setMessage("사용자 삭제 성공");
			} else {
				res.setResult(EIResponse.FAIL);
				res.setMessage("사용자 삭제 실패");
			}
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
		}
		return res;
	}

}
