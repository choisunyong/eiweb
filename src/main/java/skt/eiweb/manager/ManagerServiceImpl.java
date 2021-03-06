package skt.eiweb.manager;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.time.Duration;
import java.time.Year;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;

import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StopWatch;

import com.fasterxml.jackson.databind.ObjectMapper;

import lombok.extern.slf4j.Slf4j;
import skt.eiweb.admin.mapper.AdminMapper;
import skt.eiweb.admin.model.Device;
import skt.eiweb.base.EIProperties;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.manager
 * @Filename     : ManagerServiceImpl.java
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
@Slf4j
@Service
public class ManagerServiceImpl implements ManagerService {

	@Autowired
	EIProperties props;

	@Autowired
	AdminMapper adminMapper;

	/**
	 * 장비 상태 (연동)
	 */
	@SuppressWarnings({
		"rawtypes", "unchecked"
	})
	@Override
	public HashMap<String, HashMap<String, Object>> machine(HashMap<String, String> parm) throws Exception {
		/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		{
		    "req_type": "all",
		    "method": "statistics",
		    "metric_name": "CPUUtilization",
		    "start_time": "2020-08-01T12:00:00+0900",
		    "end_time": "1",
		    "unit": "h",
		    "period": "300",
		    "server": {
		        "req_type": "statistics",
		        "metric_name": "CPUUtilization",
		        "start_time": "2020-09-08T00:00:00+0900",
		        "end_time": "1",
		        "unit": "h",
		        "period": "60",
		        "server": "esp-ei-001",
		        "mode": "webserver"
		    }
		}
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

		ZonedDateTime n = ZonedDateTime.now(ZoneId.of("Asia/Seoul"));
		ZonedDateTime zd = Year.of(n.getYear()).atMonth(n.getMonth()).atDay(n.getDayOfMonth()).atTime(n.getHour(), n.getMinute(), n.getSecond()).atZone(ZoneId.of("Asia/Seoul"));

		if (parm.get("req_type") == null) {
			parm.put("req_type", "statistics");
		}
		// if (parm.get("method") == null) {
		// parm.put("method", "statistics");
		// }
		if (parm.get("metric_name") == null) {
			parm.put("metric_name", "CPUUtilization");
		}
		if (parm.get("start_time") == null) {
			parm.put("start_time", zd.toString().substring(0, zd.toString().indexOf("[")).replace("09:00", "0900"));
		}
		if (parm.get("end_time") == null) {
			parm.put("end_time", "1");
		}
		if (parm.get("unit") == null) {
			parm.put("unit", "h");
		}
		if (parm.get("period") == null) {
			parm.put("period", "60");
		}
		if (parm.get("server") == null) {
			parm.put("server", "");
		}
		if (parm.get("mode") == null) {
			parm.put("mode", "webserver");
		}

		// logger.info(parm);
		// {start_time=2020-09-09T11:11:05+09:00, unit=h, period=60, server=, metric_name=CPUUtilization, end_time=1, req_type=statistics}

		JSONParser parser = new JSONParser();
		JSONObject resObj = this.request(parm, "/machine");
		// System.out.println(resObj.get("res").toString().replaceAll("'", "\"").replaceAll(": nan",":0") );
		JSONObject jo = (JSONObject) parser.parse(resObj.get("res").toString().replaceAll("'", "\"").replaceAll(": nan", ":0"));

		log.info("<<<<< {}", jo.toJSONString());

		/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
		{
		    "metric_statistic_list": [
		        {
		            "instance_no": "4342365",
		            "metric_data_list": [
		                {
		                    "average": 5.1,
		                    "data_point_list": [
		                        {
		                            "average": 4.9,
		                            "timestamp": "2020-08-01T03:00:00Z",
		                            "unit": "Percent"
		                        }
		                    ],
		                    "label": "CPUUtilization",
		                    "maximum": 7.502,
		                    "minimum": 4.126,
		                    "sum": 66.56
		                }
		            ]
		        }
		    ]
		}
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

		HashMap<String, HashMap<String, Object>> map = new HashMap<String, HashMap<String, Object>>();
		HashMap<String, Object> m;
		JSONArray msList = (JSONArray) jo.get("metric_statistic_list");
		JSONArray msList2 = null;
		JSONObject ms;
		JSONObject ms2;

		for (int i = 0; i < msList.size(); i++) {
			ms = (JSONObject) msList.get(i);
			if (map.get(ms.get("instance_no").toString()) == null) {
				m = new HashMap();
				m.put("instance", ms.get("instance_no").toString());
				msList2 = (JSONArray) ms.get("metric_data_list");
				for (int j = 0; j < msList2.size(); j++) {
					ms2 = (JSONObject) msList2.get(j);
					m.put("useCpu", ms2.get("sum"));
				}
				map.put(ms.get("instance_no").toString(), m);
			}
		}

		return map;
	}

	/**
	 * 장비 scale in / out (연동)
	 */
	@Override
	public String scaleInOut(HashMap<String, String> parm) throws Exception {
		/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
		{
		    "req_type": "server_start",
		    "server": "esp-ei-002;esp-ei-003",
		    "test": "y"
		}
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

		// if (parm.get("test") == null) {
		// parm.put("test","n");
		// }

		parm.put("mode", "webserver");
		JSONObject jo = this.request(parm, "/server");

		log.info("<<<<< {}", jo.toJSONString());

		return jo.get("res") == null ? jo.get("message").toString() : jo.get("res").toString();
	}

	/**
	 * 모델 평가 요청 (연동)
	 */
	@Override
	public String modelTestReq(HashMap<String, String> parm) throws Exception {
		/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
		{
		    "req_type": "evaluation",
		    "model_id": "M000000001",
		    "model_file": "/mnt/nas/models/M0000000001/predict_VSTLF.1.py"
		}
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

		parm.put("req_type", "evaluation");
		JSONObject jo = this.request(parm, "/model");

		log.info("<<<<< {}", jo.toJSONString());

		return jo.get("res").toString();
	}

	/**
	 * airflow job 중지 (연동)
	 */
	@Override
	public String serviceKill(String serviceId) throws Exception {
		/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
		{
		    "req_type": "kill",
		    "service_id": "S000000003"
		}
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

		HashMap<String, String> parm = new HashMap<String, String>();
		parm.put("req_type", "kill");
		parm.put("service_id", serviceId);
		JSONObject jo = this.request(parm, "/docker");

		log.info("<<<<< {}", jo.toJSONString());

		return jo.get("res").toString();
	}

	/**
	 * service 직접 실행(연동)
	 */
	@Override
	public String servicePlay(String dagId) throws Exception {
		HashMap<String, String> parm = new HashMap<String, String>();
		parm.put("req_type", "create");
		parm.put("dag_id", dagId);
		JSONObject jo = this.request(parm, "/docker");

		log.info("<<<<< {}", jo.toJSONString());

		return jo.get("res").toString();
	}

	/**
	 * cpu 사용율 (연동)
	 */
	@Override
	public List<HashMap<String, String>> realAllCpu() throws Exception {
		List<HashMap<String, String>> ret = new ArrayList<HashMap<String, String>>();
		/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
		{
		    "req_type": "allserver"
		}
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

		HashMap<String, String> parm = new HashMap<String, String>();
		parm.put("req_type", "allserver");
		JSONObject jo = this.request(parm, "/machine");
		JSONObject ijo = (JSONObject) jo.get("res");

		log.info("<<<<< {}", ijo.toJSONString());

		Device device = new Device();
		HashMap<String, String> item;
		List<Device> list = adminMapper.deviceList(device);

		for (int i = 0; i < list.size(); i++) {
			device = list.get(i);
			item = new HashMap<String, String>();
			if (ijo.get(device.getServerName()) != null) {
				item.put("serverName", device.getServerName());
				item.put("cpu", ijo.get(device.getServerName()).toString());
				item.put("instance", device.getInstance());
				ret.add(item);
			}
		}

		return ret;
	}

	/**
	 * container 현황 (연동)
	 */
	@Override
	public List<HashMap<String, String>> containerInfo() throws Exception {
		List<HashMap<String, String>> ret = new ArrayList<HashMap<String, String>>();
		/* +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ 
		{
		    "req_type": "status"
		}
		+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++ */

		JSONParser parser = new JSONParser();
		HashMap<String, String> parm = new HashMap<String, String>();
		parm.put("req_type", "status");
		JSONObject jo = this.request(parm, "/docker");
		String res = jo.get("res").toString();
		JSONObject ijo = (JSONObject) parser.parse(res.replaceAll("'", "\"").replaceAll(": nan", ":0"));

		log.info("<<<<< {}", ijo.toJSONString());

		Device device = new Device();
		HashMap<String, String> item;
		List<Device> list = adminMapper.deviceList(device);

		/*
		if (ijo.get("master") != null) {
			item = new HashMap<String, String>();
			item.put("role", "master");
			item.put("hasContainer", ijo.get("master").toString());
			ret.add(item);
		}
		*/

		for (int i = 0; i < list.size(); i++) {
			device = list.get(i);
			item = new HashMap<String, String>();
			if (ijo.get(device.getRole()) != null) {
				item.put("role", device.getRole());
				item.put("hasContainer", ijo.get(device.getRole()).toString());
				ret.add(item);
			}
		}

		return ret;
	}

	/**
	 * Manager 요청 공통 처리
	 */
	@Override
	public JSONObject request(HashMap<String, String> parm, String url) throws Exception {
		ObjectMapper objectMapper = new ObjectMapper();
		HttpResponse<String> response = null;
		String requestBody = objectMapper.writeValueAsString(parm);
		JSONObject jobj = null;

		try {
			StopWatch sw = new StopWatch();
			sw.start();

			// request 로깅
			log.info(">>>>> POST {}, {}", props.getManagerurl().concat(url), requestBody);

			HttpClient client = HttpClient.newHttpClient();
			String reqType = parm.get("req_type");
			int timeout = 3;
			if (reqType.equals("evaluation") || reqType.equals("create")) {
				timeout = 60 * 30;
			}
			HttpRequest req = HttpRequest.newBuilder()
				.header("Content-Type", "application/json")
				.uri(URI.create(props.getManagerurl().concat(url)))
				.POST(HttpRequest.BodyPublishers.ofString(requestBody))
				.timeout(Duration.ofSeconds(timeout))
				.build();
			

			response = client.send(req, HttpResponse.BodyHandlers.ofString());
			sw.stop();

			Long total = sw.getTotalTimeMillis();

			// response 로깅
			log.info("<<<<< {}, {}(ms)", response, total);

			JSONParser parser = new JSONParser();
			jobj = (JSONObject) parser.parse(response.body());
		} catch (Exception e) {
			log.error(e.getMessage());
			throw e;
		}

		return jobj;
	}

}
