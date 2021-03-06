import React, { Component } from 'react';
import { ServiceService } from 'service';
import Grid from '@toast-ui/react-grid';
import TuiGrid from 'tui-grid';
import { Pagination, Msg, NameRenderer } from 'comp';
import Validation from 'comp/Validation';
import ServiceReg from 'service/ServiceReg';
import { AdminService } from 'admin';
import ModelPopCont from 'model/ModelPopCont';
import ServiceDetail from 'service/ServiceDetail';
import { ModelService, ModelReg, ModelDetail } from 'model';
import { MenuCode } from 'main';
/**
 * 화면명 : 서비스 관리
 * 화면 경로 : 서비스 > 서비스 관리
 * 화면 코드 : MENU00301
 * 참고 : https://nhn.github.io/tui.grid/latest/Grid
 */
class ServiceManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: [],
      columns: [],
      bodyHeight: 200,
      pagesPage: 1,
      pagesTotalCount: 0,
      pagesPerPage: 5,
      modifyServiceInfo: undefined,
      serviceGroupData: [],
      schInfo: undefined,
      winPop: null,
      prevGroup: undefined
    };
    this.requestData = this.requestData.bind(this);
    this.onResultList = this.onResultList.bind(this);
    this.onClickPageItem = this.onClickPageItem.bind(this);
    this.onClickReg = this.onClickReg.bind(this);
    this.onCloseReg = this.onCloseReg.bind(this);
    this.onCloseModelReg = this.onCloseModelReg.bind(this);
    this.onClickModify = this.onClickModify.bind(this);
    this.onClickSch = this.onClickSch.bind(this);
    this.onClickGridNameColumn = this.onClickGridNameColumn.bind(this);
    this.onClickGridModelColumn = this.onClickGridModelColumn.bind(this);
    this.onResultServiceGroupList = this.onResultServiceGroupList.bind(this);
    this.onClickModelPop = this.onClickModelPop.bind(this);
    this.onClickModelSelection = this.onClickModelSelection.bind(this);
    this.onClickSchModelDel = this.onClickSchModelDel.bind(this);
    this.onClickKill = this.onClickKill.bind(this);
    this.onClickHistory = this.onClickHistory.bind(this)
    this.onClickPlay = this.onClickPlay.bind(this)
  }

  componentDidMount() {
    TuiGrid.setLanguage('ko');
    TuiGrid.applyTheme('clean'); // default, striped, clean

    // 서비스 그룹
    AdminService.serviceGroupList({}, this.onResultServiceGroupList, (err) => Msg.error(err.message));
  }

  componentDidUpdate() {
  }

  onResultServiceGroupList(res) {
    if (res.result === "ok") {
      this.setState({ serviceGroupData: res.list });
      this.requestData(1);
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
 * 페이지 클릭 이벤트 핸들러
 * @param {int} page 
 */
  onClickPageItem(page) {
    const { schKey } = this.refs;
    if (schKey.value.length > 0)
      this.requestData(page, schKey.value, true);
    else
      this.requestData(page, null, true);
  }

  requestData(page, schKeyword, fromKey) {
    const { schServiceGroup, modelId } = this.refs;
    if (page === undefined) page = this.state.pagesPage;
    this.props.main.showLoading();
    let parm = {
      page: page
    };
    
    if (fromKey !== undefined) {
      parm.serviceGroupName = this.state.prevGroup;
      this.refs.schServiceGroup.value = this.state.prevGroup;
    } else {
      parm.serviceGroupName = schServiceGroup.value;
      this.setState({prevGroup:schServiceGroup.value});
    }
    
    // model
    if (modelId.value !== undefined && modelId.value !== null && modelId.value !== "") {
      parm.modelId = modelId.value;
    }

    if (schKeyword !== undefined && schKeyword !== null) {
      // Msg.info("필터전 : " + schKeyword);
      schKeyword = Validation.filterSchKeyword(schKeyword);
      // Msg.info("필터후 : " + schKeyword);
      parm.schKey = schKeyword;
    }
    this.setState({ schInfo: parm });
    ServiceService.list(parm, this.onResultList, (err) => Msg.error(err.message));
  }

  onResultList(res) {
    this.props.main.hideLoading();
    if (res.result === "ok") {
      const pagesInfo = res.data;
      let totalStatus = {};
      if (pagesInfo.totalStatus) totalStatus = pagesInfo.totalStatus; 
      const columns = [
        {
          name: 'serviceName', header: 'Service Name', minWidth: 300, sortable: true,
          renderer: {
            type: NameRenderer, options: {
              listData: res.list, labelKey: "serviceName",
              onClickGridNameColumn: this.onClickGridNameColumn
            }
          }
        },
        { name: 'serviceGroupName', header: 'Service Group', sortable: true, align: "center" },
        {
          name: 'dagId', header: 'DAG ID', sortable: true, align: "center",
          renderer: { type: DagIdRenderer, options: { listData: res.list } }
        },
        {
          name: 'modelName', header: 'Model Name', sortable: true,
          renderer: {
            type: NameRenderer, options: {
              listData: res.list, labelKey: "modelName",
              onClickGridNameColumn: this.onClickGridModelColumn
            }
          }
        },
        { name: 'userId', header: 'Regist User', sortable: true, align: "center" },
        {
          name: 'state', header: 'Status', align: "center", sortable: true,
          renderer: { type: StatusRenderer, options: { listData: res.list } }
        },
        { name: 'runCycle', header: 'Cycle', sortable: true, align: "center" },
        {
          name: 'action', header: 'Action', width: 100, align: "center",
          renderer: { type: LinkRenderer, options: { listData: res.list, onClickKill: this.onClickKill, onClickHistory: this.onClickHistory, onClickPlay: this.onClickPlay } }
        }
      ];
      this.setState({ gridData: res.list, pagesPage: pagesInfo.page, pagesTotalCount: pagesInfo.totalCount, pagesPerPage: pagesInfo.pageCount, columns: columns, totalStatus: totalStatus });
    } else if (res.result === "fail") {
      Msg.error(res.message);
      if (res.errCode === "401") {
        console.log(res.errCode);
        this.props.main.setState({ login: false, role: '', username: '', sessionId: '', userInfo: {} });
      }
    }
  }

  /**
 * 랜더러 클릭 이벤트 핸들러
 * @param {Object} item 선택 Row 데이터
 * @param {MouseEvent} e 클릭 이벤트
 * @param {Object} props 랜더러 Options
 */
  onClickGridNameColumn(item, e, props) {
    try {
      const { userInfo } = this.props.main.state;
      // 관리자/등록자는 수정 팝업
      if (userInfo.userPermission === "ADMIN" || (item.userId === userInfo.userId)) {
        ServiceService.getServiceInfo(item.serviceId, (res) => {
          this.props.main.hideLoading();
          if (res.result === "ok") {
            this.onClickModify(res.data.serviceInfo);
          }
          else if (res.result === "fail") {
            Msg.error(res.message);
          }
        }, (e) => { console.log(e); this.props.main.hideLoading(); });
      } else {
        const popTitle = "Service Info.";
        this.props.main.showPopup(
          popTitle,
          <ServiceDetail title={popTitle} main={this.props.main} selectionItem={item} onClose={(e) => this.props.main.hidePopup(popTitle)} />,
          { width: 735 + item.serviceName.length * 2, height: 600, popupBtnAreaVisible: false }, null, null
        );
      }
    } catch (err) {
      console.log(err);
    }
  }

  /**
  * 랜더러 클릭 이벤트 핸들러
  * @param {Object} item 선택 Row 데이터
  * @param {MouseEvent} e 클릭 이벤트
  * @param {Object} props 랜더러 Options
  */
  onClickGridModelColumn(item, e, props) {
    if (this.props.isPopup && this.props.onChangeItem) {
      this.props.onChangeItem(item);
    }
    if (this.props.isPopup) {
      this.props.onSelection();
      this.props.onClose();
    } else {
      try {
        let { userInfo } = this.props.main.state;
        // userInfo.userPermission = "MODELER"; // TEST
        // 관리자/등록자는 수정 팝업
        if (userInfo.userPermission === "ADMIN" || (item.userId === userInfo.userId)) {
          ModelService.getModelInfo(item.modelId, (res) => {
            if (res.result === "ok") {
              this.popupModify(res.data.modelInfo, res.list);
            }
            else if (res.result === "fail") {
              Msg.error(res.message);
            }
          }, (e) => console.log(e));
        } else {
          this.setState({ selectionRowKey: e.rowKey, selectionItem: item, selectionColumName: e.columnName, showDetail: true });
          const popTitle = "Model Info.";
          this.props.main.showPopup(
            popTitle,
            <ModelDetail main={this.props.main} sourceView={true} title={popTitle} selectionItem={item} onClose={(e) => this.onCloseDetail(popTitle)} />,
            { width: 735, height: 677, popupBtnAreaVisible: false, contentAppendClass: "model_content" }, null, null
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  /**
 * 모델 수정 팝업
 * @param {Object} modelInfo 
 * @param {Array} modelFiles 
 */
  popupModify(modelInfo, modelFiles) {
    // this.setState({modifyModelInfo:modelInfo, modifyModelFiles:modelFiles, showDetail:false, showReg:true});
    const popTitle = "Model Modify";
    this.props.main.showPopup(
      popTitle,
      <ModelReg main={this.props.main} sourceView={true} modifyFlag={modelInfo !== undefined} modifyModelInfo={modelInfo} modifyModelFiles={modelFiles} onClose={(e) => this.onCloseModelReg(popTitle)} />,
      { width: 735, height: 530, okLabel: "저장", popupBtnAreaVisible: false, contentAppendClass: "model_content" }, null, null
    );
  }

  onCloseModelReg(title) {
    // this.requestData(this.state.pagesPage);
    // this.setState({modifyServiceInfo:undefined});
    this.props.main.hidePopup(title);
  }

  onClickReg() {
    const { modifyServiceInfo } = this.state;
    // this.setState({showReg:true});
    const popTitle = "Create Service";
    this.props.main.showPopup(
      popTitle,
      <ServiceReg title={popTitle} main={this.props.main} modifyFlag={modifyServiceInfo !== undefined} modifyServiceInfo={modifyServiceInfo} onClose={(e) => this.onCloseReg(popTitle)} />,
      { width: 735, height: 662, popupBtnAreaVisible: false }, null, null
    );
  }

  onClickModelPop() {
    const popTitle = "Model Selection";
    this.props.main.showPopup(
      popTitle,
      <ModelPopCont title={popTitle} main={this.props.main} onClose={(e) => this.props.main.hidePopup(popTitle)} onClickSelection={this.onClickModelSelection} />,
      { width: 700, height: 542, okLabel: "선택", popupBtnAreaVisible: false }, null, null
    );
  }

  onClickModelSelection(item) {
    this.refs.modelName.value = item.modelName;
    this.refs.modelId.value = item.modelId;
  }

  onClickSchModelDel() {
    this.refs.modelName.value = "";
    this.refs.modelId.value = "";
  }

  /**
 * 검색 클릭 핸들러
 */
  onClickSch() {
    this.requestData(this.state.pagesPage, this.refs.schKey.value);
  }

  onClickModify(serviceInfo) {
    const popTitle = "Service Modify";
    this.props.main.showPopup(
      popTitle,
      <ServiceReg title={popTitle} main={this.props.main} modifyFlag={serviceInfo !== undefined} modifyServiceInfo={serviceInfo} onClose={(e) => this.onCloseReg(popTitle)} />,
      { width: 735, height: 719, popupBtnAreaVisible: false }, null, null
    );
  }

  onCloseReg(title) {
      this.requestData(this.state.pagesPage);
      this.setState({modifyModelInfo:undefined, modifyModelFiles:undefined});
      this.props.main.hidePopup(title);
  }
  onClickHistory(row) {
    this.props.main.onMenuChange(MenuCode.ADMIN_HIST_SERVICEEXEC, row);
  }

  onClickKill(item) {
    // ServiceService.list(parm,this.onResultList,(err) => Msg.error(err.message));
    ServiceService.kill(item.serviceId, this.onResultKill, (err) => Msg.error(err.message));
  }

  onClickPlay(item) {
    // alert("ServiceManaget.js에서 'alert' 검색 후 변경");
    Msg.ok("서비스를 실행했습니다.");
    ServiceService.play(item.dagId, this.onResultPlay, (err) => Msg.error(err.message));
  }

  onResultKill(res) {
    Msg.ok(res.message);
  }

  onResultPlay(res) {
    if (res.result === "ok") {
      Msg.ok(res.message);
    }
    else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  render() {
    let {
      gridData, bodyHeight, columns,
      pagesPage, pagesTotalCount, pagesPerPage,
      serviceGroupData, schInfo, totalStatus
    } = this.state;
    const { role } = this.props.main.state;
    if (totalStatus === undefined) totalStatus = {};
    if (schInfo === undefined) schInfo = {};
    let serviceGroupOpts = [<option value="all">All</option>];
    for (let i = 0; i < serviceGroupData.length; i++) {
      serviceGroupOpts.push(
        <option value={serviceGroupData[i].serviceGroupName} selected={schInfo.serviceGroupName === serviceGroupData[i].serviceGroupName} key={serviceGroupData[i].serviceGroupName}>{serviceGroupData[i].serviceGroupName}</option>
      );
    }
    // 등록 버튼 스타일
    let schSty = {};
    if (role !== "ADMIN" && role !== 'MODELER') {
      schSty.backgroundColor = "#a2a2a2";
      schSty.border = "none";
      schSty.cursor = "auto";
    }
    return <div className="page_layout">
      {/* <MainSubMenu /> */}
      <div className="layout_contents">
        <div className="content_list model_aid_list table_type1">
          <div className="content_title">
            <h3 className="tit">Service Management</h3>
          </div>
          <button className="airflow_btn" onClick={() => window.open('http://61.97.187.199:8080/home', "airFlow")}></button>
          {/* <a href="#" rel="noopener noreferrer" className="airflow_btn" target="_blank"></a> */}
          <div className="search_condition">
            <div className="ipt_group search_basis search_basis2">
              <div className="group_center">
                <ul>
                  <li>
                    <span className="tit">Service Group</span>
                    <select ref="schServiceGroup" className="ml5" style={{ float: "left", width: 100, height: 32, marginLeft: 10, outline: "none", border: "1px solid #CECECE" }}>
                      {serviceGroupOpts}
                    </select>
                  </li>
                  <li className="">
                    <span className="tit float_left">Model</span>
                    <div className="ipt_searchpop">
                      <input ref="modelName" type="text" className="ipt_text ml5" style={{ width: 201 }} disabled />
                      <input ref="modelId" type="hidden" defaultValue={schInfo.modelId} />
                      <button className="btn btn_white" style={{ width: 30, marginLeft: -6, border: "1px solid #CECECE", borderLeft: "none" }} onClick={() => this.onClickSchModelDel()}>X</button>
                      <span className="btn btn_file" onClick={() => this.onClickModelPop()}></span>
                    </div>
                  </li>
                  <li>
                    <span className="tit">Service Name / Dag ID</span>
                    <input ref="schKey" type="text" className="ipt_text ml5" style={{ width: 110 }} defaultValue={schInfo.schKey} />
                  </li>
                </ul>
                <button className="btn btn_black" onClick={() => this.onClickSch()}>검색</button>
              </div>
            </div>
            <button className="btn btn_add btn_blue" style={schSty}
              onClick={() => { role !== "ADMIN" && role !== "MODELER" ? console.log(role) : this.onClickReg() }} ></button>
          </div>

          <div className="status_guide">
            <ul>
              <li><span className="staus staus_running"></span> Running <b>{totalStatus.running === undefined ? 0 : totalStatus.running}</b></li>
              <li><span className="staus staus_standby"></span> Standby <b>{totalStatus.standby === undefined ? 0 : totalStatus.standby}</b></li>
              <li><span className="staus staus_unscheduled"></span> Unscheduled <b>{totalStatus.unscheduled === undefined ? 0 : totalStatus.unscheduled}</b></li>
              {/* <li style={{paddingLeft: 11}}><span>Total : {common.displNum(pagesTotalCount)}</span></li> */}
            </ul>
          </div>
          <Grid ref={'grid'}
            data={gridData} columnOptions={{ resizable: true }}
            columns={columns}
            scrollX={false} scrollY={false}
          // bodyHeight={bodyHeight}
          />
          <div className="gridControlArea btn_area">
            <Pagination ref={'page'}
              page={pagesPage}
              totalCount={pagesTotalCount}
              perPage={pagesPerPage}
              onClickItem={this.onClickPageItem} />
          </div>
        </div>
      </div></div>;
  }
}

class DagIdRenderer {
  constructor(props) {
    // <div className="tui-grid-cell-content">model file ver test</div>
    const { listData } = props.columnInfo.renderer.options;
    const el = document.createElement('div');
    el.className = "tui-grid-cell-content";
    let item = undefined;
    if (listData && listData.length > 0)
      item = listData[props.rowKey];
    el.innerText = item["dagId"];
    el.title = item["serviceId"];

    this.el = el;
  }
  getElement() {
    return this.el;
  }
}

class LinkRenderer {
  constructor(props) {
    const { onClickKill, onClickHistory, onClickPlay, listData } = props.columnInfo.renderer.options;
    let item = undefined;
    if (listData && listData.length > 0)
      item = listData[props.rowKey];
    if (item === undefined) item = {};
    let el = document.createElement('div');
    // KILL 버튼
    let kill = document.createElement('button');
    kill.role = "button";
    kill.className = item.state === 'running' ? "btn_kill" : "btn_kill_disable";
    kill.title = "KILL";
    if (item.state === 'running') {
      kill.addEventListener("click", (e) => onClickKill(item, e, props));
    }
    el.appendChild(kill);
    // PLAY 버튼
    let play = document.createElement('button');
    play.role = "button";
    play.className = item.state === 'running' ? "btn_play_disable" : "btn_play";
    play.title = "play";
    if (item.state !== 'running') {
      play.addEventListener("click", (e) => onClickPlay(item, e, props));
    }
    el.appendChild(play);
    // HISTORY 버튼
    let history = document.createElement('button');
    history.className = 'btn_history'
    history.title = "History";
    history.addEventListener("click", (e) => onClickHistory(item, e, props));
    el.appendChild(history);
    this.el = el;
  }

  getElement() {
    return this.el
  }
}

class StatusRenderer {
  constructor(props) {
    const { onClickTestReq, listData } = props.columnInfo.renderer.options;
    let item = undefined;
    if (listData && listData.length > 0)
      item = listData[props.rowKey];
    if (item === undefined) item = {};
    let el = document.createElement('span');
    if (item.state === "running") {
      el.className = "staus staus_running";
    } else {
      if (item.runCycle === "None" || item.runCycle === "" || item.runCycle === undefined || item.runCycle === null
        || item.state === undefined || item.state === null) {
        if ((item.runCycle !== null && item.runCycle.indexOf("@") > -1) || (item.runCycle !== null && item.runCycle.split(" ").length === 5))
          el.className = "staus staus_standby";
        else
          el.className = "staus staus_unscheduled";
      } else {
        el.className = "staus staus_standby";
      }
    }
    this.el = el;
  }
  getElement() {
    return this.el;
  }
}

class ButtonRenderer {
  constructor(props) {
    const { onClickKill, listData } = props.columnInfo.renderer.options;
    let item = undefined;
    if (listData && listData.length > 0)
      item = listData[props.rowKey];
    if (item === undefined) item = {};
    let el = document.createElement('a');
    el.role = "button";
    el.className = item.state === 'running'
      ? "table_btn btn_lineorange btn_resource"
      : "table_btn btn_disable btn_resource";
    el.innerText = "KILL";
    el.title = "KILL";
    if (item.state === 'running')
      el.addEventListener("click", (e) => onClickKill(item, e, props));
    this.el = el;
  }
  getElement() {
    return this.el;
  }
}

export default ServiceManager;