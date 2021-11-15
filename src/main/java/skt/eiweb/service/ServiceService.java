package skt.eiweb.service;

import java.util.HashMap;
import java.util.List;

import skt.eiweb.service.model.ServiceCreHistoryDto;
import skt.eiweb.service.model.ServiceDto;
import skt.eiweb.service.model.ServiceExecHistory;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.service
 * @Filename     : ServiceService.java
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
public interface ServiceService {

	public List<ServiceDto> getList(ServiceDto service) throws Exception;

	public int getTotalCount(ServiceDto service) throws Exception;

	public String makeNextServiceId() throws Exception;

	public int createService(ServiceDto service) throws Exception;

	public int updateService(ServiceDto service) throws Exception;

	public int chkServiceName(ServiceDto service) throws Exception;

	public int chkDagId(ServiceDto service) throws Exception;

	public ServiceDto getServiceInfo(String serviceId) throws Exception;

	public int deleteService(String serviceId) throws Exception;

	public int insertServiceCreHistory(String serviceId) throws Exception;

	public int createDag(ServiceDto service) throws Exception;

	public int deleteDag(String serviceId) throws Exception;

	public ServiceCreHistoryDto getServiceHistInfo(String serviceId) throws Exception;

	public HashMap<String, Integer> getTotalStatus(ServiceDto service) throws Exception;

	public HashMap<String, Integer> getTotalHistStatus(ServiceExecHistory service) throws Exception;

}
