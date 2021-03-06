import React, { Component } from 'react';
import { MenuCode, MenuData, MainService, ChangeUserPassword, Logo } from 'main';

/**
 * 화면명 : 메인 상단
 * 화면 경로 : 없음.
 * 화면 코드 : 없음.
 * 참고 : 
 */
class MainTop extends Component {
    constructor(props) {
        super(props);
        this.state = {
            subBgHei: 235
        };
        this.isMenuItemActive = this.isMenuItemActive.bind(this);
        this.onLogout = this.onLogout.bind(this);
        this.onLogoutResult = this.onLogoutResult.bind(this);
        this.onClickChangePw = this.onClickChangePw.bind(this);
    }

    /**************************************************************************/
    /* 기능 */
    /**************************************************************************/
    /**
     * 메뉴 활성 여부
     * @param {String} menuCode 메뉴 코드
     * @return {boolean} 메뉴 활성여부
     */
    isMenuItemActive(menuCode) {
        return this.props.main.state.menuCode.substr(0, 7) === menuCode;
    }

    /**
     * 로그아웃
     */
    onLogout() {
        MainService.logout(this.onLogoutResult, this.onLogoutResult);
    }

    /**************************************************************************/
    /* 핸들러 */
    /**************************************************************************/
    /**
     * 로그아웃 결과 핸들러
     * @param {Object} res
     */
    onLogoutResult(res) {
        this.props.main.setState({ login: false, role: '', username: '', sessionId: '', userInfo: {} });
        this.props.main.onMenuChange(MenuCode.DASHBOARD);
    }

    /**
     * 비밀번호 변경
     */
    onClickChangePw() {
        const popTitle = "Change User Password";
        this.props.main.showPopup(
            popTitle,
            <ChangeUserPassword main={this.props.main} onClose={(e) => this.props.main.hidePopup(popTitle)} />,
            { width: 560, height: 288, popupBtnAreaVisible: false }, null, null
        );
    }

    render() {
        const { role, onMenuChange } = this.props;
        let menuItems = [];

        // 관리자 메뉴
        if (role === "ADMIN") {
            menuItems.push(<MenuItem menu="Dashboard" menuCode={MenuCode.DASHBOARD} currentMenuCode={this.props.main.state.menuCode} onMenuChange={onMenuChange} key={Math.random()} active={this.isMenuItemActive(MenuCode.DASHBOARD)} />);
            menuItems.push(<MenuItem menu="Model" menuCode={MenuCode.MODEL_MANAGER} currentMenuCode={this.props.main.state.menuCode} onMenuChange={onMenuChange} key={Math.random()} active={this.isMenuItemActive(MenuCode.MODEL)} />); // Model
            menuItems.push(<MenuItem menu="Serivce" menuCode={MenuCode.SERVICE} currentMenuCode={this.props.main.state.menuCode} subMenu={MenuData.service} onMenuChange={onMenuChange} key={Math.random()} active={this.isMenuItemActive(MenuCode.SERVICE)} />); // Service
            menuItems.push(<MenuItem menu="Admin" menuCode={MenuCode.ADMIN} currentMenuCode={this.props.main.state.menuCode} subMenu={MenuData.admin} onMenuChange={onMenuChange} key={Math.random()} active={this.isMenuItemActive(MenuCode.ADMIN)} />); // Administrator
        }
        // 모델러 메뉴
        else if (role === "MODELER") {
            menuItems.push(<MenuItem menu="Model" menuCode={MenuCode.MODEL_MANAGER} currentMenuCode={this.props.main.state.menuCode} onMenuChange={onMenuChange} key={Math.random()} active={this.isMenuItemActive(MenuCode.MODEL)} />); // Model
            menuItems.push(<MenuItem menu="Serivce" menuCode={MenuCode.SERVICE} currentMenuCode={this.props.main.state.menuCode} subMenu={MenuData.service} onMenuChange={onMenuChange} key={Math.random()} active={this.isMenuItemActive(MenuCode.SERVICE)} />); // Service
        }
        return <div className="page_header">
            <div className="page_inner">
                <Logo onMenuChange={onMenuChange} />

                <div className="gnb">
                    <ul>{menuItems}</ul>
                </div>

                <ul className="login_sts">
                    {this.props.main.state.login
                        ? <li><a>{this.props.username}</a>
                            <ul className="user_menu">
                                <li><a onClick={() => this.onClickChangePw()}>PW 변경</a></li>
                                <li><a onClick={() => this.onLogout()}>Logout</a></li>
                            </ul>
                        </li>
                        : <li><a onClick={() => onMenuChange(MenuCode.LOGIN)}>Login</a></li>}
                </ul>
            </div>
        </div>
    }
}

class MenuItem extends Component {
    render() {
        let { menu, menuCode, subMenu, active, onMenuChange, currentMenuCode } = this.props;
        let subMenuItems = [];
        if (!subMenu) subMenu = [];
        for (let i = 0; i < subMenu.length; i++) {
            subMenuItems.push(<li className={subMenu[i].menuCode === currentMenuCode ? 'active' : ''} key={Math.random()}><a onClick={() => onMenuChange(subMenu[i].menuCode)}>{subMenu[i].menu}</a></li>)
        }
        return <li className={active ? 'active' : ''} >
            {subMenu.length > 0
                ? <a onClick={() => console.log(menu)}>{menu}</a>
                : <a onClick={() => onMenuChange(menuCode)}>{menu}</a>
            }
            {subMenu.length > 0 ? <ul>{subMenuItems}</ul> : null}
        </li>
    }
}

export default MainTop;