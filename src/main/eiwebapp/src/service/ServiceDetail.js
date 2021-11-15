import React, { Component } from 'react';

class ServiceDetail extends Component {
    render() {
        const { selectionItem } = this.props;
        console.log(selectionItem);
        return <div className="table_type2">
            <table>
                <colgroup>
                    <col style={{ width: 240 }} />
                    <col style={{ width: "*" }} />
                </colgroup>
                <tbody>
                    <tr>
                        <th>Service명</th>
                        <td>
                            <div className="ipt_group">
                                <span className="txt">{selectionItem.serviceName}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>Service Group</th>
                        <td>
                            <div className="ipt_group">
                                <span className="txt">{selectionItem.serviceGroupName}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>DAG ID</th>
                        <td>
                            <div className="ipt_group">
                                <span className="txt">{selectionItem.dagId}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>Model</th>
                        <td>
                            <div className="ipt_group">
                                <span className="txt">{selectionItem.modelName}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>Cycle</th>
                        <td>
                            <div className="ipt_group">
                                <span className="txt">{selectionItem.runCycle}</span>
                            </div>
                            <div className="font_gray">※ <a href="https://airflow.apache.org/docs/1.10.1/scheduler.html" rel="noopener noreferrer" target="_blank">{'Airflow Scheduling & Triggers'}</a></div>
                            <div className="font_gray">※ <a href="https://en.wikipedia.org/wiki/Cron#CRON_expression" rel="noopener noreferrer" target="_blank">CRON expression</a></div>
                        </td>
                    </tr>
                    <tr>
                        <th>Description</th>
                        <td style={{ textAlign: "right" }}>
                            <textarea ref="serviceDesc" rows="3" cols="100" maxLength="100" defaultValue={selectionItem.serviceDesc} disabled></textarea>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="popupBtnArea btn_area addbtnarea"><p className="btn2">
                <button className="btn btn_white" onClick={() => this.props.main.hidePopup(this.props.title)}>닫기</button>
            </p></div>
        </div>;
    }
}

export default ServiceDetail;