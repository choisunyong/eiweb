import React, { Component } from 'react';
import { DashboardService } from 'dashboard';
import { Msg, GridList, common } from 'comp';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Legend, Tooltip, PieChart, Pie, Cell } from 'recharts';
import ScaleInOutGrid from './ScaleInOutGrid';

/**
 * 화면명 : Dashboard
 * 화면 경로 : Dashboard
 * 화면 코드 : MENU001
 * 참고 : 
 */
class Dashboard extends Component {
  timerID;
  timer2ID;
  constructor(props) {
    super(props);
    this.state = {
      serviceExecHistoryColumns: [],
      serviceExecSummColumns: [
        { name: "serviceGroupName", header: "Service Group", width: 100 },
        { name: "serviceCount", header: "Service", width: 80 },
        { name: "execCount", header: "Execution", width: 80 },
        { name: "success", header: "Success", width: 80 },
        { name: "fail", header: "Fail", width: 80 }
      ],
      serviceExecStatusForToday: [],
      serviceTodayExecSummForGroup: {},
      serviceTotalExecSummForGroup: {},
      serviceExecHistory: [],
      serviceExecSummListForGroup: [],
      scaleInOutSummary: [],
      containerInfo: {},
      cpuAvgList: [],
      cpuSummListForDay: [],
      cpuSummListForMonth: [],
      cpuSummListForHour: [],
      cpuAvgListForHour: [],
      todayCpuAvg: 0,
      serverNames: [],
      cpuSummList: undefined,
      cpuSummType: undefined
    }
    this.onResultResourceData = this.onResultResourceData.bind(this);
    this.onResultServiceData = this.onResultServiceData.bind(this);
    this.onTimerDashboard = this.onTimerDashboard.bind(this);
    this.onTimerDashboard2 = this.onTimerDashboard2.bind(this);
    this.onResultRealData = this.onResultRealData.bind(this);
    this.onResultRealData2 = this.onResultRealData2.bind(this);
    this.onClickTab = this.onClickTab.bind(this);
  }

  componentDidMount() {
    this.props.main.showLoading();
    DashboardService.dashboardServiceData({}, this.onResultServiceData, (err) => Msg.error(err.message));
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
    clearInterval(this.timer2ID);
  };

  /**************************************************************************/
  /* 기능 */
  /**************************************************************************/
  /**
   * 실시간 데이터 요청 타이머 핸들러(3초)
   */
  onTimerDashboard() {
    DashboardService.dashboardRealData({}, this.onResultRealData, (err) => Msg.error(err.message));
  }
  /**
   * 실시간 데이터 요청 타이머 핸들러(30초)
   */
  onTimerDashboard2() {
    DashboardService.dashboardRealData2({}, this.onResultRealData2, (err) => Msg.error(err.message));
  }

  /**************************************************************************/
  /* 핸들러 */
  /**************************************************************************/
  /**
   * 대시보드 리소스 데이터 결과 핸들러
   * @param {Object} res {result:ok|fail,data:{
   * 							scaleInOutSummary:Scale In/Out 최근 일주일,
   * 							containerInfo:Container 현황,
   * 							cpuAvgList:최근 CPU 데이터,
   * 							cpuSummListForDay:CPU 이번달 일자별 현황,
   * 							cpuSummListForMonth:CPU 이번달 현황,
   * 							cpuSummListForHour:CPU 금일 시간별 현황,
   * 							todayCpuAvg:금일 현재 CPU 평균,
   * 							serverNames:서버명 리스트(차트 라인을 동적으로 만들기위해)
   * 						}}
   */
  onResultResourceData(res) {
    this.props.main.hideLoading();
    if (res.result === "ok") {
      let {
        scaleInOutSummary,
        containerInfo,
        cpuAvgList,
        cpuSummListForDay,
        cpuSummListForMonth,
        cpuAvgListForHour,
        cpuSummListForHour,
        todayCpuAvg,
        serverNames
      } = res.data;
      let i;
      let itm;
      for (i = 0; i < cpuSummListForHour.length; i++) {
        itm = cpuSummListForHour[i];
        for (let j = 0; j < serverNames.length; j++) {
          itm[serverNames[j]] = parseFloat(itm[serverNames[j]]);
        }
      }
      /* 데이터를 float 형식으로 변환 */
      cpuSummListForDay = cpuSummListForDay.map(day => {
        Object.keys(day).forEach(key => {
          if (key !== 'receiveDate') {
            day[key] = parseFloat(day[key])
          }
        })
        return day;
      })
      cpuSummListForMonth.map(month => {
        Object.keys(month).forEach(key => {
          if (key !== 'receiveDate') {
            month[key] = parseFloat(month[key])
          }
        })
        return month;
      })
      cpuSummListForHour.map(hour => {
        Object.keys(hour).forEach(key => {
          if (key !== 'receiveDate') {
            hour[key] = parseFloat(hour[key])
          }
        })
        return hour;
      })
      this.setState({
        scaleInOutSummary: scaleInOutSummary,
        containerInfo: containerInfo,
        cpuAvgList: cpuAvgList,
        cpuSummListForDay: cpuSummListForDay,
        cpuSummListForMonth: cpuSummListForMonth,
        cpuSummListForHour: cpuSummListForHour,
        cpuAvgListForHour: cpuAvgListForHour,
        todayCpuAvg: todayCpuAvg === undefined || (todayCpuAvg !== undefined && todayCpuAvg.cpuAverage === undefined) ? 0 : todayCpuAvg.cpuAverage,
        serverNames: serverNames
      });
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }

    // 실시간 데이터 요청 실행
    this.timerID = setInterval(() => this.onTimerDashboard(), 3000);		//3초
    this.timer2ID = setInterval(() => this.onTimerDashboard2(), 30000);	//30초
  }

  /**
   * 대시보드 서비스 데이터 결과 핸들러
   * @param {Object} res {result:ok|fail,data:{
   * 							serviceExecStatusForToday:금일 시간대별 서비스 실행 현황,
   * 							serviceExecHistory:금일 서비스 실행 이력 리스트,
   * 							serviceTodayExecSummForGroup:금일 서비스 실행 현황,
   * 							serviceTotalExecSummForGroup:전체 서비스 실행 현황,
   * 							serviceExecSummListForGroup:그룹별 서비스 실행 현황 리스트
   * 						}}
   */
  onResultServiceData(res) {
    this.props.main.hideLoading();
    if (res.result === "ok") {
      // console.log(res.data);
      const {
        serviceExecStatusForToday,
        serviceTodayExecSummForGroup,
        serviceTotalExecSummForGroup,
        serviceExecHistory,
        serviceExecSummListForGroup
      } = res.data;
      const serviceExecHistoryColumns = [
        { name: "serviceName", header: "Service Name", width: 150, align: "left" },
        { name: "serviceGroupName", header: "Service Group", width: 100 },
        { name: "startDate", header: "Start", width: 100 },
        { name: "elasped", header: "Elasped", width: 90 },
        {
          name: "serviceStatus", header: "Result", width: 40, align: "center", paddingRight: 5, sortable: true,
          renderer: { type: StatusRenderer, options: { listData: serviceExecHistory } }
        }
      ];
      let i;
      let itm;
      for (i = 0; i < serviceExecStatusForToday.length; i++) {
        itm = serviceExecStatusForToday[i];
        for (let j = 0; j < serviceExecSummListForGroup.length; j++) {
          itm[serviceExecSummListForGroup[j].serviceGroupName] = parseInt(itm[serviceExecSummListForGroup[j].serviceGroupName]);
        }
      }
      this.setState({
        serviceExecStatusForToday: serviceExecStatusForToday,
        serviceTodayExecSummForGroup: serviceTodayExecSummForGroup,
        serviceTotalExecSummForGroup: serviceTotalExecSummForGroup,
        serviceExecHistory: serviceExecHistory,
        serviceExecHistoryColumns: serviceExecHistoryColumns,
        serviceExecSummListForGroup: serviceExecSummListForGroup
      });
      this.props.main.showLoading();
      DashboardService.dashboardResourceData({}, this.onResultResourceData, (err) => Msg.error(err.message));
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * 실시간 데이터 요청(3초) 결과 핸들러
   * @param {Object} res {result:ok|fail, data:{{
   * 							containerInfo:Container 현황,
   * 							cpuAvgList:최근 CPU 데이터,
   * 							todayCpuAvg:금일 현재 CPU 평균
   * 						}}
   */
  onResultRealData(res) {
    if (res.result === "ok") {
      const {
        containerInfo,
        cpuAvgList,
        todayCpuAvg
      } = res.data;
      this.setState({
        containerInfo: containerInfo,
        cpuAvgList: cpuAvgList,
        todayCpuAvg: todayCpuAvg === undefined || (todayCpuAvg !== undefined && todayCpuAvg.cpuAverage === undefined) ? 0 : todayCpuAvg.cpuAverage
      });
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * 실시간 데이터 요청(30초) 결과 핸들러
   * @param {Object} res {result:ok|fail, data:{{
   * 							cpuSummListForHour:CPU 금일 시간별 현황,
   * 							scaleInOutSummary:Scale In/Out 최근 일주일,
   * 							serviceExecHistory:금일 서비스 실행 이력 리스트,
   * 							serviceTodayExecSummForGroup:금일 서비스 실행 현황,
   * 							serviceTotalExecSummForGroup:전체 서비스 실행 현황,
   * 							serviceExecSummListForGroup:그룹별 서비스 실행 현황 리스트
   * 						}}
   */
  onResultRealData2(res) {
    if (res.result === "ok") {
      // console.log(res.data);
      const { serverNames } = this.state;
      const {
        cpuSummListForHour,
        serviceExecHistory,
        serviceExecStatusForToday,
        serviceTodayExecSummForGroup,
        serviceTotalExecSummForGroup,
        serviceExecSummListForGroup,
        onResultRealData2
      } = res.data;
      let i;
      let itm;
      for (i = 0; i < cpuSummListForHour.length; i++) {
        itm = cpuSummListForHour[i];
        for (let j = 0; j < serverNames.length; j++) {
          itm[serverNames[j]] = parseFloat(itm[serverNames[j]]);
        }
      }
      for (i = 0; i < serviceExecStatusForToday.length; i++) {
        itm = serviceExecStatusForToday[i];
        for (let j = 0; j < serviceExecSummListForGroup.length; j++) {
          itm[serviceExecSummListForGroup[j].serviceGroupName] = parseInt(itm[serviceExecSummListForGroup[j].serviceGroupName]);
        }
      }
      this.setState({
        onResultRealData2: onResultRealData2,
        cpuSummListForHour: cpuSummListForHour,
        serviceExecHistory: serviceExecHistory,
        serviceExecStatusForToday: serviceExecStatusForToday,
        serviceTodayExecSummForGroup: serviceTodayExecSummForGroup,
        serviceTotalExecSummForGroup: serviceTotalExecSummForGroup,
        serviceExecSummListForGroup: serviceExecSummListForGroup
      });
    } else if (res.result === "fail") {
      Msg.error(res.message);
    }
  }

  /**
   * Cpu 현황 타입 클릭 핸들러
   * @param {String} type Cpu 현황 타입
   */
  onClickTab(type) {
    const { cpuSummListForHour, cpuSummListForDay, cpuSummListForMonth } = this.state;
    let cpuSummList = [];
    if (type === "time")
      cpuSummList = cpuSummListForHour;
    else if (type === "day")
      cpuSummList = cpuSummListForDay;
    else if (type === "month")
      cpuSummList = cpuSummListForMonth;
    this.setState({ cpuSummList: cpuSummList, cpuSummType: type });
  }

  render() {
    let {
      serviceExecStatusForToday, serviceTodayExecSummForGroup, serviceTotalExecSummForGroup, serviceExecHistory, serviceExecSummListForGroup,
      scaleInOutSummary, cpuAvgList, cpuSummListForHour, serverNames, todayCpuAvg, containerInfo,
      serviceExecHistoryColumns, serviceExecSummColumns, cpuSummList, cpuSummType
    } = this.state;
    if (cpuSummList === undefined) cpuSummList = cpuSummListForHour;
    if (cpuSummType === undefined) cpuSummType = "time";
    if (containerInfo === undefined) containerInfo = [];
    let i;
    let contains = [];
    for (i = containerInfo.length - 1; i >= 0; i--) {
      contains.push(<tr><td>{containerInfo[i].role}</td><td>{containerInfo[i].hasContainer}</td></tr>);
    }


    const RealCpuTooltip = ({ active, payload, label }) => {
      try {
        if (active) {
          let lblStr = payload[0].payload.receiveDate;
          return (
            <div className="custom-tooltip" style={{ border: "dotted 1px #419efa", background: "#FFF", padding: "10px", color: payload[0].color }}>
              {lblStr + " : " + (isNaN(payload[0].value) ? 0 : payload[0].value) + "%"}
            </div>
          );
        }
      } catch (err) { }

      return null;
    };

    const CpuUtilizationTooltip = ({ active, payload, label }) => {
      try {
        if (active) {
          let tooltips = [<div style={{ color: "#000", fontWeight: "bold" }}>{label + (cpuSummType === "time" ? "시" : "")}</div>];
          /* payload.length는 서버의 개수 */
          for (let i = 0; i < payload.length; i++) {
            tooltips.push(<div style={{ color: payload[i].color }}>{payload[i].name + " : " + (isNaN(payload[i].payload[payload[i].dataKey]) ? 0 : payload[i].payload[payload[i].dataKey]) + "%"}</div>);
          }
          return (
            <div className="custom-tooltip" style={{ border: "dotted 1px #CECECE", background: "#FFF", padding: "10px", color: payload[0].color }}>
              {tooltips}
            </div>
          );
        }
      } catch (err) { }

      return null;
    };
    const ServiceExecutionTooltip = ({ active, payload, label }) => {
      try {
        if (active) {
          let tooltips = [<div style={{ color: "#000", fontWeight: "bold" }}>{label + "시 (성공/실패)"}</div>];
          for (let i = 0; i < payload.length; i++) {
            tooltips.push(<div style={{ color: payload[i].color }}>{payload[i].name + " : " + (isNaN(payload[i].payload[payload[i].dataKey]) ? 0 : payload[i].payload[payload[i].dataKey]) + " (" + payload[i].payload[payload[i].dataKey + "_success"] + "/" + payload[i].payload[payload[i].dataKey + "_fail"] + ")"}</div>);
          }
          return (
            <div className="custom-tooltip" style={{ border: "dotted 1px #CECECE", background: "#FFF", padding: "10px", color: payload[0].color }}>
              {/* {lblStr + " : " + payload[0].value + "%"} */}
              {tooltips}
            </div>
          );
        }
      } catch (err) { }

      return null;
    };

    const pieData = [{ name: 'todayAvg', value: todayCpuAvg }, { name: 'blank', value: 100 - todayCpuAvg }];
    let todayCpuAvgSty = { right: 86 };
    /*
        fontsize 40
  	
        1(1)
        102				(86+16)
  	
        11(2)
        93				(86+7)
  	
        1.1(3)
        86
  	
        11.1(4)
        78				(86-8)
    */
    // 자리수에 따른 가운데 위치하기위해 스타일 조절
    if (todayCpuAvg.length === 1) todayCpuAvgSty.right = 102;
    else if (todayCpuAvg.length === 2) todayCpuAvgSty.right = 93;
    else if (todayCpuAvg.length === 4) todayCpuAvgSty.right = 78;

    const colors = ["#f4b922", "#71b8ff", "#07c180", "#fc8d27", "#8f8dfc"];
    let itm;
    let cpuUtilizationLines = [];
    for (i = 0; i < serverNames.length; i++) {
      itm = serverNames[i];
      if (itm === "Total")
        cpuUtilizationLines.push(<Line type="linear" dataKey={itm} fill="#FF0000" stroke={"#FF0000"} strokeWidth={2} dot={{ r: 3 }} isAnimationActive={false} />);
      else
        cpuUtilizationLines.push(<Line type="linear" dataKey={itm} stroke={colors[i]} fill={colors[i]} dot={{ r: 3 }} isAnimationActive={false} />);
    }

    let serviceExecutionLines = [];
    for (i = 0; i < serviceExecSummListForGroup.length; i++) {
      itm = serviceExecSummListForGroup[i];
      serviceExecutionLines.push(<Line type="linear" dataKey={itm.serviceGroupName} stroke={colors[i]} fill={colors[i]} activeDot={{ r: 3 }} isAnimationActive={false} />);
    }

    return <div className="dashboard_container">
      <div className="dash_tit">
        <h3>Resource</h3>
        {this.props.main.state.login ? <div className="float">
          <a href="http://61.97.187.199:9900" target="_blank" className="img_link" alt="visualizer"></a>
          <a href="http://61.97.187.199:9000" target="_blank" className="img_link" alt="swarmpit"></a>
        </div> : null}
      </div>
      <ul className="dash_layout dash_layout1">
        {/* <!-- Server/Container --> */}
        <li>
          <ul className="inner_layout">
            <li><dl>
              <dt>Server</dt>
              <dd>
                <b>{containerInfo.length}</b>
                <p>nodes</p>
              </dd>
            </dl></li>
            <li><dl>
              <dt>Container</dt>
              <dd>
                <table>
                  <colgroup>
                    <col style={{ width: 120 }} />
                    <col style={{ width: 60 }} />
                  </colgroup>
                  {contains}
                </table>
              </dd>
            </dl>
            </li>
          </ul>
        </li>
        {/* <!-- CPU --> */}
        <li>
          <ul className="inner_layout">
            <li>
              <dl>
                <dt>CPU</dt>
                <dd style={{ display: "flex", justifyContent: "center", marginLeft: 20 }}>
                  <LineChart width={590} height={210} data={cpuAvgList}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                    <XAxis dataKey="receiveDate" />
                    <YAxis type="number" domain={[0, 100]} width={10} />
                    <CartesianGrid strokeDasharray="3 3" />
                    <Tooltip content={<RealCpuTooltip />} />
                    <Line type="monotone" dataKey="cpuAverage" stroke="#419efa" isAnimationActive={false} dot={false} activeDot={{ r: 5 }} />
                  </LineChart>
                </dd>
              </dl>
            </li>
            <li>
              <div className="graph_wrap" style={{ marginTop: -10, height: 220 }}>
                <dl><dt>Today CPU Avg.</dt></dl>
                <PieChart width={220} height={200} unit="%">
                  <Pie dataKey={"value"}
                    data={pieData}
                    cx={70}
                    cy={90}
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={0}
                  >
                    <Cell fill="#419efa" />
                    <Cell fill="#ebedf1" />
                  </Pie>
                </PieChart>
              </div>
              <span className="percent_value" style={todayCpuAvgSty}>{todayCpuAvg}<sup>%</sup></span>
            </li>
          </ul>
        </li>
        {/* <!-- Scale In / Out --> */}
        <li>
          <dl>
            <dt>Scale In / Out</dt>
            <dd><ScaleInOutGrid gridData={scaleInOutSummary} /></dd>
          </dl>
        </li>
        {/* <!-- CPU Utilization --> */}
        <li>
          <dl>
            <dt>CPU Utilization</dt>
            <dd>
              {/* </dd><!-- 시간/일/월 라디오 커스텀 버튼 --> */}
              <div className="ipradio_group">
                <label className="term_radio">
                  <input type="radio" name="cp_item" value="시간" defaultChecked={cpuSummType === "time"} onClick={() => this.onClickTab('time')} />
                  <span>시간</span>
                </label>
                <label className="term_radio">
                  <input type="radio" name="cp_item" value="일" defaultChecked={cpuSummType === "day"} onClick={() => this.onClickTab('day')} />
                  <span>일</span>
                </label>
                <label className="term_radio">
                  <input type="radio" name="cp_item" value="월" defaultChecked={cpuSummType === "month"} onClick={() => this.onClickTab('month')} />
                  <span>월</span>
                </label>
              </div>
              <div className="graph_wrap">
                <LineChart width={723} height={240} data={cpuSummList}>
                  <XAxis dataKey="receiveDate" />
                  <YAxis unit="%" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip content={<CpuUtilizationTooltip />} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                  {cpuUtilizationLines}
                </LineChart>
              </div>
            </dd>
          </dl>
        </li>
        {/* <!-- Service Execution --> */}
        <li>
          <dl>
            <dt>Service Execution</dt>
            <dd>
              <div className="graph_wrap" style={{ marginTop: 20 }}>
                <LineChart width={952} height={240} data={serviceExecStatusForToday}>
                  <XAxis unit="시" dataKey="hour" width={20} />
                  <YAxis unit="건" />
                  <CartesianGrid strokeDasharray="3 3" />
                  <Tooltip content={<ServiceExecutionTooltip />} />
                  <Legend verticalAlign="bottom" iconType="circle" />
                  {serviceExecutionLines}
                </LineChart>
              </div>
            </dd>
          </dl>
        </li>

      </ul>

      <div className="dash_tit">
        <h3>Service</h3>
      </div>

      <ul className="dash_layout dash_layout2">
        {/* <!-- Today Execution --> */}
        <li>
          <dl>
            <dt>Today Execution</dt>
            <dd>
              <table className="table_execution"><tbody>
                <tr>
                  <td colSpan="2">
                    <h2>{common.displNum(serviceTodayExecSummForGroup.total)}</h2>
                  </td>
                </tr>
                <tr>
                  <td>
                    <span className="blue">{common.displNum(serviceTodayExecSummForGroup.success)}</span>
                    <p>success</p>
                  </td>
                  <td>
                    <span className="orange">{common.displNum(serviceTodayExecSummForGroup.fail)}</span>
                    <p>fail</p>
                  </td>
                </tr>
              </tbody></table>
            </dd>
          </dl>
        </li>
        {/* <!-- Total Execution --> */}
        <li>
          <dl>
            <dt>Total Execution</dt>
            <dd>
              <ul className="inner_layout">
                <li>
                  <table className="table_execution">
                    <tbody>
                      <tr>
                        <td colSpan="2">
                          <h3>{common.displNum(serviceTotalExecSummForGroup.total)}</h3>
                        </td>
                      </tr>
                      <tr>
                        <td>
                          <span>{common.displNum(serviceTotalExecSummForGroup.success)}</span>
                          <p>success</p>
                        </td>
                        <td>
                          <span>{common.displNum(serviceTotalExecSummForGroup.fail)}</span>
                          <p>fail</p>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </li>
                <li className="graph_wrap" style={{ marginLeft: 14 }}>
                  <div className="table_type1 table_type3">
                    <GridList columns={serviceExecSummColumns} gridData={serviceExecSummListForGroup} bodyHeight={130} key={Math.random()} />
                  </div>
                </li>

              </ul>
            </dd>
          </dl>
        </li>
        <li>
          <div className="graph_wrap">
            <div className="table_type1">
              <GridList columns={serviceExecHistoryColumns} gridData={serviceExecHistory} bodyHeight={160} key={Math.random()} />
            </div>
          </div>
        </li>
      </ul>
    </div>;
  }
}

/**
 * Status 컬럼 랜더러
 */
class StatusRenderer extends Component {
  render() {
    const { item } = this.props;
    let cls = item.serviceStatus === "success" ? "staus staus_completion" : "staus staus_warning";
    return <span className={cls} title={item.serviceStatus}></span>;
  }
}

export default Dashboard;