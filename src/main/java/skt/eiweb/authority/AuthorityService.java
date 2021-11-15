package skt.eiweb.authority;

import java.util.ArrayList;
import java.util.Collection;
import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import skt.eiweb.authority.mapper.UserMapper;
import skt.eiweb.authority.model.LoginHist;
import skt.eiweb.authority.model.User;
import skt.eiweb.code.CommonCodeService;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.authority
 * @Filename     : AuthorityService.java
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
@Service
public class AuthorityService implements UserDetailsService {

	@Autowired
	private AccountRepository repository;

	@Autowired
	UserMapper mapper;

	@Autowired
	private CommonCodeService commonCodeService;

	@Autowired
	private PasswordEncoder passwordEncoder;

	public AuthorityService(AccountRepository repository, PasswordEncoder passwordEncoder) {
		this.repository = repository;
	}

	@SuppressWarnings("serial")
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		User user = repository.findByLoginId(username);
		UserDetails userDetails = new UserDetails() {
			@Override
			public boolean isEnabled() {
				return false;
			}

			@Override
			public boolean isCredentialsNonExpired() {
				return false;
			}

			@Override
			public boolean isAccountNonLocked() {
				return false;
			}

			@Override
			public boolean isAccountNonExpired() {
				return false;
			}

			@Override
			public String getUsername() {
				return user.getUserId();
			}

			@Override
			public String getPassword() {
				return user.getPassword();
			}

			@SuppressWarnings({
				"unchecked", "rawtypes"
			})
			@Override
			public Collection<? extends GrantedAuthority> getAuthorities() {
				List<GrantedAuthority> auth = new ArrayList();
				auth.add(new SimpleGrantedAuthority("ROLE_" + user.getUserPermission()));
				return auth;
			}
		};

		return userDetails;
	}

	/**
	 * 사용자 추가
	 */
	public int signup(HashMap<String, String> parm) throws Exception {
		User user = new User();
		user.setUserId(parm.get("loginId"));
		user.setUserEmail(parm.get("emailfirst") + "@" + parm.get("emaillast"));
		user.setPassword(parm.get("pw"));
		user.setUserName(parm.get("name"));
		user.setUserPermission(parm.get("role") == null ? "GUEST" : parm.get("role"));
		user.setPassword(passwordEncoder.encode(user.getPassword()));

		return mapper.insertUser(user);
	}

	/**
	 * 관리자 계정 초기화
	 */
	public int initAdmin() throws Exception {
		User admin = new User();
		HashMap<String, String> adminCodes = commonCodeService.getCodesByGroupCode("INIT_ADMIN_INFO");

		admin.setUserId(adminCodes.get("ID"));
		List<User> list = this.getUserInfo(admin);
		if (list.size() > 0) { // 이미 생성되어 있으면 비밀번호만 초기화
			admin.setPassword(adminCodes.get("PW"));
			admin.setPassword(passwordEncoder.encode(admin.getPassword()));
			return mapper.updatePassword(admin);
		}
		admin.setUserName("관리자");
		admin.setUserEmail(adminCodes.get("EMAIL"));
		admin.setPassword(adminCodes.get("PW"));
		admin.setUserPermission("ADMIN");
		admin.setActivate("1");
		admin.setPassword(passwordEncoder.encode(admin.getPassword()));

		return mapper.insertUser(admin);
	}

	/**
	 * 사용자 정보
	 */
	public List<User> getUserInfo(User user) throws Exception {
		return mapper.selectUser(user);
	}

	/**
	 * 비밀번호 비교
	 */
	public boolean chkPassword(User user, String inputPassword) {
		return passwordEncoder.matches(inputPassword, user.getPassword());
	}

	/**
	 * 세션 아이디로 사용자 정보
	 */
	public User getUserInfoBySessionId(LoginHist hist) throws Exception {
		return mapper.selectUserBySessionId(hist);
	}

	/**
	 * 로그인 이력 저장
	 */
	public int insertLoginHist(LoginHist hist) throws Exception {
		return mapper.insertLoginHist(hist);
	}

	/**
	 * 비밀번호로 사용자 정보
	 */
	public User getUserInfoByPw(User user) throws Exception {
		return mapper.selectUserByPw(user);
	}

	/**
	 * 비밀번호 변경
	 */
	public int changePassword(User user) throws Exception {
		user.setPassword(passwordEncoder.encode(user.getPassword()));
		return mapper.updatePassword(user);
	}

	/**
	 * 사용자 정보 저장
	 */
	public int save(User user) throws Exception {
		int ret = 0;
		User usr = new User();
		usr.setUserId(user.getUserId());
		List<User> list = this.getUserInfo(usr);

		if (list.size() > 0) { // update
			if (user.getPassword() != null) {
				user.setPassword(passwordEncoder.encode(user.getPassword()));
				ret = mapper.updatePassword(user);
			}
			ret += mapper.updateUser(user);
		} else { // insert
			user.setPassword(passwordEncoder.encode(user.getPassword()));
			ret = mapper.insertUser(user);
		}

		return ret;
	}

}
