package skt.eiweb.code;

import java.util.HashMap;
import java.util.List;

import skt.eiweb.code.model.CommonCodeDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.code
 * @Filename     : CommonCodeService.java
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
public interface CommonCodeService {

	public List<CommonCodeDto> getList(CommonCodeDto dto) throws Exception;

	public CommonCodeDto getCode(String groupCode, String code) throws Exception;

	public HashMap<String, String> getCodesByGroupCode(String groupCode) throws Exception;

	public List<CommonCodeDto> getGroupList() throws Exception;

	public List<CommonCodeDto> getGroupList(CommonCodeDto dto) throws Exception;

	public int insertCodeGroup(CommonCodeDto dto) throws Exception;

	public int updateCodeGroup(CommonCodeDto dto) throws Exception;

	public int insertCode(CommonCodeDto dto) throws Exception;

	public int updateCode(CommonCodeDto dto) throws Exception;

	public int deleteCodeGroup(CommonCodeDto dto) throws Exception;

	public int deleteCode(CommonCodeDto dto) throws Exception;

	public int deleteCodeAll(CommonCodeDto dto) throws Exception;

}
