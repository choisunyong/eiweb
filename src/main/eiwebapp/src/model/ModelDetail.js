import React, { Component } from 'react';
import { CommonCode } from 'main';
import { Msg, common } from 'comp';
import { ModelService } from 'model';

/**
 * 모델 상세
 */
class ModelDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modelInfo: undefined,
            files: []
        };
        this.onResultInfo = this.onResultInfo.bind(this);
        this.onResultFileReq = this.onResultFileReq.bind(this);
    }

    componentDidMount() {
        this.props.main.showLoading();
        ModelService.getModelInfo(this.props.selectionItem.modelId, this.onResultInfo, (e) => console.log(e));
    }

    /**
     * 모델 정보 결과 핸들러
     * @param {Object} res 
     */
    onResultInfo(res) {
        this.props.main.hideLoading();
        if (res.result === "ok") {
            this.setState({ modelInfo: res.data.modelInfo, files: res.list });
        }
        else if (res.result === "fail") {
            Msg.error(res.message);
        }
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
     * 모델 소스 보기
     * @param {*} res
     * @param {String} modleId
     */
    onResultFileReq(res) {
        if (res.result === "ok") {
            this.props.main.showPopup(res.data.fileName, <textarea value={res.data.contents} style={{ height: '600px' }}></textarea>);
        }
        else if (res.result === "fail") {
            Msg.error(res.message);
        }
    }

    render() {
        let { modelInfo, files } = this.state;
        let modelFileItems = [];
        if (modelInfo === undefined) modelInfo = {};
        let itm;
        if (files.length < 1) {
            modelFileItems.push(<tr><td colSpan={4} style={{ textAlign: "center" }}><span className="font_gray">파일이 없습니다.</span></td></tr>);
        }
        for (let i = 0; i < files.length; i++) {
            itm = files[i];
            modelFileItems.push(<FileRow file={itm} />);
        }
        const optsPriority = CommonCode.getCodeSelectList("MODEL_PRIORITY", "value");
        let defaultValuePriority = undefined;
        for (let i = 0; i < optsPriority.length; i++) {
            if (optsPriority[i].value === String(modelInfo.priority)) {
                defaultValuePriority = optsPriority[i];
                break;
            }
        }

        return <div className="table_type2">
            <table>
                <tbody>
                    <tr>
                        <th>모델명</th>
                        <td>
                            <div className="ipt_group">
                                <span className="txt">{modelInfo.modelName}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>모델 파일</th>
                        <td>
                            <fieldset id="modelMain">
                                <table className="fileTable">
                                    <tr>
                                        <th>파일명</th>
                                        <th style={{ width: 80 }}>사이즈</th>
                                        <th style={{ width: 80 }}>타입</th>
                                    </tr>
                                    {modelFileItems}
                                </table>
                            </fieldset>
                        </td>
                    </tr>
                    <tr>
                        <th>Priority</th>
                        <td><span className="txt">{defaultValuePriority ? defaultValuePriority.label : ''}</span>
                        </td>
                    </tr>
                    <tr>
                        <th>Limit</th>
                        <td><div style={{ display: "flex", alignItems: "center" }}>
                            <span className="txt">{modelInfo.limitRuntime ? modelInfo.limitRuntime : '0'}</span>
                            <span className="font_gray" style={{ paddingLeft: 10 }}>분 (제한없는경우 0)</span>
                        </div></td>
                    </tr>
                    <tr>
                        <th>설명 (최대 100자)</th>
                        <td><textarea ref="modelDesc" rows="2" cols="100" maxLength="100" disabled defaultValue={modelInfo.modelDesc}>{modelInfo.modelDesc}</textarea></td>
                    </tr>
                    <tr>
                        <th>CPU Cores</th>
                        <td>
                            <div className="ipt_group">
                                <span className="txt">{modelInfo.cpuCores}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>Memory</th>
                        <td>
                            <div className="ipt_group">
                                <span className="txt">{modelInfo.mem}</span>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <th>수행시간</th>
                        <td>
                            <div className="ipt_group">
                                <span className="txt">{modelInfo.elapsed}</span>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
            <div className="popupBtnArea btn_area addbtnarea"><p className="btn2">
                <button className="btn btn_white" onClick={() => this.props.main.hidePopup(this.props.title)}>닫기</button>
                {this.props.sourceView===true ? (<button className="btn btn_blue" onClick={(e) => this.onClickFileReq(modelInfo)}>소스보기</button>) : null }
            </p></div>
        </div>;
    }
}

/**
 * 파일리스트 Row
 */
class FileRow extends Component {
    constructor(props) {
        super(props);
        this.state = {
            mainYn: "N"
        };
    }
    render() {
        const { file } = this.props;
        const { fileName, fileSize, fileExt } = file;
        return <tr>
            <td>{fileName}</td>
            <td>{common.getDisplFileSize(fileSize)}</td>
            <td>{fileExt && fileExt.length > 0 ? fileExt.toUpperCase() : ""}</td>
        </tr>;
    }
}

export default ModelDetail;
