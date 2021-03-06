import http from "comp/http-common";

/**
 * 화면명 : 없음.
 * 화면 경로 : 없음.
 * 화면 코드 : 없음.
 * 참고 : 메인 관련 서비스 호출부분
 */
class MainService {
    /**
     * 로그인 요청
     * @param {String} id 아이디
     * @param {String} pw 비밀번호
     * @param {Function} resFn 결과 콜백 함수
     * @param {Function} errFn 실패 콜백 함수
     */
    login(id,pw,resFn,errFn) {
        let formData = new FormData();
        formData.append("username",id);
        formData.append("password",pw);
        return http.post("/login",formData)
            .then(function (res) {
                if (resFn) {
                    resFn(res.data);
                }
            })
            .catch(function (err) {
                if (errFn) {
                    errFn(err);
                }
            });
    }
    
    /**
     * 로그아웃 요청
     * @param {Function} resFn 결과 콜백 함수
     * @param {Function} errFn 실패 콜백 함수
     */
    logout(resFn, errFn) {
        return http.get("/logout").then(function(res) {
            if (resFn) {
                resFn(res.data);
            }
        }).catch(function(err) {
            if (errFn) {
                errFn(err);
            }
        })
    }
    
    /**
     * 로그인 여부 확인 요청
     * @param {String} sessionId 세션 아이디
     * @param {Function} resFn 결과 콜백 함수
     * @param {Function} errFn 실패 콜백 함수
     */
    chkLogin(sessionId, resFn, errFn) {
        let formData = new FormData();
        formData.append("sessionId",sessionId);
        return http.post("/chkLogin",formData)
            .then(function(res) {
                if (resFn) {
                    resFn(res.data);
                }
            }).catch(function(err) {
                if (errFn) {
                    errFn(err);
                }
            });
    }
    
    /**
     * 회원 가입 요청
     * @param {Object} parm 파라미터
     * @param {Function} resFn 결과 콜백 함수
     * @param {Function} errFn 실패 콜백 함수
     */
    signUp(parm, resFn, errFn) {
        let formData = new FormData();
        for (let v in parm) {
            formData.append(v,parm[v]);
        }
        return http.post("/signup",formData)
            .then(function (res) {
                if (resFn) {
                    resFn(res.data);
                }
            })
            .catch(function (err) {
                if (errFn) {
                    errFn(err);
                }
            });
    }
    
    /**
     * 아이디 중복 체크 요청
     * @param {Object} parm 파라미터
     * @param {Function} resFn 결과 콜백 함수
     * @param {Function} errFn 실패 콜백 함수
     */
    chkId(parm, resFn, errFn) {
        let formData = new FormData();
        for (let v in parm) {
            formData.append(v,parm[v]);
        }
        return http.post("/chkId",formData)
            .then(function (res) {
                if (resFn) {
                    resFn(res.data);
                }
            })
            .catch(function (err) {
                if (errFn) {
                    errFn(err);
                }
            });
    }
    
    /**
     * 공통코드 리스트 요청
     * @param {Function} resFn 결과 콜백 함수
     * @param {Function} errFn 실패 콜백 함수
     */
    commonCodeList(resFn, errFn) {
        let parm = {groupUseYn:'Y',useYn:'Y'};
        let formData = new FormData();
        for (let v in parm) {
            formData.append(v,parm[v]);
        }
        return http.post("/code/list",formData)
            .then(function (res) {
                if (resFn) {
                    resFn(res.data);
                }
            })
            .catch(function (err) {
                if (errFn) {
                    errFn(err);
                }
            });
    }
    
    /**
     * 비밀번호 변경 요청
     * @param {Object} parm 파라미터
     * @param {Function} resFn 결과 콜백 함수
     * @param {Function} errFn 실패 콜백 함수
     */
    changeUserPw(parm,resFn,errFn) {
        let formData = new FormData();
        for (let v in parm) {
            formData.append(v,parm[v]);
        }
        return http.post("/changeUserPw",formData)
            .then(function (res) {
                if (resFn) {
                    resFn(res.data);
                }
            })
            .catch(function (err) {
                if (errFn) {
                    errFn(err);
                }
            });
	}
}

export default new MainService();