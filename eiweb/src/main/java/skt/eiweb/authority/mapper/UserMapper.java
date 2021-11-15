package skt.eiweb.authority.mapper;

import java.util.List;

import skt.eiweb.authority.model.LoginHist;
import skt.eiweb.authority.model.User;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.authority.mapper
 * @Filename     : UserMapper.java
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
public interface UserMapper {

	public int insertUser(User user) throws Exception;

	public List<User> selectUser(User user) throws Exception;

	public int insertLoginHist(LoginHist hist) throws Exception;

	public User selectUserBySessionId(LoginHist hist) throws Exception;

	public User selectUserByPw(User user) throws Exception;

	public int updatePassword(User user) throws Exception;

	public List<User> selectUserPage(User user) throws Exception;

	public int selectUserPageTotalCount(User user) throws Exception;

	public int updateUser(User user) throws Exception;

	public int deleteUser(User user) throws Exception;

}
