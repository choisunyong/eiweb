package skt.eiweb.authority;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.authority.mapper.UserMapper;
import skt.eiweb.authority.model.User;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.authority
 * @Filename     : AccountRepository.java
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
@Repository
public class AccountRepository {

	@Autowired
	UserMapper mapper;

	public User findByLoginId(String username) {
		User ret = null;
		User user = new User();
		user.setUserId(username);

		List<User> users;
		try {
			users = mapper.selectUser(user);
			for (int i = 0; i < users.size(); i++) {
				ret = users.get(i);
			}
		} catch (Exception e) {
			log.error(e.getMessage(), e);
		}

		return ret;
	}

}
