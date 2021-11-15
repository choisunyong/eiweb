import React , {Component}from 'react';

/**
 * Loading
 */
class Loading extends Component {
    render() {
        return <div className={"lds-ring"}><div></div><div></div><div></div><div></div></div>;
    }
}

export default Loading;