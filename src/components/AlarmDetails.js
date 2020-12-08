import Axios from 'axios'
import React, {Component} from 'react'
import axios from 'axios'
import './../css/alarmDetails.css'
import { Container, Row, Col, Button, Form, Table } from 'react-bootstrap'
import { BrowserRouter as Router, Redirect } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faClock } from '@fortawesome/free-solid-svg-icons'

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
            console.log(response)
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
                var alarmsData = this.state.data
                alarmsData = alarmsData.map(alarm =>(
                    <tr>
                        <td>{alarm.AlarmID}</td>
                        <td>{alarm.compactorID}</td>
                        <td>{alarm.alarmStatus}</td>
                        <td>{alarm.humanReadableTS}</td>
                        <td onClick={()=>{
                            this.handleClearAlarm(alarm.compactorID, alarm.AlarmID)
                        }} style={{cursor:'pointer'}}><FontAwesomeIcon icon={faClock} /></td>
                    </tr>
                ))
                return(
                    <div className='alarm-grid-container'>
                        <div className='alarm-grid-item-01 markbg'>
                            <div>&nbsp;</div>
                        <Container>
                            <Row>
                                <Col><div></div></Col>
                                <Col className='titleAdjust'><div>Alarm Details</div></Col>
                                <Col><div></div></Col>
                            </Row>
                        </Container>
                        <div>&nbsp;</div>
                        <Table striped bordered hover>
                            <thead>
                                <tr>
                                <th>Alarm ID</th>
                                <th>Compactor ID</th>
                                <th>Status</th>
                                <th>TS</th>
                                <th>Clear Alarm</th>
                                </tr>
                            </thead>
                            <tbody>
                                {alarmsData}
                            </tbody>
                        </Table>
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