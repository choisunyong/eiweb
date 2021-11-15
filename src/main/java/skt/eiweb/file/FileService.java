package skt.eiweb.file;

import org.springframework.web.multipart.MultipartFile;

import skt.eiweb.file.model.File;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.file
 * @Filename     : FileService.java
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
public interface FileService {

	public void init();

	public void init(String path);

	public File getFileInfo(MultipartFile file);

}
