package skt.eiweb.email;

import java.util.Iterator;
import java.util.Set;

import javax.mail.MessagingException;
import javax.mail.internet.MimeMessage;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring5.SpringTemplateEngine;

import skt.eiweb.email.model.EmailModel;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.email
 * @Filename     : EmailServiceImpl.java
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
public class EmailServiceImpl implements EmailService {

	@Autowired
	private JavaMailSender javaMailSender;

	@Autowired
	private SpringTemplateEngine templateEngine;

	/**
	 * 이메일 전송
	 */
	@Override
	@SuppressWarnings("rawtypes")
	public int send(EmailModel model) {
		int ret = -1;
		MimeMessage message = javaMailSender.createMimeMessage();
		MimeMessageHelper helper;

		try {
			helper = new MimeMessageHelper(message, true);
			helper.setSubject(model.getSubject()); // 수신자 설정
			helper.setTo(model.getToEmail()); // 템플릿에 전달할 데이터 설정
			Context context = new Context();

			Set set = model.getVariable().keySet();
			Iterator iterator = set.iterator();
			while (iterator.hasNext()) {
				String key = (String) iterator.next();
				context.setVariable(key, model.getVariable().get(key)); // 메일 내용 설정 : 템플릿 프로세스
			}

			String html = templateEngine.process(model.getTemplate(), context);
			helper.setText(html, true); // 메일 보내기
			javaMailSender.send(message);
			ret = 1;
		} catch (MessagingException e) {
			ret = -1;
		}

		return ret;
	}

}
