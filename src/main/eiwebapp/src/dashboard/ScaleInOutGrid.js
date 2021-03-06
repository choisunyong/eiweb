import React, {Component} from 'react';

/**
 * 대시보드 Scale In/Out 그리드
 */
class ScaleInOutGrid extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cellHeight:30,
            cellColsCount:7
        };
    }
    
    render() {
        let {gridData,height} = this.props;
		if (gridData === undefined) gridData = [];
		if (height === undefined) height=190;
        let itm;
        let rows = [];
        const rowHei = ((height-25-(10*gridData.length-1))/gridData.length) + "px";
        for (let i=0; i<gridData.length; i++) {
            itm = gridData[i];
            rows.push(<Row rowData={itm} rowHei={rowHei}/>);
        }        
        let days = [];
        var moment = require('moment');
        for (let i = 6; i >= 0; i--) {
            days.push(moment().add(-i, 'd').format("MM/DD"));
        }
        return <table className="scale_table" ><tbody>
            {rows}
			<tr className="sts_day">
				<th></th>
				<td>{days[0]}</td>
				<td>{days[1]}</td>
				<td>{days[2]}</td>
				<td>{days[3]}</td>
				<td>{days[4]}</td>
				<td>{days[5]}</td>
				<td>{days[6]}</td>
			</tr>
        </tbody></table>;
    }
}

class Row extends Component {
    render() {
        let {rowData,labelKey,cellCount,rowHei} = this.props;
        if (labelKey === undefined) labelKey = "serverRole";
        if (cellCount === undefined) cellCount = 7;
        if (rowHei === undefined) rowHei = 30;
        let cells = [];
        let cls = "";
        let key = "";
        for (let i=1; i<=cellCount; i++) {
            cls = "cell";
            key = "v" + i;
			if (rowData[key] === "0")
				cls += " scalein";
			else if (rowData[key] === "1")
				cls += " scaleout";
			cells.push(<td className={cls} style={{height:rowHei}}></td>);
        }
		return <tr>
			<th>{rowData === "label" ? "Date" : rowData[labelKey]}</th>
			{cells}
		</tr>;
    }
}

export default ScaleInOutGrid;