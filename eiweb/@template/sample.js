import React, {Component} from 'react';
import {Msg} from 'comp';
import Msg2 from 'comp/Msg';

class Sample extends Component {
    constructor(props) {
        this.state = {
            state1:"sample",
            state2:[
                {key:"key",value:"value"}
            ],
            state3:undefined
        };
        this.test = this.test.bind(this);
    }
    /**
     * 화면 구성후
     */
    componentDidMount() {
        this.test();
    }
    // 화면 업데이트 될때마다
    componentDidUpdate() {}
    /**
     * 화면 제거전
     */
    componentWillUnmount() {
        console.log("render 실행전");
    }
    // 테스트 함수
    test() {
        console.log(this.props);
        console.log(this.state);
        console.log("Testing...");
        this.setState({state3:"state3value"});
    }
    /**
     * 화면 구성
     */
    render() {
        const {prop1} = this.props;         // <Sample prop1={"propvalue"}/>
        const {state1,state2,state3} = this.state;

        console.log(state1);
        console.log(this.state.state1);

        this.test();
    return <div className="testclass" style={{paddingTop:10}}>      {/* class="testclass" style="padding-top:10px" */}
            {prop1} / 
            {state1} /
            {state2.length} /
            {state3 === undefined ? 'state3 is null' : state3} /
        </div>;
    }
    /* output
    <div>propvalue / sample / 1 / state3 is null
    */
}

export default Sample;