import React, { Component } from "react";
import './../css/dashboard.css'
import CompactorEdit from './CompactorEdit';
import { Card, Table } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
const axios = require('axios');

class DashboardTable extends Component {
    constructor(props){
      super(props)
      this.state = 
      {
        'redirectToCompactorEditPage' : false,
        'currentCompactorID' : ''
      }
      this.redirectToCompactorEdit = this.redirectToCompactorEdit.bind(this)
    }

    redirectToCompactorEdit(compactorID){
      this.setState(
        {
          redirectToCompactorEditPage : true,
          currentCompactorID : compactorID
        }
      )
    }

    render(){
      if(this.props.alarmsLoaded){
        let allAlarms = this.props.alarmData
        var alarms = allAlarms.map(al => (
            <tr>
                 <th>{al.humanReadableTS}</th>
                 <th>{al.compactorID}</th>
                 <th>{al.userid}</th>
                 <th>{al.address}</th>
             </tr>
         ))
       }
       
      if(this.props.compactorLoaded){
        let compactors = this.props.compactorData
        var compactorInfo = compactors.map(compactor => (
             <tr>
                  <th>{compactor.compactorID}</th>
                  <th>{compactor.current_weight}</th>
                  <th>{compactor.max_weight}</th>
              </tr>
        ))
      }

      if(this.props.renderCompactorInfo){
        let compactors = this.props.compactorData
        var compactorInfo = compactors.map(compactor => (
             <tr>
                  <th onClick={()=>{
                    this.redirectToCompactorEdit(compactor.compactorID)
                  }} >{compactor.compactorID}</th>
                  <th>{compactor.compactorType}</th>
                  <th>{compactor.address}</th>
                  <th>{compactor.coordinate.lat} , {compactor.coordinate.long}</th>
              </tr>
        ))
      }


      if(this.props.renderWeightTable){
          return(
            <div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Compactor Weight Information</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <thead>
                    <tr>
                        <th>Compactor ID</th>
                        <th>Collection Weight</th>
                        <th>Max Load</th>
                    </tr>
                    </thead>
                    <tbody>
                    {compactorInfo}
                    </tbody>
                </Table>
            </div>
          )
      }

      if(this.props.renderAlarmTable){
          return(
            <div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Alarm Raised Today</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <thead>
                    <tr>
                        <th>Time</th>
                        <th>Compactor ID</th>
                        <th>UserID</th>
                        <th>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                      {alarms}
                    </tbody>
                </Table>
            </div>
          )
      }

      if(this.props.renderCompactorInfo){
        if(this.state.redirectToCompactorEditPage){
          console.log(this.props.alarmData)
          return(
            <CompactorEdit userType={this.props.userType} token={this.props.token} currentCompactorID={this.state.currentCompactorID} allAlarms={this.props.alarmData}/>
          )
        }else{
          return(
            <div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th></th>
                        <th>Compactor Information</th>
                        <th></th>
                        <th></th>
                    </tr>
                    </thead>
                    <thead>
                    <tr>
                        <th>Compactor ID</th>
                        <th>Compactor Type</th>
                        <th>Compactor Address</th>
                        <th>Compactor Coordinates</th>
                    </tr>
                    </thead>
                    <tbody>
                      {compactorInfo}
                    </tbody>
                </Table>
            </div>
          )
        }
      }else{
        console.log(this.state)
        console.log(this.props)
        return(
          <div>Data Saved</div>
        )
      }
    }
}

export default DashboardTable