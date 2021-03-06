import React from 'react';
/**
 * Example
 * 
 * <Grid ref={'grid'} onClick={this.onClickGrid}
                    data={this.state.gridData}
                    columns={this.state.columns}
                    bodyHeight={this.state.bodyHeight}
                />
 * <Pagination ref={'page'}
                    page={this.state.pagesPage}
                    totalCount={this.state.pagesTotalCount}
                    perPage={this.state.pagesPerPage} pageCount={this.state.pagesPageCount}
                    onClickItem={this.onClickPageItem}/>


    constructor(props) {
        super(props);
        this.state = {
            listData:[],
            gridData:[],
            ...
            pagesPage:1,
            pagesTotalCount:0,
            pagesPerPage:5
        };
        this.onClickPageItem = this.onClickPageItem.bind(this);
    }
    onClickPageItem(page,startIdx,lastIdx) {
        let newGridData = [];
        for (let i=startIdx; i<lastIdx; i++) {
            newGridData.push(this.state.listData[i]);
        }
        this.setState({pagesPage:page,gridData:newGridData});
    }
 */
class Pagination extends React.Component {
    constructor(props) {
        super(props);
        this.onClickItem = this.onClickItem.bind(this);
        this.state = {
            firstPage:1,
            lastPage:10,
            pageCount:10
        };
    }
    
    onClickItem(page) {
        let {firstPage,pageCount} = this.state;
        const maxPage = parseInt(Math.ceil(this.props.totalCount / this.props.perPage));
        let movePage = (pageCount * parseInt(maxPage / pageCount))+1;
        if (movePage >= maxPage) {
            movePage = maxPage;
        }
        if (this.props.page === 1) {
            firstPage=1;
        }

        if (page === this.props.page) return;
        if (page === '<<') {
            this.setState({firstPage:1});
            this.props.onClickItem(1);
        } else if (page === '>>') {
            this.setState({firstPage:movePage});
            this.props.onClickItem(maxPage);
        } else if (page === '>') {
            this.setState({firstPage:firstPage + pageCount});
            this.props.onClickItem(firstPage + pageCount);
        } else if (page === '<') {
            this.setState({firstPage:firstPage - pageCount});
            this.props.onClickItem(firstPage - pageCount);
        } else{
            let realMovePage = page;
            if (realMovePage > maxPage) {
                realMovePage = maxPage;
            }
            this.props.onClickItem(realMovePage);
        }
    }
    
    render() {
        let {firstPage,pageCount} = this.state;
        if (this.props.pageCount && this.state.pageCount !== this.props.pageCount) 
            this.setState( {pageCount:this.props.pageCount} );
        
        const maxPage = parseInt(Math.ceil(this.props.totalCount / this.props.perPage));
        
        let pages = [];
        if (firstPage > maxPage || this.props.page === 1) {
            firstPage = 1;
        }
        let p=firstPage;
                
        if (this.props.totalCount === 0) {
            // ??????????????? ?????? ???
            pages.push(<PageItem page={1} index={0} activate={true} onClick={(e) => console.log(e)} key={Math.random()} />); 
        } else {
            // 1????????? ?????? ?????? ???
            for (let i = 0; i <this.props.totalCount; i += this.props.perPage) {
                if (p > pageCount && p === firstPage) {
                    if (p > pageCount*2) {
                        pages.push(<PageItem appendClass="first" page={'<<'} index={i} onClick={this.onClickItem} key={Math.random()} />);
                    }
                    pages.push(<PageItem appendClass="pre" page={'<'} index={i} onClick={this.onClickItem} key={Math.random()} />);
                }

                if (maxPage < p) break;
                
                if (p >= firstPage + pageCount) {
                    if (p === firstPage + pageCount) {
                        pages.push(<PageItem appendClass="next" page={'>'} index={i} onClick={this.onClickItem} key={Math.random()} />);
                        if (maxPage-firstPage > (pageCount*2)) {
                            pages.push(<PageItem appendClass="last" page={'>>'} index={i} onClick={this.onClickItem} key={Math.random()} />);
                        }
                        break;
                    } 
                }
                pages.push(<PageItem page={p} index={i} active={this.props.page === p} onClick={this.onClickItem} key={Math.random()} />);
                p++;
            }
        }

        // if (pages.length < 1) pages.push(<PageItem page={1} index={0} active={true} onClick={(e) => console.log(e)} key={Math.random()}/>);

        return <div className={'pages'}>
            {pages}
        </div>
    }
}

class PageItem extends React.Component {
    render() {
        let {appendClass} = this.props;
        const {active, onClick, page} = this.props;
        if (appendClass === undefined )
            appendClass = "";
        return <div className={'pageItem' + (active ? ' active' : '') + " " + appendClass} onClick={(e) => onClick(page)}>{page}</div>
    }
}

export default Pagination;