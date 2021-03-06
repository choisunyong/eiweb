import http from "comp/http-common";

/**
 * ModelService
 * use Example
 *  ModelService.list(function(res) {
    if (res.result === "ok") {
        // TODO :: success process
    }
    ,(err) => Msg.error(err.message));
 **/
class ModelService {
  /**
   * 모델 리스트
   * @param {Object} parm 
   * @param {Function} resFn 
   * @param {Function} errFn 
   */
  list(parm, resFn, errFn) {
    let formData = new FormData();
    for (let k in parm) {
      formData.append(k, parm[k]);
    }
    return http.post("/model/list", formData).then(function (res) {
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
   * 모델 등록2
   * @param {Object} parm 
   * @param {Function} resFn 
   * @param {Function} errFn 
   */
  regist(parm, resFn, errFn) { 
    let formData = new FormData();
    if (process.env.NODE_ENV === "development") {
      formData.append("developing", "true");
    }
    for (let k in parm) {
      formData.append(k, parm[k]);
    }
    return http.post("/model/regist", formData).then(function (res) {
      if (resFn) {
        resFn(res.data);
      }
    }).catch(function (err) {
      if (errFn) {
        errFn(err);
      }
    });
  }

  /**
   * 모델명 중복 체크
   * @param {Object} parm 
   * @param {Function} resFn 
   * @param {Function} errFn 
   */
  chkModelName(modelName, resFn, errFn) {
    let formData = new FormData();
    formData.append("modelName", modelName);
    return http.post("/model/chkModelName", formData).then(function (res) {
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
   * 모델닉 중복 체크
   * @param {Object} parm 
   * @param {Function} resFn 
   * @param {Function} errFn 
   */
  chkModelNick(modelNick, resFn, errFn) {
    let formData = new FormData();
    formData.append("modelNick", modelNick);
    return http.post("/model/chkModelNick", formData).then(function (res) {
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
   * 모델 정보
   * @param {Object} parm 
   * @param {Function} resFn 
   * @param {Function} errFn 
   */
  getModelInfo(modelId, resFn, errFn) {
    let formData = new FormData();
    formData.append("modelId", modelId);
    return http.post("/model/modelInfo", formData).then(function (res) {
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
   * 모델 정보(이력)
   * @param {Object} parm 
   * @param {Function} resFn 
   * @param {Function} errFn 
   */
  getModelHistInfo(parm, resFn, errFn) {
    let formData = new FormData();
    console.log(parm);
    formData.append("modelId", parm.modelId);
    formData.append("regDate", parm.regDate);
    return http.post("/model/modelHistInfo", formData).then(function (res) {
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
   * 모델 등록 이력 리스트
   * @param {Object} parm 
   * @param {Function} resFn 
   * @param {Function} errFn 
   */
  regHistory(parm, resFn, errFn) {
    let formData = new FormData();
    for (let k in parm) {
      formData.append(k, parm[k]);
    }
    return http.post("/model/regHistory", formData).then(function (res) {
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
   * 모델 평가
   * @param {Object} parm 
   * @param {Function} resFn 
   * @param {Function} errFn 
   */
  modelTestReq(modelId, resFn, errFn) {
    let formData = new FormData();
    formData.append("modelId", modelId);
    return http.post("/model/modelTestReq", formData).then(function (res) {
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
   * 모델 소스 파일 읽기
   * @param {String} parm 
   * @param {Function} resFn 
   * @param {Function} errFn 
   */
  getModelFile(modelId, resFn, errFn) {
    let formData = new FormData();
    formData.append("modelId", modelId);
    return http.post("/model/modelSourceView", formData).then(function (res) {
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

export default new ModelService();