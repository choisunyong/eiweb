import React, { Component } from 'react';
import { Pagination, Msg, NameRenderer } from 'comp';
import { AdminService } from 'admin';
import Grid from '@toast-ui/react-grid';
import TuiGrid from 'tui-grid';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { add, sub } from 'date-fns';
import HistoryServiceDetail from './HistoryServiceDetail';

/**
 * 화면명 : Service 실행결과 이력
 * 화면 경로 : Admin > 이력 조회 > Service 실행결과 이력
 * 화면 코드 : MENU0040506
 * 참고 : https://react-day-picker.js.org/docs/input
 */
class HistoryServiceExec extends Component {
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
      serviceGroupData: [],
      schInfo: undefined,
      stDt: undefined,
      edDt: undefined,
      prevGroup: undefined,
      schKeyword: this.props.params ? this.props.params.serviceName : ''
    }
    this.requestData = this.requestData.bind(this);
    this.onResultList = this.onResultList.bind(this);
    this.onClickSch = this.onClickSch.bind(this);
    this.onResultServiceGroupList = this.onResultServiceGroupList.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.parseDate = this.parseDate.bind(this);
    this.onChangeStDt = this.onChangeStDt.bind(this);
    this.onChangeEdDt = this.onChangeEdDt.bind(this);
    this.onClickGridNameColumn = this.onClickGridNameColumn.bind(this);
    this.onClickPageItem = this.onClickPageItem.bind(this);
  }

  componentDidMount() {
    TuiGrid.setLanguage('ko');
    TuiGrid.applyTheme('clean'); // default, striped, clean
    let { stDt, edDt } = this.state;
    let setStateFlag = false;

    if (edDt === undefined) {
      edDt = new Date();
      setStateFlag = true;
    }
    if (stDt === undefined) {
      stDt = sub(edDt, { months: 1 });// 1달전
      setStateFlag = true;
    }
    if (setStateFlag)
      this.setState({ stDt: stDt, edDt: edDt });

    // 서비스 그룹
    AdminService.serviceGroupList({}, this.onResultServiceGroupList, (err) => Msg.error(err.message));
  }

  /**************************************************************************/
  /* 기능 */
  /**************************************************************************/
  /**
   * 리스트
   * @param {int} page 페이지
   * @param {String} schKeyword Service ID, Service Name 검색어
   */
  requestData(page, schKeyword, fromKey) {
    console.log("## PAGE : [" + page + "], keyword : [" + schKeyword + "]");
    if (page === undefined) page = this.state.pagesPage;
    let { stDt, edDt } = this.state;
    let parm = {
      page: page
    };

    if (schKeyword !== undefined)
      parm.schKey = schKeyword;
    if (edDt === undefined) {
      edDt = new Date();
    }
    if (stDt === undefined) {
      stDt = sub(edDt, { months: 1 });// 1달전
    }
    
    let format = "yyyyMMdd";
    let locale = undefined;
    if (fromKey !== undefined) {
      parm.serviceGroupName = this.state.prevGroup;
      this.refs.serviceGroupName.value = this.state.prevGroup;
    } else {
      parm.serviceGroupName = this.refs.serviceGroupName.value;
      this.setState({prevGroup:this.refs.serviceGroupName.value });
    }

    parm.serviceStatus = this.refs.serviceStatus.value;
    parm.startDate = dateFnsFormat(stDt, format, { locale });
    parm.endDate = dateFnsFormat(edDt, format, { locale });

    this.setState({ schInfo: parm, stDt: stDt, edDt: edDt, schKeyword: schKeyword});
    AdminService.serviceExecHistory(parm, this.onResultList, (err) => Msg.error(err.message));
  }

  /**************************************************************************/
  /* 핸들러 */
  /**************************************************************************/
  /**
   * 리스트 결과 핸들러
   * @param {Object} res {result:ok|fail,list:리스트}
   */
  onResultList(res) {
    this.props.main.hideLoading();
    if (res.result === "ok") {
      const pagesInfo = res.data;
      this.setState({})
      // console.log(pagesInfo);
      const columns = [
        {
          name: 'serviceName', header: 'Service Name', 
          renderer: {
            type: ServiceNameRenderer, options: {
              listData: res.list,
              onClickGridNameColumn: this.onClickGridNameColumn
            }
          }
        }
        , { name: 'serviceGroupName', header: 'Service Group', align: "center" }
        , {
          name: 'dagId', header: 'DAG ID', align: "center",
          renderer: { type: DagIdRenderer, options: { listData: res.list } }
        }
        , { name: 'startDate', header: 'Start', align: "center" }
        , { name: 'endDate', header: 'End', align: "center" }
        , { name: 'elapsed', header: 'Elapsed Time(sec)', align: "center" }
        , {
          name: 'serviceStatus', header: 'Result', align: "center",
          renderer: { type: StatusRenderer, options: { listData: res.list } }
        }
      ];
      this.setState({ gridData: res.list, pagesPage: pagesInfo.page, pagesTotalCount: pagesInfo.totalCount, pagesPerPage: pagesInfo.pageCount, columns: columns, totalStatus: pagesInfo.totalStatus });
    } else if (res.result === "fail") {
      Msg.error(res.message);
      if (res.errCode === "401") {
        console.log(res.errCode);
        this.props.main.setState({ login: false, role: '', username: '', sessionId: '', userInfo: {} });
      }
    }
  }

  /**
   * 서비스 그룹 리스트 결과 핸들러
   * @param {Object} res {result:ok|fail,list:서비스 그룹 리스트}
   */
  onResultServiceGroupList(res) {
    if (res.result === "ok") {
      this.setState({ serviceGroupData: res.list });
      this.requestData(1, this.state.schKeyword);
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * 검색 버튼 클릭 핸들러
   */
  onClickSch() {
    console.log("## schKey.value : [" + this.refs.schKey.value + "]");
    this.requestData(1, this.refs.schKey.value);
  }

  formatDate(date, format, locale) {
    return dateFnsFormat(date, format, { locale });
  }

  parseDate(str, format, locale) {
    const parsed = dateFnsParse(str, format, new Date(), { locale });
    return parsed;
  }

  /**
   * 조건 시작일자 변경 핸들러
   * @param {Date} day 
   */
  onChangeStDt(day) {
    const { edDt } = this.state;
    let minDt = sub(edDt, { months: 3 });
    if (day < minDt) {
      Msg.warn("조회할수있는 최대기간은 3달입니다.");
      this.setState({ stDt: minDt });
      return;
    }
    this.setState({ stDt: day });
  }

  /**
   * 조건 종료일자 변경 핸들러
   * @param {Date} day 
   */
  onChangeEdDt(day) {
    const { stDt } = this.state;
    let maxDt = add(stDt, { months: 3 });
    if (day > maxDt) {
      Msg.warn("조회할수있는 최대기간은 3달입니다.");
      this.setState({ edDt: maxDt });
      return;
    }
    this.setState({ edDt: day });
  }

  /**
 * 랜더러 클릭 이벤트 핸들러
 * @param {Object} item 선택 Row 데이터
 * @param {MouseEvent} e 클릭 이벤트
 * @param {Object} props 랜더러 Options
 */
  onClickGridNameColumn(item, e, props) {
    this.setState({ selectionRowKey: e.rowKey, selectionItem: item, selectionColumName: e.columnName, showDetail: true });
  }

  /**
   * 페이지 클릭 이벤트 핸들러
   * @param {int} page 
   */
  onClickPageItem(page) {
    this.requestData(page, this.state.schKeyword, true);
  }

  render() {
    let {
      gridData, columns,
      pagesPage, pagesTotalCount, pagesPerPage,
      serviceGroupData, schInfo, selectionItem,
      stDt, edDt, totalStatus, showDetail
    } = this.state;
    let serviceGroupOpts = [<option value="all">All</option>];
    for (let i = 0; i < serviceGroupData.length; i++) {
      if (schInfo) {
        serviceGroupOpts.push(
          <option value={serviceGroupData[i].serviceGroupName} selected={schInfo.serviceGroupName === serviceGroupData[i].serviceGroupName} key={Math.random()}>{serviceGroupData[i].serviceGroupName}</option>
        );
      }
    }
    if (totalStatus === undefined) totalStatus = {};

    return <div className="page_layout">
      <div className="layout_contents">
        {showDetail ? <HistoryServiceDetail serviceHistory={selectionItem} onClose={() => this.setState({ showDetail: false })} />
          : <div className="content_list model_aid_list table_type1">

            <div className="content_title">
              <h3 className="tit">Service History</h3>
            </div>

            <div className="search_condition">
              <div className="ipt_group search_basis search_basis_wide">
                <div className="group_center">
                  <ul>
                    <li>
                      <span className="tit">Service Group</span>
                      <select ref="serviceGroupName" className="ml5" style={{ float: "left", width: 100, height: 32, marginLeft: 10, outline: "none", border: "1px solid #CECECE" }}>
                        {serviceGroupOpts}
                      </select>
                    </li>
                    <li>
                      <span className="tit">Service Name / Dag ID</span>
                      <input ref="schKey" type="text" className="ipt_text ml5" placeholder="" value={this.state.schKeyword} onChange={(e) => this.setState({schKeyword : e.target.value})} style={{ width: 158 }} />
                    </li>
                    <li>
                      <span className="tit">Result</span>
                      <select ref="serviceStatus" className="ml5" style={{ float: "left", width: 100, height: 32, marginLeft: 10, outline: "none", border: "1px solid #CECECE" }}>
                        <option value="all">All</option>
                        <option value="success">Completion</option>
                        <option value="warning">Warning</option>
                      </select>
                    </li>
                    <li>
                      <div className="tui-datepicker-input tui-datetime-input tui-has-focus" style={{ width: 110 }}>
                        <DayPickerInput format="yyyy-MM-dd" formatDate={this.formatDate} parseDate={this.parseDate}
                          placeholder="YYYY-MM-DD" onDayChange={this.onChangeStDt} value={stDt} />
                      </div>
                      <span className="bar">&nbsp;&nbsp;~&nbsp;&nbsp;</span>
                      <div className="tui-datepicker-input tui-datetime-input tui-has-focus" style={{ width: 110 }}>
                        <DayPickerInput format="yyyy-MM-dd" formatDate={this.formatDate} parseDate={this.parseDate}
                          placeholder="YYYY-MM-DD" onDayChange={this.onChangeEdDt} value={edDt} />
                      </div>
                    </li>
                  </ul>
                  <button className="btn btn_black" onClick={() => this.onClickSch()}>검색</button>
                </div>
              </div>
            </div>

            <div className="status_guide">
              <ul>
                <li>
                  <span className="staus staus_completion"></span> Completion <b>{totalStatus.success === undefined ? 0 : totalStatus.success}</b>
                </li>
                <li>
                  <span className="staus staus_warning"></span> Warning <b>{totalStatus.warning === undefined ? 0 : totalStatus.warning}</b>
                </li>
              </ul>
            </div>
            <Grid ref={'grid'}
              data={gridData} columnOptions={{ resizable: true }}
              columns={columns}
              scrollX={false} scrollY={false}
            />
            <div className="gridControlArea btn_area">
              <Pagination ref={'page'}
                page={pagesPage}
                totalCount={pagesTotalCount}
                perPage={pagesPerPage}
                onClickItem={this.onClickPageItem} />
            </div>
          </div>
        } {/* showDetail */}
      </div></div>;
  }
}

class ServiceNameRenderer {
  constructor(props) {
    const { listData, onClickGridNameColumn } = props.columnInfo.renderer.options;
    const el = document.createElement('a');
    el.className = "nameLink link";
    let item = undefined;
    if (listData && listData.length > 0)
      item = listData[props.rowKey];
    el.innerText = item["serviceName"];
    el.title = item["resultPath"];
    el.href = "#";
    el.addEventListener("click", (e) => onClickGridNameColumn(item, e, props));
    this.el = el;
  }
  getElement() {
    return this.el;
  }
}
/**
 * DAG ID 컬럼 랜더러
 */
class DagIdRenderer {
  constructor(props) {
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

/**
 * Status 컬럼 랜더러
 */
class StatusRenderer {
  constructor(props) {
    const { onClickTestReq, listData } = props.columnInfo.renderer.options;
    let item = undefined;
    if (listData && listData.length > 0)
      item = listData[props.rowKey];
    if (item === undefined) item = {};
    let el = document.createElement('span');
    if (item.serviceStatus === "success") {
      el.className = "staus staus_completion";
    } else {
      el.className = "staus staus_warning";
    }
    this.el = el;
  }
  getElement() {
    return this.el;
  }
}

export default HistoryServiceExec;