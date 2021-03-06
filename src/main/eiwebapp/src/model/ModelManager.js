import React, { Component } from 'react';
import Grid from '@toast-ui/react-grid';
import TuiGrid from 'tui-grid';
import { Pagination, Msg, NameRenderer, common, Validation } from 'comp';
import { ModelService, ModelReg, ModelDetail } from 'model';

/**
 * 화면명 : 모델 관리
 * 화면 경로 : 모델 > 모델 관리
 * 화면 코드 : MENU00201
 * 참고 : https://nhn.github.io/tui.grid/latest/Grid
 */
class ModelManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gridData: [],
      columns: [],
      bodyHeight: 200,
      pagesPage: 1,
      pagesTotalCount: 0,
      pagesPerPage: 5
    };
    this.requestData = this.requestData.bind(this);
    this.onResultList = this.onResultList.bind(this);
    this.onClickPageItem = this.onClickPageItem.bind(this);
    this.onClickDel = this.onClickDel.bind(this);
    this.onResultDel = this.onResultDel.bind(this);
    this.onConfirmOkDel = this.onConfirmOkDel.bind(this);
    this.onConfirmCancelDel = this.onConfirmCancelDel.bind(this);
    this.onClickReg = this.onClickReg.bind(this);
    this.onCloseReg = this.onCloseReg.bind(this);
    this.popupModify = this.popupModify.bind(this);
    this.onClickSch = this.onClickSch.bind(this);
    this.onClickGridNameColumn = this.onClickGridNameColumn.bind(this);
    this.onClickTestReq = this.onClickTestReq.bind(this);
    this.onResultTestReq = this.onResultTestReq.bind(this);
    this.onClickFileReq = this.onClickFileReq.bind(this);
    this.onResultFileReq = this.onResultFileReq.bind(this);
  }

  componentDidMount() {
    TuiGrid.setLanguage('ko');
    TuiGrid.applyTheme('clean'); // default, striped, clean
    this.requestData(1);
  }

  /**
 * 페이지 클릭 이벤트 핸들러
 * @param {int} page 
 */
  onClickPageItem(page) {
    const { schKey, schType } = this.refs;
    if (schKey.value.length > 0 && schType.value.length > 0)
      this.requestData(page, schType.value, schKey.value);
    else
      this.requestData(page);

  }

  /**
   * 모델 리스트
   * @param {int} page 
   * @param {String} schType 
   * @param {String} schKeyword 
   */
  requestData(page, schType, schKeyword) {
    if (page === undefined) page = this.state.pagesPage;
    this.props.main.showLoading();
    const parm = {
      page: page
    };
    
    
    if (schType !== undefined && schKeyword !== undefined) {
      // Msg.info("필터전 : " + schKeyword);
      schKeyword = Validation.filterSchKeyword(schKeyword);
      // Msg.info("필터후 : " + schKeyword);
      parm.schKey = schKeyword;
      parm.schType = schType;
    } else if (this.refs.schKey.value !== null && this.refs.schKey.value !== "") {
      parm.schKey = Validation.filterSchKeyword(this.refs.schKey.value);
      parm.schType = this.refs.schType.value;
    }
    ModelService.list(parm, this.onResultList, (err) => Msg.error(err.message));
  }

  /**
   * 모델 리스트 결과 핸들러
   * @param {Object} res 
   */
  onResultList(res) {
    this.props.main.hideLoading();
    if (res.result === "ok") {
      const pagesInfo = res.data;
      const columns = [
        {
          name: 'modelName', header: 'Model Name', minWidth: 300, sortable: true,
          renderer: {
            type: NameRenderer, options: {
              listData: res.list, labelKey: "modelName",
              onClickGridNameColumn: this.onClickGridNameColumn
            }
          }
        }, 
        { name: 'modelId', header: 'Model ID', align: "center", sortable: true, whiteSpace: "normal" },
        { name: 'priorityNm', header: 'Priority', align: "center", sortable: true, whiteSpace: "normal" },
        { name: 'limitRuntime', header: 'Limit (Min.)', align: "center", sortable: true, whiteSpace: "normal" },
        { name: 'regDate', header: 'Update Date', align: "center", sortable: true, whiteSpace: "normal" },
        { name: 'userId', header: 'User', align: "center", sortable: true, whiteSpace: "normal" },
        { name: 'testResult', header: 'Test Result (CPU/Duration)', align: "center" },
        {
          name: 'file', header: 'File', width: 100, align: "center",
          renderer: { type: FileRenderer, options: { listData: res.list, onClickFileReq: this.onClickFileReq} }
        },
        {
          name: 'resourceTest', header: 'Resource Test', width: 100, align: "center",
          renderer: { type: LinkRenderer, options: { listData: res.list, onClickTestReq: this.onClickTestReq } }
        }
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
            <ModelDetail title={popTitle} main={this.props.main} selectionItem={item} onClose={(e) => this.onCloseDetail(popTitle)} />,
            { width: 735, height: 677, popupBtnAreaVisible: false, contentAppendClass: "model_content" }, 
            null, 
            null
          );
        }
      } catch (err) {
        console.log(err);
      }
    }
  }

  /**
 * 검색 클릭 핸들러
 */
  onClickSch() {
    this.requestData(1, this.refs.schType.value, this.refs.schKey.value);
  }

  /**
   * 삭제 클릭 핸들러
   */
  onClickDel() {
    const popTitle = "모델 삭제";
    this.props.main.showPopup(
      popTitle,
      "모델 삭제하시겠습니까?",
      { width: 300, height: 200, headerVisiable: false }, () => this.onConfirmOkDel(), null
    );
  }

  /**
   * 모델 삭제 확인 OK
   */
  onConfirmOkDel() {
    // console.log( this.refs.grid.getInstance().getCheckedRows() );
    const chkedModels = this.refs.grid.getInstance().getCheckedRows();
    let delModels = [];
    for (let i = 0; i < chkedModels.length; i++) {
      delModels.push(chkedModels[i].modelId);
    }
    ModelService.delete(delModels, this.onResultDel, (e) => console.log(e));
  }

  /**
   * 모델 삭제 확인 취소
   */
  onConfirmCancelDel() {
    // 삭제 확인 취소시
  }

  /**
   * 모델 삭제 결과 핸들러
   * @param {Object} res 
   */
  onResultDel(res) {
    this.requestData();
    if (res.result === "ok") {
      Msg.ok("모델 삭제 되었습니다.");
    }
    else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * 모델 등록 클릭 핸들러
   */
  onClickReg() {
    const {
      modifyModelInfo, modifyModelFiles
    } = this.state;
    // this.setState({showReg:true});
    const popTitle = "Model Regist";
    this.props.main.showPopup(
      popTitle,
      <ModelReg title={popTitle} main={this.props.main} modifyFlag={modifyModelInfo !== undefined} modifyModelInfo={modifyModelInfo} modifyModelFiles={modifyModelFiles} onClose={(e) => this.onCloseReg(popTitle)} />,
      { width: 735, height: 530, okLabel: "등록", popupBtnAreaVisible: false, contentAppendClass: "model_content" }, null, null
    );
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
      <ModelReg main={this.props.main} modifyFlag={modelInfo !== undefined} modifyModelInfo={modelInfo} modifyModelFiles={modelFiles} onClose={(e) => this.onCloseReg(popTitle)} />,
      { width: 735, height: 530, okLabel: "저장", popupBtnAreaVisible: false, contentAppendClass: "model_content" }, null, null
    );
  }

  /**
   * 등록 / 수정 팝업 닫힘 핸들러
   * @param {String} title 
   */
  onCloseReg(title) {
    this.requestData(this.state.pagesPage);
    this.setState({ modifyModelInfo: undefined, modifyModelFiles: undefined });
    this.props.main.hidePopup(title);
  }

  /**
   * 리스트 평가 버튼 클릭 핸들러
   * @param {Object} item 
   * @param {Event} e 
   * @param {Object} props 
   */
  onClickTestReq(item, e, props) {
    // console.log('onClickTestReq');
    // console.log(item);
    // console.log(e);
    // console.log(props);
    ModelService.modelTestReq(item.modelId, this.onResultTestReq, (err) => Msg.error(err.message));
  }

  /**
   * 소스보기 버튼 클릭 핸들러
   * @param {Object} item 
   * @param {Event} e 
   * @param {Object} props 
   */
  onClickFileReq(item, e, props) {
    ModelService.getModelFile(item.modelId, this.onResultFileReq, (err) => Msg.error(err.message));
  }

  /**
   * 평가 결과 핸들러
   * @param {Object} res 
   */
  onResultTestReq(res) {
    if (res.result === "ok") {
      Msg.ok(res.message);
    }
    else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * 모델 소스 보기
   * @param {*} res
   * @param {String} modleId
   */
  onResultFileReq(res) {
    if (res.result === "ok") {
      this.props.main.showPopup(res.data.fileName, <textarea value={res.data.contents} style={ {height: '600px'} }></textarea> );
    }
    else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  render() {
    let {
      gridData, bodyHeight, columns,
      pagesPage, pagesTotalCount, pagesPerPage
    } = this.state;
    let rh = [];
    return <div className="page_layout">

      <div className="layout_contents">
        <div className="content_list model_aid_list table_type1">

          <div className="content_title">
            <h3 className="tit">Model Management</h3>
          </div>

          <div className="search_condition marginbottomremove" >
            <div className="ipt_group search_basis">
              <div className="group_center">
                <select ref="schType" className="combobox" style={{ float: "left", marginLeft: 10 }}>
                  <option value="modelName">Model Name</option>
                  <option value="user">User</option>
                </select>
                <input ref="schKey" type="text" className="ipt_text ml10" placeholder="검색어를 입력해 주세요." style={{ width: 495 }} />
                <button className="btn btn_black" onClick={() => this.onClickSch()}>검색</button>
              </div>
            </div>
            <button className="btn btn_add btn_blue" onClick={this.onClickReg}></button>
          </div>

          <div className="content_stitle">
            <span>Total : {common.displNum(pagesTotalCount)}</span>
          </div>
          <Grid ref="grid" rowHeaders={rh} header={{ height: 50, whiteSpace: "normal" }}
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

/**
 * 평가 컬럼 랜더러
 */
class LinkRenderer {
  constructor(props) {
    const { onClickTestReq, listData } = props.columnInfo.renderer.options;
    let item = undefined;
    if (listData && listData.length > 0)
      item = listData[props.rowKey];
    if (item === undefined) item = {};
    let el = document.createElement('b');
    // 평가 중이아닐경우 평가 버튼 표시
    // 평가 중일경우 Testing.. 텍스트 표시
    if (item.evaluationStatus === 'tested' || item.evaluationStatus === 'init') {
      el = document.createElement('a');
      el.className = "table_btn btn_lineblue btn_resource gridItemBtn";
      el.innerText = "TEST";
      el.title = "TEST";
      el.addEventListener("click", (e) => onClickTestReq(item, e, props));
    } else {
      el.className = "font_blue";
      el.innerText = "Testing..";
    }
    this.el = el;
  }
  getElement() {
    return this.el;
  }
}

class FileRenderer {
  constructor(props) {
    const { onClickFileReq, listData } = props.columnInfo.renderer.options;
    let item = undefined;
    if (listData && listData.length > 0)
      item = listData[props.rowKey];
    if (item === undefined) item = {};
    let el = document.createElement('button');
      el.className = 'btn_history';
      el.innerText = "";
      el.title = "FILE";
      el.addEventListener("click", (e) => onClickFileReq(item, e, props));
    this.el = el;
  }

  getElement() {
    return this.el
  }
}

export default ModelManager;