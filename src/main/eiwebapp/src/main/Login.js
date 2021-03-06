import React, {Component} from 'react';
import {MainService,MenuCode,CookieNames} from 'main';
import { common, Msg } from 'comp';

/**
 * 화면명 : 로그인 팝업
 * 화면 경로 : 없음.
 * 화면 코드 : 없음.
 * 참고 : 
 */
class Login extends Component {
    constructor(props) {
        super(props);
        this.onLoginResult = this.onLoginResult.bind(this);
    }
    
    componentDidMount() {
        const {
            REACT_APP_DEBUG,REACT_APP_DEV_AUTO_LOGIN
        } = process.env;
        if (REACT_APP_DEBUG && REACT_APP_DEV_AUTO_LOGIN === "true") {
            MainService.login(this.refs.uid.value,this.refs.pw.value,this.onLoginResult,(err) => console.log(err));
        } else
        this.refs.uid.focus();
    }
    
	/**************************************************************************/
	/* 핸들러 */
	/**************************************************************************/
    /**
     * 로그인 결과 핸들러
     * @param {Object} res {result:ok|fail,userInfo,data:{sessionId}}
     */
    onLoginResult(res) {
        if (res.result === "ok") {
            let role = "";
            let userId = "";
            let userInfo = {};
            if (res.data && res.data.userInfo) {
                userInfo = res.data.userInfo;
                role = res.data.userInfo.userPermission;
                userId = res.data.userInfo.userId;
            }
            common.setCookie(CookieNames.SESSION_ID,res.data.sessionId);
            this.props.main.setState({login:true,sessionId:res.data.sessionId,role:role,username:userId,showLogin:false,userInfo:userInfo});
            if (process.env.REACT_APP_DEBUG && process.env.REACT_APP_FIRST_MENU_CODE)
                this.props.main.onMenuChange(process.env.REACT_APP_FIRST_MENU_CODE,true);
            else
                this.props.main.onMenuChange(MenuCode.DASHBOARD,true);
        } else if (res.result === "fail"){
            Msg.error(res.message);
        }
    }
    
    render() {
        const {onClose} = this.props;
        const {
            REACT_APP_DEBUG,REACT_APP_DEV_LOGIN_ID,REACT_APP_DEV_LOGIN_PW
        } = process.env;
        return <div className="modal_wrapper">
        <div className="modal_content login_modal">
      
          <h2 className="logo"><span className="hide">ESP Energy Intelligence</span></h2>
          <input ref='uid' type="text" className="ipt_text2" placeholder="아이디를 입력해주세요" autocomplete="off"
            onKeyDown={(e) => {
                if (e.keyCode === 13) {
                    this.refs.pw.focus();
                }
            }}
            defaultValue={REACT_APP_DEBUG ? REACT_APP_DEV_LOGIN_ID : null}
          />
          <input ref='pw' type="password" className="ipt_text2" placeholder="비밀번호" autocomplete="off" 
            onKeyDown={(e) => {
                if (e.keyCode === 13) {
                    MainService.login(this.refs.uid.value,this.refs.pw.value,this.onLoginResult,(err) => console.log(err));
                }
            }}
            defaultValue={REACT_APP_DEBUG ? REACT_APP_DEV_LOGIN_PW : null}
          />
          <p className="msg">
            <span className="error" style={{display:"none"}}>등록되지 않은 아이디이이거나 올바르지 않은 비밀번호입니다.<br />아이디와 비밀번호를 확인 후 다시 시도해 주세요.</span>
          </p>
          <a href={(e) => console.log("login")} className="btn btn_blue btn_login" onClick={(e) => {
                MainService.login(this.refs.uid.value,this.refs.pw.value,this.onLoginResult,(err) => console.log(err));
            }}>로그인</a>
          <ul className="account_menu">
            <li><a href={(e) => console.log("find id pw")} onClick={() => Msg.warn("관리자에게 문의하세요.")}>아이디 / 비밀번호 찾기</a></li>
            {/* <li><a href="#">회원가입</a></li> */}
          </ul>
          <a href={() => {onClose()}} onClick={() => {onClose()}} className="btn btn_close"><span className="hide">닫기</span></a>
      
        </div>
      </div>;
    }
}

export default Login;