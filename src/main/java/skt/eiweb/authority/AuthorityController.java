package skt.eiweb.authority;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.authority.model.LoginHist;
import skt.eiweb.authority.model.User;
import skt.eiweb.base.EIProperties;
import skt.eiweb.base.model.EIResponse;
import skt.eiweb.config.Constant;
import skt.eiweb.utils.SessionUtil;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.authority
 * @Filename     : AuthorityController.java
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
@SuppressWarnings({
	"rawtypes", "unchecked"
})
public class AuthorityController {

	@Autowired
	AuthorityService authorityService;

	@Autowired
	EIProperties props;

	/**
	 * ?????????
	 */
	@PostMapping("/login")
	public EIResponse login(@RequestParam HashMap parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		User user = new User();
		user.setUserId(parm.get("username").toString());
		user.setPassword(parm.get("password").toString());
		user.setActivate("1"); // ?????? (0 ?????????)
		HashMap data = new HashMap();

		try {
			List<User> users = authorityService.getUserInfo(user);
			if (users.size() > 0) {
				for (int i = 0; i < users.size(); i++) {
					user = users.get(i);
				}
				if (authorityService.chkPassword(user, parm.get("password").toString())) {
					UserDetails userDetails = authorityService.loadUserByUsername(user.getUserId());

					// securityContext ??????
					Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, user.getPassword(), userDetails.getAuthorities());
					SecurityContext securityContext = SecurityContextHolder.getContext();
					securityContext.setAuthentication(authentication);

					// session ??????
					HttpSession session = request.getSession(true);
					session.setMaxInactiveInterval((int) props.getMaxInactiveInterval()); // ?????? ?????? ??????
					session.setAttribute(Constant.SPRING_SECURITY_CONTEXT, securityContext);
					SessionUtil.printCurrentSessionInfo(request); // ?????????

					// ?????? data ??????
					data.put("sessionId", session.getId().toString());
					User u = new User();
					u.setUserId(user.getUserId());
					u.setUserName(user.getUserName());
					u.setUserPermission(user.getUserPermission());
					data.put("userInfo", u);
					res.setData(data);

					// ????????? ?????? ??????
					LoginHist hist = new LoginHist();
					hist.setUserId(user.getUserId());
					hist.setSession(request.getSession().getId());
					authorityService.insertLoginHist(hist);
				} else {
					res.setResponse(EIResponse.FAIL, "??????????????? ?????????????????????.");
					return res;
				}
			} else {
				res.setResponse(EIResponse.FAIL, "???????????? ????????????.");
				return res;
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "????????? ??????");
			e.printStackTrace();
		}

		res.setResponse(EIResponse.SUCCESS, "????????? ??????");

		return res;
	}

	/**
	 * ????????? ?????? ??????
	 */
	@PostMapping("/chkId")
	public EIResponse chkId(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		User user = new User();
		user.setUserId(parm.get("loginId"));
		List<User> users;

		try {
			users = authorityService.getUserInfo(user);
			if (users.size() > 0) {
				res.setResponse(EIResponse.FAIL, "???????????? ???????????? ???????????????.");
			} else {
				res.setResponse(EIResponse.SUCCESS, "?????? ????????? ??????????????????.");
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "????????? ?????? ?????? ??????");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ????????????
	 */
	@PostMapping("/signup")
	public EIResponse signup(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		int ret;

		try {
			User user = new User();
			user.setUserId(parm.get("loginId"));
			List<User> users = authorityService.getUserInfo(user);
			if (users.size() > 0) {
				res.setResponse(EIResponse.FAIL, "?????? ?????????????????? ???????????????.");
			} else {
				ret = authorityService.signup(parm);
				if (ret == 1) {
					res.setResponse(EIResponse.SUCCESS, "???????????? ??????");
				} else {
					res.setResponse(EIResponse.FAIL, "???????????? ??????");
				}
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "???????????? ??????");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? ????????? ?????? ?????? / ???????????? ?????????(admin)
	 */
	@GetMapping("/initAdmin")
	public EIResponse initAdmin() throws Exception {
		EIResponse res = new EIResponse();
		int ret = authorityService.initAdmin();

		if (ret == 1) {
			res.setResponse(EIResponse.SUCCESS, "????????? ????????? ??????");
		} else {
			res.setResponse(EIResponse.FAIL, "????????? ????????? ??????");
		}

		return res;
	}

	/**
	 * ????????? ?????? ??????
	 */
	@PostMapping("/chkLogin")
	public EIResponse chkLogin(@RequestParam HashMap parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		HashMap data = null;
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();

		if (!props.isDeveloping() && authentication.getPrincipal().toString().equals(Constant.ANONYMOUS_USER)) {
			res.setResponse(EIResponse.FAIL, "??????????????? ???????????????.");
			res.setErrCode("401");
		} else {
			data = new HashMap();
			if (props.isDeveloping()) {
				data.put("sessionId", parm.get("sessionId"));
			} else {
				data.put("sessionId", request.getSession().getId());
			}
			LoginHist hist = new LoginHist();
			if (props.isDeveloping()) {
				hist.setSession((String) parm.get("sessionId"));
			} else {
				hist.setSession(request.getSession().getId());
			}
			try {
				data.put("userInfo", authorityService.getUserInfoBySessionId(hist));
			} catch (Exception e) {
				log.error(e.getMessage(), e);
			}
			res.setResponse(EIResponse.SUCCESS, "????????? ?????? ??????", null, data);
		}

		return res;
	}

	/**
	 * ???????????? ??????
	 */
	@PostMapping("/changeUserPw")
	public EIResponse changeUserPw(@RequestParam HashMap parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		User user = new User();
		user.setUserId((String) parm.get("userId"));

		try {
			List<User> users = authorityService.getUserInfo(user);
			if (users.size() > 0) {
				user = users.get(0);
			}
			if (authorityService.chkPassword(user, parm.get("currpw").toString())) {
				user.setPassword(parm.get("pw").toString());
				authorityService.changePassword(user);
			} else {
				res.setResponse(EIResponse.FAIL, "??????????????? ?????????????????????.");
				return res;
			}
			res.setResponse(EIResponse.SUCCESS, "?????????????????????.");
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "???????????? ?????? ??????");
			e.printStackTrace();
		}

		return res;
	}

}
