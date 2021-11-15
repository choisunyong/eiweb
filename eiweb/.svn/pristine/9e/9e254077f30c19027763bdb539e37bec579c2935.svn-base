package skt.eiweb.utils;

import java.text.SimpleDateFormat;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.config.Constant;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.utils
 * @Filename     : SessionUtil.java
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
public class SessionUtil {

	public static HttpSession printCurrentSessionInfo(HttpServletRequest httpRequest) {
		HttpSession session = getCurrentSession(httpRequest);
		if (session != null) {
			SimpleDateFormat sdf = new SimpleDateFormat(Constant.DATE_FORMAT_X);
			log.debug("sessionId={}", session.getId());
			log.debug("creationTime={}", sdf.format(session.getCreationTime()));
			log.debug("lastAccessedTime={}", sdf.format(session.getLastAccessedTime()));
			log.debug("expireTime={}", sdf.format(session.getLastAccessedTime() + session.getMaxInactiveInterval() * Constant.SECOND_MILLI));
		}

		return session;
	}

	public static HttpSession getCurrentSession(HttpServletRequest httpRequest) {
		return httpRequest.getSession(false);
	}

}
