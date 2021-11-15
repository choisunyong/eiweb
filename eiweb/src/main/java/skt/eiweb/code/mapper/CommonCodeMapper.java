package skt.eiweb.code.mapper;

import java.util.List;

import skt.eiweb.code.model.CommonCodeDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.code.mapper
 * @Filename     : CommonCodeMapper.java
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
public interface CommonCodeMapper {

	public List<CommonCodeDto> selectCommonCodeList(CommonCodeDto dto) throws Exception;

	public CommonCodeDto selectCommonCode(CommonCodeDto dto) throws Exception;

	public List<CommonCodeDto> selectCodesByGroupCode(CommonCodeDto dto) throws Exception;

	public List<CommonCodeDto> selectCommonGroupList(CommonCodeDto dto) throws Exception;

	public int insertCodeGroup(CommonCodeDto dto) throws Exception;

	public int updateCodeGroup(CommonCodeDto dto) throws Exception;

	public int insertCode(CommonCodeDto dto) throws Exception;

	public int updateCode(CommonCodeDto dto) throws Exception;

	public int deleteCodeGroup(CommonCodeDto dto) throws Exception;

	public int deleteCode(CommonCodeDto dto) throws Exception;

}
