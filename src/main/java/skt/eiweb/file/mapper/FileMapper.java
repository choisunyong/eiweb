package skt.eiweb.file.mapper;

import java.util.List;

import skt.eiweb.file.model.File;
import skt.eiweb.file.model.FileDto;

/**
 * ================================================================================
 * @Project      : eiweb
 * @Package      : skt.eiweb.file.mapper
 * @Filename     : FileMapper.java
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
public interface FileMapper {

	public List<FileDto> selectFile(File fileDto) throws Exception;

	public List<FileDto> selectFileNotInCodes(FileDto dto) throws Exception;

}
