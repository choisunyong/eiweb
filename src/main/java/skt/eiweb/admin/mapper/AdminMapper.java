package skt.eiweb.admin.mapper;

import java.util.List;

import skt.eiweb.admin.model.Device;
import skt.eiweb.admin.model.LoginHistoryDto;
import skt.eiweb.admin.model.ResourceGroup;
import skt.eiweb.admin.model.ResourceGroupDto;
import skt.eiweb.admin.model.RestExecHistory;
import skt.eiweb.admin.model.RestExecHistoryDto;
import skt.eiweb.admin.model.ScaleHistory;
import skt.eiweb.admin.model.ScaleHistoryDto;
import skt.eiweb.admin.model.ServiceGroup;
import skt.eiweb.admin.model.ServiceGroupDto;
import skt.eiweb.service.model.ServiceCreHistory;
import skt.eiweb.service.model.ServiceCreHistoryDto;
import skt.eiweb.service.model.ServiceExecHistory;
import skt.eiweb.service.model.ServiceExecHistoryDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.admin.mapper
 * @Filename     : AdminMapper.java
 * 
 * All rights reserved. No part of this work may be reproduced, stored in a
 * retrieval system, or transmitted by any means without prior written
 * permission of SKT corp.
 * 
 * Copyright(c) 2020 SKT corp. All rights reserved
 * =================================================================================
 *  No     DATE              Description
 * =================================================================================
 *  1.0	   2020. 9. 28.      Initial Coding & Update
 * =================================================================================
 */
public interface AdminMapper {

	public List<LoginHistoryDto> selectUserLoginHistory(LoginHistoryDto loginHistory) throws Exception;

	public int selectUserLoginHistoryTotalCount(LoginHistoryDto loginHistory) throws Exception;

	public List<ServiceCreHistoryDto> selectServiceCreHistory(ServiceCreHistory serviceCreHistory) throws Exception;

	public int selectServiceCreHistoryTotalCount(ServiceCreHistory serviceCreHistory) throws Exception;

	public List<ServiceExecHistoryDto> selectServiceExecHistory(ServiceExecHistory serviceExecHistory) throws Exception;

	public int selectServiceExecHistoryTotalCount(ServiceExecHistory serviceExecHistory) throws Exception;

	public List<RestExecHistoryDto> selectRestExecHistory(RestExecHistory restExecHistory) throws Exception;

	public int selectRestExecHistoryTotalCount(RestExecHistory restExecHistory) throws Exception;

	public List<ResourceGroupDto> selectResourceGroupList(ResourceGroup resourceGroup) throws Exception;

	public int selectResourceGroupListTotalCount(ResourceGroup resourceGroup) throws Exception;

	public int insertResourceGroup(ResourceGroup resourceGroup) throws Exception;

	public int updateResourceGroup(ResourceGroup resourceGroup) throws Exception;

	public int deleteResourceGroup(ResourceGroup resourceGroup) throws Exception;

	public List<ResourceGroupDto> selectResourceGroupAllList(ResourceGroup resourceGroup) throws Exception;

	public List<ScaleHistoryDto> selectScaleHistory(ScaleHistory scaleHistory) throws Exception;

	public int selectScaleHistoryTotalCount(ScaleHistory scaleHistory) throws Exception;

	public int insertScaleHistory(ScaleHistory scaleHistory) throws Exception;

	public List<Device> deviceList(Device device) throws Exception;

	public List<ServiceGroupDto> selectServiceGroupList(ServiceGroup serviceGroup) throws Exception;

	public int selectServiceGroupListTotalCount(ServiceGroup serviceGroup) throws Exception;

	public List<ServiceGroupDto> selectServiceGroupAllList(ServiceGroup serviceGroup) throws Exception;

	public int insertServiceGroup(ServiceGroup serviceGroup) throws Exception;

	public int updateServiceGroup(ServiceGroup serviceGroup) throws Exception;

	public int countServiceGroupByServiceGroupName(ServiceGroup serviceGroup) throws Exception;

	public int deleteServiceGroup(ServiceGroup serviceGroup) throws Exception;

	public int useServiceGroup(ServiceGroup serviceGroup) throws Exception;

	public int deleteUser(String userId) throws Exception;

}
