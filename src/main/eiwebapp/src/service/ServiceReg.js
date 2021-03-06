import React, {Component} from 'react';
import { Msg } from 'comp';
import { makeParam } from 'comp/common';
import Validation from 'comp/Validation';
import {ModelManager} from 'model';
import ServiceService from './ServiceService';
import {AdminService} from 'admin';
import ModelPopCont from 'model/ModelPopCont';

/**
 * 화면명 : Service 등록
 * 화면 경로 : Service > Service 관리 > Service 등록
 * 화면 코드 : 
 * 참고 : Service 관리 화면에서 사용하는 등록 화면
 */
class ServiceReg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            validName:null,
            validModelId:null,
            validUseData:null,
            isNameChk:false,
            descLength:0,
            progress:0,
            selectedFiles:undefined,
            currentFile:undefined,
            initModify:false,
            popupSelectedItem:undefined,
            inputChange:false,
            resourceGroupData:[],
            selectedResourceGroupId:undefined,
            serviceGroupData:[],
            selectedServiceGroupName:undefined,
			models:[]
        };
        this.onClickReg = this.onClickReg.bind(this);
        this.onClose = this.onClose.bind(this);
        this.modelChoosePopup = this.modelChoosePopup.bind(this);
        this.modelSelectedItem = this.modelSelectedItem.bind(this);
        this.onResultCreate = this.onResultCreate.bind(this);
        this.onResultServiceGroupList = this.onResultServiceGroupList.bind(this);
		this.onChangeDesc = this.onChangeDesc.bind(this);
        this.onClickModelPop = this.onClickModelPop.bind(this);
        this.onClickModelSelection = this.onClickModelSelection.bind(this);
        this.onChangeDagId = this.onChangeDagId.bind(this);
    }
    
    componentDidMount() {
        this.setState({
            validName:null,
            isNameChk:false,
            descLength:0,
            progress:0,
            selectedFiles:undefined,
            currentFile:undefined,
            modifyFlag:false
        });
        this.refs.serviceName.focus();
        // 서비스 그룹
        AdminService.serviceGroupList({},this.onResultServiceGroupList,(err) => Msg.error(err.message));
    }
    
    componentDidUpdate() {
        const { initModify } = this.state;
        let { modifyFlag } = this.props;
        if (modifyFlag && !initModify) {
            this.setState({initModify:true, isNameChk:true});   // 수정일경우 처음에 중복확인 PASS
        }
    }

    onResultServiceGroupList(res) {
        if (res.result==="ok") {
            this.setState({serviceGroupData:res.list});
        } else if (res.result === "fail"){
            Msg.error(res.message);
        }
    }
    
    onChangeName() {
        this.setState({inputChange:true,isNameChk:false});
    }
    
    
    onClickReg() {
        if (!this.validationCheck()) return;
        let parm = makeParam(this);
        ServiceService.create(parm,this.onResultCreate,(e) => Msg.error(e.message));
    }
    
    validationCheck() {
        if (!this.state.inputChange) {
            Msg.warn("변경된 사항이 없습니다.");
            return false;
        }
        // 초기화
        this.setState({validName:null});
        // 모델명
        let chkVal = this.refs.serviceName.value;
        let valiRes = Validation.chkServiceName(chkVal);
        let chkState = {};
        chkState.validName = true;
        if (!valiRes.result) {
            Msg.error(valiRes.errMsg);
            chkState.validName = false;
            this.setState(chkState);
            return false;
        }

        // 서비스 그룹 체크 : default 선택으로 PASS

        // DAG ID 체크
        chkVal = this.refs.dagId.value;
        valiRes = Validation.chkServiceDagIdExp(chkVal);
        chkState.validDagId = true;
        if (!valiRes.result) {
            Msg.error(valiRes.errMsg);
            chkState.validDagId = false;
            this.setState(chkState);
            return false;
        }

        // Cycle 입력했으면 체크
        chkVal = this.refs.runCycle.value;
        if (chkVal.length > 0) {
            //None
            if (!(chkVal === "None")) {
                chkVal = chkVal.split(" ");
                if (chkVal.length !== 5) {
                    Msg.error("Cycle 실행 입력 형식이 잘못되었습니다.");
                    return false;
                }
            }
        } else {
            this.refs.runCycle.value = "None";
        }

        // 모델 선택 체크
        chkVal = this.refs.modelId.value;
        chkState.validModelId = true;
        if (chkVal.length < 1) {
            Msg.error("모델을 선택해 주세요.");
            chkState.validModelId = false;
            this.setState(chkState);
            return false;
        }
        this.setState(chkState);
        return true;
    }
    
    onResultCreate(res) {
        this.setState(this.defaultState);
        if (res.result === "ok") {
            Msg.ok(res.message);
            this.props.onClose();
        } else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }
    
    onClose() {
        setTimeout((e) => this.props.onClose(),100);
    }
    
    modelChoosePopup() {
        //title,cont,closeFn) {
        this.setState({popupSelectedItem:undefined});
        this.props.main.showPopup(
            "모델 선택",
            <ModelManager main={this.props.main} isPopup={true} onChangeItem={(item) => this.setState({popupSelectedItem:item})} onSelection={this.modelSelectedItem} onClose={() => this.props.main.hidePopup("모델 선택")}/>,
            {width:900, height:450, okLabel:"선택"},this.modelSelectedItem,
            function() {
                console.log("close");
            }
        );
    }
    
    modelSelectedItem() {
        let {popupSelectedItem} = this.state;
        if (!popupSelectedItem)
            Msg.error("선택된 모델이 없습니다.");
        else {
            this.addModelData(popupSelectedItem);
        }
    }

    
	onChangeDesc() {
        const maxLen = 100;
        if (this.refs.serviceDesc.value.length > maxLen) {
            this.refs.serviceDesc.value = this.refs.serviceDesc.value.substr(0,maxLen);
        }
        this.setState({descLength:this.refs.serviceDesc.value.length,inputChange:true});
	}
	
	onClickModelPop() {
        const popTitle = "Model 선택";
        this.props.main.showPopup(
            popTitle,
            <ModelPopCont title={popTitle} main={this.props.main} onClose={(e) => this.props.main.hidePopup(popTitle)} onClickSelection={this.onClickModelSelection}/> ,
            {width:700, height:542, okLabel:"선택", popupBtnAreaVisible:false},null,null
        );
    }
	
    onClickModelSelection(item) {
        console.log(item);
        let {modifyServiceInfo} = this.props;
        this.refs.modelName.value = item.modelName;
        this.refs.modelId.value = item.modelId;
        // if (!modifyServiceInfo) modifyServiceInfo = {};
        if (modifyServiceInfo) {
            modifyServiceInfo.modelName = item.modelName;
            modifyServiceInfo.modelId = item.modelId;
            this.setState({inputChange:true,modifyServiceInfo:modifyServiceInfo});
        } else {
            this.setState({inputChange:true});
        }
    }
    
    onChangeDagId() {
        this.setState({inputChange:true});
    }
    
    render() {
        const { serviceGroupData,selectedServiceGroupName } = this.state;
        let { descLength } = this.state;
        let { modifyFlag,modifyServiceInfo } = this.props;
        if (modifyServiceInfo === undefined) modifyServiceInfo = {};
		let i;

        if (modifyServiceInfo.serviceGroupName && !selectedServiceGroupName) {
            this.setState({selectedServiceGroupName:modifyServiceInfo.serviceGroupName});
		}
		
		let serviceGroupOpts = [];
        for (i=0; i<serviceGroupData.length; i++) {
            if (selectedServiceGroupName === serviceGroupData[i].serviceGroupName)
                serviceGroupOpts.push(
                    <option value={serviceGroupData[i].serviceGroupName} key={Math.random()} selected>{serviceGroupData[i].serviceGroupName}</option>
                );
            else
                serviceGroupOpts.push(
                    <option value={serviceGroupData[i].serviceGroupName} key={Math.random()}>{serviceGroupData[i].serviceGroupName}</option>
                );
		}

		if (descLength === 0 && modifyServiceInfo.serviceDesc !== null && modifyServiceInfo.serviceDesc !== undefined && modifyServiceInfo.serviceDesc.length > 0)
            descLength = modifyServiceInfo.serviceDesc.length;
		
        return <div className="table_type2">
        {modifyFlag ? 
            <input type="text" ref="serviceId" style={{display:"none"}} id="inputId" defaultValue={modifyServiceInfo.serviceId} disabled/>
        : null}
        <table>
          <tbody>
            {modifyFlag ?
            <tr>
              <th>Service ID</th>
              <td>
                <div className="ipt_group">
				<span className="txt">{modifyServiceInfo.serviceId}</span>
                </div>
              </td>
            </tr> : null}
            <tr>
              <th>Service명
                  {/* <span className="font_gray">(한글,영문 최대 20자)</span> */}
                  <span className="necessary">*</span></th>
              <td>
                <div className="ipt_group">
                  <input ref="serviceName" type="text" className="ipt_text" placeholder="한글,영문 최대 50자" 
                    // onKeyDown={(e) => e.keyCode === 13 && !isNameChk ? this.onClickNameCheck() : console.log('isNameChked')}
                      onChange={(e) => {this.onChangeName()}}
                      maxLength="50" defaultValue={modifyServiceInfo.serviceName}/>
                  {/* <a role="button" className={"btn btn_black btn_duplicate" + (isNameChk ? ' success' : '')} onClick={(e) => {!isNameChk ? this.onClickNameCheck() : console.log('isNameChked')}}>{isNameChk ? '확인완료' : '중복확인'}</a> */}
                </div>
              </td>
            </tr>
            <tr>
              <th>Service Group<span className="necessary">*</span></th>
              <td>
                <div className="ipt_group">
					<select ref="serviceGroupName" style={{width: 172,height: 38,outline: "none",border: "1px solid #CECECE",borderRadius: 3,paddingLeft: 8}}
						onChange={() => this.setState({inputChange:true,selectedServiceGroupName:this.refs.serviceGroupName.value})}>
						{serviceGroupOpts}
					</select>
                </div>
              </td>
            </tr>
			<tr>
              <th>DAG ID
                  {/* <span className="font_gray">(한글,영문 최대 20자)</span> */}
                  <span className="necessary">*</span></th>
              <td>
                <div className="ipt_group">
                  <input ref="dagId" type="text" className="ipt_text" placeholder="영문 최대 30자" 
                    // onKeyDown={(e) => e.keyCode === 13 && !isNameChk ? this.onClickNameCheck() : console.log('isNameChked')}
                      onChange={(e) => {this.onChangeDagId()}}
                      maxLength="30" defaultValue={modifyServiceInfo.dagId}/>
                  {/* <a role="button" className={"btn btn_black btn_duplicate" + (isNameChk ? ' success' : '')} onClick={(e) => {!isNameChk ? this.onClickNameCheck() : console.log('isNameChked')}}>{isNameChk ? '확인완료' : '중복확인'}</a> */}
                </div>
              </td>
            </tr>
			<tr>
              <th>Model<span className="necessary">*</span></th>
              <td>
                <div className="ipt_group">
                    <label className="ipt_file" for="iptFile">
                        <input ref="modelName" type="text" className="ipt_text file_text" style={{width:431}}
                            placeholder="모델을 선택해 주세요." defaultValue={modifyServiceInfo.modelName} disabled />
                        <span className="btn btn_file" onClick={() => this.onClickModelPop()}></span>
                        <input type="button" className="btn_clear" style={{display: "none"}} />
                    </label>
                    {/* <input ref="modelName" type="text" className="ipt_text" style={{width:"calc(100% - 80px)"}}
                        placeholder="모델을 선택해 주세요." defaultValue={modifyServiceInfo.modelName} disabled/>
					<button className="btn btn_blue" style={{height:32}} onClick={() => this.onClickModelPop()}>모델 선택</button> */}
                    {modifyFlag
                        ? <input ref="modelId" type="hidden" defaultValue={modifyServiceInfo.modelId}/>
                        : <input ref="modelId" type="hidden"/>
                    }
                </div>
              </td>
            </tr>
			<tr>
              <th>Cycle</th>
              <td>
                <div className="ipt_group">
					<input ref="runCycle" type="text" className="ipt_text" placeholder="* * * * *" defaultValue={modifyServiceInfo.runCycle}
						onChange={(e) => this.setState({inputChange:true})}/>
                </div>
                {/* <div className="font_gray">분[0-59] 시간[0-23] 일자[1-31] 월[1-12] 요일[0-6]</div>
                <div className="font_gray">(예) 20,30 23 * * 1 (매주 월요일 23시 20분,30분에 실행)</div> */}
                <div className="font_gray">※ 분[0-59] 시간[0-23] 일자[1-31] 월[1-12] 요일[0-6] 예) 20,30 23 * * * (매일 23시 20분,30분에 실행) </div>
                <div className="font_gray">※ None 가능 (Airflow에서 수동으로 실행할 때 설정)</div>
                <div className="font_gray">※ <a href="https://airflow.apache.org/docs/1.10.1/scheduler.html#dag-runs" rel="noopener noreferrer" target="_blank">{'Airflow Scheduling & Triggers'}</a></div>
                <div className="font_gray">※ <a href="https://en.wikipedia.org/wiki/Cron#CRON_expression" rel="noopener noreferrer" target="_blank">CRON expression</a></div>
              </td>
            </tr>
            <tr>
              <th>Description</th>
              <td style={{textAlign:"right"}}>
				  <textarea ref="serviceDesc" rows="3" cols="100" maxlength="100" onChange={(e) => this.onChangeDesc()} defaultValue={modifyServiceInfo.serviceDesc}></textarea>
                  <span className="font_gray" style={{paddingRight:5}}>(<span style={{color:"#ff7272"}}>{descLength}</span> / 100)</span>
			  </td>
            </tr>
          </tbody>
        </table>
        <div className="popupBtnArea btn_area addbtnarea"><p className="btn2">
            <button className="btn btn_white" onClick={() => this.props.onClose()}>취소</button>
            <button className="btn btn_black" onClick={(e) => this.onClickReg()}>저장</button>
        </p></div>
      </div>;
    }
}

export default ServiceReg;