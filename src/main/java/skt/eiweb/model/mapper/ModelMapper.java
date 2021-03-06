package skt.eiweb.model.mapper;
import java.util.List;

import skt.eiweb.model.model.Model;
import skt.eiweb.model.model.ModelDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.model.mapper
 * @Filename     : ModelMapper.java
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
public interface ModelMapper {

	public List<ModelDto> selectModel(Model model) throws Exception;

	public int selectModelTotalCount(Model model) throws Exception;

	public int insertModel(Model model) throws Exception;

	public int updateModel(Model model) throws Exception;

	public int countModelByModelName(Model model) throws Exception;

	public String makeNextModelId() throws Exception;

	public int deleteModel(Model model) throws Exception;

	public int insertModelHistory(Model model) throws Exception;

	public List<ModelDto> selectModelRegHist(Model model) throws Exception;

	public int selectModelRegHistTotalCount(Model model) throws Exception;

	public int selectIsUseService(Model model) throws Exception;

	public String selectModelFile(String modelId) throws Exception;

}
