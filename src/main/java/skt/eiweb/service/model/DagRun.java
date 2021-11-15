package skt.eiweb.service.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.service.model
 * @Filename     : DagRun.java
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
public class DagRun {

	/*
	 * DAG_RUN
	 * ----------------------------------------------------
	 * id integer DEFAULT nextval('dag_run_id_seq'::regclass) NOT NULL,
	 * dag_id character varying(250),
	 * execution_date timestamp with time zone,
	 * state character varying(50),
	 * run_id character varying(250),
	 * external_trigger boolean,
	 * conf bytea,
	 * end_date timestamp with time zone,
	 * start_date timestamp with time zone
	 */

	private String dagId;
	private String executionDate;
	private String state;
	private String runId;
	private String externalTrigger;
	private String startDate;
	private String endDate;
	private String elapsed;

}
