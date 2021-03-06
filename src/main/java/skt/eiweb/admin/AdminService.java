
package skt.eiweb.admin;

import java.util.HashMap;
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
import skt.eiweb.authority.model.User;
import skt.eiweb.service.model.ServiceCreHistory;
import skt.eiweb.service.model.ServiceCreHistoryDto;
import skt.eiweb.service.model.ServiceExecHistory;
import skt.eiweb.service.model.ServiceExecHistoryDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.admin
 * @Filename     : AdminService.java
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
public interface AdminService {

	public List<LoginHistoryDto> userLoginHistory(LoginHistoryDto loginHistory) throws Exception;

	public int userLoginHistoryTotalCount(LoginHistoryDto loginHistory) throws Exception;

	public List<User> getUserList(User user) throws Exception;

	public int getUserListTotalCount(User user) throws Exception;

	public List<ServiceCreHistoryDto> serviceCreHistory(ServiceCreHistory serviceCreHistory) throws Exception;

	public int serviceCreHistoryTotalCount(ServiceCreHistory serviceCreHistory) throws Exception;

	public List<ServiceExecHistoryDto> serviceExecHistory(ServiceExecHistory serviceExecHistory) throws Exception;

	public int serviceExecHistoryTotalCount(ServiceExecHistory serviceExecHistory) throws Exception;

	public List<RestExecHistoryDto> restExecHistory(RestExecHistory restExecHistory) throws Exception;

	public int restExecHistoryTotalCount(RestExecHistory restExecHistory) throws Exception;

	public List<ResourceGroupDto> resourceGroupList(ResourceGroup resourceGroup) throws Exception;

	public int resourceGroupListTotalCount(ResourceGroup resourceGroup) throws Exception;

	public int createResourceGroup(ResourceGroup resourceGroup) throws Exception;

	public int updateResourceGroup(ResourceGroup resourceGroup) throws Exception;

	public ResourceGroupDto getResourceGroupInfo(String resourceGroupId) throws Exception;

	public int deleteResourceGroup(String resourceId) throws Exception;

	public List<ResourceGroupDto> resourceGroupAllList(ResourceGroup resourceGroup) throws Exception;

	public List<ScaleHistoryDto> scaleHistory(ScaleHistory scaleHistory) throws Exception;

	public int scaleHistoryTotalCount(ScaleHistory scaleHistory) throws Exception;

	public int saveScaleHistory(ScaleHistory scaleHistory) throws Exception;

	public List<Device> deviceList(Device device) throws Exception;

	public List<ServiceGroupDto> serviceGroupList(ServiceGroup serviceGroup) throws Exception;

	public List<ServiceGroupDto> serviceGroupAllList(ServiceGroup serviceGroup) throws Exception;

	public int serviceGroupListTotalCount(ServiceGroup serviceGroup) throws Exception;

	public int createServiceGroup(ServiceGroup serviceGroup) throws Exception;

	public int updateServiceGroup(ServiceGroup serviceGroup) throws Exception;

	public ServiceGroupDto getServiceGroupInfo(String serviceGroupName) throws Exception;

	public int chkServiceGroupName(ServiceGroup serviceGroup) throws Exception;

	public int deleteServiceGroup(String serviceGroupName) throws Exception;

	public int useServiceGroup(String serviceGroupName) throws Exception;

	public HashMap<String, String> getServiceExecResult(ServiceExecHistory seh) throws Exception;

	public int deleteUser(String userId) throws Exception;

}
