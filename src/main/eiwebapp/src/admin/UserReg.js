import React, {Component} from 'react';
import CommonCode from 'main/CommonCode';
import {Msg, common, Validation} from 'comp';
import AdminService from './AdminService';

/**
 * 화면명 : 사용자 등록
 * 화면 경로 : Admin > User Management > 사용자 등록
 * 화면 코드 : 
 * 참고 : 
 */
class UserReg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inputChange:false
		};
		this.onClickSave = this.onClickSave.bind(this);
		this.validationCheck = this.validationCheck.bind(this);
		this.onResultSave = this.onResultSave.bind(this);
	}
    
	componentDidMount() {
		this.refs.userId.focus();
	}

	/**************************************************************************/
	/* 기능 */
	/**************************************************************************/
	
	/**************************************************************************/
	/* 핸들러 */
	/**************************************************************************/
	/**
	 * 저장 버튼 클릭 핸들러
	 */
	onClickSave() {
		const {modifyFlag} = this.props;
        if (!this.validationCheck()) return;
		let param = common.makeParam(this);
		param.schType = modifyFlag ? "modi" : "new";
        console.log(param);
        AdminService.save(param,this.onResultSave,(err) => Msg.error(err.message));
	}
	
	/**
	 * 저장 전 값 체크
	 */
	validationCheck() {
        const {modifyFlag} = this.props;
        // 초기화
        // this.initValids();
		let chkState = {};

		// 아이디
		let chkVal = this.refs.userId.value;
		let valiRes = Validation.chkId(chkVal);
		chkState.validId = true;
		if (!valiRes.result) {
			Msg.error(valiRes.errMsg);
			chkState.validId = false;
			this.setState(chkState);
			this.refs.userId.focus();
			return false;
		}

        // 이름
		chkVal = this.refs.userName.value;
		// 입력했을경우 체크
		if (chkVal.length > 0) {
			chkState.validName = true;
			if (chkVal.length < 2 || chkVal.length > 10) {
				Msg.error("이름의 입력가능 자릿수는 2~10 입니다.");
				chkState.validName = false;
				this.setState(chkState);
				this.refs.userName.focus();
				return false;
			}
		}

		if (!modifyFlag || (modifyFlag && (this.refs.pw.value.length > 0))) {
			// 비밀번호
            chkVal = this.refs.pw.value;
            valiRes = Validation.chkPw(chkVal);
            chkState.validPw = true;
            if (!valiRes.result) {
                Msg.error(valiRes.errMsg);
                chkState.validPw = false;
                this.setState(chkState);
                return false;
            }
            let chkVal2 = this.refs.pwchk.value;
            if (chkVal !== chkVal2) {
                Msg.error("비밀번호가 동일하지 않습니다.");
                chkState.validPw = false;
                this.setState(chkState);
                return false;
            }
		}

		// 이메일 : emailfirst + emaillast
        chkVal = this.refs.userEmail.value;
        valiRes = Validation.chkEmail(chkVal);
        chkState.validEmail = true;
        if (!valiRes.result) {
            Msg.error(valiRes.errMsg);
            chkState.validEmail = false;
            this.setState(chkState);
            return false;
        }

        this.setState(chkState);
        return true;
	}
	
	/**
	 * 저장 결과 핸들러
	 * @param {Object} res {result:ok|fail,message}
	 */
	onResultSave(res) {
        if (res.result === "ok") {
            Msg.ok(res.message);
            // this.initForm();
            // this.initValids();
			// this.requestData(1);
			this.props.onClose();
        } else {
            Msg.error(res.message);
        }
    }
	
    render() {
		let {modifyUserInfo} = this.props;
		if (!modifyUserInfo) modifyUserInfo = {};
		if (modifyUserInfo.activate && (modifyUserInfo.activate === "Y" || modifyUserInfo.activate === "N")) {
			modifyUserInfo.activate = modifyUserInfo.activate === "Y" ? "1" : "0";
		}
		console.log("modifyUserInfo");
		console.log(modifyUserInfo);
		const userPermissionOptions = CommonCode.makeOptions("PERMISSION",null,null,modifyUserInfo.userPermission);
		const userActiveOptions = CommonCode.makeOptions("USER_ACTIVE",null,null,modifyUserInfo.activate);
        return <div className="table_type2">
			<table>
				<tbody>
					<tr>
						<th>User ID
							<span className="necessary">*</span></th>
						<td>
						<div className="ipt_group">
							<input ref="userId" type="text" className="ipt_text" placeholder="영문자, 숫자 최대 20자리" disabled={modifyUserInfo.userId !== undefined}
								maxLength="20" defaultValue={modifyUserInfo.userId}/>
						</div>
						</td>
					</tr>
					<tr>
						<th>User Name
						</th>
						<td>
						<div className="ipt_group">
							<input ref="userName" type="text" className="ipt_text" placeholder="최대 길이 10자리" 
								maxLength="10" defaultValue={modifyUserInfo.userName}/>
						</div>
						</td>
					</tr>
					<tr>
						<th>User Group
							<span className="necessary">*</span>
						</th>
						<td>
						<div className="ipt_group">
							<select ref="userPermission" className="combobox">
								{userPermissionOptions}
							</select>
						</div>
						</td>
					</tr>
					<tr>
						<th>Password
							<span className="necessary">*</span>
						</th>
						<td>
						<div className="ipt_group">
							<input type="password" className="ipt_text" ref="pw" placeholder="영문자,특수문자 조합해서 4자리에서 12자리"/>
							<input type="password" className="ipt_text" ref="pwchk" placeholder="확인" style={{marginTop: 4}}/>
						</div>
						</td>
					</tr>
					<tr>
						<th>Email
							<span className="necessary">*</span>
						</th>
						<td>
						<div className="ipt_group">
							<input ref="userEmail" type="text" className="ipt_text" placeholder="" maxLength={100} defaultValue={modifyUserInfo.userEmail}/>
						</div>
						</td>
					</tr>
					<tr>
						<th>Activate
							<span className="necessary">*</span>
						</th>
						<td>
						<div className="ipt_group">
							<select ref="activate" className="combobox">
								{userActiveOptions}
							</select>
						</div>
						</td>
					</tr>
				</tbody>
			</table>
			<div className="popupBtnArea btn_area addbtnarea"><p className="btn2">
				<button className="btn btn_white" onClick={() => this.props.onClose()}>취소</button>
				<button className="btn btn_black" onClick={(e) => this.onClickSave()}>저장</button>
			</p></div>
        </div>;
    }
}

export default UserReg;