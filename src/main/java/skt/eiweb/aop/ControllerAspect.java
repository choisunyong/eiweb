package skt.eiweb.aop;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang3.ObjectUtils;
import org.apache.commons.lang3.builder.ToStringBuilder;
import org.apache.commons.lang3.builder.ToStringStyle;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.AfterReturning;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Before;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.base.EIProperties;
import skt.eiweb.base.model.EIResponse;
import skt.eiweb.config.Constant;
import skt.eiweb.exception.UnauthorizedException;
import skt.eiweb.utils.SessionUtil;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.aop
 * @Filename     : ControllerAspect.java
 * 
 * All rights reserved. No part of this work may be reproduced, stored in a
 * retrieval system, or transmitted by any means without prior written
 * permission of SKT corp.
 * 
 * Copyright(c) 2020 SKT corp. All rights reserved
 * =================================================================================
 *  No     DATE              Description
 * =================================================================================
 *  1.0	   2020. 10. 7.      Initial Coding & Update
 * =================================================================================
 */
@Slf4j
@Aspect
@Component
@SuppressWarnings({
	"rawtypes", "unused"
})
public class ControllerAspect {

	private static final String[] API_ANONYMOUS_URL_TO_PERMIT = {
		"/nock",
		"/login",
		"/logout",
		"/chkLogin",
		"/chkId",
		"/signup",
		"/changeUserPw",
		"/initAdmin",
		"/code",
		"/dashboard"
	};

	@Autowired
	EIProperties props;

	@Pointcut("@annotation(org.springframework.web.bind.annotation.RequestMapping) || "
		+ "@annotation(org.springframework.web.bind.annotation.PostMapping) || "
		+ "@annotation(org.springframework.web.bind.annotation.GetMapping) || "
		+ "@annotation(org.springframework.web.bind.annotation.PutMapping) || "
		+ "@annotation(org.springframework.web.bind.annotation.DeleteMapping)")
	public void requestMapping() {
	}

	@Pointcut("execution(* skt.eiweb.*.*Controller.*(..)) || "
		+ "execution(* skt.eiweb.*.*.*Controller.*(..))")
	public void apiController() {
	}

	@Pointcut("execution(* skt.eiweb.*.*Repository.*(..)) || "
		+ "execution(* skt.eiweb.*.*.*Repository.*(..))")
	public void apiRepository() {
	}

	@Pointcut("execution(* skt.eiweb.*.*ServiceImpl.*(..)) || "
		+ "execution(* skt.eiweb.*.*.*ServiceImpl.*(..))")
	public void apiService() {
	}

	@Before("requestMapping() && apiController()")
	public void onBeforeControllerHandler(JoinPoint joinPoint) throws Exception {
		this.commonBeforeProcess(joinPoint);
	}

	@AfterReturning(pointcut = "requestMapping() && apiController() ", returning = "ret")
	public void onAfterControllerHandler(JoinPoint joinPoint, Object ret) {
		this.commonAfterProcess(joinPoint, ret);
	}

	@Around("apiController() ")
	// @Around("apiController() || apiService()")
	public Object onAroundProcessHandler(ProceedingJoinPoint joinPoint) throws Throwable {
		return this.commonAroundProcess(joinPoint);
	}

	private void commonBeforeProcess(JoinPoint joinPoint) throws IOException, UnauthorizedException {
		int reqIndex = indexOfHttpServletRequest(joinPoint);
		if (reqIndex > -1) {
			Object[] args = joinPoint.getArgs();

			final HttpServletRequest httpRequest = HttpServletRequest.class.cast(args[reqIndex]);
			if (httpRequest == null) {
				return;
			}

			// authentication from securityContext
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			String userId = auth == null ? "" : auth.getName();

			// ?????? ??????
			if (!props.isDeveloping()) {
				if (!(Arrays.stream(API_ANONYMOUS_URL_TO_PERMIT).anyMatch(httpRequest.getRequestURI()::contains) || "/".equals(httpRequest.getRequestURI()))) {
					if (userId.startsWith(Constant.ANONYMOUS_USER) || userId.length() == 0) {
						throw new UnauthorizedException("unauthorized - anonymous user!!");
					}
					HttpSession session = SessionUtil.getCurrentSession(httpRequest);
					if (session == null) {
						throw new UnauthorizedException("unauthorized - no session!!");
					}
				}
			}

			// request ??????
			HashMap obj = findReqParmFromJoinPoint(joinPoint);
			log.info("{} => {}, {}", userId, httpRequest.getRequestURI(), obj instanceof HashMap ? obj.containsKey("password") ? "" : obj.toString() : "");
		}
	}

	private void commonAfterProcess(JoinPoint joinPoint, Object ret) {
		int reqIndex = indexOfHttpServletRequest(joinPoint);
		if (reqIndex > -1) {
			Object[] args = joinPoint.getArgs();

			final HttpServletRequest httpRequest = HttpServletRequest.class.cast(args[reqIndex]);
			if (httpRequest == null) {
				return;
			}

			// authentication from securityContext
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			String userId = auth == null ? "" : auth.getName();

			// reponse ??????
			if (ObjectUtils.isNotEmpty(ret)) {
				if (ret instanceof EIResponse) {
					try {
						log.info("{} <= {}, {}", userId, httpRequest.getRequestURI(), ToStringBuilder.reflectionToString(ret, ToStringStyle.JSON_STYLE));
					} catch (RuntimeException e) {
						log.info("{} <= {}, {}", userId, httpRequest.getRequestURI(), "");
					}
				} else {
					log.info("{} <= {}, {}", userId, httpRequest.getRequestURI(), "");
				}
			}
		}
	}

	private Object commonAroundProcess(ProceedingJoinPoint joinPoint) throws Throwable {
		String target = joinPoint.getTarget().getClass().getSimpleName().concat(".").concat(joinPoint.getSignature().getName()).concat("(..)");

		StopWatch sw = new StopWatch();
		sw.start();
		Object result = joinPoint.proceed();
		sw.stop();

		Long total = sw.getTotalTimeMillis();

		if (total > Constant.SECOND_MILLI) { // 1??? ?????? ?????????
			log.info("[executionTime] target={}, total={}(ms)", target, total);
		}

		return result;
	}

	private int indexOfHttpServletRequest(JoinPoint joinPoint) {
		Object[] args = joinPoint.getArgs();
		if (args.length > 0) {
			for (int i = 0; i < args.length; i++) {
				if (args[i] instanceof HttpServletRequest) {
					return i;
				}
			}
		}
		return -1;
	}

	private HashMap findReqParmFromJoinPoint(JoinPoint joinPoint) {
		HashMap obj = null;
		Object[] args = joinPoint.getArgs();
		for (int i = 0; i < args.length; i++) {
			if (args[i] instanceof HashMap) {
				obj = (HashMap) args[i];
				break;
			}
		}
		return obj;
	}

	private EIResponse findBaseObjectFromJoinPoint(JoinPoint joinPoint) {
		EIResponse obj = null;
		Object[] args = joinPoint.getArgs();
		for (int i = 0; i < args.length; i++) {
			if (args[i] instanceof EIResponse) {
				obj = (EIResponse) args[i];
				break;
			}
		}
		return obj;
	}

}
