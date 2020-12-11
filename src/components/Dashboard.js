import React, { Component } from "react";
import './../css/dashboard.css'
import NavBarContent from './NavBarContent';
import DashboardTable from './DashboardTable';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Table , Button } from 'react-bootstrap'
const sortObjectsArray = require('sort-objects-array');
const axios = require('axios');

class Dashboard extends Component {
    constructor(props){
      super(props)
      this.state = 
      {
        'data': [],
        'detailedAlarmReport' : [],
        'detailedAlarmReportLoaded' : false,
        'compactorLoaded' : false,
        'alarmsLoaded' : false,
        'renderAlarmTable' : true,
        'renderWeightTable' : false,
        'renderCompactorInfo' : false,
        'renderDetailedAlarmReport' : false
      }
      this.renderCollectionWeight = this.renderCollectionWeight.bind(this)
      this.renderAlarmTable = this.renderAlarmTable.bind(this)
      this.renderCompactorInfo = this.renderCompactorInfo.bind(this)
      this.handleRenderDetailedReport = this.handleRenderDetailedReport.bind(this)
      this.handleRedirect = this.handleRedirect.bind(this)
    }

    componentDidMount(){
      var token = this.props.location.state.token
      var config = {
        headers: { Authorization: `Bearer ${token}` }
    }

    var currentSection = this.props.location.state.currentSection || 'A'
      axios.get(`http://localhost:8080/getTodaysAlarm/${currentSection}`,config)
      .then((response)=> {
        console.log(response)
        this.setState({
          alarmData : response.data.alarms,
          numberofAlarms : response.data.alarms.length,
          alarmsLoaded: true
        })
      })
      .catch(function (error) {
        console.log(error);
      })

      axios.get(`http://localhost:8080/allCompactorInfo/${currentSection}`,config)
      .then((response)=> {
        this.setState({
          compactorData : response.data.compactorInfo,
          compactorDataLength : response.data.compactorInfo.length,
          compactorLoaded: true
        })
      })
      .catch(function (error) {
        console.log(error);
      })  
  }

  handleRenderDetailedReport(){
    var token = this.props.location.state.token
    var config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    axios.get(`http://localhost:8080/getDetailAlarm`,config)
    .then((response)=> {
      this.setState({
        detailedAlarmReport : response.data.alarmInfo,
        detailedAlarmReportLoaded: true,
        renderDetailedAlarmReport : true 
      })
    })
    .catch(function (error) {
      console.log(error);
    })   
  }

  handleRedirect(path){
    this.setState({
        redirectTo : path
    })
  }

  handleClearAlarm(compactorID, AlarmID){
    var token = this.props.location.state.token

    var config = {
        headers: { Authorization: `Bearer ${token}`}
    }
    var type = 'user'
    if(this.props.location.state.userType == 'Enginner'){
        type = 'serviceUser'
    }
    
    if(this.props.location.state.userType == 'Admin'){
        type = 'admin'
    }

    var apikeys = {
        'admin' : 'jnjirej9reinvuiriuerhuinui',
        'serviceUser' : 'juit959fjji44jcion4moij0kc',
    }

    if(type !== 'user'){
      config['headers']['apikey'] = apikeys[type]
    }

    var body = { compactorID: compactorID, AlarmID : AlarmID}
    axios.post(`http://localhost:8080/clearAlarm`,body, config)
    .then((response)=> {
        console.log(response)
    })
    .catch(function (error) {
        console.log(error);
    })  
  }

  renderCollectionWeight(){
    this.setState({
      renderWeightTable : true,
      renderAlarmTable : false,
      renderCompactorInfo : false
    })
  }

  renderAlarmTable(){
    this.setState({
      renderWeightTable : false,
      renderAlarmTable : true,
      renderCompactorInfo : false
    })
  }

  renderCompactorInfo(){
    this.setState({
      renderWeightTable : false,
      renderAlarmTable : false,
      renderCompactorInfo : true
    })
  }

    render(){
      if(this.state.numberofAlarms <=0){
        this.state.numberofAlarms = 'No Alarm'
      }

      if(this.state.compactorLoaded){
        let compactors = this.state.compactorData
        var collectionWeights = []
        function reduceFunc(total, num) {
            return total + num;
        }

        for(var i=0;i<compactors.length;i++){
            if(!(isNaN(compactors[i].current_weight) && compactors[i].current_weight <= 0) ){
                collectionWeights.push(compactors[i].current_weight)
            }
        }
        var totalCollectedWeight = collectionWeights.reduce(reduceFunc);
      }

      if(this.state.redirectTo == 'userDetails'){
        return(
            <Redirect to={{
                pathname: '/editUser',
                state: { 
                    userType: this.props.location.state.userType,
                    token: this.props.location.state.token
                }
            }}
        />
        )
    }else if(this.state.renderDetailedAlarmReport){
        if(this.state.detailedAlarmReportLoaded){
          var detailedAlarmData = this.state.detailedAlarmReport
          detailedAlarmData = sortObjectsArray(detailedAlarmData, 'sectionArea')
          detailedAlarmData = detailedAlarmData.map(alarm =>(
              <tr>
                  <td>{alarm.sectionArea}</td>
                  <td>{alarm.compactorID}</td>
                  <td>{alarm.address}</td>
                  <td>{alarm.alarmStatus}</td>
                  <td>{alarm.humanReadableTS}</td>
                  <td>{alarm.type}</td>
                  <td>{alarm.username}</td>
              </tr>
          ))
          return(
            <div className='dashboard-grid-container'>
              <div className='dashboard-item-03 lol bordercolor'>
                <NavBarContent token={this.props.location.state.token} />
              </div>
              <div className='dashboard-item-08 lol'>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Section</th>
                    <th>Compactor ID</th>
                    <th>Address</th>
                    <th>Alarm Status</th>
                    <th>TS</th>
                    <th>Alarm Type</th>
                    <th>Cleared By</th>
                  </tr>
                </thead>
                <tbody>
                  {detailedAlarmData}
                </tbody>
              </Table>
              <Button onClick={()=>{
                this.setState(
                  {
                    renderDetailedAlarmReport : false
                  }
                )
              }} variant="primary">Back</Button>{' '}
              </div>
            </div>
          )
        }else{
          return(
            <div>Loading .....</div>
          )
        }
        
      }else{
        return(
          <div className='dashboard-grid-container'>
            <div className='dashboard-item-02 lol'>
              <div className='customNavTitle'>Section {this.props.location.state.currentSection}</div>
              <div style={{cursor:'pointer'}} onClick={this.handleRenderDetailedReport} className='customNavCell'>Detailed Alarm Report</div>
              <div className='customNavCell'>Admin Add User(Still in Development)</div>
            </div>
            <div className='dashboard-item-03 lol bordercolor'>
              <NavBarContent handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
            </div>
            <div className='dashboard-item-04 dangercolor'>
              <div>
                <span><img style={{cursor:'pointer'}} onClick={this.renderAlarmTable} src={require('./alarmRaised.png')} width="100" height="90"></img></span>
                <span className='cardAdjustment' >Alarm Raised : &nbsp;<span className='font-sizing'>{this.state.numberofAlarms}</span></span>
              <div>&nbsp;</div>
              <div className='lineBreak'></div>
              <div>&nbsp;</div>
              <div style={{cursor:'pointer'}} onClick={this.renderAlarmTable} className='cardAdjustment'>Details</div>
              </div>
            </div>
            <div className='dashboard-item-05 lol weightColor'>
            <div>
              <span><img style={{cursor:'pointer'}} onClick={this.renderCollectionWeight} src={require('./weight.png')} width="100" height="90"></img></span>
<span className='cardAdjustment' >Collection Weight : &nbsp;<span className='font-sizing'>{totalCollectedWeight}kg</span></span>
              <div>&nbsp;</div>
              <div className='lineBreak'></div>
              <div>&nbsp;</div>
              <div style={{cursor:'pointer'}} onClick={this.renderCollectionWeight} className='cardAdjustment'>Details</div>
            </div>
        </div>
        <div className='dashboard-item-06 compactorColor'>
        <div>
              <span><img style={{cursor:'pointer'}} onClick={this.renderCompactorInfo} src={require('./compactorImg.png')} width="100" height="90"></img></span>
<span className='cardAdjustment' >Compactor Information : &nbsp;<span className='font-sizing'>{this.state.compactorDataLength}</span></span>
              <div>&nbsp;</div>
              <div className='lineBreak'></div>
              <div>&nbsp;</div>
              <div style={{cursor:'pointer'}} onClick={this.renderCompactorInfo} className='cardAdjustment'>Details</div>
            </div>
        </div>
              <div className='dashboard-item-07 lol'>
              <DashboardTable 
          currentSection={this.props.location.state.currentSection} userType={this.props.location.state.userType} renderCompactorInfo={this.state.renderCompactorInfo} renderAlarmTable={this.state.renderAlarmTable} renderWeightTable={this.state.renderWeightTable} compactorLoaded={this.state.compactorLoaded} compactorData={this.state.compactorData} 
          alarmsLoaded={this.state.alarmsLoaded} alarmData={this.state.alarmData} token={this.props.location.state.token} />
              </div>
          </div>
        )
      }
    }
}

export default Dashboard