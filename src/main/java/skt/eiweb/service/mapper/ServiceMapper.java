package skt.eiweb.service.mapper;

import java.util.List;

import skt.eiweb.service.model.ServiceDto;
import skt.eiweb.service.model.ServiceExecHistory;
import skt.eiweb.service.model.ServiceExecHistoryDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.service.mapper
 * @Filename     : ServiceMapper.java
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
public interface ServiceMapper {

	public List<ServiceDto> selectService(ServiceDto dto) throws Exception;

	public List<ServiceDto> selectServiceAll(ServiceDto dto) throws Exception;

	public int selectServiceTotalCount(ServiceDto dto) throws Exception;

	public String makeNextServiceId() throws Exception;

	public int insertService(ServiceDto dto) throws Exception;

	public int updateService(ServiceDto dto) throws Exception;

	public int countServiceByServiceName(ServiceDto dto) throws Exception;

	public int countServiceByDagId(ServiceDto dto) throws Exception;

	public int deleteService(ServiceDto dto) throws Exception;

	public int insertServiceCreHistory(ServiceDto dto) throws Exception;

	public ServiceExecHistoryDto selectServiceExecHistoryStatus(ServiceExecHistory serivceExecHistory) throws Exception;

}
