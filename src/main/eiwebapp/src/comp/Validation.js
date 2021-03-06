import React from 'react';

class Validation extends React.Component {
    constructor(props) {
        super(props);
        this.chkPhone = this.chkPhone.bind(this);
        this.chkEmail = this.chkEmail.bind(this);
        this.chkId = this.chkId.bind(this);
        this.chkPw = this.chkPw.bind(this);
        this.chkNumber = this.chkNumber.bind(this);
        this.filterSchKeyword = this.filterSchKeyword.bind(this);
    }

    // 숫자만 체크 정규식
    /* eslint-disable */
    numberExp = /^[0-9]+$/;

    // 이메일 체크 정규식
    /* eslint-disable */
    emailExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    // 일반 전화번호 정규식
    /* eslint-disable */
    telNoExp = /^\d{2,3}-\d{3,4}-\d{4}$/;

    // 아이디나 비밀번호 정규식
    /* eslint-disable */
    idExp = /^[a-z0-9_]{4,20}$/;

    // 비밀번호 정규식 : 영문자,특수문자 조합 4자리에서 12자리 이하
    /* eslint-disable */
    pwExp = /^(?=.*[~`!@#$%\\^&*()-])(?=.*[a-zA-Z]).{4,12}$/;

    // 숫자,영소문자,영대문자,특수문자 조합된 4자리이상 12자리 이하
    // /^(?=.*[0-9])(?=.*[~`!@#$%\\^&*()-])(?=.*[a-z])(?=.*[A-Z]).{4,12}$/
    // 휴대폰번호 체크 정규식
    /* eslint-disable */
    phoneExp = /^01([0|1|6|7|8|9])-?([0-9]{3,4})-?([0-9]{4})$/;
    // phoneNoExp = /^\d{3}-\d{3,4}-\d{4}$/;

    // 모델명
    /* eslint-disable */
    modelNameExp=/^[가-힣a-zA-Z-_0-9 ]{1,50}$/;

    // 모델 닉네임
    /* eslint-disable */
    modelNickExp=/^[a-z_]{1,10}$/;

    // Service명
    /* eslint-disable */
    serviceNameExp=/^[가-힣a-zA-Z-_0-9 ]{1,50}$/;
    // 자원 그룹명
    /* eslint-disable */
    resourceGroupNameExp=/^[가-힣a-zA-Z-_0-9 ]{1,20}$/;
    // 서비스 그룹명
    /* eslint-disable */
    serviceGroupNameExp=/^[가-힣a-zA-Z-_0-9 ]{1,50}$/;
    // 서비스 DAG ID
    /* eslint-disable */
    serviceDagIdExp=/^[a-zA-Z_0-9]{1,30}$/;

    // 검색어에 특수문자 제거하기위한 정규식
    /* eslint-disable */
    searchExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
    
    // 공통 코드
    /* eslint-disable */
    commCodeExp = /^[a-zA-Z_0-9]{2,30}$/;

    chkTelNo(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.telNoExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "전화번호 형식에 맞지 않습니다";
        return ret;
    }

    chkPhone(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.phoneExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "휴대번호 형식에 맞지 않습니다";
        return ret;
    }

    chkEmail(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.emailExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "이메일 형식에 맞지 않습니다";
        return ret;
    }

    chkId(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.idExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "아이디 형식에 맞지 않습니다";
        return ret;
    }

    chkPw(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.pwExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "비밀번호 형식에 맞지 않습니다";
        return ret;
    }

    chkNumber(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.numberExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "숫자가 아닙니다.";
        return ret;
    }

    chkModelName(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.modelNameExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "모델명 형식에 맞지 않습니다";
        return ret;
    }
    chkModelNick(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.modelNickExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "모델 닉네임 형식에 맞지 않습니다";
        return ret;
    }

    chkServiceName(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.serviceNameExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "Service명 형식에 맞지 않습니다";
        return ret;
    }

    chkResourceGroupName(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.resourceGroupNameExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "자원 그룹명 형식에 맞지 않습니다";
        return ret;
    }

    chkCommonCode(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.commCodeExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "공통코드 형식에 맞지 않습니다";
        return ret;
    }

    filterSchKeyword(chkVal) {
        if (!this.searchExp.test(chkVal))
            return chkVal;
        return chkVal.replace(this.searchExp,"");
    }

    chkServiceGroupName(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.serviceGroupNameExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "서비스 그룹명 형식에 맞지 않습니다";
        return ret;
    }

    chkServiceDagIdExp(chkVal) {
        let ret = {result:true, errMsg:""};
        let chk = this.serviceDagIdExp.test(chkVal);
        ret.result = chk;
        if (!chk) ret.errMsg = "DAG ID 형식에 맞지 않습니다";
        return ret;
    }

}

export default new Validation();
