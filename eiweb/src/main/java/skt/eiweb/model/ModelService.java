package skt.eiweb.model;

import java.util.List;
import java.util.Map;

import skt.eiweb.model.model.Model;
import skt.eiweb.model.model.ModelDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.model
 * @Filename     : ModelService.java
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
public interface ModelService {

	public List<ModelDto> getList(Model model) throws Exception;

	public int getTotalCount(Model model) throws Exception;

	public int registModel(Model model) throws Exception;

	public int updateModel(Model model) throws Exception;

	public int chkModelName(Model model) throws Exception;

	public String makeNextModelId() throws Exception;

	public int deleteModel(String modelId) throws Exception;

	public ModelDto getModelInfo(String modelId) throws Exception;

	public ModelDto getModelHistInfo(String modelId, String regDate) throws Exception;

	public int createHistory(String modelId, String created) throws Exception;

	public List<ModelDto> getRegHistory(Model model) throws Exception;

	public int getRegHistTotalCount(Model model) throws Exception;

	public boolean isUseService(String modelId) throws Exception;

	public Map<String, String> getSourceFileContents(String modelId) throws Exception;
}
