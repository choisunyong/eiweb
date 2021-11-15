package skt.eiweb.aop;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.util.StopWatch;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.config.Constant;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.aop
 * @Filename     : SchedulerAspect.java
 * 
 * All rights reserved. No part of this work may be reproduced, stored in a
 * retrieval system, or transmitted by any means without prior written
 * permission of SKT corp.
 * 
 * Copyright(c) 2020 SKT corp. All rights reserved
 * =================================================================================
 *  No     DATE              Description
 * =================================================================================
 *  1.0	   2020. 10. 7.      Initial Coding & Update
 * =================================================================================
 */
@Slf4j
@Aspect
@Component
public class SchedulerAspect {

	@Pointcut("execution(* skt.eiweb.schedule.*.*(..))")
	public void scheduler() {
	}

	@Pointcut("@annotation(org.springframework.scheduling.annotation.Scheduled) && @annotation(scheduled)")
	public void scheduledAnnotation(Scheduled scheduled) {
	}

	@Around(value = "scheduler() && scheduledAnnotation(scheduled)", argNames = "scheduled")
	public Object onAroundProcessHandler(ProceedingJoinPoint joinPoint, Scheduled scheduled) throws Throwable {
		String target = joinPoint.getTarget().getClass().getSimpleName().concat(".").concat(joinPoint.getSignature().getName()).concat("(..)");
		log.debug("scheduled.cron={}, target={}", scheduled.cron(), target);

		StopWatch sw = new StopWatch();
		sw.start();
		Object result = joinPoint.proceed();
		sw.stop();

		Long total = sw.getTotalTimeMillis();

		if (total > Constant.SECOND_MILLI) { // 1초 이상 걸리면
			log.info("[executionTime] target={}, total={}(ms)", target, total);
		}

		return result;
	}

}
