package skt.eiweb.file;

import java.nio.file.Path;
import java.nio.file.Paths;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import skt.eiweb.authority.AuthorityService;
import skt.eiweb.authority.model.User;
import skt.eiweb.base.EIProperties;
import skt.eiweb.file.model.File;
import skt.eiweb.utils.FileUtil;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.file
 * @Filename     : FileServiceImpl.java
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
@Service
public class FileServiceImpl implements FileService {

	@Autowired
	private AuthorityService service;

	@Autowired
	private EIProperties props;

	private Path root = null;

	@Override
	public void init() {
		boolean isSuccess = FileUtil.makeDirectory(root);
		if (!isSuccess) {
			throw new RuntimeException("could not initialize upload directory!!");
		}
	}

	@Override
	public void init(String path) {
		root = Paths.get(path);
		this.init();
	}

	/**
	 * 파일 저장
	 */
	@Override
	public File getFileInfo(MultipartFile file) {
		File fileVo = new File();

		try{
			// 파일 정보 확인
			String ext = "";
			String fileName = file.getOriginalFilename();
			if (props.getMaxFileNameLen() < fileName.length()) {
				throw new RuntimeException("파일명 길이가 깁니다. (길이 제한 : " + props.getMaxFileNameLen() + ")");
			}
			if (fileName.indexOf(".") > -1) {
				ext = fileName.substring(fileName.lastIndexOf(".")+1, fileName.length());
			}

			if (!chkUploadExt(ext)) {
				throw new RuntimeException("업로드 가능하지 않는 확장자 입니다. : " + ext);
			}
			Authentication auth = SecurityContextHolder.getContext().getAuthentication();
			User usr = new User();
			usr.setPassword(auth.getCredentials().toString());
			usr = service.getUserInfoByPw(usr);

			// fileVo.setFileCode(fileName);
			fileVo.setFileName(fileName);
			fileVo.setFileExt(ext);
			fileVo.setFileSize(Long.toString(file.getSize()));
			fileVo.setUserId(usr.getUserId());
		} catch (Exception e) {
			e.printStackTrace();
			throw new RuntimeException(e.getMessage());
		}

		return fileVo;
	}

	private boolean chkUploadExt(String ext) {
		boolean ret = false;
		String[] exts = props.getUploadextensions().split(",");

		for (int i = 0; i < exts.length; i++) {
			if (exts[i].toLowerCase().equals(ext.toLowerCase()))
				ret = true;
		}

		return ret;
	}

}
