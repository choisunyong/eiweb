import http from "comp/http-common";
// import airflow from "comp/http-airflow";

class DashboardService {
    /**
     * 대시보드 자원관련 데이터
     * @param {Object} parm 파라미터
     * @param {Funtion} resFn 결과 핸들러
     * @param {Function} errFn 에러 핸들러
     */
    dashboardResourceData(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/dashboard/dashboardResourceData",formData)
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
     * 대시보드 서비스 관련 데이터
     * @param {Object} parm 파라미터
     * @param {Funtion} resFn 결과 핸들러
     * @param {Function} errFn 에러 핸들러
     */
    dashboardServiceData(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/dashboard/dashboardServiceData",formData)
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
     * 실시간 데이터
     * @param {Object} parm 파라미터
     * @param {Funtion} resFn 결과 핸들러
     * @param {Function} errFn 에러 핸들러
     */
    dashboardRealData(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/dashboard/dashboardRealData",formData)
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
     * 실시간 데이터2
     * @param {Object} parm 파라미터
     * @param {Funtion} resFn 결과 핸들러
     * @param {Function} errFn 에러 핸들러
     */
    dashboardRealData2(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/dashboard/dashboardRealData2",formData)
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

export default new DashboardService();