package skt.eiweb.model;

import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.annotation.Secured;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.authority.AuthorityService;
import skt.eiweb.authority.model.User;
import skt.eiweb.base.EIProperties;
import skt.eiweb.base.model.EIResponse;
import skt.eiweb.file.FileService;
import skt.eiweb.file.model.File;
import skt.eiweb.manager.ManagerService;
import skt.eiweb.model.model.Model;
import skt.eiweb.model.model.ModelDto;
import skt.eiweb.utils.FileUtil;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.model
 * @Filename     : ModelController.java
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
@RequestMapping("/model")
@SuppressWarnings({
	"rawtypes", "unchecked", "unused"
})
public class ModelController {
	private static final Logger logger = LogManager.getLogger(ModelController.class);

	@Autowired
	ModelService modelService;

	@Autowired
	AuthorityService authorityService;

	@Autowired
	FileService fileService;

	@Autowired
	EIProperties props;

	@Autowired
	ManagerService managerService;

	/**
	 * ?????? ????????? ??????
	 */
	@PostMapping("/list")
	@Secured({
		"ROLE_MODELER", "ROLE_ADMIN"
	})
	public EIResponse getList(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		Model model = new Model();
		model.setModelId(parm.get("modelId"));

		if ("all".equals(parm.get("page"))) {
			model.setPage(1);
			model.setPageCount(9999999);
		} else {
			if (parm.get("page") != null) {
				model.setPage(Integer.parseInt(parm.get("page")));
			}
			if (parm.get("pageCount") != null) {
				model.setPageCount(Integer.parseInt(parm.get("pageCount")));
			}
		}
		if (parm.get("schKey") != null && parm.get("schType") != null) {
			model.setSchType(parm.get("schType"));
			model.setSchKey(parm.get("schKey"));
		}

		List<ModelDto> list;
		HashMap data;
		try {
			list = modelService.getList(model);
			data = new HashMap();
			data.put("totalCount", modelService.getTotalCount(model));
			data.put("page", model.getPage());
			data.put("pageCount", model.getPageCount());
			res.setResult(EIResponse.SUCCESS);
			res.setList(list);
			res.setData(data);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? ??????
	 */
	@PostMapping("/regist")
	@Secured({
		"ROLE_MODELER", "ROLE_ADMIN"
	})
	public EIResponse regist(@RequestParam HashMap<String, String> parm, @RequestParam("modelFileContext") MultipartFile uploadfile, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();

		Set<String> keys = parm.keySet();
		Model model = new Model();
		model.setModelName(parm.get("modelName"));
		model.setPriority(Integer.parseInt(parm.get("priority")));
		model.setBaseImage(parm.get("baseImage"));
		model.setLimitRuntime(Integer.parseInt(parm.get("limitRuntime")));
		model.setEvaluationStatus("init");
		String modelDesc = parm.get("modelDesc");
		if (modelDesc != null && !"".equals(modelDesc)) {
			model.setModelDesc(modelDesc);
		}
		model.setFileName(parm.get("fileName"));
		model.setFileSize(parm.get("fileSize"));

		try{
			String modelId = parm.get("modelId");
			boolean modify = false;

			// ?????? ???????????? ????????? ?????? ??????(??????)
			// ????????? ??????
			if (modelId != null) {
				modify = true;
			} else {
				modelId = modelService.makeNextModelId();
			}
			model.setModelId(modelId);

			// ????????? ?????? ??????
			int ret = modelService.chkModelName(model);
			if (ret > 0) {
				res.setResult(EIResponse.FAIL);
				res.setMessage("????????? ???????????? ???????????????.");
				return res;
			}

			// ????????? ?????? ????????????
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User user = new User();
			user.setPassword(auth.getCredentials().toString());
			user = authorityService.getUserInfoByPw(user);
			if (parm.get("developing") != null && "true".equals(parm.get("developing"))) {
				model.setUserId("admin");	// ?????????
			} else {
				model.setUserId(user.getUserId());
			}

			// ?????? ??????
			String savePath = props.getUploadpath() + "/" + model.getModelId();
			boolean isSuccess = FileUtil.makeDirectory(savePath);
			if (isSuccess) {
				Files.copy(uploadfile.getInputStream(), Paths.get(savePath).resolve(model.getFileName()));
			} else {
				logger.warn("Can not created path : [" + savePath + "]");
				res.setResult(EIResponse.FAIL);
				res.setMessage("???????????? ?????? ??????");
				return res;
			}

			// ?????? ??????/??????
			// System.out.println("####### userid			: [" + model.getUserId() + "]");
			// System.out.println("####### modelName		: [" + model.getModelName() + "]");
			// System.out.println("####### modelId			: [" + model.getModelId() + "]");
			// System.out.println("####### priority		: [" + model.getPriority() + "]");
			// System.out.println("####### baseImage		: [" + model.getBaseImage() + "]");
			// System.out.println("####### modelDesc		: [" + model.getModelDesc() + "]");
			// System.out.println("####### limitRuntime	: [" + model.getLimitRuntime() + "]");
			// System.out.println("####### evaluation		: [" + model.getEvaluationStatus() + "]");
			// System.out.println("####### fileName		: [" + model.getFileName() + "]");
			// System.out.println("####### fileSize		: [" + model.getFileSize() + "]");
			ret = modify ? modelService.updateModel(model) : modelService.registModel(model);
			if (ret > 0) {
				String created = "0";
				if (modify) {
					created = "1";
				}
				modelService.createHistory(modelId, created);
				res.setResult(EIResponse.SUCCESS);
			} else {
				res.setResult(EIResponse.FAIL);
				res.setMessage("?????? ?????? ??????");
			}
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ????????? ????????????
	 */
	@PostMapping("/chkModelName")
	@Secured({
		"ROLE_MODELER", "ROLE_ADMIN"
	})
	public EIResponse chkModelName(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		Model model = new Model();
		model.setModelName(parm.get("modelName"));

		if (parm.get("modelName") == null || model.getModelName().length() < 1) {
			res.setResult(EIResponse.FAIL);
			res.setMessage("???????????? ??????????????????.");
			return res;
		}

		try {
			int ret = modelService.chkModelName(model);
			if (ret > 0) {
				res.setResult(EIResponse.FAIL);
				res.setMessage("????????? ???????????? ???????????????.");
			} else {
				res.setResult(EIResponse.SUCCESS);
				res.setMessage("?????? ???????????????.");
			}
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return res;
	}
	/**
	 * ?????? ?????? ??????
	 */
	@PostMapping("/modelInfo")
	@Secured({
		"ROLE_MODELER", "ROLE_ADMIN"
	})
	public EIResponse modelInfo(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		String modelId = parm.get("modelId");

		try {
			ModelDto model = modelService.getModelInfo(modelId);
			List<File> files = new ArrayList<>();
			File file = new File();
			file.setFileName(model.getFileName());
			file.setFileSize(model.getFileSize());
			file.setFileExt(model.getBaseImage());
			files.add(file);
			HashMap m = new HashMap();
			m.put("modelInfo", model);
			res.setData(m);
			res.setList(files);
			res.setResult(EIResponse.SUCCESS);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? ?????? ??????
	 */
	@PostMapping("/modelHistInfo")
	@Secured({
		"ROLE_MODELER", "ROLE_ADMIN"
	})
	public EIResponse modelHistInfo(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		String modelId = parm.get("modelId");
		String regDate = parm.get("regDate");

		try {
			ModelDto model = modelService.getModelHistInfo(modelId, regDate);
			List<File> files = new ArrayList<>();
			File modelFile = new File();
			modelFile.setFileName(model.getFileName());
			modelFile.setFileSize(model.getFileSize());
			modelFile.setFileExt(model.getBaseImage());
			files.add(modelFile);
			HashMap m = new HashMap();
			m.put("modelInfo", model);
			res.setData(m);
			res.setList(files);
			res.setResult(EIResponse.SUCCESS);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? ?????? ?????? ??????
	 */
	@PostMapping("/regHistory")
	@Secured({
		"ROLE_ADMIN"
	})
	public EIResponse history(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		Model model = new Model();
		model.setModelId(parm.get("modelId"));

		if (parm.get("page") != null) {
			model.setPage(Integer.parseInt(parm.get("page")));
		}
		if (parm.get("schKey") != null && !"".equals(parm.get("schKey"))) {
			model.setSchKey(parm.get("schKey"));
		}
		if (parm.get("startDate") != null) {
			model.setStartDate(parm.get("startDate"));
		}
		if (parm.get("endDate") != null) {
			model.setEndDate(parm.get("endDate"));
		}
		if (parm.get("action") != null) {
			model.setAction(parm.get("action"));
		}

		List<ModelDto> list;
		HashMap data;
		try {
			list = modelService.getRegHistory(model);
			data = new HashMap();
			data.put("totalCount", modelService.getRegHistTotalCount(model));
			data.put("page", model.getPage());
			data.put("pageCount", model.getPageCount());
			res.setResult(EIResponse.SUCCESS);
			res.setList(list);
			res.setData(data);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

	/**
	 * ?????? ?????? ?????? (??????)
	 */
	@PostMapping("/modelTestReq")
	@Secured({
		"ROLE_ADMIN", "ROLE_MODELER"
	})
	public EIResponse modelTestReq(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();
		String modelId = parm.get("modelId");

		try{
			ModelDto model = modelService.getModelInfo(modelId);
			String modelFilePath = props.getUploadpath() + "/" + modelId + "/" + model.getFileName();
			System.out.println("######## MODEL FILE PATH : [" + modelFilePath + "]");

			HashMap<String, String> mngParm = new HashMap<>();
			mngParm.put("model_id", modelId);
			mngParm.put("model_file", modelFilePath);
			String mngRes = managerService.modelTestReq(mngParm);
			res.setResult(EIResponse.SUCCESS);
			res.setValue(mngRes);
			res.setMessage("?????? ?????? ????????????.");
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}
		return res;
	}

	/**
	 * ?????? ?????? ??????(??????)
	 */
	@PostMapping("/modelSourceView")
	@Secured({
		"ROLE_ADMIN", "ROLE_MODELER"
	})
	public EIResponse modelSourceView(@RequestParam HashMap<String, String> parm, HttpServletRequest request) throws Exception {
		EIResponse res = new EIResponse();

		try{
			Map<String, String> datas = modelService.getSourceFileContents(parm.get("modelId"));

			res.setResult(EIResponse.SUCCESS);
			res.setData(datas);
			res.setMessage("?????? ?????? ????????????.");
		} catch (Exception e) {
			e.printStackTrace();
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return res;
	}

}
