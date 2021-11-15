package skt.eiweb.base;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import skt.eiweb.config.Constant;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.base
 * @Filename     : EIProperties.java
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
@Data
@NoArgsConstructor
@AllArgsConstructor
@Component
@ConfigurationProperties("eiconfig")
public class EIProperties {

	private String uploadpath;
	private String filepath;
	private String uploadextensions;
	private boolean developing;
	private String dagspath;
	private String dagtmplpath;
	private String managerurl;
	private int maxFileNameLen = 90;
	private String resultpath;
	private long maxInactiveInterval = Constant.HOUR_MILLI; // 기본 1시간

}
