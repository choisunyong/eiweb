package skt.eiweb.exception;

import javax.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.base.model.EIResponse;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.exception
 * @Filename     : ExceptionHandlerAdvice.java
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
@ControllerAdvice
public class ExceptionHandlerAdvice {

	@ExceptionHandler({
		UnauthorizedException.class
	})
	@ResponseStatus(value = HttpStatus.OK)
	@ResponseBody
	public ResponseEntity<EIResponse> UnauthorizedExceptionHandler(HttpServletRequest request, Exception e) {
		log.info(e.getMessage());
		return new ResponseEntity<EIResponse>(createErrorResponse(request), HttpStatus.OK);
	}

	private EIResponse createErrorResponse(HttpServletRequest request) {
		EIResponse res = new EIResponse();
		res.setResponse(EIResponse.FAIL, "재로그인이 필요합니다.");
		res.setErrCode("401");
		return res;
	}

}
