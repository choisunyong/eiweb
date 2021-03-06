import React, {Component} from 'react';
import { Loading,common, Msg, Confirm, SystemChecking, Modal, DeadServer, Popup, Message } from 'comp';
import { MenuCode, CookieNames, MainContent, MenuData, MainTop, Login, MainPath, CommonCode, MainService } from 'main';
import http from "comp/http-common";

/**
 * 화면명 : 메인
 * 화면 경로 : 없음.
 * 화면 코드 : 없음.
 * 참고 : 화면 최상단
 */
class Main extends Component {
    constructor(props) {
		super(props);
		this.state = {
			userInfo:{},
			loading:false,
			content:null,
			menuCode:'',
			login:false,
			sessionId:'',
			role:'',
			username:'',
			paths:[],
			commonCode:[],
			popup:false,
			modal:false,
			allScreen:false,
			showLogin:false,
			confirm:false,
			confirmTitle:undefined,
			confirmMessage:undefined,
			confirmOkfn:undefined,
			confirmCancelFn:undefined,
			popupIdx:[],
			popups:{},
			popupTitle:undefined,
			popupContent:undefined,
			popupOpts:undefined,
			popupOkFn:undefined,
			popupCancelFn:undefined,
			message:false,
			messageMsg:""
		}
		this.onResultCommonCode = this.onResultCommonCode.bind(this);
		this.showLoading = this.showLoading.bind(this);
		this.hideLoading = this.hideLoading.bind(this);
		this.onMenuChange = this.onMenuChange.bind(this);
		this.getContent = this.getContent.bind(this);
		this.onChkLogin = this.onChkLogin.bind(this);
		this.onResultCommonCode = this.onResultCommonCode.bind(this);
		this.onFail = this.onFail.bind(this);
		this.hideLogin = this.hideLogin.bind(this);

		this.showConfirm = this.showConfirm.bind(this);
		this.hideConfirm = this.hideConfirm.bind(this);
		this.showPopup = this.showPopup.bind(this);
		this.hidePopup = this.hidePopup.bind(this);
	}
    
    componentWillMount() {
		common.main = this;
        // Spring Boot내에서 웹을 돌릴경우(.env.production REACT_APP_WAS_URL 주소 현재 사용안함)
        // 웹 서버를 따로 돌릴경우 빼야함.(.env.production 설정에 REACT_APP_WAS_URL 주소로 호출)
        if (process.env.NODE_ENV === 'production')
            http.defaults.baseURL = "";
    }
    
    componentDidMount() {
        window.onresize();
        // 공통 코드 가져오기
        MainService.commonCodeList(this.onResultCommonCode,this.onFail);
    }

	/**************************************************************************/
	/* 기능 */
	/**************************************************************************/
	/**
	 * 로딩 실행
	 */
	showLoading(modal) {
      if (modal)
          this.setState({loading:true,modal:modal});
      else
          this.setState({loading:true});
	}
	
	/**
	 * 로딩 종료
	 */
	hideLoading() {
		this.setState({loading:false,modal:false});
	}
	
    /**
     * 메뉴 변경
     * @param {String} menuCode 메뉴 코드
     * @param {Object} params 파라미터
     * @param {boolean} unconditionality 강제실행여부(동일한 메뉴코드)
     */
  onMenuChange(menuCode, params, unconditionality) {
    console.log(menuCode, params, unconditionality)
        if (!unconditionality && menuCode === this.state.menuCode) return;

		if (menuCode === MenuCode.LOGIN) {
			this.setState({showLogin:true});
			return;
		}
		const content = this.getContent(menuCode, params);
		// const pathData = this.makePathData(menuCode);
		const pathData = MenuData.getPaths(menuCode);
		common.setCookie(CookieNames.LAST_MENU_CODE,menuCode);
		this.setState({content:content,menuCode:menuCode,paths:pathData});
	}
	
	/**
	 * 메뉴 화면 반환
	 * @param {String} menuCode 메뉴 코드
	 */
	getContent(menuCode, params) {
		const content = MainContent.getContent(menuCode,this, params);
		return content;
	}
	
	/**
	 * 로그인 팝업 닫기
	 */
	hideLogin() {
		this.setState({showLogin:false});
	}

	/**
     * 확인 컴퍼넌트 실행
     * @param {String} title 제목
     * @param {String} message 메세지
     * @param {Function} okFn 확인 콜백 함수
     * @param {Function} cancelFn 취소 콜백 함수
     */
    showConfirm(title,message,okFn,cancelFn) {
        this.setState({confirm:true,confirmTitle:title,confirmMessage:message,confirmOkfn:okFn,confirmCancelFn:cancelFn});
    }
    
    /**
     * 확인 컴퍼넌트 종료
     */
    hideConfirm() {
        this.setState({confirm:false,confirmTitle:undefined,confirmMessage:undefined,confirmOkfn:undefined,confirmCancelFn:undefined});
	}
    
	/**
     * 공통 팝업 열기
     * @param {String} title 팝업 타이틀 (여러 팝업 띄웠을때 플래그 역할을 한다.)
     * @param {JSX} cont 컨텐츠 화면
     * @param {Object} opts 옵션
     * @param {Function} okFn 확인 콜백 함수
     * @param {Function} closeFn 닫기 콜백 함수
     */
    showPopup(title,cont,opts,okFn,closeFn) {
        let {popupIdx,popups} = this.state;
        const popupOpt = {
            title:title,
            content:cont,
            opts:opts,
            okFn:okFn,
            closeFn:closeFn
		};
        popupIdx.push(title);
        popups[title] = popupOpt;
        this.setState({popup:true,popupIdx:popupIdx,popups:popups});
        // this.setState({popup:true, modal:true, popupTitle:title, popupContent:cont, popupOpts:opts, popupOkFn:okFn, popupCloseFn:closeFn});
    }
    
    /**
     * 해당 팝업 타이틀을 갖고있는 팝업 닫기
	 * @param {String} title 팝업 타이틀
     */
    hidePopup(title) {
        const {popups,popupIdx} = this.state;
        let nPopups = {};
        let nPopupIdx = [];
        for (let i=0; i<popupIdx.length; i++) {
            if (title !== popupIdx[i]) {
                nPopups[popupIdx[i]] = popups[popupIdx[i]];
                nPopupIdx.push(popupIdx[i]);
            }
        }
        if (nPopupIdx.length < 1)
            this.setState({popup:false,popups:{},popupIdx:[]});
        else
            this.setState({popups:nPopups,popupIdx:nPopupIdx});
    }
    
	/**************************************************************************/
	/* 핸들러 */
	/**************************************************************************/
    /**
     * 공통 코드 결과 핸들러
     * @param {Object} res {result:ok|fail,list:공통코드 리스트,message:결과 메세지}
     */
    onResultCommonCode(res) {
        if (res.result === "ok") {
            CommonCode.setData(res.list);

            // 시스템 점검중 설정 확인
            if (CommonCode.getValue("SYSTEM_CONFIG","SYS_CHECKING") === "Y") {
                this.setState({allScreen:true,content:<SystemChecking />});
            } else {
                const setSessionId = common.getCookie(CookieNames.SESSION_ID);
                MainService.chkLogin(setSessionId,this.onChkLogin,(err) => Msg.error(err.message));
            }
        } else if (res.result === "fail") {
            Msg.error(res.message);
            this.setState({content:<DeadServer />});
        }
    }
    
    /**
     * 요청 결과 실패 이벤트 핸들러
     * @param {Error} err
     */
    onFail(err) {
        // 웹만 살아있을경우(웹을 따로 돌릴경우) 서버가 죽어 있어 요청실패시 서버 통신 안된다는 메세지 화면 출력
        if (err.message === 'Network Error') {
            this.setState({content:<DeadServer />});
        }
    }
    
    /**
     * 로그인중 확인 결과 핸들러
     * @param {Object} res {result:ok|fail,data:{userInfo:{userPermission,userName}},message:결과 메세지}
     */
    onChkLogin(res) {
        // console.log(res);
        if (res.result === "ok") {
            let setSessionId = res.data.sessionId;
            if (setSessionId && setSessionId.replace(/ /g,'') !== '') {
                // console.log(res.data);
                if (res.data && res.data.userInfo) {
					const {userPermission, userId} = res.data.userInfo;
					this.setState({login:true,sessionId:setSessionId,role:userPermission,username:userId,userInfo:res.data.userInfo});
					let preMenuCode = common.getCookie(CookieNames.LAST_MENU_CODE);
					this.onMenuChange(preMenuCode && (preMenuCode !== null || preMenuCode !== undefined) ? preMenuCode : MenuCode.SERVICE);
				} else {
					common.setCookie(CookieNames.SESSION_ID,"");
					common.setCookie(CookieNames.LAST_MENU_CODE,"");
					this.onMenuChange(MenuCode.DASHBOARD);
				}

            }
        } else {
            common.setCookie(CookieNames.SESSION_ID,"");
            common.setCookie(CookieNames.LAST_MENU_CODE,"");
            this.onMenuChange(MenuCode.DASHBOARD);
        }
	}
    
	/**
	 * Message
	 * @param {String} msg message
	 */
	msg(msg) {
		this.setState({message:true,messageMsg:msg,model:true});
	}
	
    render() {
		const {
			username,
			role,
			paths,
			content,
			loading,
			confirm,
			confirmTitle,
			confirmMessage,
			confirmOkfn,
			confirmCancelFn,
			popup,
			modal,
			popupIdx,
			popups,
			allScreen,
			showLogin,
			message,
			messageMsg,
			menuCode
		} = this.state;

		let pops = [];
		let popOpts;
		if (popup) {
			for (let i=0; i<popupIdx.length; i++) {
				popOpts = popups[popupIdx[i]];
				pops.push(
					<Popup onClose={() => this.hidePopup(popOpts.title)} 
						title={popOpts.title}
						content={popOpts.content}
						opts={popOpts.opts}
						okFn={popOpts.okFn} closeFn={popOpts.closeFn}/>
				);
			}
		}
		return <div className="page_root">
			{/* 전체 화면을 활용하는 화면이면 기본틀을 안보이게 처리한다. */}
			{allScreen ? <div>{content}</div>
				: <div className="page_wrapper">
						<MainTop main={this} username={username} role={role} onMenuChange={this.onMenuChange}/>

						<div className={"page_container" + (menuCode === MenuCode.DASHBOARD ? ' dash_wrap' : '')}>
							{/* 대시보드 화면은 메뉴 경로를 안보이게 처리한다. */}
							{menuCode !== MenuCode.DASHBOARD ? <MainPath paths={paths} onClick={this.onMenuChange} /> : null }
							{content}
						</div>

						{/* 모달 */}
						{modal ? <Modal /> : null}
						{/* 공통 팝업 */}
						{pops}
						{/* 로그인 팝업 */}
						{showLogin ? <Login main={this} onClose={this.hideLogin} /> : null}
						{/* 확인 컴퍼넌트 */}
						{confirm ? <Confirm main={this}
							confirmTitle={confirmTitle}
							confirmMessage={confirmMessage}
							confirmOkfn={confirmOkfn}
							confirmCancelFn={confirmCancelFn}
							/> : null}
						{/* Msg */}
						{message ? <Message message={messageMsg} onClickOk={() => this.setState({message:false,modal:false})}/> : null}
						{/* 로딩 */}
						{loading ? <Loading /> : null}
				</div>
			}{/* allScreen */}
			<div className="page_footer dash_footer">
				<div className="page_inner">
				<a alt="logo"></a>
				<ul className="footer_aside">
					<li>개인정보 처리방침</li>
					<li>이용약관</li>
				</ul>
				<span className="float">Copyright 2020 by SK Telecom Co., Ltd. All Rights Reserved.</span>
				</div>  
			</div>
		</div>;{/* page_root */}
	} /* render */
}
						
export default Main;