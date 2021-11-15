package skt.eiweb.base.model;

import java.util.List;
import java.util.Map;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.base.model
 * @Filename     : EIResponse.java
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
@SuppressWarnings("rawtypes")
public class EIResponse {

	public static String SUCCESS = "ok";
	public static String FAIL = "fail";

	private String result;
	private String message;
	private String value;
	private String errCode;
	private List list;
	private Map data;

	public void setResponse(String result, String message) {
		this.result = result;
		this.message = message;
	}

	public void setResponse(String result, String message, String value) {
		this.result = result;
		this.message = message;
		this.value = value;
	}

	public void setResponse(String result, String message, String value, String errCode) {
		this.result = result;
		this.message = message;
		this.value = value;
		this.errCode = errCode;
	}

	public void setResponse(String result, List list, Map data) {
		this.result = result;
		this.list = list;
		this.data = data;
	}

	public void setResponse(String result, String message, List list, Map data) {
		this.result = result;
		this.message = message;
		this.list = list;
		this.data = data;
	}

}
