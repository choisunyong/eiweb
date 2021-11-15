import React, { Component } from 'react';

/**
 * 화면명 : 메인 화면 경로
 * 화면 경로 : 없음.
 * 화면 코드 : 없음.
 * 참고 : 
 */
class MainPath extends Component {
  render() {
    const { paths, onClick } = this.props;
    let pathcomps = [];
    for (let i = 0; i < this.props.paths.length; i++) {
      if (i > 0) pathcomps.push(<label key={Math.random()}>&gt;</label>);
      pathcomps.push(<PathItem name={paths[i].name} menuCode={paths[i].menuCode} onClick={onClick} key={Math.random()} />);
    }
    return <div className="breadcrumb"><p className="inner">
      {pathcomps}
    </p></div>;
  }
}

class PathItem extends Component {
  render() {
    return <span>{this.props.name}</span>
  }
}

export default MainPath;