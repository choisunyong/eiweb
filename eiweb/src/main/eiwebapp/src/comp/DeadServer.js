import React,{Component} from 'react';

/**
 * 화면명 : 요청시 서버 반응없을때 표시
 * 화면 경로 : 
 * 화면 코드 : 
 * 참고 : 
 */
class DeadServer extends Component {
    render() {
        return <div className="deadServer mainContent">
            <div><i className="axi axi-exclamation-triangle"></i>서버와 통신이 되지 않습니다.</div>
        </div>;
    }
}

export default DeadServer;