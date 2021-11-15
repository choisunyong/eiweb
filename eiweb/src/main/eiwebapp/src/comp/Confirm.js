import React, { Component } from 'react';

/**
 * 화면명 : 확인 팝업
 * 화면 경로 : 확인 팝업
 * 화면 코드 : 
 * 참고 : 
 */
class Confirm extends Component {
    constructor(props) {
        super(props);
        this.onClose = this.onClose.bind(this);
        this.onOk = this.onOk.bind(this);
    }

    /**
     * 닫기 버튼 클릭 핸들러
     */
    onClose() {
        try {
            if (this.props.confirmCancelFn) this.props.confirmCancelFn();
        } catch (err) { console.log(err) }
        this.props.main.hideConfirm();
    }

    /**
     * 확인 버튼 클릭 핸들러
     */
    onOk() {
        try {
            if (this.props.confirmOkfn) this.props.confirmOkfn();
        } catch (err) { console.log(err) }
        this.props.main.hideConfirm();
    }

    render() {
        let {
            confirmMessage, okLabel, cancelLabel
        } = this.props;
        if (okLabel === undefined) okLabel = "확인";
        if (cancelLabel === undefined) cancelLabel = "닫기";
        let top = ((document.getElementById('root').clientHeight - (330)) / 2);
        return <div className="modal_wrapper">
            <div className="modal_content dialog_modal" style={{ top: top }}>
                <div className="modal_body">
                    <div className="msg">
                        <p className="txt t1">{confirmMessage}</p>
                    </div>
                </div>
                <div className="modal_footer" style={{ display: "flex" }}>
                    <a href={() => console.log('cancel')} className="btn btn_white" onClick={() => this.onClose()}>{cancelLabel}</a>
                    <a href={() => console.log('ok')} className="btn btn_black" onClick={() => this.onOk()} style={{ marginLeft: 7 }}>{okLabel}</a>
                </div>
            </div>
        </div>;
    }
}

export default Confirm;