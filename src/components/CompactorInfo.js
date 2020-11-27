import React, { Component } from "react";
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Card, Table } from 'react-bootstrap'
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
    console.log(this.props.userType)
    let compactorInfo = null;
    if(this.state.compactorLoaded){
      let compactors = this.state.data
      compactorInfo = compactors.map(compactor => (
           <tr>
                 <th onClick={()=>{
                   this.redirectToDashboard(compactor.sectionArea)
                 }}>{compactor.sectionArea}</th>
                <th>{compactor.address}</th>
                <th>{compactor.compactorID}</th>
                <th>{compactor.compactorType}</th>
                <th>{compactor.alarmRaised ? <div  onClick={()=>{
                  this.redirectToAlarmDetails(compactor.compactorID)
                }}>true</div> : <div>false</div>}</th>
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
      console.log(this.state.currentComponent)
      return(
        <Redirect to={{
            pathname: '/alarmDetails',
            state: { 
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
                  <th>Compactor Type</th>
                  <th>Alarm Raised</th>
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