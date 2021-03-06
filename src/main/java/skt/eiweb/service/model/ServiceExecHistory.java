package skt.eiweb.service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import skt.eiweb.base.model.BaseModel;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.service.model
 * @Filename     : ServiceExecHistory.java
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
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ServiceExecHistory extends BaseModel {

	private String executeDate;
	private String userId;
	private String serviceId;
	private String serviceName;
	private String modelId;
	private String runCycle;
	private String resourceGroupId;
	private String resourceGroupName;
	private String resourceCpu;
	private String serviceGroupName;
	private String transactionId;
	private String serviceDesc;
	private String serviceStatus;
	private String startDate;
	private String endDate;
	private String elapsed;
	private String dagId;
	private String resultPath;

}
