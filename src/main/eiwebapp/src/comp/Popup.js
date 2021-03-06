import React,{Component} from 'react';
import Draggable from 'react-draggable';

/**
 * 공통 팝업
 */
class Popup extends Component {
    constructor(props) {
        super(props);
        this.state = {
            activeDrags: 0,
            deltaPosition: {
                x: 0, y: 0
            },
            controlledPosition: {
                x: -400, y: 200
            }
        };
        this.onStart = this.onStart.bind(this);
        this.onStop = this.onStop.bind(this);
        this.onClickOk = this.onClickOk.bind(this);
    }
    
    /**
     * 드래그 시작
     */
    onStart = () => {
        this.setState({activeDrags: ++this.state.activeDrags});
    };
    
    /**
     * 드래그 종료
     */
    onStop = () => {
        this.setState({activeDrags: --this.state.activeDrags});
    };
    
    /**
     * 확인 버튼 클릭 핸들러
     */
    onClickOk() {
        if (this.props.okFn)
            this.props.okFn();
        this.props.onClose();
    }
    
    render() {
        const {title, onClose} = this.props;
        let {opts,content} = this.props;
        if (opts === undefined) opts = {headerVisiable:true,popupBtnAreaVisible:true};
        let {headerVisiable,popupBtnAreaVisible, contentAppendClass} = opts;
        if (headerVisiable === undefined) headerVisiable = true;
        if (popupBtnAreaVisible === undefined) popupBtnAreaVisible = true;
        if (contentAppendClass === undefined) contentAppendClass = "model_content";
        let popupSty = {};
        let okLabel = "확인";
        let closeLabel = "취소";
        if (opts) {
            if (opts.width)
                popupSty.width = parseInt(String(opts.width).replace(/px/gi,""));
            if (opts.height) {
                popupSty.height = parseInt(String(opts.height).replace(/px/gi,""));
                // 가운데 위치
                try {
                    popupSty.top = ((document.getElementById('root').clientHeight - (popupSty.height+200)) / 2);
                } catch (err) {
                    console.log(err);
                }
            }
            if (opts.okLabel)
                okLabel = opts.okLabel;
            if (opts.closeLabel)
                closeLabel = opts.closeLabel;
        }
        // content가 JSX가 아닌 그냥 메세지 일때
        if ((typeof content) === "string") {
            content = <div className={"popupContent msg" + (popupBtnAreaVisible ? '' : ' addbtnarea')}><div className="content"><div>{content}</div></div></div>;
        } else {
            content = <div className={"popupContent" + (popupBtnAreaVisible ? '' : ' addbtnarea')}><div className="content">{content}</div></div>;
        }
        return <div className="modal_wrapper">
            <Draggable
                axis="both"
                handle=".popupHandler"
                defaultPosition={{x: 0, y: 0}}
                position={null}
                grid={[1, 1]}
                scale={1}
                onStart={this.onStart}
                // onDrag={this.handleDrag}
                onStop={this.onStop}>
            <div className={"modal_content popup " + contentAppendClass} style={popupSty}>
                <div className="popupHandler"></div>
                {headerVisiable ? <h2 className="modal_tit">{title}</h2> : null}
                {content}
                {popupBtnAreaVisible
                    ? <div className={"popupBtnArea btn_area"}><p className="btn2">
                        <button className="btn btn_white" onClick={onClose}>{closeLabel}</button>
                        <button className="btn btn_black" onClick={() => this.onClickOk()}>{okLabel}</button>
                    </p></div> : null}
                <button className="btn btn_close" onClick={onClose}><span className="hide">닫기</span></button>
            </div>
            </Draggable>
        </div>;
    }
}

export default Popup;