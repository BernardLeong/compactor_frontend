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
            'count' : 0,
            'compactorLoaded' : false,
            'renderWeightInformation' : false,
            'pressLeftArrowWeight' : false
        }
        this.renderWeightInformation = this.renderWeightInformation.bind(this)
        this.switchCompactorSection = this.switchCompactorSection.bind(this)
        this.toggleRightArrow = this.toggleRightArrow.bind(this)
        this.toggleLeftArrow = this.toggleLeftArrow.bind(this)
    }

    componentDidMount(){
        var currentSection = this.state.compactorSection
        var token = this.props.location.state.token
        var config = {
            headers: { Authorization: `Bearer ${token}` }
        }
        axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/allCompactorInfo`,config)
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

    reduceFunc(total, num){
        return total + num
    }

    switchCompactorSection(){
        this.setState({
            compactorSection : 'B',
        })
    }

    toggleRightArrow(){
        var sections = ['A','B']
        var count = this.state.count
        count = count -1
        this.setState({count : count})
        var currentSection = sections[count]
        this.setState({compactorSection : currentSection, pressRightArrowWeight : true, pressLeftArrowWeight : false})
    }

    toggleLeftArrow(){
        var sections = ['A','B']
        var count = this.state.count
        count = count + 1
        this.setState({count : count})
        var currentSection = sections[count]
        this.setState({compactorSection : currentSection, pressRightArrowWeight : false, pressLeftArrowWeight : true})
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
            var compactors = this.state.compactorData
            if(this.state.pressLeftArrowWeight || this.state.pressRightArrowWeight){
                var currentSection = this.state.compactorSection
            }else{
                var currentSection = 'A'
            }

            var compactorData = []
            var collectionWeights = []
            for(var i=0;i<compactors.length;i++){
                if(compactors[i].sectionArea == currentSection){
                    compactorData.push(compactors[i])
                }
            }
            compactors = compactorData

            let reduceFunc = this.reduceFunc

            for(var i=0;i<compactors.length;i++){
                if(!(isNaN(compactors[i].current_weight) && compactors[i].current_weight <= 0) ){
                    collectionWeights.push(compactors[i].current_weight)
                }
            }

            var totalCollectedWeight = collectionWeights.reduce(reduceFunc);

            var compactorInfo = <tr><th>Loading ......</th></tr>
            if(this.state.renderWeightInformation){
                compactorInfo = compactors.map(compactor => (
                    <tr>
                         <th>{compactor.compactorID}</th>
                         <th>{compactor.current_weight}</th>
                         <th>{compactor.max_weight}</th>
                         <th>{(Math.round((compactor.current_weight / compactor.max_weight)*100 )) + ' %'}</th>
                         <th>{Math.round((compactor.current_weight / compactor.max_weight)*100 ) < 25 ? 
                            <span><img
                            src={require('./greendot.png')}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                            /></span> : 
                         Math.round((compactor.current_weight / compactor.max_weight)*100 ) < 50 ? 
                            <span><img
                            src={require('./yellowdot.png')}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                            /></span> : 
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

          }

          if(this.state.renderWeightInformation){
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
                    <div>
                        <div>&nbsp;</div>
                        <Container>
                        <Row>
                            <Col style={{textAlign: 'center', fontSize : '1.4em'}}>Collection Weight</Col>
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
                            <th>Level</th>
                        </tr>
                        </thead>
                        <tbody>
                        {compactorInfo}
                        </tbody>
                    </Table>
                    <button onClick={()=>{this.setState({renderWeightInformation: false})}}>Back</button>
               </div>
               <div className="grid-item grid-item-mapDashboard">
                   <Mapping selectedAddress={this.state.selectedAddress} compactorFilledLevel={this.state.compactorFilledLevel} token={this.props.location.state.token} />
               </div>
           </div>
            )
            }else{
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
                                         {/* <Col className='alarmRaisedNumber'>1000</Col> */}
                                <Col className='alarmRaisedNumber'>{totalCollectedWeight}</Col>
                                    </Row>
                                </Container>
                                <Container>
                                    <Row>
                                        <Col onClick={()=>{this.toggleRightArrow()}} style={{textAlign : 'center', cursor:'pointer'}}><FontAwesomeIcon icon={faArrowLeft} /></Col>
                                        <Col style={{textAlign : 'center'}}>Section {this.state.compactorSection}</Col>
                                        <Col onClick={()=>{this.toggleLeftArrow()}} style={{textAlign : 'center', cursor:'pointer'}}><FontAwesomeIcon icon={faArrowRight} /></Col>
                                    </Row>
                                </Container>
                                <div>&nbsp;</div>
                                <button onClick={this.renderWeightInformation}>Collection Weight</button>
                        </div>
                        <div className="grid-item grid-item-mapDashboard">
                            <Mapping selectedAddress={this.state.selectedAddress} compactorFilledLevel={this.state.compactorFilledLevel} token={this.props.location.state.token} />
                        </div>
                    </div>
                )
            }
    }
}

export default GridContainer