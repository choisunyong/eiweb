package skt.eiweb.utils;

import java.text.SimpleDateFormat;
import java.util.Date;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.config.Constant;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.utils
 * @Filename     : CheckTime.java
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
public class CheckTime {

	long before;
	String beforeCheckPoint;
	String checkName;
	int printCondition = 0;

	public CheckTime(Class<?> cls) {
		this.before = System.currentTimeMillis();
		this.beforeCheckPoint = "init";
		this.checkName = cls.getSimpleName();
	}

	public CheckTime(Class<?> cls, int printCond) {
		this(cls);
		this.printCondition = printCond;
	}

	public CheckTime(String name) {
		this.before = System.currentTimeMillis();
		this.beforeCheckPoint = "init";
		this.checkName = name;
	}

	public CheckTime(String name, int printCond) {
		this(name);
		this.printCondition = printCond;
	}

	public void reset() {
		this.before = 0;
	}

	public long getBefore() {
		return this.before;
	}

	public String getName() {
		return this.checkName;
	}

	public void check(String checkpoint) {
		long curr = System.currentTimeMillis();
		if (this.before != 0 && curr - this.before >= this.printCondition) {
			log.info(this.checkName + " : between " + this.beforeCheckPoint + " and " + checkpoint + " = " + (curr - this.before));
		}
		this.beforeCheckPoint = checkpoint;
		this.before = curr;
	}

	public long checkAndGet(String checkpoint) {
		long curr = System.currentTimeMillis();
		long duration = 0;

		if (this.before != 0 && curr - this.before >= this.printCondition) {
			duration = curr - this.before;
			log.info(this.checkName + " : between " + this.beforeCheckPoint + " and " + checkpoint + " = " + duration);
		}
		this.beforeCheckPoint = checkpoint;
		this.before = curr;

		return duration;
	}

	public void check(String checkpoint, int expectMinTime) {
		long curr = System.currentTimeMillis();
		if (this.before != 0 && curr - this.before >= expectMinTime) {
			log.info(this.checkName + " : between " + this.beforeCheckPoint + " and " + checkpoint + " = " + (curr - this.before));
		}
		this.beforeCheckPoint = checkpoint;
		this.before = curr;
	}

	public void endAndPrintLog(boolean isSuccess, String errorMsg) {
		String checkpoint = "end";
		long curr = System.currentTimeMillis();
		long duration = 0;

		if (this.before != 0 && curr - this.before >= this.printCondition) {
			duration = curr - this.before;
		}
		this.beforeCheckPoint = checkpoint;
		this.before = curr;

		endAndPrintLog(isSuccess, errorMsg, duration);
	}

	public void endAndPrintLog(boolean isSuccess, String errorMsg, long duration) {
		SimpleDateFormat fmt = new SimpleDateFormat(Constant.DATE_FORMAT_X);
		String startTime = fmt.format(new Date(getBefore()));
		log.debug("{}, isSuccess={}, errorMsg={}, start={}, duration={}", getName(), isSuccess, errorMsg, startTime, duration);
	}

}
