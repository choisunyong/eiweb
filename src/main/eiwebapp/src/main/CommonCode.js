import React,{Component} from 'react';

/**
 * 화면명 : 공통 코드 관련 유틸
 * 화면 경로 :
 * 화면 코드 :
 * 참고 : 
 */
class CommonCode extends Component {
    data = [];
    map = {};

    /**
     * 공통 코드 메모리 저장
     * @param {Object} data {groupCode,code,value}
     */
    setData(data) {
        let itm;
        for (let i=0; i<data.length; i++) {
            itm = data[i];
            if (!this.map[itm.groupCode])
                this.map[itm.groupCode] = [];
            this.map[itm.groupCode].push(itm);
        }
    }
    
    /**
     * 공통코드 Value값 반환
     * @param {String} groupCode 그룹 코드
     * @param {String} commonCode 코드
     * @return {String} Value값
     */
    getValue(groupCode,commonCode) {
        let ret = undefined;
        const arr = this.map[groupCode];
        if (arr && arr.length > 0) {
            for (let i=0;i<arr.length;i++) {
                if (arr[i].code === commonCode)
                    ret = arr[i].value;
            }
        } else {
            return undefined;
        }
        return ret;
    }
    
    /**
     * select에 셋팅할 option 리스트 반환
     * @param {String} groupCode 그룹 코드
     * @param {String} valueKey [value로 설정할 키값]
     * @param {String} labelKey [label로 설정할 키값]
     * @param {*} selectedValue [선택값]
     * @param {Boolean} allFlag [All option 추가여부]
     * @param {String} allLabel [All 대신 보여줄 라벨]
     * @return {Array} [<option />,<option />...]
     */
    makeOptions(groupCode, valueKey, labelKey, selectedValue, allFlag, allLabel) {
        if (!valueKey) valueKey = "code";
        if (!labelKey) labelKey = "codeName";
        let opts = [];
        if (allFlag) {
            if (!allLabel) allLabel = "All";
            opts.push( <option value="all" key={Math.random()} >{allLabel}</option> );
        }
        const arr = this.map[groupCode];
        if (arr === null || arr === undefined) arr = [];
        for (let i=0; i<arr.length; i++) {
            if (groupCode == 'SCALE_IN_OUT_LIST' && i == 0) continue;
            opts.push( <option value={arr[i][valueKey]} key={Math.random()} selected={arr[i][valueKey] === String(selectedValue)}>{arr[i][labelKey]}</option> );
        }
        return opts;
    }
    
    /**
     * select에 셋팅할 option data 반환
     * @param {String} groupCode 그룹 코드
     * @param {String} valueKey value로 설정할 키값
     * @param {String} labelKey label로 설정할 키값
     * @return {Array} [{label,value}...]
     */
    getCodeSelectList(groupCode, valueKey, labelKey) {
        if (!valueKey) valueKey = "code";
        if (!labelKey) labelKey = "codeName";
        let ret = [];
        const arr = this.map[groupCode];
        for (let i=0; i<arr.length; i++) {
            ret.push( {label:arr[i][labelKey],value:arr[i][valueKey]} );
        }
        return ret;
    }
    
    /**
     * 공통 코드 리스트 반환
     * @param {String} groupCode 
     * @return {Array} 코드 리스트
     */
    getCodeList(groupCode) {
        return this.map[groupCode];
    }
}

export default new CommonCode();