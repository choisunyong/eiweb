package skt.eiweb.manager;

import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONObject;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.manager
 * @Filename     : ManagerService.java
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
public interface ManagerService {

	public JSONObject request(HashMap<String, String> parm, String url) throws Exception;

	public HashMap<String, HashMap<String, Object>> machine(HashMap<String, String> parm) throws Exception;

	public String scaleInOut(HashMap<String, String> parm) throws Exception;

	public String modelTestReq(HashMap<String, String> parm) throws Exception;

	public String serviceKill(String serviceId) throws Exception;

	public String servicePlay(String dagId) throws Exception;

	public List<HashMap<String, String>> realAllCpu() throws Exception;

	public List<HashMap<String, String>> containerInfo() throws Exception;

}
