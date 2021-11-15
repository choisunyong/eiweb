package skt.eiweb;

import javax.annotation.Resource;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.filter.CharacterEncodingFilter;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.base.EIProperties;
import skt.eiweb.file.FileService;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb
 * @Filename     : EiwebApplication.java
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
@Slf4j
@Configuration
@SpringBootApplication
public class EiwebApplication implements CommandLineRunner {

	@Resource
	FileService fileService;

	@Autowired
	private EIProperties props;

	public static void main(String[] args) {
		SpringApplication.run(EiwebApplication.class, args);

		/* @formatter:off */
		log.info("\n========================================================="
			   + "\n                                                         "
			   + "\n    EI WEB                                               "
			   + "\n                                                         "
			   + "\n=========================================================");
		/* @formatter:on */
	}

	@Override
	public void run(String... arg) throws Exception {
		fileService.init(props.getUploadpath()); // 파일 업로드 디렉토리 생성
	}

	@Bean
	public CharacterEncodingFilter buildCharacterEncodingFilter() {
		CharacterEncodingFilter filter = new CharacterEncodingFilter();
		filter.setEncoding("UTF-8");
		filter.setForceEncoding(true);
		return filter;
	}

}
