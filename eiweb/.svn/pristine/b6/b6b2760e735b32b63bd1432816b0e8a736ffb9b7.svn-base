package skt.eiweb.base;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import skt.eiweb.base.airflowMapper.BaseMapper;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.base
 * @Filename     : BaseService.java
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
@Service
public class BaseService {

	@Autowired
	BaseMapper mapper;

	@SuppressWarnings({
		"rawtypes", "unchecked"
	})
	public HashMap nock() throws Exception {
		HashMap res = new HashMap();
		res.put("airflow", mapper.selectVersion());
		return res;
	}

}
