import React, {Component} from 'react'
import './../css/compactorInfo.css'
import Mapping from './Mapping';
import NavBarContent from './NavBarContent';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Card, Table, Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBalanceScale, faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
const axios = require('axios');
class GridContainer extends Component{
    constructor(props){
        super(props)
        this.state = 
        {
            'compactorSection' : 'A', 
            'compactorData' : [],
            'compactorLoaded' : false,
            'renderWeightInformation' : false
        }
        this.renderWeightInformation = this.renderWeightInformation.bind(this)
        this.switchCompactorSection = this.switchCompactorSection.bind(this)
        this.getCompactorSectionData = this.getCompactorSectionData.bind(this)
    }

    componentDidMount(){
        var currentSection = this.state.compactorSection
        var token = this.props.location.state.token
        var config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/allCompactorInfo/${currentSection}`,config)
        .then((response)=> {
            this.setState({
            compactorData : response.data.compactorInfo,
            compactorLoaded: true
            })
        })
      .catch(function (error) {
        console.log(error);
      })  
    }

    switchCompactorSection(){
        this.setState({
            compactorSection : 'B',
        })
    }

    getCompactorSectionData(){
        var currentSection = this.state.compactorSection
        console.log(currentSection)
        var token = this.props.location.state.token
        var config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/allCompactorInfo/${currentSection}`,config)
        .then((response)=> {
            console.log(response.data.compactorInfo)
            this.setState({
            compactorData : response.data.compactorInfo,
            compactorLoaded: true
            })
        })
      .catch(function (error) {
        console.log(error);
      })
    }

    renderWeightInformation(){
        this.setState(
            {
                renderWeightInformation : true
            }
        )
    }

    render(){    
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

                return(
                    <div className='grid-container-compactor'>
                         <div className='grid-item grid-item-01-compactor'>
                             <NavBarContent userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                        </div>
                        <div className="grid-item grid-item-sideDashboard whiteBG">
                                <Container className="blueBG adjustPadding">
                                    <Row>
                                        <Col></Col>
                                        <Col>Dashboard</Col>
                                        <Col></Col>
                                    </Row>
                                </Container>
                                <Container className="blueBorder adjustPaddingContent">
                                    <Row>
                                        <Col>Map</Col>
                                    </Row>
                                </Container>
                                <Container className="blueBorder adjustPaddingContent">
                                    <Row>
                                        <Col>Equipment</Col>
                                    </Row>
                                </Container>
                                <Container className="blueBorder adjustPaddingContent">
                                    <Row>
                                        <Col>Report</Col>
                                    </Row>
                                </Container>
                                <Container className="blueBorder adjustPaddingContent">
                                    <Row>
                                        <Col>Admin</Col>
                                    </Row>
                                </Container>
                        </div>
                        <div className="grid-item grid-item-alarmDashboard whiteBG">
                                <Container>
                                    <Row>
                                        <Col className='alarmTitle'>Alarm</Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row>
                                        <Col className='alarmRaisedNumber'>5</Col>
                                    </Row>
                                </Container>
                                <button>Status</button>
                                <button>Status</button>
                                <button>Status</button>
                        </div>
                        <div className="grid-item grid-item-weightDashboard whiteBG">
                                <Container>
                                    <Row>
                                        <Col className='alarmTitle'>Weight (tonnes)</Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row>
                                <Col className='alarmRaisedNumber'>{totalCollectedWeight}</Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row>
                                        <Col style={{textAlign : 'center', cursor:'pointer'}}><FontAwesomeIcon icon={faArrowLeft} /></Col>
                                        <Col style={{textAlign : 'center'}}>Section {this.state.compactorSection}</Col>
                                        <Col onClick={()=>{this.switchCompactorSection(); this.getCompactorSectionData()}} style={{textAlign : 'center', cursor:'pointer'}}><FontAwesomeIcon icon={faArrowRight} /></Col>
                                    </Row>
                                </Container>
                                <FontAwesomeIcon style={{cursor:'pointer', fontSize: '1.4em'}}icon={faBalanceScale} />
                        </div>
                        <div className="grid-item grid-item-mapDashboard">
                            <Mapping selectedAddress={this.state.selectedAddress} compactorFilledLevel={this.state.compactorFilledLevel} token={this.props.location.state.token} />
                        </div>
                    </div>
                )
    }
}

export default GridContainer