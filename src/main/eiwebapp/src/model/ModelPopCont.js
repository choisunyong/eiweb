import React, {Component} from 'react';
import {Pagination, Msg} from 'comp';
import {ModelService} from 'model';
import Validation from 'comp/Validation';
import GridList from 'comp/GridList';

class ModelPopCont extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridData:[],
            columns:[
                {name:"modelName",header:"Model Name",width:200},
                {name:"priorityNm",header:"Priority",width:50,align:"center"},
                {name:"regDate",header:"Update Date",width:120,align:"center"},
                {name:"userId",header:"User",width:100,align:"center"},
                {name:"select",header:"Select",width:79,align:"center"}
            ],
            bodyHeight:200,
            pagesPage:1,
            pagesTotalCount:0,
            pagesPerPage:5
        };
        this.requestData = this.requestData.bind(this);
        this.onResultList = this.onResultList.bind(this);
        this.onClickPageItem = this.onClickPageItem.bind(this);
        this.onClickSch = this.onClickSch.bind(this);
        this.onClickSelection = this.onClickSelection.bind(this);
    }
    
    componentDidMount() {
        this.requestData(1);
    }
    
    requestData(page,schType,schKeyword) {
        if (page === undefined) page = this.state.pagesPage;
        this.props.main.showLoading();
        const parm = {
            page:page
        };
        if (schType !== undefined && schKeyword !== undefined) {
            // Msg.info("필터전 : " + schKeyword);
            schKeyword = Validation.filterSchKeyword(schKeyword);
            // Msg.info("필터후 : " + schKeyword);
            parm.schKey = schKeyword;
            parm.schType = schType;
        }
        ModelService.list(parm,this.onResultList,(err) => Msg.error(err.message));
    }
    
    onResultList(res) {
        this.props.main.hideLoading();
        // console.log("onresultlist");
        // console.log(res);
        if (res.result==="ok") {
            const pagesInfo = res.data;
            const columns = [
                {name:"modelName",header:"Model Name",width:120,sortable:true},
                {name:"priorityNm",header:"Priority",width:120,align:"center",sortable:true},
                {name:"regDate",header:"Update Date",width:120,align:"center",sortable:true},
                {name:"userId",header:"User",width:100,align:"center",sortable:true},
                {name:"select",header:"Select",width:85,align:"center",paddingRight:5,sortable:true,
                    renderer: { type: SelectButton ,options: { listData:res.list,onClickSelection:this.onClickSelection } }
                }
            ];
            this.setState({gridData:res.list,pagesPage:pagesInfo.page,pagesTotalCount:pagesInfo.totalCount,pagesPerPage:pagesInfo.pageCount,columns:columns});
            // this.setState({gridData:res.list,columns:columns});
        } else if (res.result === "fail"){
            Msg.error(res.message);
        }
    }
    
    /**
	 * 검색 클릭 핸들러
	 */
    onClickSch() {
        // if (this.refs.schKey.value.length < 1) {
        //     Msg.warn("모델명을 입력해 주세요.");
        //     return;
        // }
        this.requestData(1, "modelName", this.refs.schKey.value );
    }
    
    onClickSelection(item) {
        if (this.props.onClickSelection)
            this.props.onClickSelection(item);
        this.props.onClose();
    }
    
    /**
	 * 페이지 클릭 이벤트 핸들러
	 * @param {int} page 
	 */
    onClickPageItem(page) {
        // console.log("onclickpageitem : " + page);
        const {schKey} = this.refs;
        this.requestData(page,"modelName",schKey.value);
    }
    
    render() {
        let {
            gridData, columns, 
            pagesPage, pagesTotalCount, pagesPerPage
        } = this.state;
        return <div style={{padding:7}}>
            <div className="search_condition" style={{marginBottom: 10}}>
                <div className="ipt_group search_basis" style={{paddingLeft: 31,width:"100%"}}>
                    {/* <span className="txt">검색어</span> */}
                    {/* <select ref="schType" style={{float:"left",width: 200,height: 32,marginLeft: 10,outline:"none",border:"1px solid #CECECE"}}>
                        <option value="modelName">Model Name</option>
                        <option value="user">User</option>
                        </select>
                    <span className="selectbox ml10" id="searchSort" style={{width:120}}></span> */}
                    <input ref="schKey" type="text" className="ipt_text ml10" placeholder="Model Name" style={{width:297}} onKeyDown={(e) => e.keyCode === 13 ? this.onClickSch() : null}/>
                    <button className="btn btn_black" onClick={() => this.onClickSch()}>검색</button>
                </div>
            </div>
            <div style={{paddingTop:9}}>
                <GridList columns={columns} gridData={gridData}/>
                <Pagination ref={'page'}
                    page={pagesPage}
                    totalCount={pagesTotalCount}
                    perPage={pagesPerPage}
                    onClickItem={this.onClickPageItem}/>
            </div>
        {/* <div className="popupBtnArea btn_area addbtnarea"><p className="btn2">
            <button className="btn btn_white" onClick={() => this.props.main.hidePopup(this.props.title)}>닫기</button>
            * <button className="btn btn_black" onClick={(e) => this.onClickSelection()}>선택</button> *
		</p></div> */}
        </div>;
    }
}

class SelectButton extends Component {
    render() {
        const {item} = this.props;
        const {onClickSelection} = this.props.options;
        return <button className="table_btn btn_linegray" onClick={() => onClickSelection(item)}>Select</button>;
    }
}

export default ModelPopCont;