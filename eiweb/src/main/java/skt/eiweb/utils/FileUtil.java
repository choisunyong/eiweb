package skt.eiweb.utils;

import java.io.File;
import java.nio.file.Path;

import org.springframework.util.ObjectUtils;
import org.springframework.util.StringUtils;

import lombok.extern.slf4j.Slf4j;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.utils
 * @Filename     : FileUtil.java
 * 
 * All rights reserved. No part of this work may be reproduced, stored in a
 * retrieval system, or transmitted by any means without prior written
 * permission of SKT corp.
 * 
 * Copyright(c) 2020 SKT corp. All rights reserved
 * =================================================================================
 *  No     DATE              Description
 * =================================================================================
 *  1.0	   2020. 10. 7.      Initial Coding & Update
 * =================================================================================
 */
@Slf4j
public class FileUtil {

	public static boolean makeDirectory(final Path pathAsPath) {
		return makeDirectory(pathAsPath.toString());
	}

	public static boolean makeDirectory(final String pathAsString) {
		File pathAsFile = null;
		if (StringUtils.isEmpty(pathAsString)) {
			return false;
		}
		pathAsFile = new File(pathAsString.trim());
		if (ObjectUtils.isEmpty(pathAsFile)) {
			return false;
		}

		// 디렉토리 생성
		try {
			if (!pathAsFile.exists()) {
				if (!pathAsFile.mkdirs()) {
					return false;
				}
			} else {
				File[] file_list = pathAsFile.listFiles();
				for (File file : file_list) {
					file.delete();
				}
			}
		} catch (RuntimeException e) {
			log.error(e.getMessage(), e);
			return false;
		}

		if (!pathAsFile.canRead()) {
			return false;
		}
		if (!pathAsFile.canWrite()) {
			return false;
		}

		return true;
	}

}
