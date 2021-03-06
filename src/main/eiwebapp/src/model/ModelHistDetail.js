import React, { Component } from 'react';
import { ModelService } from 'model';
import { common, Msg } from 'comp';
import { CommonCode } from 'main';

/**
 * 화면명 : 이력 모델 상세
 * 화면 경로 : 모델 > 모델 관리 > 모델 상세
 * 화면 코드 : 
 * 참고 : 모델 관리 화면에서 사용하는 등록 화면
 */
class ModelHistDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            modelInfo: undefined,
            files: []
        };
        this.onResultInfo = this.onResultInfo.bind(this);
    }

    componentDidMount() {
        this.props.main.showLoading();
        ModelService.getModelHistInfo(this.props.selectionItem, this.onResultInfo, (e) => this.props.main.hideLoading());
    }

    onResultInfo(res) {
        this.props.main.hideLoading();
        console.log(res.data);
        if (res.result === "ok") {
            this.setState({ modelInfo: res.data.modelInfo, files: res.list });
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
                        <td><span className="txt">{modelInfo.priorityNm}</span>
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
                        <th>설명</th>
                        <td><textarea ref="modelDesc" rows="2" cols="100" maxLength="100" disabled defaultValue={modelInfo.modelDesc}>{modelInfo.modelDesc}</textarea></td>
                    </tr>
                </tbody>
            </table>
            <div className="popupBtnArea btn_area addbtnarea"><p className="btn2">
                <button className="btn btn_white" onClick={() => this.props.main.hidePopup(this.props.title)}>닫기</button>
            </p></div>
        </div>;
    }
}

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

export default ModelHistDetail;