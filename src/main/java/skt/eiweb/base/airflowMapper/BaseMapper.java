package skt.eiweb.base.airflowMapper;

import java.util.Map;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.base.airflowMapper
 * @Filename     : BaseMapper.java
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
@SuppressWarnings("rawtypes")
public interface BaseMapper {

	public Map selectVersion() throws Exception;

}
