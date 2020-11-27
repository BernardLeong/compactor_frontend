import React, { Component } from "react";
import './../css/dashboard.css'
import NavBarContent from './NavBarContent';
import DashboardTable from './DashboardTable';
import { Card, Table, Button } from 'react-bootstrap'
const axios = require('axios');

class Dashboard extends Component {
    constructor(props){
      super(props)
      this.state = 
      {
        'data': [],
        'compactorLoaded' : false,
        'alarmsLoaded' : false,
        'renderAlarmTable' : true,
        'renderWeightTable' : false,
        'renderCompactorInfo' : false
      }
      this.renderCollectionWeight = this.renderCollectionWeight.bind(this)
      this.renderAlarmTable = this.renderAlarmTable.bind(this)
      this.renderCompactorInfo = this.renderCompactorInfo.bind(this)
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
        console.log(response)
        console.log(response.data);
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
      console.log(this.props.location.state.currentSection)
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
        console.log(totalCollectedWeight)
      }
        return(
            <div className='grid-container'>
                <div className='dashboard-item-01'>

                </div>
                <div className='dashboard-item-02 lol bordercolor'>
                </div>
                <div className='dashboard-item-03 lol bordercolor'>
                    <NavBarContent/>
                </div>
                <div className='dashboard-item-04 lol dangercolor'>
                    <div>
                    <span><img src={require('./alarmRaised.png')} width="100" height="90"></img></span>
        <span className='cardAdjustment' >Alarm Raised : &nbsp;<span className='font-sizing'>{this.state.numberofAlarms}</span></span>
                    <div>&nbsp;</div>
                    <div className='lineBreak'></div>
                    <div>&nbsp;</div>
                    <div onClick={this.renderAlarmTable} className='cardAdjustment'>Details</div>
                    </div>
                </div>
                <div className='dashboard-item-05 lol weightColor'>
                    <div>
                      <span><img src={require('./weight.png')} width="100" height="90"></img></span>
        <span className='cardAdjustment' >Collection Weight : &nbsp;<span className='font-sizing'>{totalCollectedWeight}</span></span>
                      <div>&nbsp;</div>
                      <div className='lineBreak'></div>
                      <div>&nbsp;</div>
                      <div onClick={this.renderCollectionWeight} className='cardAdjustment'>Details</div>
                    </div>
                </div>
                <div className='dashboard-item-06 compactorColor'>
                <div>
                      <span><img src={require('./compactorImg.png')} width="100" height="90"></img></span>
        <span className='cardAdjustment' >Compactor Information : &nbsp;<span className='font-sizing'>{this.state.compactorDataLength}</span></span>
                      <div>&nbsp;</div>
                      <div className='lineBreak'></div>
                      <div>&nbsp;</div>
                      <div onClick={this.renderCompactorInfo} className='cardAdjustment'>Details</div>
                    </div>
                </div>
                <div className='dashboard-item-07 tableBg'>
                  <DashboardTable 
                  userType={this.props.location.state.userType} renderCompactorInfo={this.state.renderCompactorInfo} renderAlarmTable={this.state.renderAlarmTable} renderWeightTable={this.state.renderWeightTable} compactorLoaded={this.state.compactorLoaded} compactorData={this.state.compactorData} 
                  alarmsLoaded={this.state.alarmsLoaded} alarmData={this.state.alarmData} token={this.props.location.state.token} />
                </div>
            </div>
        )
    }
}

export default Dashboard