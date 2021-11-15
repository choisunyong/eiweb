package skt.eiweb.model;

import java.io.BufferedReader;
import java.nio.charset.Charset;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import skt.eiweb.model.mapper.ModelMapper;
import skt.eiweb.model.model.Model;
import skt.eiweb.model.model.ModelDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.model
 * @Filename     : ModelServiceImpl.java
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
public class ModelServiceImpl implements ModelService {

	@Autowired
	ModelMapper mapper;

	/**
	 * 모델 리스트
	 */
	@Override
	public List<ModelDto> getList(Model model) throws Exception {
		return mapper.selectModel(model);
	}

	/**
	 * 모델 리스트 전체 카운트
	 */
	@Override
	public int getTotalCount(Model model) throws Exception {
		return mapper.selectModelTotalCount(model);
	}

	/**
	 * 모델 등록
	 */
	@Override
	public int registModel(Model model) throws Exception {
		return mapper.insertModel(model);
	}

	/**
	 * 모델명 중복 체크
	 */
	@Override
	public int chkModelName(Model model) throws Exception {
		return mapper.countModelByModelName(model);
	}

	/**
	 * 모델 아이디 생성
	 */
	@Override
	public String makeNextModelId() throws Exception {
		return mapper.makeNextModelId();
	}

	/**
	 * 모델 사가제
	 */
	@Override
	public int deleteModel(String modelId) throws Exception {
		Model model = new Model();
		model.setModelId(modelId);
		return mapper.deleteModel(model);
	}

	/**
	 * 모델 수정
	 */
	@Override
	public int updateModel(Model model) throws Exception {
		return mapper.updateModel(model);
	}

	/**
	 * 모델 이력 정보
	 */
	@Override
	public ModelDto getModelHistInfo(String modelId, String regDate) throws Exception {
		Model model = new Model();
		model.setModelId(modelId);
		model.setRegDate(regDate);
		List<ModelDto> list = mapper.selectModelRegHist(model);
		ModelDto ret = null;
		if (list.size() > 0) {
			ret = list.get(0);
		}
		return ret;
	}

	/**
	 * 모델 정보
	 */
	@Override
	public ModelDto getModelInfo(String modelId) throws Exception {
		Model model = new Model();
		model.setModelId(modelId);
		List<ModelDto> list = mapper.selectModel(model);
		ModelDto ret = null;
		if (list.size() > 0)
			ret = list.get(0);
		return ret;
	}

	/**
	 * 모델 이력 추가
	 */
	@Override
	public int createHistory(String modelId, String created) throws Exception {
		ModelDto model = new ModelDto();
		model.setModelId(modelId);
		model.setCreated(created);
		return mapper.insertModelHistory(model);
	}

	/**
	 * 모델 생성 이력 리스트
	 */
	@Override
	public List<ModelDto> getRegHistory(Model model) throws Exception {
		return mapper.selectModelRegHist(model);
	}

	/**
	 * 모델 생성 이력 리스트 전체 카운트
	 */
	@Override
	public int getRegHistTotalCount(Model model) throws Exception {
		return mapper.selectModelRegHistTotalCount(model);
	}

	/**
	 * 모델 Service 사용유무
	 */
	@Override
	public boolean isUseService(String modelId) throws Exception {
		Model model = new Model();
		model.setModelId(modelId);
		return mapper.selectIsUseService(model) > 0;
	}

	/**
	 * 모델 파일 소스 내용 보기
	 */
	@Override
	public Map<String, String> getSourceFileContents(String modelId) throws Exception {

		String currentLine = null;
		String contents = "";
		String model_file = mapper.selectModelFile(modelId);
		
		Map<String, String> datas = new HashMap<>();
		datas.put("fileName", model_file.substring(model_file.lastIndexOf("/")+ 1, model_file.length()));
		datas.put("modelId", modelId);

		BufferedReader reader = Files.newBufferedReader(Paths.get(model_file), Charset.forName("UTF-8"));
		while ((currentLine = reader.readLine()) != null) {
			contents += currentLine + "\n";
		}
		reader.close();
		
		datas.put("contents", contents);
		
		return datas;
	}
}
