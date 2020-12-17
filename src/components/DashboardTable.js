import React, { Component } from "react";
import './../css/dashboard.css'
import { Form, Table, Button, Container, Row, Col } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
const axios = require('axios');

class DashboardTable extends Component {
    constructor(props){
      super(props)
      this.state = 
      {
        'redirectToLocationData' : false,
        'redirectToCompactorEditPage' : false,
        'compactorPageSubmitted' : false,
        'compactorInfo' : '',
        'address' : '',
        'compactorType' : '',
        'sectionArea' : '',
        'currentCompactorID' : '',
        'compactorData' : []
      }
      this.redirectToCompactorEdit = this.redirectToCompactorEdit.bind(this)
      this.handleRedirectToLocationData = this.handleRedirectToLocationData.bind(this)
      this.handleSelectChange = this.handleSelectChange.bind(this)
      this.handleSubmit = this.handleSubmit.bind(this)
    }

    redirectToCompactorEdit(compactorID){
      var token = this.props.token
      var config = {
        headers: { Authorization: `Bearer ${token}` }
      }
  
      var type = 'user'
      if(this.props.userType == 'Enginner'){
          type = 'serviceUser'
      }
      
      if(this.props.userType == 'Admin'){
          type = 'admin'
      }
  
      var apikeys = {
          'admin' : 'jnjirej9reinvuiriuerhuinui',
          'serviceUser' : 'juit959fjji44jcion4moij0kc',
      }

      
      if(type !== 'user'){
          config['headers']['apikey'] = apikeys[type]
      }  
      axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/getCompactorInfo/${compactorID}`,config)
      .then((response)=> {
          console.log(response.data)
        this.setState({
          compactorInfo : response.data.compactorInfo,
          address : response.data.compactorInfo.address,
          compactorType : response.data.compactorInfo.compactorType,
          sectionArea : response.data.compactorInfo.sectionArea,
          currentCompactorID : compactorID,
          redirectToCompactorEditPage : true
        })
      })
      .catch(function (error) {
          console.log(error);
      })
    }

    handleRedirectToLocationData(){
      this.setState({
        redirectToLocationData : true
      })
    }

    handleSelectChange(event){ 
      var name = event.target.name
      this.setState({ 
          [name] : event.target.value
      });
    }

    handleSubmit(){
      var type = 'user'
      if(this.props.userType == 'Enginner'){
          type = 'serviceUser'
      }
      
      if(this.props.userType == 'Admin'){
          type = 'admin'
      }
      var currentCompactorID = this.state.currentCompactorID
      var body = {
          "compactorType" : this.state.compactorType,
          "address" : this.state.address,
          "sectionArea" : this.state.sectionArea,
          'compactorID' : currentCompactorID
      }
      
      var token = this.props.token
      var apikeys = {
          'admin' : 'jnjirej9reinvuiriuerhuinui',
          'serviceUser' : 'juit959fjji44jcion4moij0kc',
      }

      var config = {
          headers: { Authorization: `Bearer ${token}` }
      }

      if(type !== 'user'){
          config['headers']['apikey'] = apikeys[type]
      }

      axios.post('http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/editCompactor', body, config).then((result)=>{
          console.log(result)
      }).catch((err)=>{
          console.log(err)
      })

      this.setState({
        redirectToCompactorEditPage : false,
        compactorPageSubmitted : true
      })
  }

    render(){
      if(this.props.alarmsLoaded){
        let allAlarms = this.props.alarmData
        if(allAlarms[0] == null){
          var alarms = <tr>
          <th>Loading ....</th>
      </tr>
        }else{
          var alarms = allAlarms.map(al => (
            <tr>
                 <th>{al.compactorID}</th>
                 <th>{al.humanReadableTS}</th>
                 <th>{al.type}</th>
                 <th>{al.alarmStatus}</th>
                 <th>{al.address}</th>
             </tr>
         ))
        }       
       }

      if(this.props.compactorLoaded){
        var compactors = this.props.compactorData
       
        var compactorInfo = compactors.map(compactor => (
             <tr>
                  <th>{compactor.compactorID}</th>
                  <th>{compactor.current_weight}</th>
                  <th>{compactor.max_weight}</th>
                  <th>{(Math.round((compactor.current_weight / compactor.max_weight)*100 )) + ' %'}</th>
                  <th>{Math.round((compactor.current_weight / compactor.max_weight)*100 ) < 25 ? 'green' : 
                  Math.round((compactor.current_weight / compactor.max_weight)*100 ) < 50 ? 'yellow' : 'red'
                  }</th>
                  
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
              </tr>
        ))
      }
      
      if(this.props.renderWeightTable){
        if(this.state.redirectToLocationData){
          return(
            <Redirect to={{
                pathname: '/locationData',
                state: { 
                    userType: this.props.userType,
                    token: this.props.token
                }
              }}
            />
          )
        }else{
          return(
            <div>
                   <div>
                  <div>&nbsp;</div>
                <Container>
                  <Row>
                    <Col></Col>
                    <Col className='dashboardTableTitle'>Compactor Collection Weight</Col>
                    <Col></Col>
                  </Row>
                </Container>
                <div>&nbsp;</div>

                </div>
                <Table striped bordered hover responsive> 
                    <thead>
                    <tr>
                        <th>Compactor ID</th>
                        <th>Collection Weight</th>
                        <th>Max Load</th>
                        <th>Weight Percentage</th>
                        <th>Weight Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {compactorInfo}
                    </tbody>
                </Table>
                <div>
                  <button onClick={this.handleRedirectToLocationData}>Back</button>
                </div>
            </div>
          )
        }
      }

      if(this.props.renderAlarmTable){
        if(this.state.redirectToLocationData){
          return(
            <Redirect to={{
                pathname: '/locationData',
                state: { 
                    userType: this.props.userType,
                    token: this.props.token
                }
            }}
        />
        )
        }else{
          return(
            <div>
                <div>
                  <div>&nbsp;</div>
                <Container>
                  <Row>
                    <Col></Col>
                    <Col className='dashboardTableTitle'>Alarm Raised Today</Col>
                    <Col></Col>
                  </Row>
                </Container>
                <div>&nbsp;</div>

                </div>
                <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Compactor ID</th>
                        <th>Time</th>
                        <th>Alarm Type</th>
                        <th>Alarm Status</th>
                        <th>Location</th>
                    </tr>
                    </thead>
                    <tbody>
                      {alarms}
                    </tbody>
                </Table>
                <div>
                  <button onClick={this.handleRedirectToLocationData}>Back</button>
                </div>
            </div>    
          )
        }   
      }

      if(this.props.renderCompactorInfo && this.props.userType == 'Admin'){
        console.log('hii')
        if(this.state.redirectToCompactorEditPage){
          return(
            <div>
              <div>
                &nbsp;
              </div>
            <Container>
              <Row>
                  <Col><div className='legendTitle'><Form.Label>Edit Compactor Details</Form.Label></div></Col>
              </Row>
            </Container>
            <Form>
            <Container>
            <div>
                &nbsp;
              </div>
              <Row>
                <Col></Col>
                <Col>
                  <Form.Group controlId="formBasicEmail">
                  <div><Form.Label>Compactor Type</Form.Label></div>
                      <Form.Control onChange={this.handleSelectChange} value={this.state.compactorType} name='compactorType' />
                  </Form.Group>
                </Col>
              <Col></Col>
              </Row>
            </Container>
            <Container>
              <Row>
                <Col></Col>
                <Col>
                  <Form.Group controlId="formBasicEmail">
                    <div><Form.Label>Compactor Address</Form.Label></div>
                    <Form.Control onChange={this.handleSelectChange} value={this.state.address} name='address' />
                  </Form.Group>
                </Col>
              <Col></Col>
              </Row>
            </Container>
            <Container>
              <Row>
                <Col></Col>
                <Col>
                  <Form.Group controlId="formBasicEmail">
                    <div><Form.Label>Compactor Section</Form.Label></div>
                    <Form.Control onChange={this.handleSelectChange} value={this.state.sectionArea} name='sectionArea' />
                  </Form.Group>
                </Col>
              <Col></Col>
              </Row>
            </Container>
            <Container>
              <Row>
                <Col></Col>
                <Col>
                  <Button onClick={this.handleSubmit} variant="primary">
                    Submit
                  </Button>
                </Col>
              <Col></Col>
              </Row>
            </Container>   
          </Form>
          </div>
           
          )
        }else{
          if(this.state.redirectToLocationData){
            return(
              <Redirect to={{
                  pathname: '/locationData',
                  state: { 
                      userType: this.props.userType,
                      token: this.props.token
                  }
              }}
          />
          )
          }else{
            return(
              <div>
                     <div>
                  <div>&nbsp;</div>
                <Container>
                  <Row>
                    <Col></Col>
                    <Col className='dashboardTableTitle'>Compactor Other Information</Col>
                    <Col></Col>
                  </Row>
                </Container>
                <div>&nbsp;</div>

                </div>
                  <Table striped bordered hover>
                      <thead>
                      <tr>
                          <th>Compactor ID</th>
                          <th>Equipment Type</th>
                          <th>Compactor Address</th>
                      </tr>
                      </thead>
                      <tbody>
                        {compactorInfo}
                      </tbody>
                  </Table>
                  <div>
                    <button onClick={this.handleRedirectToLocationData}>Back</button>
                  </div>
              </div>
            )
          }
        }
      }
    }
}

export default DashboardTable