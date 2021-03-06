import React, {Component} from 'react';
import { AdminService } from 'admin';
import Validation from 'comp/Validation';
import { Msg } from 'comp';

/**
 * 화면명 : 아이디 / 비밀번호 찾기
 * 화면 경로 :
 * 화면 코드 :
 * 참고 : 
 */
class SchIdPw extends Component {
    constructor(props) {
        super(props);
        this.state = {
            tabFocus:"schId"
        };
        this.tabChange = this.tabChange.bind(this);
        this.onClickSchId = this.onClickSchId.bind(this);
        this.onClickSchPw = this.onClickSchPw.bind(this);
        this.validationSchId = this.validationSchId.bind(this);
        this.validationSchPw = this.validationSchPw.bind(this);
        this.onResultSearchId = this.onResultSearchId.bind(this);
        this.onResultSearchPw = this.onResultSearchPw.bind(this);
    }

	/**************************************************************************/
	/* 기능 */
	/**************************************************************************/
    /**
     * 탭 변경
     * @param {String} type 탭 구분 (schId|schPw)
     */
    tabChange(type) {
        this.setState({tabFocus:type});
    }
    
    /**
     * 아이디 찾기 요청
     */
    onClickSchId() {
        if (!this.validationSchId()) return;
        let parm = {};
        parm.userName = this.refs.userName.value;
        parm.userEmail = this.refs.schIdEmail.value;
        // console.log("searchId parameter >> ");
        // console.log(parm);
        AdminService.searchId(parm,this.onResultSearchId,(e) => console.log(e));
    }
    
    /**
     * 비밀번호 찾기 요청
     */
    onClickSchPw() {
        if (!this.validationSchPw()) return;
        let parm = {};
        parm.userId = this.refs.userId.value;
        parm.userEmail = this.refs.schPwEmail.value;
        // console.log("searchPw parameter >> ");
        // console.log(parm);
        AdminService.searchPw(parm,this.onResultSearchPw,(e) => console.log(e));
    }
    
    /**
     * 아이디 찾기 Validation Check
     * @return {boolean} 가능여부
     */
    validationSchId() {
        //userName
        //schIdEmail
        let chkVal = this.refs.userName.value;
        if (chkVal.length < 2) {
            Msg.error("이름을 입력해 주세요.");
            this.refs.userName.focus();
            return false;
        }
        chkVal = this.refs.schIdEmail.value;
        let valiRes = Validation.chkEmail(chkVal);
        if (!valiRes.result) {
            Msg.error(valiRes.errMsg);
            this.refs.schIdEmail.focus();
            return false;
        }
        return true;
    }
    
    /**
     * 비밀번호 찾기 Validation Check
     * @return {boolean} 가능여부
     */
    validationSchPw() {
        //userId
        //schPwEmail
        let chkVal = this.refs.userId.value;
        if (chkVal.length < 2) {
            Msg.error("아이디를 입력해 주세요.");
            this.refs.userId.focus();
            return false;
        }
        chkVal = this.refs.schPwEmail.value;
        let valiRes = Validation.chkEmail(chkVal);
        if (!valiRes.result) {
            Msg.error(valiRes.errMsg);
            this.refs.schPwEmail.focus();
            return false;
        }
        return true;
    }

	/**************************************************************************/
	/* 핸들러 */
	/**************************************************************************/
    /**
     * 아이디 찾기 결과 핸들러
     * @param {Object} res {result:ok|fail,data:{userId},message:결과 메세지}
     */
    onResultSearchId(res) {
        console.log(res);
        if (res.result === "ok") {
            Msg.ok("아이디는 " + res.data.userId + "입니다.");
        }
        else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }
    
    /**
     * 비밀번호 찾기 결과 핸들러
     * @param {Object} res {result:ok|fail,message:결과 메세지}
     */
    onResultSearchPw(res) {
        console.log(res);
        if (res.result === "ok") {
            Msg.ok(res.message);
        }
        else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }
    
    render() {
        const {tabFocus} = this.state;
        return <div className="schIdPw mainContent"><div className={'container'}>
            <div className="tab">
                <div className={"col-md-6 item" + (tabFocus === "schId" ? " active" : "")} onClick={() => (tabFocus !== "schId" ? this.tabChange('schId') : null)}>ID 찾기</div>
                <div className={"col-md-6 item" + (tabFocus === "schPw" ? " active" : "")} onClick={() => (tabFocus !== "schPw" ? this.tabChange('schPw') : null)}>Password 찾기</div>
            </div>

            {tabFocus === "schId"
                ? <div className="form">
                    <div className="form">
                        <input ref="userName" className="form-control" placeholder="이름" />
                    </div>
                    <div className="form">
                        <input ref="schIdEmail" className="form-control" placeholder="이메일"/>
                    </div>
                    <div className="form">
                        <button className="btn btn-success btn-sm" onClick={() => this.onClickSchId()}>아이디 찾기</button>
                    </div>
                </div>
            : null}
            {tabFocus === "schPw"
                ? <div className="form">
                <div className="form">
                    <input ref="userId" className="form-control" placeholder="아이디" />
                </div>
                <div className="form">
                    <input ref="schPwEmail" className="form-control" placeholder="이메일"/>
                </div>
                <div className="form">
                    <button className="btn btn-success btn-sm" onClick={() => this.onClickSchPw()}>Password 재설정</button>
                </div>
            </div>
        : null}
        </div></div>;
    }
}

export default SchIdPw;