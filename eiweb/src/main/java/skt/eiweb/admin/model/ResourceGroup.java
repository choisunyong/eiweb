package skt.eiweb.admin.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.EqualsAndHashCode;
import lombok.NoArgsConstructor;
import skt.eiweb.base.model.BaseModel;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.admin.model
 * @Filename     : ResourceGroup.java
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
@Data
@NoArgsConstructor
@AllArgsConstructor
@EqualsAndHashCode(callSuper = true)
public class ResourceGroup extends BaseModel {

	private String resourceGroupId;
	private String resourceGroupName;
	private String resourceCpu;
	private String createDate;
	private String userId;

}
