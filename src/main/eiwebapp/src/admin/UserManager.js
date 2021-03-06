import React, { Component } from 'react';
import Grid from '@toast-ui/react-grid';
import { Pagination, Msg, NameRenderer, common } from 'comp';
import TuiGrid from 'tui-grid';
import AdminService from './AdminService';
import UserReg from './UserReg';
import { CommonCode } from 'main';

/**
 * 화면명 : User Management
 * 화면 경로 : Admin > User Management
 * 화면 코드 : MENU0040502
 * 참고 : 
 */
class UserManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: [],
      columns: [],
      bodyHeight: 200,
      pagesPage: 1,
      pagesTotalCount: 0,
      pagesPerPage: 5,
      schInfo: {}
    };
    this.requestData = this.requestData.bind(this);
    this.onResultList = this.onResultList.bind(this);
    this.onClickPageItem = this.onClickPageItem.bind(this);
    this.onClickGridNameColumn = this.onClickGridNameColumn.bind(this);
    this.onClickSch = this.onClickSch.bind(this);
    this.onClickReg = this.onClickReg.bind(this);
    this.onClickChangeActivate = this.onClickChangeActivate.bind(this);
    this.onResultChangeActivate = this.onResultChangeActivate.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmOkDelete = this.onConfirmOkDelete.bind(this);
    this.onResultDelete = this.onResultDelete.bind(this);
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
   * 사용자 리스트
   */
  requestData(page, schKeyword) {
    const { userPermission } = this.refs;
    if (page === undefined) page = this.state.pagesPage;
    this.props.main.showLoading();
    let parm = {
      page: page
    };
    if (userPermission.value !== "all") {
      parm.userPermission = userPermission.value;
    }
    if (schKeyword !== undefined)
      parm.schKey = schKeyword;
    this.setState({ schInfo: parm });
    AdminService.userList(parm, this.onResultList, (err) => Msg.error(err.message));
  }

  /**
   * 사용자 Activate 변경
   */
  onClickChangeActivate(item, e, props) {
    let parm = {};
    parm.userId = item.userId;
    parm.activate = item.activate === "Y" ? "0" : "1";
    parm.schType = "modi";
    AdminService.save(parm, this.onResultChangeActivate, (err) => Msg.error(err.message));
  }

  /**
   * 조회 버튼 클릭 이벤트 핸들러
   */
  onClickSch() {
    this.requestData(this.state.pagesPage, this.refs.schKey.value);
  }

  /**
   * 추가 버튼 클릭 이벤트 핸들러
   */
  onClickReg() {
    const {
      modifyUserInfo
    } = this.state;
    const popTitle = "User Regist";
    this.props.main.showPopup(
      popTitle,
      <UserReg title={popTitle} main={this.props.main} modifyFlag={modifyUserInfo !== undefined} modifyUserInfo={modifyUserInfo} onClose={(e) => this.onCloseReg(popTitle)} />,
      { width: 600, height: 540, popupBtnAreaVisible: false, contentAppendClass: "model_content" }, null, null
    );
  }

  /**************************************************************************/
  /* 핸들러 */
  /**************************************************************************/
  /**
   * 사용자 리스트 결과 핸들러
   */
  onResultList(res) {
    this.props.main.hideLoading();
    if (res.result === "ok") {
      const pagesInfo = res.data;
      const columns = [
        {
          name: 'userId', header: 'User ID', align: "center", sortable: true,
          renderer: {
            type: NameRenderer, options: {
              listData: res.list, labelKey: "userId",
              onClickGridNameColumn: this.onClickGridNameColumn
            }
          }
        }
        , { name: 'userName', header: 'User Name', align: "center", sortable: true }
        , { name: 'userGroup', header: 'User Group', align: "center", sortable: true }
        , { name: 'signupDate', header: 'Create Date', align: "center", sortable: true }
        , { name: 'loginDate', header: 'Recent Login', align: "center", sortable: true }
        , {
          name: 'activate', header: 'Activate', width: 100, align: "center", sortable: true,
          renderer: { type: ActivateRenderer, options: { listData: res.list, onClickChangeActivate: this.onClickChangeActivate } }
        }
        , {
          name: 'delete', header: 'Delete User', width: 100, align: "center",
          renderer: { type: DeleteRenderer, options: { listData: res.list, onClickDelete: this.onClickDelete } }
        }
      ]
      this.setState({ gridData: res.list, pagesPage: pagesInfo.page, pagesTotalCount: pagesInfo.totalCount, pagesPerPage: pagesInfo.pageCount, formCover: true, columns: columns });
    } else if (res.result === "fail") {
      Msg.error(res.message);
      if (res.errCode === "401") {
        console.log(res.errCode);
        this.props.main.setState({ login: false, role: '', username: '', sessionId: '', userInfo: {} });
      }
    }
  }

  /**
   * 사용자 Activate 변경 결과 핸들러
   */
  onResultChangeActivate(res) {
    if (res.result === "ok") {
      Msg.ok(res.message);
      this.requestData(1);
    }
    else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * 페이지 클릭 인벤트 핸들러
   */
  onClickPageItem(page) {
    const { schKey, schType } = this.refs;
    if (schKey.value.length > 0 && schType.value.length > 0)
      this.requestData(page, schType.value, schKey.value);
    else
      this.requestData(page);
  }

  /**
   * 랜더러 클릭 이벤트 핸들러
   * @param {Object} item 선택 Row 데이터
   * @param {MouseEvent} e 클릭 이벤트
   * @param {Object} props 랜더러 Options
   */
  onClickGridNameColumn(item, e, props) {
    try {
      const popTitle = "User Modify";
      this.props.main.showPopup(
        popTitle,
        <UserReg title={popTitle} main={this.props.main} modifyFlag={item !== undefined} modifyUserInfo={item} onClose={(e) => this.onCloseReg(popTitle)} />,
        { width: 600, height: 540, popupBtnAreaVisible: false, contentAppendClass: "model_content" }, null, null
      );
    } catch (err) {
      console.log(err);
    }
  }

  /**
   * 추가 팝업 닫기시 실행
   */
  onCloseReg(title) {
    this.requestData(1);
    this.setState({ modifyModelInfo: undefined, modifyModelFiles: undefined });
    this.props.main.hidePopup(title);
  }

  /**
   * 삭제 버튼 클릭 핸들러
   */
  onClickDelete(item, e, props) {
    console.log(item, e, props)
    this.props.main.showConfirm("사용자 삭제", "사용자 삭제하시겠습니까?", () => { this.onConfirmOkDelete(item) }, this.onConfirmCancelDelete)
  }

  /**
   * 삭제 확인 핸들러
   */
  onConfirmOkDelete(item) {
    console.log('onConfirmOkDelete : [' + item.userId + ']');
    AdminService.deleteUser(item.userId, this.onResultDelete, (err) => Msg.error(err.message));
  }

  /**
   * 삭제 확인 취소 핸들러
   */
  onConfirmCancelDelete() {
    // 삭제 확인 취소시
  }

  onResultDelete(res) {
    this.requestData();
    if (res.result === "ok") {
      Msg.ok("사용자 삭제 되었습니다.");
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  render() {
    let {
      gridData, columns, schInfo,
      pagesPage, pagesTotalCount, pagesPerPage
    } = this.state;
    let permissionOpts = CommonCode.makeOptions("PERMISSION", null, null, schInfo.userPermission, true);
    return <div className="page_layout">
      <div className="layout_contents">
        <div className="content_list model_aid_list table_type1">
          <div className="content_title">
            <h3 className="tit">User Management</h3>
          </div>

          <div className="search_condition">
            <div className="ipt_group search_basis search_basis2"><div className="group_center">
              <ul>
                <li>
                  <span className="tit">User Group</span>
                  <select ref="userPermission" className="ml5" style={{ float: "left", width: 100, height: 32, marginLeft: 10, outline: "none", border: "1px solid #CECECE" }}>
                    {permissionOpts}
                  </select>
                </li>
                <li>
                  <span className="tit">User Name / ID</span>
                  <input ref="schKey" type="text" className="ipt_text ml5" style={{ width: 350 }} defaultValue={schInfo.schKey} />
                </li>
              </ul>
              <button className="btn btn_black" onClick={() => this.onClickSch()}>검색</button>
            </div>
            </div>
            <button className="btn btn_add btn_blue" onClick={this.onClickReg}></button>
          </div>

          <div className="content_stitle">
            <span>Total : {pagesTotalCount}</span>
          </div>
          <Grid ref="grid" //rowHeaders={["checkbox"]}
            data={gridData} columnOptions={{ resizable: true }}
            columns={columns}
            scrollX={false} scrollY={false}
          />
          <div className="gridControlArea left btn_area">
            <div></div>
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

/**
 * Activate 컬럼 랜더러
 */
class ActivateRenderer {
  constructor(props) {
    const { onClickChangeActivate, listData } = props.columnInfo.renderer.options;
    let item = undefined;
    if (listData && listData.length > 0)
      item = listData[props.rowKey];
    if (item === undefined) item = {};
    let el = document.createElement('a');
    if (item.userId !== 'admin' && item.userId !== 'SYSTEM') {
      el.className = "table_btn btn_lineblue btn_resource gridItemBtn";
      el.innerText = item.activate === "Y" ? "중지" : "사용재개";
      el.title = item.activate === "Y" ? "중지" : "사용재개";
      el.addEventListener("click", (e) => onClickChangeActivate(item, e, props));
    }
    this.el = el;
  }
  getElement() {
    return this.el;
  }
}

class DeleteRenderer {
  constructor(props) {
    const { onClickDelete, listData } = props.columnInfo.renderer.options;
    let item = undefined;
    if (listData && listData.length > 0) {
      item = listData[props.rowKey];
    }
    if (item === undefined) item = {};

    let de = document.createElement('a');
    if (item.userId !== 'admin' && item.userId !== 'SYSTEM') {
      de.className = "table_btn btn_lineblue btn_resource gridItemBtn";
      de.innerText = "삭제";
      de.title = "삭제";
      de.addEventListener("click", (e) => onClickDelete(item, e, props));
    }

    this.de = de;
  }
  getElement() {
    return this.de;
  }
}



export default UserManager;