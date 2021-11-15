package skt.eiweb.email.model;

import java.util.HashMap;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.email.model
 * @Filename     : EmailModel.java
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
@Data
@NoArgsConstructor
@AllArgsConstructor
public class EmailModel {

	private String subject; // 메일제목
	private String toEmail; // 받는사람
	private String template; // 메일 템플릿(thymeleaf)
	private HashMap<String, String> variable; // 메일 내용 바인드 값

}
