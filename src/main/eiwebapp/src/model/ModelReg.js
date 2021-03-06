import React, { Component } from 'react';
import { CommonCode } from 'main';
import { Msg, common, Validation } from 'comp';
import { makeParam } from 'comp/common';
import UploadService from 'comp/file/services/upload-files.service';
import ModelService from './ModelService';

/**
 * 화면명 : 모델 등록
 * 화면 경로 : 모델 > 모델 관리 > 모델 등록
 * 화면 코드 : 
 * 참고 : 모델 관리 화면에서 사용하는 등록 화면
 */
class ModelReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      nameValid: null,
      nickValid: null,
      modelFileValid: null,
      descLength: 0,
      progress: 0,
      currentFile: undefined,
      modelFiles: [],
      modelFile: null,
      initModify: false,
      inputChange: false,
      checkedPriority: undefined
    };
    this.onClickReg = this.onClickReg.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onResultRegist = this.onResultRegist.bind(this);
    this.onChangeDesc = this.onChangeDesc.bind(this);
    this.selectFile = this.selectFile.bind(this);
    this.upload = this.upload.bind(this);
    this.onResultFileReq = this.onResultFileReq.bind(this);
    // this.fileValidationCheck = this.fileValidationCheck.bind(this);
    this.onChangePriority = this.onChangePriority.bind(this);
    this.onClickRadio = this.onClickRadio.bind(this);
  }

  componentDidMount() {
    this.refs.modelName.focus();
  }

  componentDidUpdate() {
    const { initModify } = this.state;
    let { modifyFlag } = this.props;
    if (modifyFlag && !initModify) {
      this.setState({
        initModify: true
        , modifyFlag: modifyFlag
      });   // 수정일경우 처음에 중복확인 PASS
    }
  }

  /**
   * 모델명 변경 핸들러
   */
  onChangeName() {
    this.setState({ inputChange: true });
  }

  /**
   * 설명 변경 핸들러
   */
  onChangeDesc() {
    const maxLen = 100;
    if (this.refs.modelDesc.value.length > maxLen) {
      this.refs.modelDesc.value = this.refs.modelDesc.value.substr(0, maxLen);
    }
    this.setState({ descLength: this.refs.modelDesc.value.length, inputChange: true });
  }

  /**
   * 파일 선택
   * @param {FileEvent} event 
   */
  selectFile(event) {
    if (event.target.files.length < 1) return;
    const file = event.target.files[0];
    // if (!this.fileValidationCheck(file)) return;
    this.upload(file);
  }

  /**
   * 파일 업로드
   * @param {File} uploadFile 
   */
  upload(uploadFile) {
    this.setState({ progress: 0, currentFile: uploadFile });
    if (uploadFile.size > common.getFileSizeByte("10MB")) {
      Msg.error("업로드 가능한 파일사이즈 : 10MB");
      return;
    }
    this.props.main.showLoading();
    UploadService.upload(uploadFile, (event) => {
      this.setState({ progress: Math.round((100 * event.loaded) / event.total) })
    })
      .then((response) => {
        this.props.main.hideLoading();
        const res = response.data;
        if (res.result === "ok") {
          let files = [];
          files.push(res.data.file);
          this.setState({ modelFiles: files, modelFile: res.data.file, inputChange: true });
        } else if (res.result === "fail") {
          Msg.error(res.message);
        }
      })
      .catch(() => {
        this.props.main.hideLoading();
        Msg.error("정보 확인 실패 실패되었습니다.");
        this.setState({
          progress: 0,
          message: "Could not inform the file!",
          currentFile: undefined,
        });
      });
  }

  /**
   * 파일리스트에 동일한 파일 체크
   * @param {File} file 
   */
  // fileValidationCheck(file) {
  //     const files = this.state.modelFiles;
  //     for (let i=0; i<files.length; i++) {
  //         if (files[i].fileName === file.name && Number(files[i].fileSize) === file.size) {
  //             Msg.warn("이미 동일한 파일이 추가되어 있습니다.");
  //             return false;
  //         }
  //     }
  //     return true;
  // }

  /**
   * 모델 등록 클릭 핸들러
   */
  onClickReg() {
    if (!this.validationCheck()) return;
    const { checkedPriority } = this.state;
    const currentFile = this.state.currentFile;
    // console.log(currentFile);
    let parm = makeParam(this);
    let ext = ""
    let file = this.state.modelFile;
    if (file.fileName.indexOf(".") > -1) {
      ext = file.fileName.substr(file.fileName.lastIndexOf(".") + 1, file.fileName.length).toUpperCase();
    }
    parm.fileName = file.fileName;
    parm.fileSize = currentFile.size;
    parm.baseImage = ext;
    parm.priority = checkedPriority;
    parm.modelFileContext = currentFile;
    ModelService.regist(parm, this.onResultRegist, (e) => console.log(e));
  }

  /**
   * 모델 등록전 입력값 확인
   * @return {Boolean} 확인결과
   */
  validationCheck() {
    const { inputChange, checkedPriority,
      // isNameChk, isNickChk, 
      modelFiles } = this.state;
    let chkState = {};
    if (!inputChange) {
      Msg.warn("변경된 사항이 없습니다.");
      return false;
    }
    // 초기화
    this.setState({ nameValid: null, nickValid: null, modelFileValid: null, priorityValid: null });
    // 모델명
    let chkVal = this.refs.modelName.value;
    let valiRes = Validation.chkModelName(chkVal);
    chkState.validName = true;
    if (!valiRes.result) {
      Msg.error(valiRes.errMsg);
      chkState.validName = false;
      this.setState(chkState);
      return false;
    }

    chkState.priorityValid = true;

    if (checkedPriority === null) {
      Msg.error("우선순위를 선택해 주세요.");
      chkState.priorityValid = false;
      this.setState(chkState);
      return false;
    }

    // Limit
    chkVal = this.refs.limitRuntime.value;
    if (chkVal.length < 1) {
      Msg.error("Limit 입력해 주세요.");
      this.setState(chkState);
      return false;
    } else if (isNaN(chkVal)) {
      Msg.error("Limit 잘못된 입력입니다.");
      this.setState(chkState);
      return false;
    }

    chkState.modelFileValid = true;
    if (modelFiles.length < 1) {
      Msg.error("모델파일은 필수 입니다.");
      chkState.modelFileValid = false;
      this.setState(chkState);
      return false;
    }

    this.setState(chkState);
    return true;
  }

  /**
   * 등록 결과 핸들러
   * @param {Object} res 
   */
  onResultRegist(res) {
    this.setState(this.defaultState);
    if (res.result === "ok") {
      Msg.ok("등록 완료되었습니다.");
      this.props.onClose();
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }


  /**
   * 우선순위 변경 핸들러
   */
  onChangePriority() {
    try {
      let { modifyModelInfo } = this.props;
      modifyModelInfo.priority = this.refs.priority.value;
      this.setState({ inputChange: true });
    } catch (err) { }
  }

  /**
   * 모델 우선순위 Radio 클릭 이벤트 핸들러
   * @param {MouseEvent} e 
   */
  onClickRadio(e) {
    this.setState({ checkedPriority: e.currentTarget.value, inputChange: true });
  }

  /**
 * 소스보기 버튼 클릭 핸들러
 * @param {Object} item 
 * @param {Event} e 
 * @param {Object} props 
 */
  onClickFileReq(item, e, props) {
    // this.props.onClose();
    ModelService.getModelFile(item.modelId, this.onResultFileReq, (err) => Msg.error(err.message));
  }
  /**
   * 모델 소스 보기
   * @param {*} res
   * @param {String} modleId
   */
  onResultFileReq(res) {
    if (res.result === "ok") {
        this.props.main.showPopup(res.data.fileName, <textarea value={res.data.contents} style={{ height: '600px' }}></textarea>);
    }
    else if (res.result === "fail") {
        Msg.error(res.message);
    }
  }

  render() {
    let {
      // selectedFiles,progress,
      modelFiles, initModify, checkedPriority, modelFile,
      descLength } = this.state;
    let { modifyFlag, modifyModelInfo, modifyModelFiles } = this.props;
    if (modifyModelInfo === undefined) modifyModelInfo = {};
    if (!initModify && (modelFiles && modifyModelFiles) && (modelFiles.length !== modifyModelFiles.length))
      this.setState({ modelFiles: modifyModelFiles });
    if (!checkedPriority) {
      if (modifyModelInfo.priority !== undefined) {
        checkedPriority = String(modifyModelInfo.priority);
      } else {
        checkedPriority = "3";// LOW (Default Value)
      }
      this.setState({ checkedPriority: checkedPriority });
    }

    let modelFileName = "";
    if (modelFile) {
      modelFileName = modelFile.fileName + "(" + common.getDisplFileSize(Number(modelFile.fileSize)) + ")";
    }

    let radios = [];
    const prioritys = CommonCode.getCodeList("MODEL_PRIORITY");
    let priority;
    for (let i = 0; i < prioritys.length; i++) {
      priority = prioritys[i];
      radios.push(<input id={priority.code} type="radio" name="priority" value={priority.value}
        checked={checkedPriority === priority.value} onClick={(e) => this.onClickRadio(e)} />);
      radios.push(<label for={priority.code}>{priority.codeName}</label>);
    }

    if (descLength === 0 && modifyModelInfo.modelDesc !== null && modifyModelInfo.modelDesc !== undefined && modifyModelInfo.modelDesc.length > 0)
      descLength = modifyModelInfo.modelDesc.length;


    return <div className="table_type2">
      {modifyFlag ?
        <input type="text" ref="modelId" style={{ display: "none" }} id="inputId" defaultValue={modifyModelInfo.modelId} disabled />
        : null}
      <table>
        <tbody>
          <tr>
            <th>Model Name <span className="necessary">*</span></th>
            <td>
              <div className="ipt_group">
                <input ref="modelName" type="text" className="ipt_text" placeholder="한글,영문 최대 50자" style={{ width: 430 }}
                  onChange={(e) => { this.onChangeName() }}
                  maxLength="50" defaultValue={modifyModelInfo.modelName} />
              </div>
            </td>
          </tr>
          <tr>
            <th>Model File<span className="necessary">*</span>
            </th>
            <td>
              <div className="ipt_group">
                <label className="ipt_file" for="iptFile" style={{ width: "100%" }}>
                  <input type="text" className="ipt_text" readonly="readonly" style={{ width: "calc(100% - 67px)", paddingLeft: 44 }} placeholder="업로드 제한 : 10M이하 / 파일명 최대 길이 90자"
                    defaultValue={modelFileName} title={modelFileName} />
                  <span className="btn btn_blue btn_file"></span>
                  <input type="file" id="iptFile" onChange={this.selectFile} />
                </label>
              </div>
            </td>
          </tr>
          <tr>
            <th>Priority <span className="necessary">*</span></th>
            <td><div className="radio_group">{radios}</div></td>
          </tr>
          <tr>
            <th>Limit <span className="necessary">*</span></th>
            <td><div style={{ display: "flex", alignItems: "center" }}>
              <input ref="limitRuntime" type="number" className="ipt_number" style={{ width: 90 }} defaultValue={modifyModelInfo.limitRuntime ? modifyModelInfo.limitRuntime : 0} min={0} max={99999} step={1}
                onChange={(e) => this.setState({ inputChange: true })} />&nbsp;분 <span class="font_blue">(제한없는 경우, 0 입력)</span>
            </div></td>
          </tr>
          <tr>
            <th>Description</th>
            <td style={{ textAlign: "right" }}>
              <textarea ref="modelDesc" rows="3" cols="100" maxlength="100" onChange={(e) => this.onChangeDesc()} defaultValue={modifyModelInfo.modelDesc}></textarea>
              <span className="font_gray" style={{ paddingRight: 5 }}>(<span style={{ color: "#ff7272" }}>{descLength}</span> / 100)</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="popupBtnArea btn_area addbtnarea"><p className="btn2">
        <button className="btn btn_white" onClick={() => this.props.onClose()}>취소</button>
        <button className="btn btn_black" onClick={(e) => this.onClickReg()}>저장</button>
        {this.props.sourceView===true ? (<button className="btn btn_blue" onClick={(e) => this.onClickFileReq(modifyModelInfo)}>소스보기</button>) : null }
      </p></div>
    </div>;
  }
}

export default ModelReg;