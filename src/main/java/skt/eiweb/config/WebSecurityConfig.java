package skt.eiweb.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.factory.PasswordEncoderFactories;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.config
 * @Filename     : WebSecurityConfig.java
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
@Configuration
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class WebSecurityConfig extends WebSecurityConfigurerAdapter {

	public static final String[] API_ANONYMOUS_URL_TO_PERMIT = {
		"/nock",
		"/login",
		"/logout",
		"/chkLogin",
		"/chkId",
		"/signup",
		"/changeUserPw",
		"/initAdmin",
		"/code/**",
		"/docker",
		"/machine",
		"/model",
		"/server",
		"/kill",
	};

	public static final String[] RESOURCE_URL_TO_PERMIT = {
		"/favicon.ico",
		"/**/*.png",
		"/**/*.gif",
		"/**/*.svg",
		"/**/*.jpg",
		"/**/*.html",
		"/**/*.css",
		"/**/*.ttf",
		"/**/*.less",
		"/**/*.json",
		"/**/*.otf",
		"/**/*.eot",
		"/**/*.woff",
		"/**/*.html",
		"/**/*.js"
	};

	public static final String[] API_ROOT_URL = {
		"/model/**",
		"/service/**",
		"/admin/**",
		"/dashboard/**",
		"/email/**",
		"/file/**"
	};

	@Override
	protected void configure(HttpSecurity http) throws Exception {
		/* @formatter:off */
		http.csrf().disable()
			.authorizeRequests()
			.antMatchers(API_ANONYMOUS_URL_TO_PERMIT).permitAll()
			.antMatchers(RESOURCE_URL_TO_PERMIT).permitAll()
			.antMatchers(API_ROOT_URL).permitAll()
			.anyRequest().authenticated()
			.and()
			.formLogin()
			.loginPage("/")
			.permitAll()
			.and()
			.logout()
			.invalidateHttpSession(true)
			.clearAuthentication(true)			
			.permitAll();
		http.csrf().disable();
		/* @formatter:on */
	}

	@Bean
	public PasswordEncoder passwordEncoder() {
		return PasswordEncoderFactories.createDelegatingPasswordEncoder();
	}

}
