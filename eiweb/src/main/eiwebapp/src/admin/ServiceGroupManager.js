import React, { Component } from 'react';
import { Pagination, Msg, common, Validation } from 'comp';
import { AdminService, ServiceGroupReg } from 'admin';
import Grid from '@toast-ui/react-grid';
import TuiGrid from 'tui-grid';

/**
 * 화면명 : Service Group Management
 * 화면 경로 : Admin > Service Group Management
 * 화면 코드 : MENU00407
 * 참고 : 
 */
class ServiceGroupManager extends Component {
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
      selectionRowKey: -1
    }
    this.requestData = this.requestData.bind(this);
    this.onResultList = this.onResultList.bind(this);
    this.onClickPageItem = this.onClickPageItem.bind(this);
    this.onClickSch = this.onClickSch.bind(this);
    this.onClickReg = this.onClickReg.bind(this);
    this.onClickDel = this.onClickDel.bind(this);
    this.onResultDel = this.onResultDel.bind(this);
    this.onConfirmOkDel = this.onConfirmOkDel.bind(this);
    this.onConfirmCancelDel = this.onConfirmCancelDel.bind(this);
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
   * @param {int} page 
   * @param {String} schKeyword 
   */
  requestData(page, schKeyword) {
    if (page === undefined) page = this.state.pagesPage;
    this.props.main.showLoading();
    let parm = {
      page: page
    };
    if (schKeyword !== undefined) {
      schKeyword = Validation.filterSchKeyword(schKeyword);
      parm.schKey = schKeyword;
    }
    AdminService.serviceGroupList(parm, this.onResultList, (err) => Msg.error(err.message));
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
        { name: 'serviceGroupName', header: 'Service Group Name', align: "left" }
        , { name: 'creationDate', header: '생성일', align: "center" }
        , { name: 'description', header: '설명', align: "left" }
      ];
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
    this.requestData(this.state.pagesPage, this.refs.schKey.value);
  }

  /**
   * 등록 버튼 클릭 핸들러
   */
  onClickReg() {
    const { modifyServiceGroupInfo } = this.state;
    const title = "서비스 그룹 추가";
    this.props.main.showPopup(
      title,
      <ServiceGroupReg main={this.props.main} modifyFlag={modifyServiceGroupInfo !== undefined} modifyServiceGroupInfo={modifyServiceGroupInfo} onClose={(e) => { this.props.main.hidePopup(title); this.requestData() }} />,
      { width: 516, height: 342, popupBtnAreaVisible: false }, null, null
    );
  }

  /**
   * 삭제 버튼 클릭 핸들러
   */
  onClickDel() {
    const chkedRsrs = this.refs.grid.getInstance().getCheckedRows();
    if (chkedRsrs.length > 0)
      this.props.main.showConfirm("서비스 그룹 삭제", "서비스 그룹 삭제하시겠습니까?", this.onConfirmOkDel, this.onConfirmCancelDel);
    else Msg.warn("선택된 서비스 그룹이 없습니다.");
  }

  /**
   * 삭제 확인 핸들러
   */
  onConfirmOkDel() {
    const chkedRsrs = this.refs.grid.getInstance().getCheckedRows();
    let delServiceGroups = [];
    for (let i = 0; i < chkedRsrs.length; i++) {
      delServiceGroups.push(chkedRsrs[i].serviceGroupName);
    }
    AdminService.deleteServiceGroup(delServiceGroups, this.onResultDel, (e) => Msg.error(e.message));
  }

  /**
   * 삭제 확인 취소 핸들러
   */
  onConfirmCancelDel() {
    // 삭제 확인 취소시
  }

  /**
   * 석제 결과 핸들러
   * @param {Object} res {result:ok|fail,message}
   */
  onResultDel(res) {
    this.requestData();
    if (res.result === "ok") {
      Msg.ok("서비스 그룹 삭제 되었습니다.");
    }
    else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  render() {
    let { gridData, columns, pagesPage, pagesTotalCount, pagesPerPage } = this.state;
    return <div className="page_layout">
      <div className="layout_contents">
        <div className="content_list model_aid_list table_type1">
          <div className="content_title">
            <h3 className="tit">Service Group Management</h3>
          </div>

          <div className="search_condition">
            <div className="ipt_group search_basis search_basis2"><div className="group_center">
              <ul><li>
                <span className="tit" id="searchSort">Service Group Name</span>
                <input ref="schKey" type="text" className="ipt_text ml5" placeholder="검색어를 입력해 주세요." style={{ width: 240 }}
                  onKeyDown={(e) => e.keyCode === 13 ? this.onClickSch() : null} />
              </li></ul>
              <button className="btn btn_black" onClick={() => this.onClickSch()}>검색</button>
            </div>
            </div>
            <button className="btn btn_add btn_blue" onClick={this.onClickReg}></button>
          </div>

          <div className="content_stitle">
            <span>Total : {common.displNum(pagesTotalCount)}</span>
          </div>
          <Grid ref={'grid'} rowHeaders={["checkbox"]}
            data={gridData} columnOptions={{ resizable: true }}
            columns={columns}
            scrollX={false} scrollY={false}
          />
          <div className="gridControlArea left btn_area">
            <button className="btn btn_black gridControlBtn" onClick={this.onClickDel}>삭제</button>
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

export default ServiceGroupManager;