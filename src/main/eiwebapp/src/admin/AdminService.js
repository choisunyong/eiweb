import http from "comp/http-common";
// import airflow from "comp/http-airflow";

class AdminService {
    /**
     * 사용자 로그인 이력
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    userLoginHistory(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/userLoginHistory",formData)
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
     * 아이디 찾기
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    searchId(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/searchId",formData)
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
     * 비밀번호 찾기
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    searchPw(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/searchPw",formData)
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
     * 사용자 리스트
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    userList(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/userList",formData)
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
     * 사용자 저장
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    save(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/save",formData)
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
     * Service 저장 이력
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    serviceCreHistory(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/serviceCreHistory",formData)
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
     * Service 실행 이력
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    serviceExecHistory(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/serviceExecHistory",formData)
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
     * REST 실행 이력 리스트
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    restExecHistory(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/restExecHistory",formData)
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
     * 자원 그룹 리스트
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    resourceGroupList(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/resourceGroupList",formData)
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
     * Scale In/Out 이력 리스트
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    scaleHistory(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/scaleHistory",formData)
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
     * 자원 그룹 생성
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    createResourceGroup(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        if (process.env.NODE_ENV === "development")
            formData.append("developing","true");// 로컬에서 개발중일때
        return http.post("/admin/createResourceGroup",formData)
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
     * 자원 그룹 정보
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    resourceGroupInfo(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/resourceGroupInfo",formData)
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
     * 자원 그룹 삭제
     * @param {String} resourceIds 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    deleteResourceGroup(resourceIds,resFn,errFn) {
        let formData = new FormData();
        formData.append("resourceIds",resourceIds);
        return http.post("/admin/deleteResourceGroup",formData).then(function (res) {
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
    
    // dagRuns(parm,resFn,errFn) {
    //     let formData = new FormData();
    //     for (let k in parm) {
    //         formData.append(k,parm[k]);
    //     }
    //     return airflow.post("/api/experimental/dags/tutorial/dag_runs",formData).then(function (res) {
    //         if (resFn) {
    //             resFn(res.data);
    //         }
    //     })
    //     .catch(function (err) {
    //         if (errFn) {
    //             errFn(err);
    //         }
    //     });
    // }
    
    /**
     * Scale In/Out 요청
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    scaleInOut(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        let url = "/admin/scale";
        if (parm.req_type === "user_start")
            url += "Out";
        else if (parm.req_type === "user_stop")
            url += "In";
        if (process.env.NODE_ENV === "development")
            formData.append("developing","true");// 로컬에서 개발중일때
        return http.post(url,formData).then(function (res) {
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
     * 장비 리스트
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    deviceList(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            if (parm[k])
                formData.append(k,parm[k]);
        }
        let url = "/admin/deviceList";
        if (process.env.NODE_ENV === "development")
            formData.append("developing","true");// 로컬에서 개발중일때
        return http.post(url,formData).then(function (res) {
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
     * 공통 코드 그룹 리스트
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    commonGroupList(resFn,errFn) {
        let formData = new FormData();
        const parm = {};
        for (let k in parm) {
            if (parm[k])
                formData.append(k,parm[k]);
        }
        return http.post("/code/groupList",formData).then(function (res) {
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
     * 공통 코드 리스트
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    commonCodeList(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            if (parm[k])
                formData.append(k,parm[k]);
        }
        return http.post("/code/list",formData).then(function (res) {
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
     * 공통 코드 그룹 저장
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    saveCodeGroup(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            if (parm[k])
                formData.append(k,parm[k]);
        }
        return http.post("/code/saveCodeGroup",formData).then(function (res) {
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
     * 공통 코드 저장
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    saveCode(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            if (parm[k])
                formData.append(k,parm[k]);
        }
        return http.post("/code/saveCode",formData).then(function (res) {
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
     * 공통 코드 그룹 삭제
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    deleteCodeGroup(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            if (parm[k])
                formData.append(k,parm[k]);
        }
        return http.post("/code/deleteCodeGroup",formData).then(function (res) {
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
     * 공통 코드 삭제
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    deleteCode(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            if (parm[k])
                formData.append(k,parm[k]);
        }
        return http.post("/code/deleteCode",formData).then(function (res) {
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
     * Service Group 리스트
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    serviceGroupList(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/serviceGroupList", formData)
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
     * Service Group 정보
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    serviceGroupInfo(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/serviceGroupInfo",formData)
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
     * Service Group 저장
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    createServiceGroup(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        if (process.env.NODE_ENV === "development")
            formData.append("developing","true");// 로컬에서 개발중일때
        return http.post("/admin/createServiceGroup",formData)
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
     * Service Group Name 중복 체크
     * @param {String} serviceGroupoName 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    chkServiceGroupName(serviceGroupoName,resFn,errFn) {
        let formData = new FormData();
        formData.append("serviceGroupName",serviceGroupoName);
        return http.post("/admin/chkServiceGroupName",formData).then(function (res) {
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
     * Service Group 삭제
     * @param {String} serviceGroupNames 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    deleteServiceGroup(serviceGroupNames,resFn,errFn) {
        let formData = new FormData();
        formData.append("serviceGroupNames",serviceGroupNames);
        return http.post("/admin/deleteServiceGroup",formData).then(function (res) {
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
     * Service 실행 이력 결과
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    serviceExecHistoryResult(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/serviceExecHistoryResult",formData)
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
     * Scale Out Rule 저장
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    saveScaleOutRule(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/saveScaleOutRule",formData)
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
     * Scale Out Rule 데이터 가져오기
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    scaleInOutRuleInfo(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/scaleInOutRuleInfo",formData)
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
     * Scale Out Rule 저장
     * @param {Object} parm 
     * @param {Function} resFn 
     * @param {Function} errFn 
     */
    saveScaleInOutRule(parm,resFn,errFn) {
        let formData = new FormData();
        for (let k in parm) {
            formData.append(k,parm[k]);
        }
        return http.post("/admin/saveScaleInOutRule",formData)
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

    deleteUser(userId, resFn,errFn) {
        let formData = new FormData();
        formData.append("userId",userId);
        return http.post("/admin/deleteUser", formData).then(function (res){
            if (resFn) {
                resFn(res.data);
            }
        }).catch(function (err) {
            if (errFn) {
                errFn(err);
            }
        });
    }
}

export default new AdminService();