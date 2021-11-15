import React, {Component} from 'react';

/**
 * 화면명 : 심플 그리드
 * 화면 경로 : 심플 그리드
 * 화면 코드 : 
 * 참고 : 간단히 리스트 표현시 TUI GRID를 사용하지 않고 가볍게 보여주기위한 컴퍼넌트
 */
class GridList extends Component {
    render() {
        let {columns,gridData,noDataMsg} = this.props;
        if (noDataMsg === undefined) noDataMsg = "데이터가 없습니다.";
        let bodyHeight = 236;
        if (this.props.bodyHeight !== undefined) bodyHeight = this.props.bodyHeight;
        let headers = [];
        let colGroup = [];
        let i;
        let col;
        let colsty;
        let headercellsty;
        const headersty = {height:40};
        const rowsty = {height:40};
        let itm;
        for (i=0; i<columns.length; i++) {
            col = columns[i];
            colsty = {};
            if (col.width !== undefined)
                colsty.width = col.width;
            if (col.align !== undefined)
                colsty.align = col.align;
            colGroup.push(<col style={colsty} key={Math.random()}/>);

            headercellsty = {verticalAlign:"middle"};
            if (col.align !== undefined) {
                headercellsty.textAlign = col.align;
                if (col.align === "left")
                    headercellsty.padding = "0px 13px";
            }
            headers.push(<th className="tui-grid-cell tui-grid-cell-header tui-grid-cell-head" style={headercellsty} key={Math.random()}>{col.header}</th>);

        }

        // make rows
        let rowcols;
        let rows = [];
        let rowcolsty;
        if (gridData.length < 1) {
            rows.push(<NoneRow colSpan={columns.length} noneContent={noDataMsg} key={Math.random()}/>);
        } else {
            for (let j=0; j<gridData.length; j++) {
                itm = gridData[j];
                rowcols = [];
                for (i=0; i<columns.length; i++) {
                    col = columns[i];
                    rowcolsty = {};
                    rowcolsty = {verticalAlign:"middle"};
                    for (let s in col) {
                        if (s === "align" || s.indexOf("padding") > -1 || s.indexOf("margin") > -1 || s.indexOf("Width") > -1 || s.indexOf("Height") > -1) {
                            if (s === "align") {
                                rowcolsty["textAlign"] = col[s];
                                if (col[s] === "left")
                                    rowcolsty["padding"] = "0px 5px";
                            }
                            else
                                rowcolsty[s] = col[s];
                        }
                    }
                    rowcols.push( 
                        <td className="tui-grid-cell tui-grid-cell-has-input" style={rowcolsty} key={Math.random()}>
                            {col.renderer !== undefined
                                ? <col.renderer.type options={col.renderer.options} item={itm} key={Math.random()}/>
                                : <div className="tui-grid-cell-content" key={Math.random()}>{itm[ col.name ]}</div>}
                        </td>
                    );
                }
                rows.push( <tr className="tui-grid-row-odd" style={rowsty}>{rowcols}</tr> );
            }
        }

        return <div className="gridList">
            <div className="tui-grid-header-area" style={headersty}>
                <table className="tui-grid-table">
                    <colgroup>
                        {colGroup}
                    </colgroup>
                    <tbody>
                        <tr style={headersty}>{headers}</tr>
                    </tbody>
                </table>
            </div>
            <div className="tui-grid-body-area">
                <div className="tui-grid-body-container" style={{height: bodyHeight,width: "100%",overflow: "auto"}}>
                    <div className="tui-grid-table-container" style={{top: 0,left: 0,overflow: "auto"}}>
                        <table className="tui-grid-table">
                            <colgroup>{colGroup}</colgroup>
                            <tbody>{rows}</tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    }
}

class NoneRow extends Component {
    render() {
        const {colspan} = this.props;
        let {noneContent} = this.props;
        if (!noneContent) noneContent = "데이터가 없습니다.";
        return <tr className="tui-grid-row-odd">
            <td className="tui-grid-cell tui-grid-cell-has-input" style={{height:40,textAlign: "center"}} colSpan={colspan}>
                <div className="tui-grid-cell-content">{noneContent}</div>
            </td>
        </tr>;
    }
}

export default GridList;