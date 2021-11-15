import React, {Component} from 'react';
import { Msg, Validation } from 'comp';
import { MainService } from 'main';
import { makeParam } from 'comp/common';

/**
 * 화면명 : 비밀번호 변경
 * 화면 경로 : 우측 상단 사용자 서브 메뉴에 비밀번호 변경
 * 화면 코드 : 없음.
 * 참고 : 
 */
class ChangeUserPassword extends Component {
    constructor(props) {
        super(props);
        this.onClickReg = this.onClickReg.bind(this);
        this.onConfirmOk = this.onConfirmOk.bind(this);
        this.onConfirmCancel = this.onConfirmCancel.bind(this);
        this.validationCheck = this.validationCheck.bind(this);
    }

    componentDidMount() {
        this.refs.currpw.focus();
    }

	/**************************************************************************/
	/* 기능 */
	/**************************************************************************/
    /**
     * 변경 클릭 이벤트 핸들러
     */
    onClickReg() {
        if (!this.validationCheck()) return;
        // 정말 저장하시겠습니까?
        const popTitle = "Change User Password Confirm";
        this.props.main.showPopup(
            popTitle,
            <div style={{textAlign: "center",fontSize: 17,paddingTop:4,paddingBottom: 21}}>정말 변경하시겠습니까?</div> ,
            {width:432, height:171, headerVisiable:false},this.onConfirmOk,this.onConfirmCancel
        );
    }
    
    /**
     * 변경전 값 체크
     */
    validationCheck() {
        // 비밀번호
        let chkVal = this.refs.currpw.value;
        if (chkVal.length < 1) {
            Msg.error("현재 비밀번호를 입력해 주세요.");
            return false;
        }
        chkVal = this.refs.pw.value;
        if (chkVal.length < 1) {
            Msg.error("변경할 비밀번호를 입력해 주세요.");
            return false;
        }
        let valiRes = Validation.chkPw(chkVal);
        if (!valiRes.result) {
            Msg.error(valiRes.errMsg);
            return false;
        }
        let chkVal2 = this.refs.pwchk.value;
        if (chkVal !== chkVal2) {
            Msg.error("비밀번호가 동일하지 않습니다.");
            return false;
        }
        return true;
    }

	/**************************************************************************/
	/* 핸들러 */
	/**************************************************************************/
    /**
     * 변경 확인
     */
    onConfirmOk() {
        // Msg.info("ok");
        const parm = makeParam(this);
        // console.log(parm);
        parm.userId = this.props.main.state.userInfo.userId;
        MainService.changeUserPw(parm,this.onResultChangePw,(e) => Msg.error(e.message));
    }
    
    /**
     * 변경 결과 이벤트 핸들러
     * @param {Object} res {result:ok|fail,message:결과 메세지}
     */
    onResultChangePw(res) {
        if (res.result === "ok") {
            Msg.ok(res.message);
            this.props.onClose();
        } else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }
    
    /**
     * 변경 확인 취소
     */
    onConfirmCancel() {
        // Msg.info("cancel");
    }
    
    render() {
        return <div className="table_type2">
            <table>
                <tbody>
                <tr>
                    <th>Password</th>
                    <td>
                    <div className="ipt_group">
                        <input type="password" className="ipt_text" ref="currpw" placeholder="현재 비밀번호"/>
                        <input type="password" className="ipt_text" ref="pw" placeholder="영문자,특수문자 조합해서 4자리에서 12자리" style={{marginTop: 4}}/>
                        <input type="password" className="ipt_text" ref="pwchk" placeholder="확인" style={{marginTop: 4}}/>
                    </div>
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

export default ChangeUserPassword;