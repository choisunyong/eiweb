package skt.eiweb.config;

import javax.sql.DataSource;

import org.apache.ibatis.session.SqlSessionFactory;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.SqlSessionTemplate;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.transaction.annotation.EnableTransactionManagement;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.config
 * @Filename     : AirflowDatabaseConfig.java
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
@Configuration
@MapperScan(value = "skt.eiweb.**.airflowMapper", sqlSessionFactoryRef = "airflowdbSqlSessionFactory")
@EnableTransactionManagement
public class AirflowDatabaseConfig {

	@Bean(name = "airflowDataSource")
	@ConfigurationProperties(prefix = "spring.airflow.datasource")
	public DataSource airflowdbDataSource() {
		return DataSourceBuilder.create().build();
	}

	@Bean(name = "airflowdbSqlSessionFactory")
	public SqlSessionFactory db2SqlSessionFactory(@Qualifier("airflowDataSource") DataSource db2DataSource, ApplicationContext applicationContext) throws Exception {
		SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
		sqlSessionFactoryBean.setDataSource(db2DataSource);
		sqlSessionFactoryBean.setMapperLocations(applicationContext.getResources("classpath:/mappers/airflowdb/*Mapper.xml"));
		sqlSessionFactoryBean.setConfigLocation(applicationContext.getResource("classpath:/config/mybatis-config.xml"));
		return sqlSessionFactoryBean.getObject();
	}

	@Bean(name = "airflowdbSqlSessionTemplate")
	public SqlSessionTemplate airflowdbSqlSessionTemplate(SqlSessionFactory airflowdbSqlSessionFactory) throws Exception {
		return new SqlSessionTemplate(airflowdbSqlSessionFactory);
	}

}
