import React, {Component} from 'react'
import ReactDOM from "react-dom";
import './../css/compactorInfo.css'
import 'react-calendar/dist/Calendar.css';
import Mapping from './Mapping';
import NavBarContent from './NavBarContent';
import { Card, Table, Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Calendar from 'react-calendar';
const sortObjectsArray = require('sort-objects-array');
const uniq = require("uniq")

const axios = require('axios');
class GridContainer extends Component{
    constructor(props){
        super(props)
        this.state = 
        {
            'alarmSection' : 'A',
            'compactorSection' : 'A', 
            'filterSection' : '',
            'allAlarmData' : [],
            'liveAllAlarmData' : [],
            'liveAlarmData' : [],
            'livecompactorData' : [],
            'count' : 0,
            'countAlarm' : 0,
            'noOfAlarms' : 0,
            'saveCurrentCompactorID' : '',
            'selectStartDate' : '',
            'selectEndDate' : '',
            'liveCompactorLoaded' : false,
            'liveAlarmsLoaded' : false,
            'renderWeightInformation' : false,
            'renderAlarmInformation' : false,
            'renderReportPage' : false,
            'renderEquipmentPage' : false,
            'pressLeftArrowWeight' : false,
            'pressRightAlarmArrowWeight' : false,
            'pressLeftAlarmArrowWeight' : false,
            'handleRedirectToMap' : false,
        }
        this.renderWeightInformation = this.renderWeightInformation.bind(this)
        this.toggleAlarmLeftArrow = this.toggleAlarmLeftArrow.bind(this)
        this.toggleAlarmRightArrow = this.toggleAlarmRightArrow.bind(this)
        this.toggleRightArrow = this.toggleRightArrow.bind(this)
        this.toggleLeftArrow = this.toggleLeftArrow.bind(this)
        this.handleRedirectToMap = this.handleRedirectToMap.bind(this)
        this.renderReportPage = this.renderReportPage.bind(this)
        this.renderEquipmentPage = this.renderEquipmentPage.bind(this)
    }

    componentDidMount(){
        var token = this.props.location.state.token
        var config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/allCompactorInfos/live`,config)
        .then((response)=> {
            console.log(response)
            this.setState({
            livecompactorData : response.data.compactorInfo,
            liveCompactorLoaded: true
            })
        })
        .catch(function (error) {
            console.log(error);
        })

        axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/getTodaysAlarms/live`,config)
        .then((response)=> {
            console.log(response)
            this.setState({
                liveAlarmData : response.data.alarms,
                liveAlarmsLoaded: true
            })
        })
        .catch(function (error) {
            console.log(error);
        })

        axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/getAllAlarms/live`,config)
        .then((response)=> {
            this.setState({
                liveAllAlarmData : response.data.alarmInfo,
            })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    reduceFunc(total, num){
        return total + num
    }

    handleRedirectToMap(){
        this.setState({handleRedirectToMap : true})
    }

    toggleAlarmRightArrow(){
        var sections = ['A','B']
        var countAlarm = this.state.countAlarm
        countAlarm = countAlarm +1
        this.setState({countAlarm : countAlarm})
        var currentSection = sections[countAlarm]
        this.setState({alarmSection : currentSection, pressRightAlarmArrowWeight : true, pressLeftAlarmArrowWeight : false})
    }

    toggleAlarmLeftArrow(){
        var sections = ['A','B']
        var countAlarm = this.state.countAlarm
        countAlarm = countAlarm -1
        this.setState({countAlarm : countAlarm})
        var currentSection = sections[countAlarm]
        this.setState({alarmSection : currentSection, pressRightAlarmArrowWeight : false, pressLeftAlarmArrowWeight : true})
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

    renderReportPage(){
        this.setState(
            {
                renderReportPage : true
            }
        )
    }

    renderEquipmentPage(){
        this.setState(
            {
                renderEquipmentPage : true
            }
        )
    }

    render(){   
        var dashboard = 
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
                <Col style={{cursor:'pointer'}} onClick={this.handleRedirectToMap}>Map</Col>
            </Row>
        </Container>
        <Container className="blueBorder adjustPaddingContent">
            <Row>
                <Col style={{cursor:'pointer'}} onClick={this.renderEquipmentPage}>Equipment</Col>
            </Row>
        </Container>
        <Container className="blueBorder adjustPaddingContent">
            <Row>
                <Col style={{cursor:'pointer'}} onClick={this.renderReportPage}>Report</Col>
            </Row>
        </Container>
        <Container className="blueBorder adjustPaddingContent">
            <Row>
                <Col>Admin</Col>
            </Row>
        </Container>
</div>
        if(this.state.liveAlarmsLoaded){

            var alarmsData = this.state.liveAlarmData

            if(this.state.renderReportPage){
                var allAlarmData = this.state.liveAllAlarmData
                console.log(allAlarmData)
                //sort here
                allAlarmData = sortObjectsArray(allAlarmData, 'ID')
                var starttime = this.state.selectStartDate
                var endtime = this.state.selectEndDate

                if(starttime !== '' && endtime !== ''){
                    var filterAlarmData = []
                    for(var i=0;i<allAlarmData.length;i++){
                        if(starttime !== endtime){
                            var todaydate = new Date(allAlarmData[i]['ts']).toISOString().split('T')[0];
                            console.log([todaydate,allAlarmData[i]['ts'],startTime])
                            todaydate = new Date(todaydate).getTime()
                            var startTime = new Date(starttime).getTime()
                            var endTime = new Date(starttime).getTime()

                            // if(startTime <= todaydate && endtime >= todaydate){
                            //     filterAlarmData.push(allAlarmData[i])
                            // }
                        }
                        else{
                            if(startTime < todaydate){
                                filterAlarmData.push(allAlarmData[i])
                            }
                        }
                    }

                    allAlarmData = filterAlarmData
                    filterAlarmData = []
                }

                allAlarmData = allAlarmData.map(alarm => (
                    <tr>
                         <th>{alarm.ID}</th>
                         <th>{alarm.Status}</th>
                         <th>{alarm.ts}</th>
                         <th>{alarm.Type}</th>
                     </tr>
               ))
                return(
                    <div className="grid-container-report">
                          <div className='grid-item grid-item-01-compactor'>
                           <NavBarContent userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                          </div>
                        <div className="grid-item grid-item-report-sideDashboard whiteBG">
                      <Container className="blueBG adjustPadding">
                          <Row>
                              <Col style={{textAlign : 'center'}}>Report</Col>
                          </Row>
                          </Container>
                          <Container className="blueBorder adjustPaddingContent">
                          <Row>
                              <Col style={{textAlign : 'center'}} onClick={()=>{
                                  this.setState({renderReportPage : false})
                              }}>Dashboard</Col>
                          </Row>
                          </Container>
                      </div>
                      <div className="grid-item grid-item-report-calender whiteBG">
  
                          <div>&nbsp;</div>
                          <Container>
                              <Row>
                                  <Col> 
                                      Start Date : 
                                  </Col>
                                  <Col> 
                                  </Col>
                                  <Col>
                                      End Date :
                                  </Col>
                              </Row>
                          </Container>
                          <Container>
                              <Row>
                                  <Col >
                                      <Calendar style={{ textAlign: 'center' }}
                                          onChange={(value, event)=>{
                                            var events = new Date(value).toISOString().split('T')[0];
                                            this.setState({
                                                selectStartDate: events
                                            })
                                          }}
                                      />
                                  </Col>
                                  <Col></Col>
                                  <Col>
                                      <Calendar
                                          onChange={(value, event)=>{
                                            var events = new Date(value).toISOString().split('T')[0];
                                            this.setState({
                                                selectEndDate: events
                                            })
                                          }}
                                      />
                                  </Col>
                              </Row>
                          </Container>
  
                         
                      </div>
                      <div className="grid-item grid-item-report-table whiteBG">
                            <Container>
                                <Row>
                                    <Col style={{textAlign : 'center', fontSize: '1.6em'}}> 
                                        Alarm Report 
                                    </Col>
                                </Row>
                            </Container>
                                    <div>&nbsp;</div>
                            <Container>
                                <Row> 
                                    <Col> 
                                    <Table striped bordered hover responsive> 
                                        <thead>
                                        <tr>
                                            <th>Equipment ID</th>
                                            <th>Alarm Status</th>
                                            <th>Alarm TimeStamp</th>
                                            <th>Fault Type</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {allAlarmData}
                                        </tbody>
                                    </Table>
                                    </Col>
                                </Row> 
                            </Container>
                            <div>&nbsp;</div>
                            <Container>
                                <Row> 
                                    <Col>
                                        <button style={{ textAlign: 'left', backgroundColor : '#1f4e78', borderRadius: '5px', color: 'white', padding : '3px'}}>Generate</button>
                                    </Col> 
                                    <Col></Col> 
                                    <Col></Col> 
                                </Row> 
                            </Container>
                      </div>
                      
                    </div>
                )
            }

            var alarms = []

            if(this.state.pressLeftAlarmArrowWeight || this.state.pressRightAlarmArrowWeight){
                var alarmSection = this.state.alarmSection
            }else{
                var alarmSection = 'A'
            }

            for(i=0;i<alarmsData.length;i++){
                if(alarmsData[i]['sectionArea'] == alarmSection){
                    alarms.push(alarmsData[i])
                }
            }
            var alarmTable = alarms.map(al => (
                <tr>
                     <th>{al.ID}</th>
                     <th>{al.ts}</th>
                     <th>{al.Type}</th>
                     <th>{al.Status}</th>
                 </tr>
            ))
            var noOfAlarms = alarms.length

        }
        if(this.state.liveCompactorLoaded){
            
            var compactors = this.state.livecompactorData
            var compactorsSort = compactors.reduce((r, a)=> {
                r[a.ID] = r[a.ID] || [];
                r[a.ID].push(a);
                return r;
            }, Object.create(null));
            var compactorData = []

            for (var key in compactorsSort) {
                compactorData.push(compactorsSort[key][( (compactorsSort[key].length) -1)])
            }

            compactors = compactorData
            var allCompactors = compactors
            if(this.state.handleRedirectToMap){
                var renderlistOfCompactorID = allCompactors.map(compactor => (
                    <Container style={{cursor:'pointer'}} className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col onClick={()=>{
                                this.setState({
                                    selectedAddress : compactor.address
                                })
                            }}>{compactor.compactorID}</Col>
                        </Row>
                    </Container>
               ))
               var mapDashboard = 
                <div className="grid-item-map-sideDashboard whiteBG">
                    <Container className="blueBG adjustPadding">
                    <Row>
                        <Col style={{textAlign : 'center'}}>Map</Col>
                    </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col onClick={()=>{
                                this.setState(
                                    {
                                        handleRedirectToMap : false
                                    }
                                )
                            }} style={{cursor:'pointer'}}>Dashboard</Col>
                        </Row>
                    </Container>
                    {renderlistOfCompactorID}
                </div>
            }

            let reduceFunc = this.reduceFunc
            var collectionWeights = []
            for(var i=0;i<compactors.length;i++){
                if(!(isNaN(compactors[i]) && compactors[i].Weight <= 0) ){
                    collectionWeights.push(compactors[i].Weight)
                }
            }
            if(collectionWeights.length <= 0){
                var totalCollectedWeight = 0;
            }else{
                var totalCollectedWeight = collectionWeights.reduce(reduceFunc);
                totalCollectedWeight = Math.round(totalCollectedWeight)
                console.log(totalCollectedWeight)
            }

            var compactorInfo = <tr><th>Loading ......</th></tr>

            if(this.state.renderWeightInformation || this.state.renderEquipmentPage){
                // console.log(compactors[0].FilledLevel-Weight)
                compactorInfo = compactors.map(compactor => (
                    <tr>
                        <th>{compactor.ID}</th>
                        <th>{compactor.ts}</th>
                        <th>{compactor.Weight}</th>
                        <th>{compactor['FilledLevel-Weight']}</th>
                        <th>{Math.round(compactor['FilledLevel-Weight']) < 25 ? 
                            <span><img
                            src={require('./greendot.png')}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                            /></span> : 
                            Math.round(compactor['FilledLevel-Weight']) < 50 ? 
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

          if(this.state.renderEquipmentPage){
            return(
                <div className="grid-container-equipment">
                    <div className='grid-item grid-item-01-compactor'>
                        <NavBarContent userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                    </div>
                    <div className="grid-item-equipment-dashboard whiteBG">
                        <Container className="blueBG adjustPadding">
                        <Row>
                            <Col style={{textAlign : 'center'}}>Equipment</Col>
                        </Row>
                        </Container>
                        <Container className="blueBorder adjustPaddingContent">
                            <Row>
                                <Col onClick={()=>{
                                    this.setState(
                                        {
                                            renderEquipmentPage : false
                                        }
                                    )
                                }} style={{cursor:'pointer'}}>Dashboard</Col>
                            </Row>
                        </Container>
                    </div>
                    <div className="grid-item-equipment-map whiteBG">
                    <Table striped bordered hover responsive> 
                        <thead>
                        <tr>
                            <th>Equipment ID</th>
                            <th>TimeStamp</th>
                            <th>Collection Weight</th>
                            <th>Weight Percentage</th>
                            <th>Level</th>
                        </tr>
                        </thead>
                        <tbody>
                        {compactorInfo}
                        </tbody>
                    </Table>
                    </div>
                </div>
            )
        }

          if(this.state.renderWeightInformation){
            var weight = 
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
                        <th>Equipment ID</th>
                        <th>TimeStamp</th>
                        <th>Collection Weight</th>
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
          }else{
            var weight = 
            <div className="grid-item grid-item-weightDashboard whiteBG">
                <Container>
                    <Row>
                        <Col className='alarmTitle'>Weight</Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        {/* <Col className='alarmRaisedNumber'>1000</Col> */}
                <Col className='alarmRaisedNumber'>
                    {totalCollectedWeight}
                </Col>
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
        }
        if(this.state.renderAlarmInformation){
            var alarmsSection = 
            <div className="grid-item grid-item-alarmDashboard whiteBG">
                 <Table striped bordered hover>
                    <thead>
                    <tr>
                        <th>Equipment ID</th>
                        <th>Date</th>
                        <th>Failure Mode</th>
                        <th>Alarm Status</th>
                    </tr>
                    </thead>
                    <tbody>
                      {alarmTable}
                    </tbody>
                </Table>
                <div>&nbsp;</div>
                <button onClick={()=>{this.setState({renderAlarmInformation : false})}}>Back</button>
            </div>
    }else{
        var alarmsSection = 
            <div className="grid-item grid-item-alarmDashboard whiteBG">
                <Container>
                    <Row>
                        <Col className='alarmTitle'>Alarm</Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col className='alarmRaisedNumber'>{noOfAlarms}</Col>
                    </Row>
                </Container>
                <Container>
                    <Row>
                        <Col onClick={()=>{this.toggleAlarmLeftArrow()}} style={{textAlign : 'center', cursor:'pointer'}}><FontAwesomeIcon icon={faArrowLeft} /></Col>
                        <Col style={{textAlign : 'center'}}>Section {this.state.alarmSection}</Col>
                        <Col onClick={()=>{this.toggleAlarmRightArrow()}} style={{textAlign : 'center', cursor:'pointer'}}><FontAwesomeIcon icon={faArrowRight} /></Col>
                    </Row>
                </Container>
                <div>&nbsp;</div>
                <button onClick={()=>{
                    this.setState({renderAlarmInformation : true})
                }}>Equipment Fault</button>
            </div>
    }

        if(this.state.handleRedirectToMap){
            return(
                <div className='grid-container-map'>
                     <div className='grid-item grid-item-01-compactor'>
                         <NavBarContent userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                    </div>
                    {mapDashboard}
                    <div className="grid-item grid-item-map-map">
                        <Mapping filterSection={this.state.filterSection} equipmentMap={this.state.handleRedirectToMap} selectedAddress={this.state.selectedAddress} compactorFilledLevel={this.state.compactorFilledLevel} token={this.props.location.state.token} />
                    </div>
                    <div className="grid-item-map-legend whiteBG">
                    <button>All Equipment</button>
                    <button onClick={()=>{
                        this.setState({
                            filterSection : 'A'
                        })
                    }}>Section A</button>
                    <button onClick={()=>{
                        this.setState({
                            filterSection : 'B'
                        })
                    }}>Section B</button>
                    <div>&nbsp;</div>
                    <Container>
                        <Row>
                            <Col style={{textAlign: 'center' , fontSize: '1.4em'}}>Legend</Col>
                        </Row>
                    </Container>
                    <div>&nbsp;</div>
                    <Container>
                        <Row>
                            <Col style={{textAlign: 'center'}}><img
                            src={require('./greendot.png')}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                            /></Col>
                            <Col style={{textAlign: 'center'}}><img
                            src={require('./yellowdot.png')}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                            /></Col>
                            <Col style={{textAlign: 'center'}}><img
                            src={require('./reddot.png')}
                            width="30"
                            height="30"
                            className="d-inline-block align-top"
                            alt="React Bootstrap logo"
                            /></Col>
                        </Row>
                    </Container>
                    <div>&nbsp;</div>
                    <Container>
                        <Row>
                            <Col style={{textAlign: 'center'}}>Compactor less than 25%</Col>
                            <Col style={{textAlign: 'center'}}>Compactor less than 50%</Col>
                            <Col style={{textAlign: 'center'}}>Compactor more than 75%</Col>
                        </Row>
                    </Container>
                    </div>
                </div>
            )
        }else{
            return(
                <div className='grid-container-compactor'>
                     <div className='grid-item grid-item-01-compactor'>
                         <NavBarContent userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                    </div>
                    {dashboard} 
                    {weight}
                    {alarmsSection}
                    <div className="grid-item grid-item-mapDashboard">
                        <Mapping selectedAddress={this.state.selectedAddress} compactorFilledLevel={this.state.compactorFilledLevel} token={this.props.location.state.token} />
                    </div>
                </div>
            )
        }
    }
}

export default GridContainer