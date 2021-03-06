import React, { Component } from 'react';
import { Msg } from 'comp';
import { makeParam } from 'comp/common';
import Validation from 'comp/Validation';
import AdminService from './AdminService';

/**
 * 화면명 : Service Group Regist
 * 화면 경로 : Admin > Service Group Management > Service Group Regist
 * 화면 코드 : MENU0040701
 * 참고 : 
 */
class ServiceGroupReg extends Component {
  constructor(props) {
    super(props);
    this.state = {
      validName: null,
      initModify: false,
      inputChange: false,
      isNameChk: false
    };
    this.onClickReg = this.onClickReg.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onResultCreate = this.onResultCreate.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.validationCheck = this.validationCheck.bind(this);
  }

  componentDidMount() {
    this.setState({
      validName: null,
      isNameChk: false,
      modifyFlag: false
    });
    this.refs.serviceGroupName.focus();
  }

  componentDidUpdate() {
    const { initModify } = this.state;
    let { modifyFlag } = this.props;
    if (modifyFlag && !initModify) {
      this.setState({ initModify: true });   // 수정일경우 처음에 중복확인 PASS
    }
  }

  /**************************************************************************/
  /* 기능 */
  /**************************************************************************/
  /**
   * 저장 버튼 클릭 핸들러
   */
  onClickReg() {
    const { modifyFlag } = this.props;
    if (!this.validationCheck()) return;
    let parm = makeParam(this);
    parm.saveType = modifyFlag ? "modi" : "ins";
    AdminService.createServiceGroup(parm, this.onResultCreate, (e) => Msg.error(e.message));
  }

  /**
   * 저장전 값 확인
   * @return {Boolean} 확인 결과
   */
  validationCheck() {
    if (!this.state.inputChange) {
      Msg.warn("변경된 사항이 없습니다.");
      return false;
    }
    // 초기화
    this.setState({ validName: null, validCpu: null });
    // 자원 그룹명
    let chkVal = this.refs.serviceGroupName.value;
    let valiRes = Validation.chkServiceGroupName(chkVal);
    let chkState = {};
    chkState.validName = true;
    if (!valiRes.result) {
      Msg.error(valiRes.errMsg);
      chkState.validName = false;
      this.setState(chkState);
      return false;
    }

    this.setState(chkState);
    return true;
  }

  /**************************************************************************/
  /* 핸들러 */
  /**************************************************************************/
  /**
   * 그룹명 변경 핸들러
   */
  onChangeName() {
    this.setState({ inputChange: true, isNameChk: false });
  }

  /**
 * 저장 결과 핸들러
 * @param {Object} res {result:ok|fail,message}
 */
  onResultCreate(res) {
    this.setState(this.defaultState);
    if (res.result === "ok") {
      // initForm(this);
      Msg.ok(res.message);
      this.props.onClose();
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * 닫기 핸들러
   */
  onClose() {
    setTimeout((e) => this.props.onClose(), 100);
  }

  /**
   * 설명 변경 핸들러
   */
  onChangeDesc() {
    const maxLen = 100;
    if (this.refs.description.value.length > maxLen) {
      this.refs.description.value = this.refs.description.value.substr(0, maxLen);
    }
    this.setState({ descLength: this.refs.description.value.length, inputChange: true });
  }

  render() {
    let { modifyServiceGroupInfo } = this.props;
    let { descLength } = this.state;

    if (modifyServiceGroupInfo === undefined) modifyServiceGroupInfo = {};
    if (descLength === 0 && modifyServiceGroupInfo.description !== null && modifyServiceGroupInfo.description !== undefined && modifyServiceGroupInfo.description.length > 0)
      descLength = modifyServiceGroupInfo.description.length;
    return <div className="table_type2">
      <table>
        <tbody>
          <tr>
            <th>서비스 그룹명</th>
            <td>
              <div className="ipt_group">
                <input type="text" ref="serviceGroupName" className="ipt_text" id="inputName" placeholder="한글,영문,숫자 최대 50자"
                  onChange={(e) => { this.onChangeName() }} maxLength="20" defaultValue={modifyServiceGroupInfo.serviceGroupName}
                />
              </div>
            </td>
          </tr>
          <tr>
            <th>Description</th>
            <td style={{ textAlign: "right" }}>
              <textarea ref="description" rows="3" cols="100" maxLength="100" onChange={(e) => this.onChangeDesc()} defaultValue={modifyServiceGroupInfo.description}></textarea>
              <span className="font_gray" style={{ paddingRight: 5 }}>(<span style={{ color: "#ff7272" }}>{descLength}</span> / 100)</span>
            </td>
          </tr>
        </tbody>
      </table>
      <div className="popupBtnArea btn_area addbtnarea"><p className="btn2">
        <button className="btn btn_white" onClick={() => this.props.onClose()}>취소</button>
        <button className="btn btn_black" onClick={() => this.onClickReg()}>저장</button>
      </p></div>
    </div>;
  }
}

export default ServiceGroupReg;