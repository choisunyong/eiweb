import React, { Component } from 'react';
import { Pagination, Msg, common, NameRenderer, Validation } from 'comp';
import Grid from '@toast-ui/react-grid';
import TuiGrid from 'tui-grid';
import DayPickerInput from 'react-day-picker/DayPickerInput';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import { add, sub } from 'date-fns';
import { CommonCode } from 'main';
import { ModelHistDetail, ModelService } from 'model';

/**
 * 화면명 : 모델 이력
 * 화면 경로 : Admin > Model History
 * 화면 코드 : MENU0040501
 * 참고 : 
 */
class HistoryModelReg extends Component {
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
      schInfo: undefined,
      stDt: undefined,
      edDt: undefined
    }
    this.requestData = this.requestData.bind(this);
    this.onResultList = this.onResultList.bind(this);
    this.onClickPageItem = this.onClickPageItem.bind(this);
    this.onClickSch = this.onClickSch.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.parseDate = this.parseDate.bind(this);
    this.onChangeStDt = this.onChangeStDt.bind(this);
    this.onChangeEdDt = this.onChangeEdDt.bind(this);
    this.onClickGridNameColumn = this.onClickGridNameColumn.bind(this);
  }

  componentDidMount() {
    TuiGrid.setLanguage('ko');
    TuiGrid.applyTheme('clean'); // default, striped, clean
    this.requestData(1);
  }

  /**************************************************************************/
  /* 기능 */
  /**************************************************************************/
  /**
   * 리스트
   * @param {int} page 페이지
   * @param {String} schKeyword Model ID, Model Name 검색어
   */
  requestData(page, schKeyword) {
    const { action } = this.refs;
    if (page === undefined) page = this.state.pagesPage;
    let { stDt, edDt } = this.state;
    this.props.main.showLoading();
    const parm = {
      page: page
    };
    if (action.value !== "all") {
      parm.action = action.value;
    }
    if (schKeyword !== undefined)
      parm.schKey = schKeyword;
    if (edDt === undefined) {
      edDt = new Date();
    }
    if (stDt === undefined) {
      stDt = sub(edDt, { months: 1 });// 1달전
    }
    const format = "yyyyMMdd";
    const locale = undefined;
    parm.endDate = dateFnsFormat(edDt, format, { locale });
    parm.startDate = dateFnsFormat(stDt, format, { locale });
    this.setState({ schInfo: parm, stDt: stDt, edDt: edDt });
    ModelService.regHistory(parm, this.onResultList, (err) => Msg.error(err.message));
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
      const columns = [
        { name: 'regDate', header: 'Date', align: "center" }
        , {
          name: 'modelName', header: 'Model Name',
          renderer: {
            type: NameRenderer, options: {
              listData: res.list, labelKey: "modelName",
              onClickGridNameColumn: this.onClickGridNameColumn
            }
          }
        }
        , { name: 'modelId', header: 'Model ID', align: "center" }
        , { name: 'action', header: 'Action', align: "center" }
        , { name: 'priorityNm', header: 'Priority', align: "center" }
        , { name: 'userId', header: 'User ID', align: "center" }
      ]
      this.setState({ gridData: res.list, pagesPage: pagesInfo.page, pagesTotalCount: pagesInfo.totalCount, pagesPerPage: pagesInfo.pageCount, columns: columns });
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
    if (this.props.isPopup && this.props.onChangeItem) {
      this.props.onChangeItem(item);
    }
    if (this.props.isPopup) {
      this.props.onSelection();
      this.props.onClose();
    } else {
      try {
        this.setState({ selectionRowKey: e.rowKey, selectionItem: item, selectionColumName: e.columnName, showDetail: true });
        const popTitle = "Model Info.";
        this.props.main.showPopup(
          popTitle,
          <ModelHistDetail title={popTitle} main={this.props.main} selectionItem={item} onClose={(e) => this.onCloseDetail(popTitle)} onClickModify={this.onClickModify} />,
          { width: 735, height: 522, popupBtnAreaVisible: false }, null, null
        );
      } catch (err) {
        console.log(err);
      }
    }
  }

  /**
   * 페이지 클릭 이벤트 핸들러
   * @param {int} page 
   */
  onClickPageItem(page) {
    const { schKey } = this.refs;
    if (schKey.value.length > 0)
      this.requestData(page, schKey.value);
    else
      this.requestData(page);
  }

  /**
   * 검색 클릭 핸들러
   */
  onClickSch() {
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

  render() {
    let {
      gridData, bodyHeight, columns, schInfo, stDt, edDt,
      pagesPage, pagesTotalCount, pagesPerPage
    } = this.state;
    if (!schInfo) schInfo = {};
    let actionOpts = CommonCode.makeOptions("MODEL_HIST_ACTION", null, null, schInfo.action, true);
    return <div className="page_layout"><div className="layout_contents">
      <div className="content_list model_aid_list table_type1">

        <div className="content_title">
          <h3 className="tit">Model History</h3>
        </div>

        <div className="search_condition">
          <div className="ipt_group search_basis search_basis2" style={{ width: "100%" }}><div className="group_center">
            <ul>
              <li>
                <span className="tit">Model Name / ID</span>
                <input ref="schKey" type="text" className="ipt_text ml5" style={{ width: 350 }} defaultValue={schInfo.schKey} />
              </li>
              <li>
                <span className="tit">Action</span>
                <select ref="action" className="ml5" style={{ float: "left", width: 100, height: 32, marginLeft: 10, outline: "none", border: "1px solid #CECECE" }}>
                  {actionOpts}
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

        <div className="content_stitle">
          <span>Total : {common.displNum(pagesTotalCount)}</span>
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
    </div>
    </div>;
  }
}

export default HistoryModelReg;