package skt.eiweb.code;

import java.util.HashMap;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.base.model.EIResponse;
import skt.eiweb.code.model.CommonCodeDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.code
 * @Filename     : CommonCodeController.java
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
@Slf4j
@CrossOrigin(origins = "*", allowedHeaders = "*")
@RestController
@RequestMapping("/code")
@SuppressWarnings({
	"rawtypes", "unused"
})
public class CommonCodeController {

	@Autowired
	private CommonCodeService commonCodeService;

	/**
	 * 공통 코드 리스트 조회
	 */
	@PostMapping("/list")
	public EIResponse getList(@RequestParam HashMap parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		CommonCodeDto dto = new CommonCodeDto();

		if (parm.get("groupCode") != null) {
			dto.setGroupCode(parm.get("groupCode").toString());
		}
		if (parm.get("groupUseYn") != null) {
			dto.setGroupUseYn(parm.get("groupUseYn").toString());
		}
		if (parm.get("useYn") != null) {
			dto.setUseYn(parm.get("useYn").toString());
		}
		if (parm.get("allFlag") != null) {
			dto.setAllFlag(parm.get("allFlag").toString());
		}

		try {
			List<CommonCodeDto> list = commonCodeService.getList(dto);
			res.setResponse(EIResponse.SUCCESS, list, null);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "공통코드 가져오기 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 공통 코드 그룹 리스트 조회
	 */
	@PostMapping("/groupList")
	@Secured("ROLE_ADMIN")
	public EIResponse getGroupList(@RequestParam HashMap parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();

		try {
			List<CommonCodeDto> list = commonCodeService.getGroupList();
			res.setResponse(EIResponse.SUCCESS, list, null);
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "공통 코드 그룹 리스트 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 공통 코드 그룹 저장
	 */
	@PostMapping("/saveCodeGroup")
	@Secured("ROLE_ADMIN")
	public EIResponse saveCodeGroup(@RequestParam HashMap parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		CommonCodeDto dto = new CommonCodeDto();
		// 기존 데이터 유뮤
		dto.setGroupCode(parm.get("groupCode").toString());
		boolean insFlag = parm.get("saveType").toString().equals("ins");
		int ret = 0;

		try {
			List<CommonCodeDto> list = commonCodeService.getGroupList(dto);
			dto.setGroupName(parm.get("groupName").toString());
			dto.setGroupUseYn(parm.get("groupUseYn").toString());
			if (insFlag) {
				if (list.size() > 0) {
					res.setResponse(EIResponse.FAIL, "동일 코드 그룹이 존재합니다.");
				} else {
					ret = commonCodeService.insertCodeGroup(dto);
					if (ret > 0) {
						res.setResponse(EIResponse.SUCCESS, "코드 그룹 추가되었습니다.");
					} else {
						res.setResponse(EIResponse.FAIL, "코드 그룹 추가 실패");
					}
				}
			} else {
				if (list.size() > 0) {
					ret = commonCodeService.updateCodeGroup(dto);
					if (ret > 0) {
						res.setResponse(EIResponse.SUCCESS, "코드 그룹 수정되었습니다.");
					} else {
						res.setResponse(EIResponse.FAIL, "코드 그룹 수정 실패");
					}
				} else {
					res.setResponse(EIResponse.FAIL, "코드 그룹이 존재하지 않습니다.");
				}
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "공통 코드 그룹 저장 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 공통 코드 저장
	 */
	@PostMapping("/saveCode")
	@Secured("ROLE_ADMIN")
	public EIResponse saveCode(@RequestParam HashMap parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		CommonCodeDto dto = new CommonCodeDto();
		// 기존 데이터 유뮤
		dto.setGroupCode(parm.get("groupCode").toString());
		dto.setCode(parm.get("code").toString());
		boolean insFlag = parm.get("saveType").toString().equals("ins");
		int ret = 0;

		try {
			List<CommonCodeDto> list = commonCodeService.getList(dto);
			dto.setCodeName(parm.get("codeName").toString());
			dto.setUseYn(parm.get("useYn").toString());
			if (parm.get("value") != null) {
				dto.setValue(parm.get("value").toString());
			}
			if (parm.get("sort") != null) {
				dto.setSort(parm.get("sort").toString());
			}
			if (insFlag) {
				if (list.size() > 0) {
					res.setResponse(EIResponse.FAIL, "동일 코드가 존재합니다.");
				} else {
					ret = commonCodeService.insertCode(dto);
					if (ret > 0) {
						res.setResponse(EIResponse.SUCCESS, "코드 추가되었습니다.");
					} else {
						res.setResponse(EIResponse.FAIL, "코드 추가 실패");
					}
				}
			} else {
				if (list.size() > 0) {
					ret = commonCodeService.updateCode(dto);
					if (ret > 0) {
						res.setResponse(EIResponse.SUCCESS, "코드 수정되었습니다.");
					} else {
						res.setResponse(EIResponse.FAIL, "코드 수정 실패");
					}
				} else {
					res.setResponse(EIResponse.FAIL, "코드가 존재하지 않습니다.");
				}
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "공통 코드 저장 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 공통 코드 그룹 삭제
	 */
	@PostMapping("/deleteCodeGroup")
	@Secured("ROLE_ADMIN")
	public EIResponse deleteCodeGroup(@RequestParam HashMap parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		CommonCodeDto dto = new CommonCodeDto();
		dto.setGroupCode(parm.get("groupCode").toString());
		boolean deleteCodeAll = false;

		if (parm.get("deleteCodeAll") != null) {
			deleteCodeAll = parm.get("deleteCodeAll").equals("true");
		}
		int ret = 0;

		try {
			// 기존 데이터 유뮤
			List<CommonCodeDto> list = commonCodeService.getGroupList(dto);
			if (list.size() < 1) {
				res.setResponse(EIResponse.FAIL, "존재하지 않는 코드 그룹입니다.");
			} else {
				// 하위 코드 존재유무 확인
				list = commonCodeService.getList(dto);
				if (list.size() > 0) {
					if (deleteCodeAll) {
						// 하위 코드 전체 삭제
						if (commonCodeService.deleteCodeAll(dto) > 0) {
							ret = commonCodeService.deleteCodeGroup(dto);
							if (ret > 0) {
								res.setResponse(EIResponse.SUCCESS, "코드 그룹 삭제 되었습니다.");
							} else {
								res.setResponse(EIResponse.FAIL, "코드 그룹 삭제 실패");
							}
						}
					} else {
						res.setResponse(EIResponse.FAIL, "코드가 존재합니다. 하위 코드 전체 삭제하시겠습니까?", "reqDeleteCodeAll");
					}
				} else {
					ret = commonCodeService.deleteCodeGroup(dto);
					if (ret > 0) {
						res.setResponse(EIResponse.SUCCESS, "코드 그룹 삭제 되었습니다.");
					} else {
						res.setResponse(EIResponse.FAIL, "코드 그룹 삭제 실패");
					}
				}
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "공통 코드 그룹 삭제 실패");
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * 공통 코드 삭제
	 */
	@PostMapping("/deleteCode")
	@Secured("ROLE_ADMIN")
	public EIResponse deleteCode(@RequestParam HashMap parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		CommonCodeDto dto = new CommonCodeDto();
		dto.setGroupCode(parm.get("groupCode").toString());
		dto.setCode(parm.get("code").toString());
		int ret = 0;

		try {
			List<CommonCodeDto> list = commonCodeService.getList(dto);
			if (list.size() < 1) {
				res.setResponse(EIResponse.FAIL, "존재하지 않는 코드입니다.");
			} else {
				ret = commonCodeService.deleteCode(dto);
				if (ret < 1) {
					res.setResponse(EIResponse.FAIL, "공통 코드 삭제 실패");
				} else {
					res.setResponse(EIResponse.SUCCESS, "코드 삭제 되었습니다.");
				}
			}
		} catch (Exception e) {
			res.setResponse(EIResponse.FAIL, "공통 코드 삭제 실패");
			e.printStackTrace();
		}

		return res;
	}

}
