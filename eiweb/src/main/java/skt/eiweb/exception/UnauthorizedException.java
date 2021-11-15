package skt.eiweb.exception;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.exception
 * @Filename     : UnauthorizedException.java
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
public class UnauthorizedException extends Exception {

	private static final long serialVersionUID = 8290725892922793344L;

	public UnauthorizedException() {
	}

	public UnauthorizedException(String message) {
		super(message);
	}

	public UnauthorizedException(Throwable cause) {
		super(cause);
	}

	@Override
	public String toString() {
		return "UnauthorizedException: " + getMessage();
	}

}
