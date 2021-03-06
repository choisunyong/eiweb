import http from "comp/http-common";

/**
 * ServiceService
 * use Example
 *  ServiceService.list(function(res) {
    if (res.result === "ok") {
        // TODO :: success process
    }
    ,(err) => Msg.error(err.message));
 **/
class ServiceService {
    list(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/service/list",formData)
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
    
    create(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        if (process.env.NODE_ENV === "development")
            formData.append("developing","true");// 로컬에서 개발중일때
        return http.post("/service/create",formData)
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
    
    chkServiceName(serviceName,resFn,errFn) {
        let formData = new FormData();
        formData.append("serviceName",serviceName);
        return http.post("/service/chkServiceName",formData).then(function (res) {
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
    
    getServiceInfo(serviceId,resFn,errFn) {
        let formData = new FormData();
        formData.append("serviceId",serviceId);
        return http.post("/service/serviceInfo",formData).then(function (res) {
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
    
    getServiceHistInfo(parm,resFn,errFn) {
        let formData = new FormData();
        formData.append("serviceId",parm.serviceId);
        return http.post("/service/serviceHistInfo",formData).then(function (res) {
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
    
    delete(serviceIds,resFn,errFn) {
        let formData = new FormData();
        formData.append("serviceIds",serviceIds);
        return http.post("/service/delete",formData).then(function (res) {
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
    
    kill(serviceId,resFn,errFn) {
        let formData = new FormData();
        formData.append("serviceId",serviceId);
        return http.post("/service/kill",formData).then(function (res) {
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

    play(dagId,resFn, errFn) {
        let formData = new FormData();
        formData.append("dagId", dagId);
        return http.post("/service/play", formData).then(function (res) {
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

export default new ServiceService();