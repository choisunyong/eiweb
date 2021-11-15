import React, {Component} from 'react';

/**
 * Message 팝업
 */
class Message extends Component {
    render() {
		let {okLabel, onClickOk} = this.props;
		if (okLabel === undefined) okLabel = "확인";
		let top = ((document.getElementById('root').clientHeight - (330)) / 2);
		return <div className="modal_wrapper">
			<div className="modal_content dialog_modal" style={{top:top}}>
				<div className="modal_body">
				<div className="msg">
					<p className="txt t1">{this.props.message}</p>
				</div>
				</div>
				<div className="modal_footer">
				<a className="btn btn_black" onClick={onClickOk}>{okLabel}</a>
				</div>
			</div>
		</div>;
    }
}

export default Message;