/**
 * 그리드에 명칭 컬럼 클릭 랜더러
 * use example
 * 
 * import {NameRenderer} from 'comp';
 * constructor(props) {
 *  ...
 *  this.onClickGridNameColumn = this.onClickGridNameColumn.bind(this);
 * }
 * onResultList(res) {
 *  ...
 *  const columns = [
      ...
      {name:'modelName',header:'모델명', minWidth:100,
            renderer: { type: NameRenderer ,options: {
                listData:res.list,labelKey:"modelName",
                onClickGridNameColumn:this.onClickGridNameColumn
            } }
        }
 *  ];
 *  this.setState({... columns:columns});
 * }
 * onClickGrid(gridEvt) {
        this.setState( {selectionRowKey:gridEvt.rowKey,selectionItem:this.state.gridData[gridEvt.rowKey],selectionColumName:gridEvt.columnName} );
    }
    onDClickGrid(gridEvt) {
        this.setState({showDetail:true});
    }
 * 
 */
class NameRenderer {
    constructor(props) {
        const el = document.createElement('a');
        // el.className = "button basefont btn btn-info btn-sm";
        
        const { listData, onClickGridNameColumn,labelKey } = props.columnInfo.renderer.options;
        let item = undefined;
        if (listData && listData.length > 0)
        item = listData[props.rowKey];
        if (item === undefined) item = {};
        el.className="nameLink link";
        el.title=item[labelKey];
        el.innerText = item[labelKey];
        el.href="#";
        el.addEventListener("click",(e) => onClickGridNameColumn(item,e,props));
        this.el = el;
    }
    
    getElement() {
        return this.el;
    }
}

export default NameRenderer;