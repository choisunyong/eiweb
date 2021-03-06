package skt.eiweb.file;

import java.util.HashMap;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.annotation.Secured;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import skt.eiweb.base.model.EIResponse;
import skt.eiweb.file.model.File;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.file
 * @Filename     : FileController.java
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
@CrossOrigin(origins = "*", allowedHeaders = "*")
@Controller
@RequestMapping("/file")
@SuppressWarnings({
	"rawtypes", "unchecked"
})
public class FileController {

	@Autowired
	FileService fileService;

	/**
	 * 파일 업로드
	 */
	@PostMapping("/upload")
	@Secured({
		"ROLE_ADMIN", "ROLE_MODELER"
	})
	public ResponseEntity<EIResponse> upload(@RequestParam("uploadfile") MultipartFile file) throws Exception {
		EIResponse res = new EIResponse();
		try {
			File fileVo = fileService.getFileInfo(file);
			res.setResult(EIResponse.SUCCESS);
			HashMap data = new HashMap();
			data.put("file", fileVo);
			res.setData(data);
		} catch (Exception e) {
			res.setResult(EIResponse.FAIL);
			res.setMessage(e.getMessage());
			e.printStackTrace();
		}

		return ResponseEntity.status(HttpStatus.OK).body(res);
	}
}
