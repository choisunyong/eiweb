import React, { Component } from 'react';
import { Msg, common } from 'comp';
import Grid from '@toast-ui/react-grid';
import TuiGrid from 'tui-grid';
import { AdminService } from 'admin';

/**
 * 화면명 : Scale In/Out Management
 * 화면 경로 : Admin > Scale In/Out Management
 * 화면 코드 : MENU00403
 * 참고 : 
 */
class ScaleInOutManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: [],
      columns: [],
      bodyHeight: 300,
      pagesPage: 1,
      pagesTotalCount: 0,
      pagesPerPage: 5,
      showDetail: false,
      selectionItem: {},
      selectionColumName: '',
      selectionRowKey: -1,
      scaleOutRuleModifyMode: false,
      scaleOutRuleEnable: true,
      scaleOutCpuPercent: undefined,
      scaleOutDurationMin: undefined,
      scaleInRuleModifyMode: false,
      scaleInRuleEnable: true,
      scaleInCpuPercent: undefined,
      scaleInDurationMin: undefined
    }
    this.requestData = this.requestData.bind(this);
    this.onResultDeviceList = this.onResultDeviceList.bind(this);
    this.onClickScaleInOut = this.onClickScaleInOut.bind(this);
    this.onResultScaleInOut = this.onResultScaleInOut.bind(this);
    this.onClickScaleOutRuleModify = this.onClickScaleOutRuleModify.bind(this);
    this.onClickSaveScaleOutRule = this.onClickSaveScaleOutRule.bind(this);
    this.onResultScaleInOutRuleInfo = this.onResultScaleInOutRuleInfo.bind(this);
    this.onResultSaveScaleInOutRule = this.onResultSaveScaleInOutRule.bind(this);
  }

  componentDidMount() {
    TuiGrid.setLanguage('ko');
    TuiGrid.applyTheme('clean'); // default, striped, clean
    AdminService.scaleInOutRuleInfo({}, this.onResultScaleInOutRuleInfo, (err) => Msg.error(err.message));
    this.requestData();
  }

  /**************************************************************************/
  /* 기능 */
  /**************************************************************************/
  /**
   * 리스트
   */
  requestData() {
    this.props.main.showLoading(true);
    AdminService.deviceList({}, this.onResultDeviceList, (err) => Msg.error(err.message));
  }

  /**
   * Scale In/Out
   * @param {Object} item 
   * @param {Event} e 
   * @param {Object} props 
   */
  onClickScaleInOut(item, e, props) {
    let param = {};
    param.server = item.serverName;
    param.req_type = item.scaleState === "on" ? "user_stop" : "user_start";
    AdminService.scaleInOut(param, this.onResultScaleInOut, (err) => Msg.error(err.message));
  }

  /**************************************************************************/
  /* 핸들러 */
  /**************************************************************************/
  /**
     * 리스트 결과 핸들러
     * @param {Object} res {result:ok|fail,list:그룹코드리스트}
     */
  onResultDeviceList(res) {
    this.props.main.hideLoading();
    if (res.result === "ok") {
      let item;
      for (let i = 0; i < res.list.length; i++) {
        item = res.list[i];
        item.nodeName = item.serverName === "manager" ? "master" : item.serverName;
      }
      const cols = [
        { name: 'nodeName', header: 'Node Name' }
        , { name: 'role', header: 'Node Type', align: "center" }
        , { name: 'useCpu', header: 'CPU', align: "center" }
        , { name: 'hasContainer', header: 'Container', align: "center" }
        , {
          name: 'scaleinout', header: 'Scale In/Out', align: "center",
          renderer: {
            type: CustomButtonRenderer
            , options: {
              listData: res.list,
              onClickScaleInOut: this.onClickScaleInOut
            }
          }
        }
      ];
      this.setState({ gridData: res.list, columns: cols });
    } else if (res.result === "fail") {
      Msg.error(res.message);
      if (res.errCode === "401") {
        console.log(res.errCode);
        this.props.main.setState({ login: false, role: '', username: '', sessionId: '', userInfo: {} });
      }
    }
  }

  /**
   * 
   * @param {Object} res 
   */
  onResultScaleInOutRuleInfo(res) {
    if (res.result === "ok") {
      const SCALE_IN_RULE = "scaleInRule";
      const SCALE_OUT_RULE = "scaleOutRule";

      let list;
      let map = {
        scaleInRule: { cpuPercent: "0", durationMin: "0", ruleEnable: true }
        , scaleOutRule: { cpuPercent: "0", durationMin: "0", ruleEnable: true }
      };
      const listKeys = [SCALE_IN_RULE, SCALE_OUT_RULE];
      // for listKeys
      for (let j = 0; j < listKeys.length; j++) {
        list = res.data[listKeys[j]];
        for (let i = 0; i < list.length; i++) {
          if ("CPU_PERCENT" === list[i].code) map[listKeys[j]].cpuPercent = list[i].value;
          else if ("DURATION_MIN" === list[i].code) map[listKeys[j]].durationMin = list[i].value;
          else if ("RULE_ENABLE" === list[i].code) map[listKeys[j]].ruleEnable = list[i].value === "Y";
        }
      }
      this.setState({
        scaleInCpuPercent: map[SCALE_IN_RULE].cpuPercent, scaleInDurationMin: map[SCALE_IN_RULE].durationMin, scaleInRuleEnable: map[SCALE_IN_RULE].ruleEnable
        , scaleOutCpuPercent: map[SCALE_OUT_RULE].cpuPercent, scaleOutDurationMin: map[SCALE_OUT_RULE].durationMin, scaleOutRuleEnable: map[SCALE_OUT_RULE].ruleEnable
      });
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * Scale In/Out 결과 핸들러
   * @param {Object} res {result:ok|fail,message:메세지}
   */
  onResultScaleInOut(res) {
    console.log(res);
    if (res.result === "ok") {
      Msg.ok("성공했습니다.");
      this.requestData(this.state.schKeyword);
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * Scale Out Rule 수정 버튼 클릭 핸들러
   */
  onClickScaleOutRuleModify() {
    const { scaleOutRuleModifyMode } = this.state;
    this.setState({ scaleOutRuleModifyMode: !scaleOutRuleModifyMode });
  }

  /**
   * Scale Out Rule 저장 버튼 클릭 핸들러
   */
  onClickSaveScaleOutRule() {
    const parm = common.makeParam(this);
    const p = { type: "scaleOut", cpuPercent: parm.scaleOutCpuPercent, durationMin: parm.scaleOutDurationMin, ruleEnable: parm.scaleOutRuleEnable };
    AdminService.saveScaleInOutRule(p, this.onResultSaveScaleInOutRule, (err) => Msg.error(err.message));
  }

  /**
   * Scale In Rule 수정 버튼 클릭 핸들러
   */
  onClickScaleInRuleModify() {
    const { scaleInRuleModifyMode } = this.state;
    this.setState({ scaleInRuleModifyMode: !scaleInRuleModifyMode });
  }

  /**
   * Scale Out Rule 저장 버튼 클릭 핸들러
   */
  onClickSaveScaleInRule() {
    const parm = common.makeParam(this);
    const p = { type: "scaleIn", cpuPercent: parm.scaleInCpuPercent, durationMin: parm.scaleInDurationMin, ruleEnable: parm.scaleInRuleEnable };
    AdminService.saveScaleInOutRule(p, this.onResultSaveScaleInOutRule, (err) => Msg.error(err.message));
  }

  /**
   * Scale Out Rule 저장 결과 핸들러
   * @param {Object} res {result:ok|fail,message:메세지}
   */
  onResultSaveScaleInOutRule(res) {
    if (res.result === "ok") {
      Msg.ok("저장되었습니다.");
      this.requestData();
      this.setState({ scaleOutRuleModifyMode: false, scaleInRuleModifyMode: false });
    }
    else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  render() {
    let {
      gridData, columns, pagesTotalCount,
      scaleOutRuleModifyMode, scaleOutCpuPercent, scaleOutDurationMin, scaleOutRuleEnable,
      scaleInRuleModifyMode, scaleInCpuPercent, scaleInDurationMin, scaleInRuleEnable
    } = this.state;
    return <div className="page_layout"><div className="layout_contents">
      <div className="content_list model_aid_list table_type1">

        <div className="content_title">
          <h3 className="tit">Scale In/Out Management</h3>
        </div>

        <div className="search_condition" style={{ height: 135 }}>
          <div className="ipt_group search_basis search_basis2 search_basis_wide">
            <div className="group_between">
              <ul>
                <li>
                  <span className="tit">Scale Out Rule</span>
                  <label className="switch ml15">
                    <input ref="scaleOutRuleEnable" type="checkbox" checked={scaleOutRuleEnable} onClick={() => this.setState({ scaleOutRuleEnable: !scaleOutRuleEnable })} disabled={!scaleOutRuleModifyMode} />
                    <span className="slider"></span>
                  </label>
                </li>
                <li>
                  <p className="sentence">
                    <span className="txt">More than</span> <input ref="scaleOutCpuPercent" type="text" defaultValue={scaleOutCpuPercent} className="ipt_text" style={{ width: 60 }} disabled={!scaleOutRuleModifyMode} />
                    <span className="txt">% of CPU Utilization last </span><input ref="scaleOutDurationMin" type="text" defaultValue={scaleOutDurationMin} className="ipt_text" style={{ width: 60 }} disabled={!scaleOutRuleModifyMode} /> <span className="txt">min.</span>
                  </p>
                </li>
              </ul>

              <div className="float">
                {scaleOutRuleModifyMode ? <button className="btn btn_white" onClick={() => this.setState({ scaleOutRuleModifyMode: false })}>취소</button> : null}
                {scaleOutRuleModifyMode
                  ? <button className="btn btn_black" onClick={() => this.onClickSaveScaleOutRule()}>저장</button>
                  : <button className="btn btn_black" onClick={() => this.onClickScaleOutRuleModify()}>수정</button>
                }
              </div>

            </div>
            <div className="group_between" style={{ marginTop: 16 }}>
              <ul>
                <li>
                  <span className="tit" style={{ width: 88 }}>Scale In Rule</span>
                  <label className="switch ml15">
                    <input ref="scaleInRuleEnable" type="checkbox" checked={scaleInRuleEnable} onClick={() => this.setState({ scaleInRuleEnable: !scaleInRuleEnable })} disabled={!scaleInRuleModifyMode} />
                    <span className="slider"></span>
                  </label>
                </li>
                <li>
                  <p className="sentence">
                    <span className="txt">Less than</span> <input ref="scaleInCpuPercent" type="text" defaultValue={scaleInCpuPercent} className="ipt_text" style={{ width: 60 }} disabled={!scaleInRuleModifyMode} />
                    <span className="txt">% of CPU Utilization last </span><input ref="scaleInDurationMin" type="text" defaultValue={scaleInDurationMin} className="ipt_text" style={{ width: 60 }} disabled={!scaleInRuleModifyMode} /> <span className="txt">min.</span>
                  </p>
                </li>
              </ul>

              <div className="float">
                {scaleInRuleModifyMode ? <button className="btn btn_white" onClick={() => this.setState({ scaleInRuleModifyMode: false })}>취소</button> : null}
                {scaleInRuleModifyMode
                  ? <button className="btn btn_black" onClick={() => this.onClickSaveScaleInRule()}>저장</button>
                  : <button className="btn btn_black" onClick={() => this.onClickScaleInRuleModify()}>수정</button>
                }
              </div>

            </div>
          </div>
        </div>

        <div className="content_stitle">
          <span>Total : {common.displNum(pagesTotalCount)}</span>
        </div>
        <Grid ref={'grid'}
          data={gridData} columnOptions={{ resizable: true }}
          columns={columns}
          scrollX={false} scrollY={false}
        />
      </div>
    </div>
    </div>;
  }
}

class CustomButtonRenderer {
  constructor(props) {
    const item = props.columnInfo.renderer.options.listData[props.rowKey];
    let el = document.createElement('div');
    if (item.role !== "master" && item.role !== "manager"
      && item.scaleState !== "MGR_CONN_FAIL") {
      el = document.createElement('a');
      el.role = "button";
      if (item.scaleState === "on") {
        el.className = "table_btn btn_green btn_resource";
        el.innerText = "ScaleIn";
      } else {
        el.className = "table_btn btn_orange btn_resource";
        el.innerText = "ScaleOut";
      }
      const { onClickScaleInOut } = props.columnInfo.renderer.options;
      el.addEventListener("click", (e) => onClickScaleInOut(item, e, props));
    } else if (item.scaleState === "MGR_CONN_FAIL") {
      el.innerText = item.scaleState;
    }

    this.el = el;
  }

  getElement() {
    return this.el;
  }

}

export default ScaleInOutManager;