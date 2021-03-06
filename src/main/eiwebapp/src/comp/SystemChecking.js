import React,{Component} from 'react';
// import CommonCode from 'main/CommonCode';

/**
 * 시스템 점검중
 */
class SystemChecking extends Component {
    render() {
        // const msg = CommonCode.getValue("SYSTEM_CONFIG","SYS_CHECKING_MSG");
        return <div className="page_wrapper">
            <div className="page_header2">
            <div className="brand">
                <h1 className="logo"><a><span className="hide">ESP Energy Intelligence</span></a></h1>
            </div>
            </div>
            <div className="page_container2">
                <div className="service_check">
                    <h3 className="tit">서버 점검으로 인한 서비스 지연 안내</h3>
                    <p className="txt">이용에 불편을 드려 죄송합니다.<br />현재 서버 점검을 실시하고 있어, 접속에 어려움이 있습니다.<br />잠시 후 다시 접속해주세요.</p>          
                </div>
        </div>
      </div>;
    }
}

export default SystemChecking;