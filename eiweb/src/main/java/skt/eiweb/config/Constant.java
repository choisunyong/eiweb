package skt.eiweb.config;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.config
 * @Filename     : Constant.java
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
public class Constant {

	// date formatter
	public static final String DATE_FORMAT_Z = "yyyy-MM-dd'T'HH:mm:ss.SSS'Z'";
	public static final String DATE_FORMAT_X = "yyyy-MM-dd'T'HH:mm:ss.SSS'+09'";
	public static final String DATE_FORMAT_6S = "yyyy-MM-dd HH:mm:ss.SSSSSS";
	public static final String DATE_FORMAT_3S = "yyyy-MM-dd HH:mm:ss.SSS";

	// time in millisec
	public static final long SECOND_MILLI = 1000L;
	public static final long MINUTE_MILLI = 60 * SECOND_MILLI;
	public static final long HOUR_MILLI = 60 * MINUTE_MILLI;
	public static final long DAY_MILLI = 24 * HOUR_MILLI;

	// session attribute
	public static final String SPRING_SECURITY_CONTEXT = "SPRING_SECURITY_CONTEXT";

	// login
	public static final String ANONYMOUS_USER = "anonymousUser";

}
