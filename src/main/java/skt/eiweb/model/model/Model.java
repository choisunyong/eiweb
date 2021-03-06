package skt.eiweb.model.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import skt.eiweb.base.model.BaseModel;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.model.model
 * @Filename     : Model.java
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
public class Model extends BaseModel {

	private String userId;
	private String modelName;
	private String modelId; // M0000001
	private int priority;
	private String cpuCores;
	private String modelDesc;
	private String regDate;
	private String baseImage;
	private int limitRuntime;
	private String evaluationStatus;
	private String elapsed;
	private String startDate;
	private String endDate;
	private String action;
	private String fileName;
	private String fileSize;

}
