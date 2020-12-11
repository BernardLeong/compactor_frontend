import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Card, Table } from 'react-bootstrap'
const sortObjectsArray = require('sort-objects-array');
const axios = require('axios');
class CompactorInfo extends Component {
  constructor(props){
    super(props)
    this.state = 
    {
      'data': [],
      'renderEditComponentPage' : false,
      'currentComponent' : '',
      'currentSection' : '',
      'compactorLoaded' : false,
      'redirectToDashboard' : false
    }
    this.redirectToAlarmDetails =this.redirectToAlarmDetails.bind(this)
    this.redirectToDashboard =this.redirectToDashboard.bind(this)
  }
  
  componentDidMount(){
    var token = this.props.token
  
    var config = {
      headers: { Authorization: `Bearer ${token}` }
    }

    var currentComponent = this.state.currentComponent
    axios.get(`http://localhost:8080/allCompactorInfo/${currentComponent}`,config)
    .then((response)=> {
      this.setState({
        data : response.data.compactorInfo,
        compactorLoaded: true
      })
    })
    .catch(function (error) {
      console.log(error);
    }) 
  }

  handleInteractiveMap(color){
    this.setState({
        compactorFilledLevel : color
    })
}

  redirectToAlarmDetails(componentID){
    this.setState(
      {
        currentComponent : componentID,
        renderEditComponentPage : true
      }
    )
  }

  redirectToDashboard(sectionArea){
    this.setState(
      {
        currentSection: sectionArea,
        redirectToDashboard : true
      }
    )
  }

  render() {
    let compactorInfo = null;
    if(this.state.compactorLoaded){
      var compactors = this.state.data
      compactors = sortObjectsArray(compactors, 'sectionArea')
      compactorInfo = compactors.map(compactor => (
           <tr>
                 <th style={{cursor:'pointer'}} onClick={()=>{
                   this.redirectToDashboard(compactor.sectionArea)
                 }}>{compactor.sectionArea}</th>
                <th style={{cursor:'pointer'}} onClick={()=>{
                  this.props.handleAddress(compactor.address)
                }}>{compactor.address}</th>
                <th>{compactor.compactorID}</th>
                <th>{compactor.compactorType}</th>
                <th>{compactor.alarmRaised ? <div onClick={()=>{
                  this.redirectToAlarmDetails(compactor.compactorID)
                }}>true</div> : <div>false</div>}</th>
                <th>{(Math.round((compactor.current_weight / compactor.max_weight)*100 )) + ' %'}</th>
                <th>{Math.round((compactor.current_weight / compactor.max_weight)*100 ) < 25 ? 
                <span><img
                  src={require('./greendot.png')}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                /></span> 
                : 
                Math.round((compactor.current_weight / compactor.max_weight)*100 ) < 50 ? 
                <span><img
                  src={require('./yellowdot.png')}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                /></span>
                : 
                <span><img
                  src={require('./reddot.png')}
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                /></span>
                }</th>
            </tr>
      ))
    }
    if(this.state.redirectToDashboard){
      return(
        <Redirect to={{
            pathname: '/dashboard',
            state: { 
                userType: this.props.userType,
                token: this.props.token,
                currentSection: this.state.currentSection
            }
        }}
    />
    )
    }
    if(this.state.renderEditComponentPage){
      return(
        <Redirect to={{
            pathname: '/alarmDetails',
            state: { 
                userType: this.props.userType,
                token: this.props.token,
                currentComponent : this.state.currentComponent
            }
          }}
        />
      )
    }else{
      return(
        <div>
          <Table striped bordered hover variant="dark">
            <thead>
                <tr>
                  <th>Section</th>
                  <th>Address</th>
                  <th>CompactorID</th>
                  <th>Equipment Type</th>
                  <th>Alarm Raised</th>
                  <th>Weight Percentage</th>
                  <th>Weight Status</th>
                </tr>
            </thead>
            <tbody>
                {compactorInfo}
            </tbody>
          </Table>
        </div>
      )
    }
  }
}

export default CompactorInfo;