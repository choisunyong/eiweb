import React from 'react';
import { common } from 'comp';

/**
 * 공통 메세지
 */
class Msg extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            option:{
                position: "top-right",
                autoClose: 4000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: true,
                progress: undefined
            }
        }
        this.ok = this.ok.bind(this);
        this.info = this.info.bind(this);
        this.warn = this.warn.bind(this);
        this.error = this.error.bind(this);
        this.msg = this.msg.bind(this);
        this.setUserOption = this.setUserOption.bind(this);
    }
    
    setUserOption(opts,useropts) {
        if (!useropts) return opts;

        if (useropts.position)
            opts.position = useropts.position;
        if (useropts.autoClose)
            opts.autoClose = useropts.autoClose;
        if (useropts.hideProgressBar)
            opts.hideProgressBar = useropts.hideProgressBar;
        if (useropts.closeOnClick)
            opts.closeOnClick = useropts.closeOnClick;
        if (useropts.pauseOnHover)
            opts.pauseOnHover = useropts.pauseOnHover;
        if (useropts.draggable)
            opts.draggable = useropts.draggable;
        if (useropts.progress)
            opts.progress = useropts.progress;
        return opts;
    }
    
    ok(msg,useropt) {
        if (process.env.NODE_ENV === "development") {
            console.log(common.main);
            console.log(">> msg type : ok");
            console.log(msg);
        }
        msg = this.shutMsg(msg);
        common.main.msg(msg);
        // let opt = this.state.option;
        // opt = this.setUserOption(opt,useropt);
        // opt.autoClose = 4000;
        // toast.success(msg, opt);
    }
    
    info(msg,useropt) {
        if (process.env.NODE_ENV === "development") {
            console.log(common.main);
            console.log(">> msg type : ok");
            console.log(msg);
        }
        msg = this.shutMsg(msg);
        common.main.msg(msg);
        // let opt = this.state.option;
        // opt = this.setUserOption(opt,useropt);
        // opt.autoClose = 4000;
        // toast.info(msg, opt);
    }
    
    warn(msg,useropt) {
        if (process.env.NODE_ENV === "development") {
            console.log(common.main);
            console.log(">> msg type : ok");
            console.log(msg);
        }
        msg = this.shutMsg(msg);
        common.main.msg(msg);
        // let opt = this.state.option;
        // opt = this.setUserOption(opt,useropt);
        // opt.autoClose = 4000;
        // toast.warn(msg, opt);
    }
    
    error(msg,useropt) {
        if (process.env.NODE_ENV === "development") {
            console.log(common.main);
            console.log(">> msg type : ok");
            console.log(msg);
        }
        msg = this.shutMsg(msg);
        common.main.msg(msg);
        // let opt = this.state.option;
        // opt = this.setUserOption(opt,useropt);
        // opt.autoClose = 4000;
        // toast.error(msg, opt);
    }
    
    msg(msg,useropt) {
        if (process.env.NODE_ENV === "development") {
            console.log(common.main);
            console.log(">> msg type : ok");
            console.log(msg);
        }
        msg = this.shutMsg(msg);
        common.main.msg(msg);
        // let opt = this.state.option;
        // opt = this.setUserOption(opt,useropt);
        // opt.autoClose = 4000;
        // toast(msg, opt);
    }
    
    shutMsg(msg) {
        const maxLen = 40;
        if (msg.length > maxLen)
            msg = msg.substr(0,maxLen) + "...";
        return msg;
    }
}

export default new Msg();