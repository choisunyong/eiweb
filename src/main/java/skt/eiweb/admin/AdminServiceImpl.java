package skt.eiweb.admin;

import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.FileInputStream;
import java.nio.charset.Charset;
import java.nio.file.DirectoryStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.apache.tomcat.util.codec.binary.Base64;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import skt.eiweb.admin.mapper.AdminMapper;
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
import skt.eiweb.authority.mapper.UserMapper;
import skt.eiweb.authority.model.User;
// import skt.eiweb.base.EIProperties;
import skt.eiweb.manager.ManagerService;
import skt.eiweb.service.model.ServiceCreHistory;
import skt.eiweb.service.model.ServiceCreHistoryDto;
import skt.eiweb.service.model.ServiceExecHistory;
import skt.eiweb.service.model.ServiceExecHistoryDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.admin
 * @Filename     : AdminServiceImpl.java
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
@Service
public class AdminServiceImpl implements AdminService {

	@Autowired
	private AdminMapper adminMapper;

	@Autowired
	private UserMapper userMapper;

	@Autowired
	private ManagerService managerService;

	// @Autowired
	// private EIProperties props;

	/**
	 * ????????? ????????? ??????
	 */
	@Override
	public List<LoginHistoryDto> userLoginHistory(LoginHistoryDto loginHistory) throws Exception {
		return adminMapper.selectUserLoginHistory(loginHistory);
	}

	/**
	 * ????????? ????????? ?????? ????????? ?????? ?????????
	 */
	@Override
	public int userLoginHistoryTotalCount(LoginHistoryDto loginHistory) throws Exception {
		return adminMapper.selectUserLoginHistoryTotalCount(loginHistory);
	}

	/**
	 * ????????? ?????????
	 */
	@Override
	public List<User> getUserList(User user) throws Exception {
		return userMapper.selectUserPage(user);
	}

	/**
	 * ????????? ????????? ?????? ?????????
	 */
	@Override
	public int getUserListTotalCount(User user) throws Exception {
		return userMapper.selectUserPageTotalCount(user);
	}

	/**
	 * Service ?????? ?????? ?????????
	 */
	@Override
	public List<ServiceCreHistoryDto> serviceCreHistory(ServiceCreHistory serviceCreHistory) throws Exception {
		return adminMapper.selectServiceCreHistory(serviceCreHistory);
	}

	/**
	 * Service ?????? ?????? ????????? ?????? ?????????
	 */
	@Override
	public int serviceCreHistoryTotalCount(ServiceCreHistory serviceCreHistory) throws Exception {
		return adminMapper.selectServiceCreHistoryTotalCount(serviceCreHistory);
	}

	/**
	 * Service ?????? ?????? ?????????
	 */
	@Override
	public List<ServiceExecHistoryDto> serviceExecHistory(ServiceExecHistory serviceExecHistory) throws Exception {
		return adminMapper.selectServiceExecHistory(serviceExecHistory);
	}

	/**
	 * Service ?????? ?????? ????????? ?????? ?????????
	 */
	@Override
	public int serviceExecHistoryTotalCount(ServiceExecHistory serviceExecHistory) throws Exception {
		return adminMapper.selectServiceExecHistoryTotalCount(serviceExecHistory);
	}

	/**
	 * REST ?????? ?????? ?????????
	 */
	@Override
	public List<RestExecHistoryDto> restExecHistory(RestExecHistory restExecHistory) throws Exception {
		return adminMapper.selectRestExecHistory(restExecHistory);
	}

	/**
	 * REST ?????? ?????? ????????? ?????? ?????????
	 */
	@Override
	public int restExecHistoryTotalCount(RestExecHistory restExecHistory) throws Exception {
		return adminMapper.selectRestExecHistoryTotalCount(restExecHistory);
	}

	/**
	 * Scale In/Out ?????? ?????????
	 */
	@Override
	public List<ScaleHistoryDto> scaleHistory(ScaleHistory scaleHistory) throws Exception {
		return adminMapper.selectScaleHistory(scaleHistory);
	}

	/**
	 * Scale In/Out ?????? ????????? ?????? ?????????
	 */
	@Override
	public int scaleHistoryTotalCount(ScaleHistory scaleHistory) throws Exception {
		return adminMapper.selectScaleHistoryTotalCount(scaleHistory);
	}

	/**
	 * ?????? ?????? ?????????
	 */
	@Override
	public List<ResourceGroupDto> resourceGroupList(ResourceGroup resourceGroup) throws Exception {
		return adminMapper.selectResourceGroupList(resourceGroup);
	}

	/**
	 * ?????? ?????? ????????? ?????? ?????????
	 */
	@Override
	public int resourceGroupListTotalCount(ResourceGroup resourceGroup) throws Exception {
		return adminMapper.selectResourceGroupListTotalCount(resourceGroup);
	}

	/**
	 * ?????? ?????? ??????
	 */
	@Override
	public int createResourceGroup(ResourceGroup resourceGroup) throws Exception {
		return adminMapper.insertResourceGroup(resourceGroup);
	}

	/**
	 * ?????? ?????? ??????
	 */
	@Override
	public int updateResourceGroup(ResourceGroup resourceGroup) throws Exception {
		return adminMapper.updateResourceGroup(resourceGroup);
	}

	/**
	 * ?????? ?????? ??????
	 */
	@Override
	public ResourceGroupDto getResourceGroupInfo(String resourceGroupId) throws Exception {
		ResourceGroup resourceGroup = new ResourceGroup();
		resourceGroup.setResourceGroupId(resourceGroupId);
		List<ResourceGroupDto> rsrs = adminMapper.selectResourceGroupList(resourceGroup);
		ResourceGroupDto ret = null;
		for (ResourceGroupDto rsr : rsrs) {
			ret = rsr;
		}
		return ret;
	}

	/**
	 * ?????? ?????? ??????
	 */
	@Override
	public int deleteResourceGroup(String resourceId) throws Exception {
		ResourceGroup resourceGroup = new ResourceGroup();
		resourceGroup.setResourceGroupId(resourceId);
		return adminMapper.deleteResourceGroup(resourceGroup);
	}

	/**
	 * ?????? ?????? ?????? ?????????
	 */
	@Override
	public List<ResourceGroupDto> resourceGroupAllList(ResourceGroup resourceGroup) throws Exception {
		return adminMapper.selectResourceGroupAllList(resourceGroup);
	}

	/**
	 * Scale In/Out ?????? ??????
	 */
	@Override
	public int saveScaleHistory(ScaleHistory scaleHistory) throws Exception {
		return adminMapper.insertScaleHistory(scaleHistory);
	}

	/**
	 * container ??????, cpu ????????? (??????)
	 */
	@Override
	public List<Device> deviceList(Device device) throws Exception {
		// ?????? ????????? ????????????
		List<Device> ret = adminMapper.deviceList(device);
		Device dv;
		int i = 0;
		int j = 0;
		List<HashMap<String, String>> cpus = null;
		List<HashMap<String, String>> roles = null;
		HashMap<String, String> itm;

		try {
			roles = managerService.containerInfo();
			cpus = managerService.realAllCpu();
		} catch (Exception e) {
			e.printStackTrace();
			if (ret != null && ret.size() > 0) {
				for (i = 0; i < ret.size(); i++) {
					dv = ret.get(i);
					dv.setScaleState("MGR_CONN_FAIL");
				}
				return ret;
			}
		}

		// Manager?????? ?????? ?????? ????????? ??????
		for (i = 0; i < ret.size(); i++) {
			dv = ret.get(i);
			if (cpus != null) {
				for (j = 0; j < cpus.size(); j++) {
					// {instance=4876512, serverName=esp-ei-001, cpu=0}
					itm = cpus.get(j);
					if (dv.getInstance().equals(itm.get("instance").toString())) {
						dv.setUseCpu(itm.get("cpu"));
						dv.setScaleState("on");
					}
				}
			}
			if (dv.getUseCpu() == null) {
				dv.setUseCpu("0");
				dv.setScaleState("off");
			}
			// set hasContainer
			if (roles != null) {
				for (j = 0; j < roles.size(); j++) {
					// {role=master, hasContainer=3}
					itm = roles.get(j);
					if ("manager".equals(dv.getRole()) && "master".equals(itm.get("role"))
						|| itm.get("role").equals(dv.getRole())) {
						dv.setHasContainer(itm.get("hasContainer").toString());
					}
				}
			}
		}

		return ret;
	}

	/**
	 * ????????? ?????? ?????????
	 */
	@Override
	public List<ServiceGroupDto> serviceGroupList(ServiceGroup serviceGroup) throws Exception {
		return adminMapper.selectServiceGroupList(serviceGroup);
	}

	/**
	 * ????????? ?????? ????????? ?????? ?????????
	 */
	@Override
	public int serviceGroupListTotalCount(ServiceGroup serviceGroup) throws Exception {
		return adminMapper.selectServiceGroupListTotalCount(serviceGroup);
	}

	/**
	 * ????????? ?????? ?????? ?????????
	 */
	@Override
	public List<ServiceGroupDto> serviceGroupAllList(ServiceGroup serviceGroup) throws Exception {
		return adminMapper.selectServiceGroupAllList(serviceGroup);
	}

	/**
	 * ????????? ?????? ??????
	 */
	@Override
	public int createServiceGroup(ServiceGroup serviceGroup) throws Exception {
		return adminMapper.insertServiceGroup(serviceGroup);
	}

	/**
	 * ????????? ?????? ??????
	 */
	@Override
	public int updateServiceGroup(ServiceGroup serviceGroup) throws Exception {
		return adminMapper.updateServiceGroup(serviceGroup);
	}

	/**
	 * ????????? ?????? ??????
	 */
	@Override
	public ServiceGroupDto getServiceGroupInfo(String serviceGroupName) throws Exception {
		ServiceGroup serviceGroup = new ServiceGroup();
		serviceGroup.setServiceGroupName(serviceGroupName);
		List<ServiceGroupDto> rsrs = adminMapper.selectServiceGroupList(serviceGroup);
		ServiceGroupDto ret = null;
		for (ServiceGroupDto rsr : rsrs) {
			ret = rsr;
		}
		return ret;
	}

	/**
	 * ????????? ????????? ?????? ??????
	 */
	@Override
	public int chkServiceGroupName(ServiceGroup serviceGroup) throws Exception {
		return adminMapper.countServiceGroupByServiceGroupName(serviceGroup);
	}

	/**
	 * ????????? ?????? ??????
	 */
	@Override
	public int deleteServiceGroup(String serviceGroupName) throws Exception {
		ServiceGroup serviceGroup = new ServiceGroup();
		serviceGroup.setServiceGroupName(serviceGroupName);
		return adminMapper.deleteServiceGroup(serviceGroup);
	}

	@Override
	public int useServiceGroup(String serviceGroupName) throws Exception {
		ServiceGroup serviceGroup = new ServiceGroup();
		serviceGroup.setServiceGroupName(serviceGroupName);
		return adminMapper.useServiceGroup(serviceGroup);
	}

	@Override
	public HashMap<String, String> getServiceExecResult(ServiceExecHistory seh) throws Exception {
		HashMap<String, String> ret = new HashMap<String, String>();

		// String y = "2020";
		// String m = "09";
		// String d = "10";
		String transid = seh.getTransactionId(); //"trans001";
		String svcId = seh.getServiceId();//"S000000231"; // seh.getServiceId()
		String basePath = "/mnt/nas/" + transid.substring(0,4) + "/" + transid.substring(4,6) + "/" + transid.substring(6,8) + "/" + svcId + "/" + transid;  
							//props.getResultpath() + "/" + y + "/" + m + "/" + d + "/" + svcId + "/" + transid;

		// html
		// String content = "";
		String currentLine = null;
		BufferedReader reader = null;
		

		// ?????? ??????
		List<Path> fileList = new ArrayList<>();
		try(DirectoryStream<Path> stream = Files.newDirectoryStream(Paths.get(basePath), "*")) {
			for (Path dataPath : stream) {
				if (Files.isDirectory(dataPath)) {
					continue;
				}
				fileList.add(dataPath);
			}
		}

		if (fileList.size() > 0) {

			String contentPng  = "";
			String contentHtml = "";
			// String contentCSV  = "";
			String contentLog  = "";
			

			for (Path path : fileList) {
				if (path.toString().endsWith(".png")) {
					FileInputStream inputStream = new FileInputStream(path.toString());
					ByteArrayOutputStream byteOutStream = new ByteArrayOutputStream();

					byteOutStream.write(inputStream.readAllBytes());
					contentPng += "<div style=\"text-align:left\">";
					contentPng += "<span style=\"color:black;font-size:150%\"><string>" + path.toString() + "</string></span><br/>";
					contentPng += "<img src=\"data:image/png;base64, " + new String(Base64.encodeBase64(byteOutStream.toByteArray())) + "\" /><br />";
					contentPng += "</div>";
					inputStream.close();
					byteOutStream.close();
				} else if (path.toString().endsWith(".html")) {
					reader = Files.newBufferedReader(path, Charset.forName("UTF-8"));
					while ((currentLine = reader.readLine()) != null) {
						contentHtml += currentLine;
					}
					reader.close();
				} else if (path.toString().endsWith(".log")) {
					reader = Files.newBufferedReader(path, Charset.forName("UTF-8"));
					contentLog += "<span style=\"color:black;font-size:150%\"><string>" + path.toString() + "</string></span><br/>";
					while ((currentLine = reader.readLine()) != null) {
						contentLog += currentLine + "<br />";
					}
					reader.close();
				} /*else if (path.toString().endsWith(".csv")) {
					reader = Files.newBufferedReader(path, Charset.forName("UTF-8"));
					contentCSV += "<span style=\"color:black;font-size:150%\"><string>" + path.toString() + "</string></span><br/>";
					// contentCSV += "<td width=300px;>";
					while ((currentLine = reader.readLine()) != null) {
						contentCSV += currentLine + "<br />";
					}
					reader.close();
				} */
			}
			ret.put("png", contentPng);
			ret.put("html", contentHtml);
			// ret.put("csv", contentCSV);
			ret.put("log", contentLog);
		} 
		return ret;
	}

	@Override
	public int deleteUser(String userId) throws Exception {
		User user = new User();
		user.setUserId(userId);
		return userMapper.deleteUser(user);
	}

}
