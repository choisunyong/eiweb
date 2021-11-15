import React,{Component} from 'react';
import Grid from '@toast-ui/react-grid';
import TuiGrid from 'tui-grid';
import { Msg } from 'comp';
import {AdminService} from 'admin';
import Validation from 'comp/Validation';
import {common} from 'comp';

/**
 * 화면명 : 공통 코드
 * 화면 경로 : 관리자 > 공통 코드
 * 화면 코드 : MENU00406
 * 참고 : 
 */
class CommonCodeMgr extends Component {
    constructor(props) {
        super(props);
        this.state = {
            groupData:[],
            groupColumns:[
                {name:'groupCode',header:'그룹 코드', align:"center"}
                ,{name:'groupName',header:'그룹 코드명', align:"center"}
                ,{name:'useYn',width:40,header:'사용', align:"center"}
            ],
            codeData:[],
            codeColumns:[
                {name:'code',header:'코드', align:"center"}
                ,{name:'codeName',header:'코드명', align:"center"}
                ,{name:'value',header:'코드값', align:"center"}
                ,{name:'sort',width:40,header:'순서', align:"center"}
                ,{name:'useYn',width:40,header:'사용', align:"center"}
            ],
            bodyHeight:300,

            selectionGroupItem:undefined,selectionCodeItem:undefined,
            groupSaveType:undefined,codeSaveType:undefined,

            validGrpCd:null,validGrpCdNm:null,
            validCd:null,validCdNm:null,
            reqDeleteCodeAll:null
        }
        this.reqCommGroupList = this.reqCommGroupList.bind(this);
        this.reqCommCodeList = this.reqCommCodeList.bind(this);
        this.onResultCommonGroupList = this.onResultCommonGroupList.bind(this);
        this.onResultCommonCodeList = this.onResultCommonCodeList.bind(this);
        this.onClickGroupGrid = this.onClickGroupGrid.bind(this);
        this.onClickCodeGrid = this.onClickCodeGrid.bind(this);
        this.groupGridSelectedItem = this.groupGridSelectedItem.bind(this);
        this.codeGridSelectedItem = this.codeGridSelectedItem.bind(this);
        this.initGroupForm = this.initGroupForm.bind(this);
        this.initCodeForm = this.initCodeForm.bind(this);
        this.disabledGroupForm = this.disabledGroupForm.bind(this);
        this.disabledCodeForm = this.disabledCodeForm.bind(this);
        this.onClickBtnGroupSave = this.onClickBtnGroupSave.bind(this);
        this.onClickBtnGroupDel = this.onClickBtnGroupDel.bind(this);
        this.onClickBtnCodeSave = this.onClickBtnCodeSave.bind(this);
        this.onClickBtnCodeDel = this.onClickBtnCodeDel.bind(this);
        this.onClickGroupAdd = this.onClickGroupAdd.bind(this);
        this.onClickCodeAdd = this.onClickCodeAdd.bind(this);
        this.validationCheckGroup = this.validationCheckGroup.bind(this);
        this.validationCheckCode = this.validationCheckCode.bind(this);
        this.initValids = this.initValids.bind(this);
        this.onResultGroupSave = this.onResultGroupSave.bind(this);
        this.onResultCodeSave = this.onResultCodeSave.bind(this);
        this.onResultGroupDel = this.onResultGroupDel.bind(this);
        this.onResultCodeDel = this.onResultCodeDel.bind(this);
        this.onConfirmGroupDelOk = this.onConfirmGroupDelOk.bind(this);
        this.onConfirmCodeDelOk = this.onConfirmCodeDelOk.bind(this);
        this.onConfirmCancel = this.onConfirmCancel.bind(this);
    }
    
    componentDidMount() {
        TuiGrid.setLanguage('ko');
        TuiGrid.applyTheme('clean'); // default, striped, clean
        this.setState({bodyHeight:document.getElementById('root').clientHeight - 350});
        this.reqCommGroupList();
        this.disabledGroupForm();
        this.disabledCodeForm();
    }
    
	/**************************************************************************/
	/* 기능 */
	/**************************************************************************/
    /**
     * 그룹 코드 리스트 요청
     */
    reqCommGroupList() {
        this.props.main.showLoading();
        AdminService.commonGroupList(this.onResultCommonGroupList,(err) => Msg.error(err.message));
    }
    
    /**
     * 공통 코드 리스트 요청
     * @param {String}} groupCode 그룹코드
     */
    reqCommCodeList(groupCode) {
        this.props.main.showLoading();
        const parm = {groupCode:groupCode,allFlag:"all"};
        AdminService.commonCodeList(parm,this.onResultCommonCodeList,(err) => Msg.error(err.message));
    }

    /**
     * 그룹 입력폼 초기화
     */
    initGroupForm() {
        const {groupCode,groupName,groupUseYn,btnGroupSave,btnGroupDel} = this.refs;
        groupCode.value = "";
        groupName.value = "";
        groupUseYn.checked = "checked";
        groupCode.disabled = groupName.disabled = groupUseYn.disabled = btnGroupSave.disabled = btnGroupDel.disabled = false;
    }

    /**
     * 코드 입력폼 초기화
     */
    initCodeForm() {
        const {code, codeName, value, sort, useYn, btnCodeSave, btnCodeDel} = this.refs;
        code.value = "";
        codeName.value = "";
        value.value = "";
        sort.value = "";
        useYn.checked = "checked";
        code.disabled = codeName.disabled = value.disabled = sort.disabled = useYn.disabled = btnCodeSave.disabled = btnCodeDel.disabled = false;
    }

    /**
     * 그룹 입력폼 전체 비활성화
     */
    disabledGroupForm() {
        const {groupCode,groupName,groupUseYn,btnGroupSave,btnGroupDel} = this.refs;
        groupCode.disabled = groupName.disabled = groupUseYn.disabled = btnGroupSave.disabled = btnGroupDel.disabled = true;
    }
    
    /**
     * 코드 입력폼 전체 비활성화
     */
    disabledCodeForm() {
        const {code, codeName, value, sort, useYn, btnCodeSave, btnCodeDel} = this.refs;
        code.disabled = codeName.disabled = value.disabled = sort.disabled = useYn.disabled = btnCodeSave.disabled = btnCodeDel.disabled = true;
    }
    
    /**
     * 그룹 그리드 선택
     */
    groupGridSelectedItem() {
        this.initGroupForm();
        const selectedItem = this.state.selectionGroupItem;
        this.reqCommCodeList( selectedItem.groupCode );

        const {groupCode,groupName,groupUseYn} = this.refs;
        groupCode.value = selectedItem.groupCode;
        groupCode.disabled = true;
        groupName.value = selectedItem.groupName;
        groupUseYn.checked = selectedItem.useYn === "Y" ? "checked" : "";

        this.initCodeForm();
        this.disabledCodeForm();

        groupName.focus();
    }
    
    /**
     * 코드 그리드 선택
     */
    codeGridSelectedItem() {
        this.disabledGroupForm();
        this.initCodeForm();
        const selectedItem = this.state.selectionCodeItem;
        const {code, codeName, value, sort, useYn} = this.refs;
        code.value = selectedItem.code;
        code.disabled = true;
        codeName.value = selectedItem.codeName;
        value.value = selectedItem.value;
        sort.value = selectedItem.sort;
        useYn.checked = selectedItem.useYn === "Y" ? "checked" : "";

        codeName.focus();
    }
    
    /**
     * 그룹코드 저장 값 체크
     * @return {boolean} 저장 가능여부
     */
    validationCheckGroup() {
        // 초기화
        this.initValids();
        let chkState = {};
        const {groupCode,groupName} = this.refs;
        // 그룹코드
        let chkVal = groupCode.value;
        let valiRes = Validation.chkCommonCode(chkVal);
        chkState.validGrpCd = true;
        if (!valiRes.result) {
            Msg.error(valiRes.errMsg);
            chkState.validGrpCd = false;
            this.setState(chkState);
            return false;
        }
        // 그룹코드명
        chkVal = groupName.value;
        chkState.validGrpCdNm = true;
        if (chkVal.length < 2 || chkVal.length > 30) {
            Msg.error("코드명은 2~30길이 입력 할 수 있습니다.");
            chkState.validGrpCdNm = false;
            this.setState(chkState);
            return false;
        }

        this.setState(chkState);
        return true;
    }
    
    /**
     * 코드 저장 값 체크
     * @return {boolean} 저장 가능여부
     */
    validationCheckCode() {
        // 초기화
        this.initValids();
        let chkState = {};
        const {code, codeName} = this.refs;

        // 코드
        let chkVal = code.value;
        let valiRes = Validation.chkCommonCode(chkVal);
        chkState.validCd = true;
        if (!valiRes.result) {
            Msg.error(valiRes.errMsg);
            chkState.validCd = false;
            this.setState(chkState);
            return false;
        }
        // 코드명
        chkVal = codeName.value;
        chkState.validCdNm = true;
        if (chkVal.length < 2 || chkVal.length > 30) {
            Msg.error("코드명은 2~30길이 입력 할 수 있습니다.");
            chkState.validCdNm = false;
            this.setState(chkState);
            return false;
        }

        this.setState(chkState);
        return true;
    }
    
    /**
     * validation 값 초기화
     */
    initValids() {
        this.setState({validGrpCd:null,validGrpCdNm:null,validCd:null,validCdNm:null});
    }

	/**************************************************************************/
	/* 핸들러 */
	/**************************************************************************/
    /**
     * 코드그룹 코드 리스트 결과 핸들러
     * @param {Object} res {result:ok|fail,list:그룹코드리스트}
     */
    onResultCommonGroupList(res) {
        this.props.main.hideLoading();
        if (res.result === "ok") {
            this.setState({groupData:res.list});
        } else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }
    
    /**
     * 코드 리스트 결과 핸들러
     * @param {Object} res {result:ok|fail,list:코드리스트}
     */
    onResultCommonCodeList(res) {
        this.props.main.hideLoading();
        if (res.result === "ok") {
            this.setState({codeData:res.list});
        } else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }
    
    /**
     * 코드그룹 그리드 클릭 이벤트 핸들러
     * @param {GridEvent} gridEvt 
     */
    onClickGroupGrid(gridEvt) {
        if (gridEvt.rowKey === undefined) return;
        this.setState( {
            selectionGroupItem:this.state.groupData[gridEvt.rowKey],
            codeSaveType:undefined,groupSaveType:"modi"
        } );
        setTimeout(this.groupGridSelectedItem,100);
    }
    
    /**
     * 코드 그리드 클릭 이벤트 핸들러
     * @param {GridEvent} gridEvt 
     */
    onClickCodeGrid(gridEvt) {
        if (gridEvt.rowKey === undefined) return;
        this.setState( {
            selectionCodeItem:this.state.codeData[gridEvt.rowKey],
            codeSaveType:"modi",groupSaveType:undefined
        } );
        setTimeout(this.codeGridSelectedItem,100);
    }

    /**
     * 코드그룹 저장 버튼 클릭 이벤트 핸들러
     */
    onClickBtnGroupSave() {
        if (!this.validationCheckGroup()) return;
        this.props.main.showLoading();
        let param = common.makeParam(this);
        param.saveType = this.state.groupSaveType;
        AdminService.saveCodeGroup(param,this.onResultGroupSave,(err) => Msg.error(err.message));
    }
    
    /**
     * 코드그룹 저장 결과 핸들러
     * @param {Object} res {result:ok|fail,message:결과 메세지}
     */
    onResultGroupSave(res) {
        this.props.main.hideLoading();
        if (res.result === "ok") {
            this.initGroupForm();
            this.disabledGroupForm();
            this.reqCommGroupList();
            Msg.ok(res.message);
        }
        else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }
    
    /**
     * 코드그룹 삭제 버튼 클릭 이벤트 핸들러
     */
    onClickBtnGroupDel() {
        const selectedItem = this.state.selectionGroupItem;
        this.props.main.showConfirm("코드그룹 삭제",selectedItem.groupName + " 삭제 하시겠습니까?",this.onConfirmGroupDelOk,this.onConfirmCancel);
    }
    
    onConfirmGroupDelOk() {
        const selectedItem = this.state.selectionGroupItem;
        this.props.main.showLoading();
        if (this.state.reqDeleteCodeAll)
            selectedItem.deleteCodeAll = true;
        AdminService.deleteCodeGroup(selectedItem,this.onResultGroupDel,(err) => Msg.error(err.message));
    }
    
    onResultGroupDel(res) {
        this.props.main.hideLoading();
        if (res.result === "ok") {
            this.initGroupForm();
            this.disabledGroupForm();
            this.reqCommGroupList();
            this.setState({reqDeleteCodeAll:null});
            Msg.ok(res.message);
        }
        else if (res.result === "fail") {
            if (res.value === "reqDeleteCodeAll") {
                this.setState({reqDeleteCodeAll:true});
                this.props.main.showConfirm("코드그룹 삭제",res.message,this.onConfirmGroupDelOk,this.onConfirmCancel);
            } else {
                this.setState({reqDeleteCodeAll:null});
                Msg.error(res.message);
            }
        }
    }
    
    onConfirmCancel() {
        this.setState({reqDeleteCodeAll:null});
    }
    
    /**
     * 코드 저장 버튼 클릭 이벤트 핸들러
     */
    onClickBtnCodeSave() {
        // const selectedItem = this.state.selectionCodeItem;
        // console.log(selectedItem);
        if (!this.validationCheckCode()) return;
        this.props.main.showLoading();
        let param = common.makeParam(this);
        param.saveType = this.state.codeSaveType;
        AdminService.saveCode(param,this.onResultCodeSave,(err) => Msg.error(err.message));
    }
    
    /**
     * 코드 저장 결과 핸들러
     * @param {Object} res {result:ok|fail,message:결과 메세지}
     */
    onResultCodeSave(res) {
        this.props.main.hideLoading();
        if (res.result === "ok") {
            this.initCodeForm();
            this.disabledCodeForm();
            this.reqCommCodeList(this.state.selectionGroupItem.groupCode);
            Msg.ok(res.message);
        }
        else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }
    
    /**
     * 코드 삭제 버튼 클릭 이벤트 핸들러
     */
    onClickBtnCodeDel() {
        const selectedItem = this.state.selectionCodeItem;
        this.props.main.showConfirm("코드 삭제",selectedItem.codeName + " 삭제 하시겠습니까?",this.onConfirmCodeDelOk,this.onConfirmCancel);
    }
    
    onConfirmCodeDelOk() {
        const selectedItem = this.state.selectionCodeItem;
        AdminService.deleteCode(selectedItem,this.onResultCodeDel,(err) => Msg.error(err.message));
    }
    
    onResultCodeDel(res) {
        this.props.main.hideLoading();
        if (res.result === "ok") {
            this.initCodeForm();
            this.disabledCodeForm();
            this.reqCommCodeList(this.state.selectionGroupItem.groupCode);
            Msg.ok(res.message);
        }
        else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }

    /**
     * 코드그룹 추가 버튼 클릭 이벤트 핸들러
     */
    onClickGroupAdd() {
        this.setState({selectionGroupItem:undefined,groupSaveType:"ins",codeSaveType:undefined});
        this.initGroupForm();
        this.initCodeForm();
        this.disabledCodeForm();
        this.refs.groupCode.focus();
    }
    
    /**
     * 코드 추가 버튼 클릭 이벤트 핸들러
     */
    onClickCodeAdd() {
        if (!this.state.selectionGroupItem) {
            Msg.error("그룹 선택해 주세요.");
            return;
        }
        this.setState({selectionCodeItem:undefined,groupSaveType:undefined,codeSaveType:"ins"});
        this.initCodeForm();
        this.disabledGroupForm();
        this.refs.code.focus();
    }

    render() {
        const {
            bodyHeight, groupData, groupColumns, codeData, codeColumns
        } = this.state;
        return <div className="commonCodeMgr mainContent">
            <div className={'content'} style={{display:"flex"}}>
            
            <div className="division">
                <span className="title">● 그룹코드</span>
                <Grid ref={'groupGrid'} onClick={this.onClickGroupGrid}
                    data={groupData} columnOptions={{resizable: true}}
                    columns={groupColumns}
                    bodyHeight={bodyHeight}
                    scrollX={false} scrollY={false}
                />
                <div className="gridBottomArea">
                    <div></div>
                    <button className="btn btn_white" onClick={() => this.onClickGroupAdd()}>추가</button>
                </div>
            </div>
            <div className="division">
                <span className="title">● 코드</span>
                <Grid ref={'codeGrid'} onClick={this.onClickCodeGrid}
                    data={codeData} columnOptions={{resizable: true}}
                    columns={codeColumns}
                    bodyHeight={bodyHeight}
                    scrollX={false} scrollY={false}
                />
                <div className="gridBottomArea">
                    <div></div>
                    <button className="btn btn_white" onClick={() => this.onClickCodeAdd()}>추가</button>
                </div>
            </div>
            <div className="division" style={{paddingTop: 22}}>
                {/*그룹 코드 입력폼*/}
                <div className="table_type2">
                <table>
                    <tbody>
                        <tr>
                            <th>그룹코드 <span className="necessary">*</span></th>
                            <td>
                                <div className="ipt_group">
                                    <input ref="groupCode" type="text" className="ipt_text" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>그룹코드명 <span className="necessary">*</span></th>
                            <td>
                                <div className="ipt_group">
                                    <input ref="groupName" type="text" className="ipt_text" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>사용유무</th>
                            <td>
                                <div className="ipt_group">
                                    <input type="checkbox" ref="groupUseYn" className="form-control formChk" />
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                    <div className="btn_area"><p className="btn2">
                        <button ref="btnGroupSave" className="btn btn_white" onClick={() => this.onClickBtnGroupSave()}>그룹 저장</button>
                        <button ref="btnGroupDel" className="btn btn_white" onClick={() => this.onClickBtnGroupDel()}>삭제</button>
                    </p></div>
                </div>

                {/*코드 입력폼*/}
                <div className="table_type2">
                <table>
                    <tbody>
                        <tr>
                            <th>코드 <span className="necessary">*</span></th>
                            <td>
                                <div className="ipt_group">
                                <input ref="code" type="text" className="ipt_text" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>코드명 <span className="necessary">*</span></th>
                            <td>
                                <div className="ipt_group">
                                <input ref="codeName" type="text" className="ipt_text" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>코드값</th>
                            <td>
                                <div className="ipt_group">
                                <input ref="value" type="text" className="ipt_text" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>순서</th>
                            <td>
                                <div className="ipt_group">
                                <input ref="sort" type="number" className="ipt_number" />
                                </div>
                            </td>
                        </tr>
                        <tr>
                            <th>사용유무</th>
                            <td>
                                <div className="ipt_group">
                                <input type="checkbox" ref="useYn" className="form-control formChk" />
                                </div>
                            </td>
                        </tr>
                        </tbody>
                    </table>

                    <div className="btn_area"><p className="btn2">
                        <button ref="btnCodeSave" className="btn btn_white" onClick={() => this.onClickBtnCodeSave()}>코드 저장</button>
                        <button ref="btnCodeDel" className="btn btn_white" onClick={() => this.onClickBtnCodeDel()}>삭제</button>
                    </p></div>
                </div>
            </div>
            </div>
        </div>;
    }
}

export default CommonCodeMgr;