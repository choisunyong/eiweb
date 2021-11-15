package skt.eiweb.code;

import java.util.HashMap;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import skt.eiweb.code.mapper.CommonCodeMapper;
import skt.eiweb.code.model.CommonCodeDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.code
 * @Filename     : CommonCodeServiceImpl.java
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
public class CommonCodeServiceImpl implements CommonCodeService {

	@Autowired
	CommonCodeMapper mapper;

	/**
	 * 공통 코드 리스트
	 */
	@Override
	public List<CommonCodeDto> getList(CommonCodeDto dto) throws Exception {
		return mapper.selectCommonCodeList(dto);
	}

	/**
	 * 공통 코드 정보
	 */
	@Override
	public CommonCodeDto getCode(String groupCode, String code) throws Exception {
		CommonCodeDto dto = new CommonCodeDto();
		dto.setGroupCode(groupCode);
		dto.setCode(code);
		return mapper.selectCommonCode(dto);
	}

	/**
	 * 해당 공통 코드 그룹 코드 리스트
	 */
	@Override
	public HashMap<String, String> getCodesByGroupCode(String groupCode) throws Exception {
		HashMap<String, String> ret = new HashMap<String, String>();
		CommonCodeDto code = new CommonCodeDto();
		code.setGroupCode(groupCode);
		List<CommonCodeDto> list = mapper.selectCodesByGroupCode(code);
		for (CommonCodeDto dto : list) {
			ret.put(dto.getCode(), dto.getValue());
		}
		return ret;
	}

	/**
	 * 코드 그룹 리스트
	 */
	@Override
	public List<CommonCodeDto> getGroupList() throws Exception {
		return mapper.selectCommonGroupList(new CommonCodeDto());
	}

	/**
	 * 코드 그룹 리스트
	 */
	@Override
	public List<CommonCodeDto> getGroupList(CommonCodeDto dto) throws Exception {
		return mapper.selectCommonGroupList(dto);
	}

	/**
	 * 코드 그룹 추가
	 */
	@Override
	public int insertCodeGroup(CommonCodeDto dto) throws Exception {
		return mapper.insertCodeGroup(dto);
	}

	/**
	 * 코드 그룹 수정
	 */
	@Override
	public int updateCodeGroup(CommonCodeDto dto) throws Exception {
		return mapper.updateCodeGroup(dto);
	}

	/**
	 * 공통 코드 추가
	 */
	@Override
	public int insertCode(CommonCodeDto dto) throws Exception {
		return mapper.insertCode(dto);
	}

	/**
	 * 공통 코드 수정
	 */
	@Override
	public int updateCode(CommonCodeDto dto) throws Exception {
		return mapper.updateCode(dto);
	}

	/**
	 * 코드 그룹 삭제
	 */
	@Override
	public int deleteCodeGroup(CommonCodeDto dto) throws Exception {
		return mapper.deleteCodeGroup(dto);
	}

	/**
	 * 공통 코드 삭제
	 */
	@Override
	public int deleteCode(CommonCodeDto dto) throws Exception {
		return mapper.deleteCode(dto);
	}

	/**
	 * 해당 코드 그룹의 코드 전체 삭제
	 */
	@Override
	public int deleteCodeAll(CommonCodeDto dto) throws Exception {
		CommonCodeDto d = new CommonCodeDto();
		d.setGroupCode(dto.getGroupCode());
		return mapper.deleteCode(d);
	}

}
