import React, {Component} from 'react';
import {Pagination, Msg,NameRenderer} from 'comp';
import Grid from '@toast-ui/react-grid';
import TuiGrid from 'tui-grid';
import {AdminService} from 'admin';
import {ServiceHistDetail} from 'service';

/**
 * 화면명 : Service 생성 이력
 * 화면 경로 : Admin > 이력 조회 > Service 생성 이력
 * 화면 코드 : MENU0040502
 * 참고 : 
 */
class HistoryServiceReg extends Component {
    constructor(props) {
        super(props);
        this.state = {
            gridData:[],
            columns:[],
            bodyHeight:300,
            pagesPage:1,
            pagesTotalCount:0,
            pagesPerPage:5,
            showDetail:false,
            selectionItem:{},
            selectionColumName:'',
            selectionRowKey:-1
        }
        this.requestData = this.requestData.bind(this);
        this.onResultList = this.onResultList.bind(this);
        this.onClickPageItem = this.onClickPageItem.bind(this);
        this.onDClickGrid = this.onDClickGrid.bind(this);
        this.onCloseDetail = this.onCloseDetail.bind(this);
        this.onClickGrid = this.onClickGrid.bind(this);
        this.onClickSch = this.onClickSch.bind(this);
        this.onClickGridNameColumn = this.onClickGridNameColumn.bind(this);
    }
    
    componentDidMount() {
        TuiGrid.setLanguage('ko');
        TuiGrid.applyTheme('clean'); // default, striped, clean
        this.setState({bodyHeight:document.getElementsByClassName('page_wrapper')[0].clientHeight - 190});
        this.requestData(1);

        if (this.refs.grid && this.refs.grid.getInstance() && this.refs.grid.getInstance().el)
            this.refs.grid.getInstance().el.addEventListener("dblclick",this.onDClickGrid,false);
    }
    
    componentDidUpdate() { 
        try {
            if (this.refs.grid && this.refs.grid.getInstance() && this.refs.grid.getInstance().el)
                this.refs.grid.getInstance().el.addEventListener("dblclick",this.onDClickGrid,false);
        } catch (err) {
            console.log(err);
        }
    }
    
	/**************************************************************************/
	/* 기능 */
	/**************************************************************************/
	/**
	 * 리스트
	 * @param {int} page 
	 * @param {String} schKeyword 
	 */
	requestData(page,schKeyword) {
		if (page === undefined) page = this.state.pagesPage;
		this.props.main.showLoading();
		let parm = {
			page:page
		};
		if (schKeyword !== undefined)
			parm.schKey = schKeyword;
		AdminService.serviceCreHistory(parm,this.onResultList,(err) => Msg.error(err.message));
	}
	
	/**************************************************************************/
	/* 핸들러 */
	/**************************************************************************/
	/**
	 * 더블 클릭 이벤트 핸들러
	 * @param {GridEvent} gridEvt 
	 */
    onDClickGrid(gridEvt) {
        this.setState({showDetail:true});
	}
    
	/**
	 * 리스트 결과 핸들러
	 * @param {Object} res {result:ok|fail,list:리스트}
	 */
    onResultList(res) {
        this.props.main.hideLoading();
        if (res.result==="ok") {
            const pagesInfo = res.data;
            const columns = [
                {name:'serviceName',header:'Service명', minWidth:100,
                    renderer: { type: NameRenderer ,options: {
                        listData:res.list,labelKey:"serviceName",
                        onClickGridNameColumn:this.onClickGridNameColumn
                    } }
                }
                ,{name:'userName',header:'생성자',width:150,align:"center"}
                ,{name:'regDate',header:'생성일',width:150,align:"center"}
                ,{name:'runCycle',header:'실행주기',width:150,align:"center"}
                ,{name:'modelName',header:'Model', minWidth:100}
            ]
            this.setState({gridData:res.list,pagesPage:pagesInfo.page,pagesTotalCount:pagesInfo.totalCount,pagesPerPage:pagesInfo.pageCount,columns:columns});
        } else if (res.result === "fail"){
            Msg.error(res.message);
            if (res.errCode === "401") {
                console.log(res.errCode);
                this.props.main.setState({login:false,role:'',username:'',sessionId:'',userInfo:{}});
            }
        }
    }
    
    /**
	 * 페이지 클릭 이벤트 핸들러
	 * @param {int} page 
	 */
    onClickPageItem(page) {
        this.requestData(page, this.state.schKeyword);
	}
    
	/**
	 * 삭제 팝업 닫힘 핸들러
	 */
    onCloseDetail() {
        this.setState({showDetail:false});
	}
    
	/**
	 * 그리드 클릭 이벤트 핸들러
	 * @param {GridEvent} gridEvt 
	 */
    onClickGrid(gridEvt) {
        console.log( this.state.gridData[gridEvt.rowKey] );
        this.setState( {selectionRowKey:gridEvt.rowKey,selectionItem:this.state.gridData[gridEvt.rowKey],selectionColumName:gridEvt.columnName} );
    }
    
    /**
	 * 검색 클릭 핸들러
	 */
    onClickSch() {
        this.requestData(this.state.pagesPage, this.refs.schKey.value );
    }
    
    /**
	 * 랜더러 클릭 이벤트 핸들러
	 * @param {Object} item 선택 Row 데이터
	 * @param {MouseEvent} e 클릭 이벤트
	 * @param {Object} props 랜더러 Options
	 */
    onClickGridNameColumn(item,e,props) {
        this.setState( {selectionRowKey:e.rowKey,selectionItem:item,selectionColumName:e.columnName,showDetail:true} );
    }
    
    render() {
        const {selectionItem,
            gridData, bodyHeight, columns, showDetail,
            pagesPage, pagesTotalCount, pagesPerPage
        } = this.state;
        return <div className="historyServiceReg">
            {showDetail 
                ? <ServiceHistDetail main={this.props.main} selectionItem={selectionItem} onClose={(e) => this.onCloseDetail()} onClickModify={this.onClickModify} modifyButtonVisible={false}/>
                : <div><div className={'searchArea2'}><div className={'searchForm'}>
                    <div className={'searchKeyword'}>
                        <label>검색어</label>
                        <input ref="schKey" className="form-control" placeholder="Service명 / 생성자 / Model / 데이터" onKeyDown={(e) => e.keyCode === 13 ? this.onClickSch() : null}/>
                    </div>
                    <button className="btn btn-success btn-sm" onClick={() => this.onClickSch()}>검색</button>
                </div></div>
                <div className="totalCount"><span>Total : {pagesTotalCount}</span></div>
                <div className={'gridArea'}>
                    <Grid ref={'grid'} onClick={this.onClickGrid}
                        data={gridData} columnOptions={{resizable: true}}
                        columns={columns}
                        bodyHeight={bodyHeight}
                        scrollX={false} scrollY={false}
                    />
                    <Pagination ref={'page'}
                        page={pagesPage}
                        totalCount={pagesTotalCount}
                        perPage={pagesPerPage}
                        onClickItem={this.onClickPageItem}/>
                </div>
            </div> }
        </div>;
    }
}

export default HistoryServiceReg;