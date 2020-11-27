import Axios from 'axios'
import React, {Component} from 'react'
import axios from 'axios'
import './../css/alarmDetails.css'
import { Container, Row, Col, Button } from 'react-bootstrap'
class AlarmDetails extends Component{
    constructor(props){
        super(props)
        this.state = 
        {
            'data' : [],
            'alarmLoaded' : false
        }
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
        console.log(response.data.alarmInfo)
        // console.log(response.data.compactorInfo);
            this.setState({
                data : response.data.alarmInfo,
                alarmLoaded: true
            })
        })
        .catch(function (error) {
        console.log(error);
        })  
      }
      render(){
          console.log(this.state.data)
        if(this.state.alarmLoaded){
            return(
                <div className='alarm-grid-container'>
                    <div className='alarm-grid-item-01 markbg'>
                    <div>&nbsp;</div>
                    <Container>
                        <Row>
                            <Col></Col>
                            <Col className='titleAdjust'>Alarm Details</Col>
                            <Col><Button variant="primary">Edit Alarm Details</Button>{' '}</Col>
                        </Row>
                        <div>&nbsp;</div>
                        <Row>
                            <Col>
                                <div className='alarmDetails'>
                                    CompactorID: {this.state.data.compactorID}
                                </div>
                                <div className='alarmDetails'>
                                    Status: {this.state.data.status}
                                </div>
                                <div className='alarmDetails'>
                                    TimeStamp: {this.state.data.humanReadableTS}
                                </div>
                            </Col>
                            <Col></Col>
                            <Col></Col>
                        </Row>
                    </Container>
                    </div>
                </div>
            )
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