import { MenuCode } from 'main';
import {Component} from 'react';

class MenuData extends Component {
    constructor(props) {
        super(props);
        this.getPaths = this.getPaths.bind(this);
        this.getMenuMap = this.getMenuMap.bind(this);
    }
    
    /* 홈 */
    home = [
        {menuCode:MenuCode.DASHBOARD, menu:"Dashboard", paths:["Dashboard",MenuCode.DASHBOARD]} //DashBoard
    ];
    
    /* Model */
    model = [];
    
    /* Service */
    service = [
        {menuCode:MenuCode.SERVICE_MANAGER, menu:"Service Management", paths:["Service",MenuCode.SERVICE_MANAGER]}
        ,{menuCode:MenuCode.ADMIN_HIST_SERVICEEXEC, menu:"Service History", paths:["Service",MenuCode.ADMIN_HIST_SERVICEEXEC]}
    ];
    
    /* 관리자 */
    admin = [
        {menuCode:MenuCode.ADMIN_USERMGR, menu:"User Managerment", paths:["Admin",MenuCode.ADMIN_USERMGR]}
        ,{menuCode:MenuCode.ADMIN_HIST_LOGIN, menu:"Login History", paths:["Admin",MenuCode.ADMIN_HIST_LOGIN]}
        ,{menuCode:MenuCode.ADMIN_HIST_MODELREG, menu:"Model History", paths:["Admin",MenuCode.ADMIN_HIST_MODELREG]}
        ,{menuCode:MenuCode.ADMIN_HIST_SCALEINOUT, menu:"Resource History", paths:["Admin",MenuCode.ADMIN_HIST_SCALEINOUT]}
        ,{menuCode:MenuCode.ADMIN_SACLEINOUTMGR, menu:"Scale In/Out Management", paths:["Admin",MenuCode.ADMIN_SACLEINOUTMGR]}
        ,{menuCode:MenuCode.ADMIN_SERVICEGROUP, menu:"Service Group Management", paths:["Admin",MenuCode.ADMIN_SERVICEGROUP]}
        ,{menuCode:MenuCode.ADMIN_COMMONCODE, menu:"Common Code", paths:["Admin",MenuCode.ADMIN_COMMONCODE]}
    ];

    // 메뉴 맵 {}
    map = null;

    /**
     * 메뉴 경로 반환
     * @param {String} menuCode 메뉴 코드
     * @return {Array} 메뉴경로
     */
    getPaths(menuCode) {
        let m = this.getMenuMap();
        let paths;
        let ret = [];
        if (menuCode === MenuCode.DASHBOARD)   // DashBoard
            ret.push( {name:"Dashboard", menuCode:menuCode} );
        else if (menuCode === MenuCode.MODEL_MANAGER)   // Model
            ret.push( {name:"Model", menuCode:menuCode} );
        if (m[menuCode] !== null && m[menuCode] !== undefined) {
            paths = m[menuCode]["paths"];
            for (let i=0; i<paths.length; i++) {
                try {
                    if (paths[i].indexOf("MENU") > -1) {
                        ret.push( {name:m[paths[i]].menu, menuCode:paths[i]} );
                    } else {
                        ret.push( {name:paths[i]} );
                    }
                } catch (err) {}
            }
        }
        return ret;
    }

    /**
     * 메뉴 맵 데이터 생성 / 반환
     * @return {Object} menuMap {(MENUCODE):{menuCode,menu(메뉴명),paths:[(경로)]}}
     */
    getMenuMap() {
        if (this.map !== null) return this.map;
        let map = {};
        let i;
        let itm;
        let iitm;
        for (i=0; i<this.model.length; i++) {
            itm = this.model[i];
            if (map[itm.menuCode] === null || map[itm.menuCode] === undefined) {
                map[itm.menuCode] = itm;
            }
        }
        for (i=0; i<this.service.length; i++) {
            itm = this.service[i];
            if (map[itm.menuCode] === null || map[itm.menuCode] === undefined) {
                map[itm.menuCode] = itm;
            }
        }
        for (i=0; i<this.admin.length; i++) {
            itm = this.admin[i];
            if (map[itm.menuCode] === null || map[itm.menuCode] === undefined) {
                map[itm.menuCode] = itm;
            }
            if (itm.children && itm.children.length > 0) {
                for (i=0; i<itm.children.length; i++) {
                    iitm = itm.children[i];
                    if (map[iitm.menuCode] === null || map[iitm.menuCode] === undefined) {
                        map[iitm.menuCode] = iitm;
                    }
                }
            }
        }
        this.map = map;
        return map;
    }
}

export default new MenuData();