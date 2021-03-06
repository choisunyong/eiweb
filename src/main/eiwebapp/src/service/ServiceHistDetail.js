import React, {Component} from 'react';
import { Msg } from 'comp';
import ServiceService from './ServiceService';
import {AdminService} from 'admin';
// import UploadService from 'comp/file/services/upload-files.service';
// import ModelFileItem from './ModelFileItem';

/**
 * 화면명 : Service 이력 상세
 * 화면 경로 : Service > Service 관리 > Service 상세
 * 화면 코드 : 
 * 참고 : Service 관리 화면에서 사용하는 등록 화면
 */
class ServiceDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            serviceInfo:undefined,
            resourceGroupData:[]
        };
        this.onResultInfo = this.onResultInfo.bind(this);
        this.onResultResourceGroupList = this.onResultResourceGroupList.bind(this);
    }
    
    componentDidMount() {
        this.props.main.showLoading();
        ServiceService.getServiceHistInfo( this.props.selectionItem,this.onResultInfo,(e) => this.props.main.hideLoading() );
        // 자원 그룹 할당
        AdminService.resourceGroupList({},this.onResultResourceGroupList,(err) => Msg.error(err.message));
    }
    
    onResultInfo(res) {
        this.props.main.hideLoading();
        // console.log( res.data );
        if (res.result === "ok") {
            this.setState({serviceInfo:res.data.serviceInfo});
        }
        else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }
    
    onResultResourceGroupList(res) {
        console.log(res);
        if (res.result==="ok") {
            this.setState({resourceGroupData:res.list});
        } else if (res.result === "fail"){
            Msg.error(res.message);
        }
    }

    render() {
        let {serviceInfo,resourceGroupData} = this.state;
        if (serviceInfo === undefined) serviceInfo = {};
        let resourceGroupOpts = [];
        for (let i=0; i<resourceGroupData.length; i++) {
            if (serviceInfo.resourceGroupId === resourceGroupData[i].resourceGroupId)
                resourceGroupOpts.push(
                    <option value={resourceGroupData[i].resourceGroupId} key={Math.random()} selected>{resourceGroupData[i].resourceGroupName}</option>
                );
            else
                resourceGroupOpts.push(
                    <option value={resourceGroupData[i].resourceGroupId} key={Math.random()}>{resourceGroupData[i].resourceGroupName}</option>
                );
        }
        return <div className="subMain"><div className={'content'}>
            <span className={'title'}>● Service 상세</span>
            <form ref={'form'}>
                <div className="form-group row">
                    <label for="inputName" className="col-sm-2 col-form-label ">Service명</label>
                    <div className="col-sm-10 input-group">
                        <input type="text" className={"form-control"} id="inputName"
                            maxLength="20" defaultValue={serviceInfo.serviceName}
                        disabled />
                    </div>
                </div>
                <div className="form-group row">
                    <label for="inputName" className="col-sm-2 col-form-label">버전</label>
                    <div className="col-sm-10 input-group">
                        <input type="text" className={"form-control"} id="inputName" value={serviceInfo.version} disabled/>
                    </div>
                </div>
                <div className="form-group row">
                    <label for="inputName" className="col-sm-2 col-form-label ">모델</label>
                    <div className="col-sm-10 input-group">
                        <input className="form-control" defaultValue={serviceInfo.modelName} disabled/>
                </div></div>
                
                {/* <div className="form-group row">
                    <label for="inputName" className="col-sm-2 col-form-label ">데이터</label>
                    <div className="col-sm-10 input-group">
                        <div className="col-sm-10 input-group" style={{paddingTop: 5,paddingBottom: 5,paddingLeft: 0}}>


                        <div className="col-md-6 input-group" style={{alignItems: "center"}}>
                        <label style={{width:100,paddingTop: 6,paddingRight: 13}}>지역 선택</label>
                        <select className="form-control" disabled><option value="1">1</option></select>
                        </div>
                        <div className="col-md-6 input-group">
                        <label style={{paddingTop: 6,paddingRight: 13}}>건물 선택</label>
                        <select className="form-control" disabled><option value="1">1</option></select>
                        </div>
                        <div className="col-md-12 input-group" style={{alignItems: "center"}}>
                        <label style={{width:100,paddingTop: 6,paddingRight: 13}}>데이터 기간</label>
                        <button className="btn btn-secondary btn-sm" style={{width: 62}} disabled>1달</button>

                        </div>

                        </div>

                </div></div> */}
                
                <div className="form-group row">
                    <label for="inputName" className="col-sm-2 col-form-label">자원 그룹 할당</label>
                    <div className="col-sm-10 input-group">
                        <select ref="resourceGroupId" className="form-control" disabled>
                            {resourceGroupOpts}
                        </select>
                </div></div>
                <div className="form-group row">
                    <label for="inputName" className="col-sm-2 col-form-label">AirFlow 실행</label>
                    <div className="col-sm-10 input-group">
                        <input ref="runCycle" className="form-control" defaultValue={serviceInfo.runCycle} disabled/>
                </div></div>
                <div className={'invaliderrmsg info'}>분[0-59] 시간[0-23] 일자[1-31] 월[1-12] 요일[0-6]</div>
                <div className={'invaliderrmsg info'}>(예) 20,30 23 * * 1 (매주 월요일 23시 20분,30분에 실행)</div>
            </form>
            <div className="controlArea">
                <button className="btn btn-secondary btn-sm controlBtn" onClick={this.props.onClose}>목록</button>
                {this.props.modifyButtonVisible === undefined || this.props.modifyButtonVisible
                    ? <button className="btn btn-success btn-sm controlBtn leftGap" onClick={(e) => this.props.onClickModify(serviceInfo)}>수정</button>
                    : null}
            </div>

            </div></div>;
    }
}

export default ServiceDetail;