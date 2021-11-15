import React, { Component } from 'react';
import { Dashboard } from 'dashboard';
import { MenuCode, SchIdPw } from 'main';
import { ModelManager } from 'model';
import { ServiceManager } from 'service';
import { HistoryServiceExec, HistoryModelReg, HistoryUserLogin, HistoryScaleInOut, ScaleInOutManager, ServiceGroupManager, CommonCodeMgr, UserManager } from 'admin';

/**
 * 메인 컨텐츠 화면 정의
 */
class MainContent extends Component {
  /**
   * 메인 컨텐츠 반환
   * @param {String} menuCode 메뉴 코드
   * @param {Main} main 메인
   * @param {Object} params 파라미터
   * @return {JSX} 메인 컨텐츠
   */
  getContent(menuCode, main, params) {
    let content;
    switch (menuCode) {
      case MenuCode.LOGIN_SCHIDPW:
        content = <SchIdPw main={main} />;
        break;
      case MenuCode.DASHBOARD:
        content = <Dashboard main={main} />;
        break;

      /** MODEL **/
      case MenuCode.MODEL_MANAGER:                // 모델관리
        content = <ModelManager main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} />;
        break;

      /** SERVICE **/
      case MenuCode.SERVICE_MANAGER:             // Service 관리
        content = <ServiceManager main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} />;
        break;
      case MenuCode.ADMIN_HIST_SERVICEEXEC:       // 이력 조회 > Service 실행결과 이력
        content = <HistoryServiceExec main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} params={params} />;
        break;

      /** ADMIN **/
      case MenuCode.ADMIN_USERMGR:                // 사용자 관리
        content = <UserManager main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} />;
        break;
      case MenuCode.ADMIN_HIST_LOGIN:        		// 이력 조회 > 사용자 로그인 이력
        content = <HistoryUserLogin main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} />;
        break;
      case MenuCode.ADMIN_HIST_MODELREG:          // 이력 조회 > Model 등록 이력
        content = <HistoryModelReg main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} />;
        break;
      case MenuCode.ADMIN_HIST_SCALEINOUT:         // Resource 이력
        content = <HistoryScaleInOut main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} />;
        break;
      case MenuCode.ADMIN_SACLEINOUTMGR:          // Scale In/Out 관리
        content = <ScaleInOutManager main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} />;
        break;
      case MenuCode.ADMIN_SERVICEGROUP:            // 서비스 그룹 관리
        content = <ServiceGroupManager main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} />;
        break;
      case MenuCode.ADMIN_COMMONCODE:            	// 공통 코드 관리
        content = <CommonCodeMgr main={main} menuCode={menuCode} onMenuChange={main.onMenuChange} />;
        break;
      default:
        content = <div>{menuCode}</div>;
    }
    return content;
  }
}

export default new MainContent();