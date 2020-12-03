import Axios from 'axios'
import React, {Component} from 'react'
import axios from 'axios'
import './../css/alarmDetails.css'
import { Container, Row, Col, Button, Form } from 'react-bootstrap'
import { BrowserRouter as Router, Redirect } from "react-router-dom";
class AlarmDetails extends Component{
    constructor(props){
        super(props)
        this.state = 
        {
            'data' : [],
            'alarmLoaded' : false,
            'redirectToLocationData' : false,
            'renderForm' : false
        }
        this.handleRedirectToLocationData = this.handleRedirectToLocationData.bind(this)
        this.showEditForm = this.showEditForm.bind(this)
        this.handleClearAlarm = this.handleClearAlarm.bind(this)
      }

      componentDidMount(){
        //get current alarm
        var token = this.props.location.state.token
        var config = {
        headers: { Authorization: `Bearer ${token}` }
        }
        let compactorID = this.props.location.state.currentComponent
        axios.get(`http://localhost:8080/getAlarm/${compactorID}`,config)
        .then((response)=> {
            this.setState({
                data : response.data.alarmInfo,
                alarmLoaded: true
            })
        })
        .catch(function (error) {
        console.log(error);
        })  
      }

      handleRedirectToLocationData(){
        this.setState(
            {
                redirectToLocationData : true
            }
        )
      }

      showEditForm(){
        this.setState(
            {
                renderForm : true
            }
        )
      }
      
      handleClearAlarm(){
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

        console.log(type)
    
        var apikeys = {
            'admin' : 'jnjirej9reinvuiriuerhuinui',
            'serviceUser' : 'juit959fjji44jcion4moij0kc',
        }

        if(type !== 'user'){
            config['headers']['apikey'] = apikeys[type]
        }
    
        console.log(config)
        let compactorID = this.state.data.compactorID
        var body = { compactorID: compactorID}
        axios.post(`http://localhost:8080/clearAlarm`,body, config)
        .then((response)=> {
            console.log(response)
        })
        .catch(function (error) {
            console.log(error);
        })  
      }

      render(){
        console.log(this.state)
        console.log(this.props)

        if(this.state.alarmLoaded){
            if(this.state.redirectToLocationData){
                return(
                    <Redirect to={{
                        pathname: '/locationData',
                        state: { 
                            userType: this.props.location.state.userType,
                            token: this.props.location.state.token
                        }
                    }}
                />
                )
            }else{
                return(
                    <div className='alarm-grid-container'>
                        <div className='alarm-grid-item-01 markbg'>
                        <div>&nbsp;</div>
                        <Container>
                            <Row>
                                <Col></Col>
                                <Col className='titleAdjust'>Alarm Details</Col>
                                <Col><Button onClick={this.handleClearAlarm} variant="primary">Clear Alarm</Button>{' '}</Col>
                            </Row>
                            <div>&nbsp;</div>
                            <Row>
                                <Col>
                                    <div className='alarmDetails'>
                                        CompactorID: {this.state.data.compactorID}
                                    </div>
                                    <div className='alarmDetails'>
                                        Status: {this.state.data.alarmStatus}
                                    </div>
                                    <div className='alarmDetails'>
                                        TimeStamp: {this.state.data.humanReadableTS}
                                    </div>
                                </Col>
                                <Col></Col>
                                <Col></Col>
                            </Row>
                        </Container>
                        <div>&nbsp;</div>
                        <Button onClick={this.handleRedirectToLocationData} variant="primary">Back</Button>{' '}
                        </div>
                    </div>
                )
            }
        }else{
            return(
                <div className='alarm-grid-container'>
                        <div className='alarm-grid-item-01 markbg'>
                        <div>&nbsp;</div>
                        <Container>
                            Loading ....
                        </Container>
                    </div>
                </div>
            )
        }
        
      }
}

export default AlarmDetails