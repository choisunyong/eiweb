import React, {Component} from 'react';
import AdminService from './AdminService';
import { Msg } from 'comp';
import ReactHtmlParser from 'react-html-parser';

/**
 * 화면명 : Service 이력 결과
 * 화면 경로 : Admin > Service History 결과 팝업
 * 화면 코드 : 
 * 참고 : Service가 결과 파일을 output할경우 해당 결과파일을 로드해서 보여주는 화면
 */
class HistoryServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            detailInfo:{}
        };
        this.onResultSvcExecHistInfo = this.onResultSvcExecHistInfo.bind(this);
    }
    
    componentDidMount() {
        const {serviceHistory} = this.props;
        // 서비스 결과 정보
        AdminService.serviceExecHistoryResult(serviceHistory,this.onResultSvcExecHistInfo,(err) => console.log(err.message));
    }
    
    /**
     * 서비스 결과 정보 결과 핸들러
     * @param {Object} res {result:ok|fail,data:{html:결과 html 파일 내용, log:결과 log 파일 내용}}
     */
    onResultSvcExecHistInfo(res) {
        if (res.result === "ok") {
            this.setState({detailInfo:res.data});
        } else if (res.result === "fail") { Msg.error(res.message) }
    }
    
    render() {
        const {detailInfo} = this.state;
        const {serviceHistory} = this.props;
        return <div className="content_view model_view">

        <div className="content_title">
          <h3 className="tit">Service Report</h3>
        </div>

        <div className="btn_area">
          <span className="left">
            <button className="btn btn_white" onClick={() => this.props.onClose()} style={{marginBottom:20}}>목록</button>
          </span>
        </div>

        <div className="table_type2 table_type3">
          <table>
            <colgroup>
              <col style={{width:240}} />
              <col />
            </colgroup>
            <tbody>
              <tr>
                <th>Service Name</th>
                <td>
                    <p className="txt">{serviceHistory.serviceName}</p>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="report">
          <p className="tit">Result Chart</p>
          <div className="contents img">
            { ReactHtmlParser(detailInfo.png) }
          </div>
        </div>

        {/* <div className="report">
          <p className="tit">Result Chart</p>
          <div className="contents">
            { ReactHtmlParser(detailInfo.html) }
          </div>
        </div> */}

        {/* <div className="log">
          <span className="tit">Result CSV</span>
          <div className="contents">
            { ReactHtmlParser(detailInfo.csv) }
          </div>
        </div> */}
        <div className="log">
          <span className="tit">Result Log</span>
          <div className="contents">
            { ReactHtmlParser(detailInfo.log) }
          </div>
        </div>

        <div className="btn_area">
          <span className="right">
            <button className="btn btn_white" onClick={() => this.props.onClose()} style={{marginBottom:20}}>목록</button>
          </span>
        </div>

      </div>;
    }
}

export default HistoryServiceDetail;