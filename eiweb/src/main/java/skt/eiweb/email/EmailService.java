package skt.eiweb.email;

import javax.mail.MessagingException;

import skt.eiweb.email.model.EmailModel;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.email
 * @Filename     : EmailService.java
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
public interface EmailService {

	public int send(EmailModel model) throws MessagingException;

}
