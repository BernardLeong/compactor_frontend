import React, {Component} from 'react'
import ReactDOM from "react-dom";
import './../css/compactorInfo.css'
import 'react-calendar/dist/Calendar.css';
import Mapping from './Mapping';
import GoogleApiWrapper from './GoogleApiWrapper';
import NavBarContent from './NavBarContent';
import { Alert, Table, Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons'
import Calendar from 'react-calendar';
const sortObjectsArray = require('sort-objects-array');
const uniq = require("uniq")
const moment = require("moment")
const CryptoJS = require("crypto-js");
const cryptKey = "someKey"

const axios = require('axios');
class GridContainer extends Component{
    constructor(props){
        super(props)
        this.state = 
        {
            'alarmSection' : 'CBM',
            'compactorSection' : 'CBM', 
            'currentCompactorID' : '',
            'equipmentSearchResult' : '',
            'filterSection' : '',
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
            'handleRedirectToAdminPage' : false,
            'registeredUser' : false,
            'paginationDefaultPage' : 1,
            'paginationAlarmDefaultPage' : 1,
            'paginationAlarmReportPage' : 1,
            'userTypeOption' : '',
            'username' : '',
            'password' : ''
        }
        this.renderWeightInformation = this.renderWeightInformation.bind(this)
        this.toggleAlarmLeftArrow = this.toggleAlarmLeftArrow.bind(this)
        this.toggleAlarmRightArrow = this.toggleAlarmRightArrow.bind(this)
        this.toggleRightArrow = this.toggleRightArrow.bind(this)
        this.toggleLeftArrow = this.toggleLeftArrow.bind(this)
        this.handleRedirectToMap = this.handleRedirectToMap.bind(this)
        this.handleRedirectToAdminPage = this.handleRedirectToAdminPage.bind(this)
        this.renderReportPage = this.renderReportPage.bind(this)
        this.renderEquipmentPage = this.renderEquipmentPage.bind(this)
        this.handleRegisterUserType = this.handleRegisterUserType.bind(this)
        this.handleRegisterCreditials = this.handleRegisterCreditials.bind(this)
        this.handleRegisterUser = this.handleRegisterUser.bind(this)
        this.handleEquipmentSearch = this.handleEquipmentSearch.bind(this)
    }

    componentDidMount(){
        var token = this.props.location.state.token
        var config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/CompactorCurrentStatus/live`,config)
        .then((response)=> {
            console.log(response)
            this.setState({
            livecompactorData : response.data.compactorCurrentStatus,
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

        axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/allCompactorAddresses/live`,config)
        .then((response)=> {
            this.setState({
                liveCompactorAddresses : response.data.compactorAddresses,

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

    handleRedirectToAdminPage(){
        this.setState({handleRedirectToAdminPage : true})
    }

    handleRegisterUserType(event){ 
        this.setState({ 
            userTypeOption : event.target.value
        });
    }

    handleRegisterCreditials(event){
        var name = event.target.name
        this.setState({ 
            [name] : event.target.value
        });
    }

    handleEquipmentSearch(event){
        var name = event.target.name
        this.setState({ 
            [name] : event.target.value
        });
    }

    handleRegisterUser(){
        var type = 'user'
        if(this.state.userTypeOption == 'Enginner'){
            type = 'serviceUser'
        }

        if(this.state.userTypeOption == 'Admin'){
            type = 'admin'
        }

        var body = {
            "username" : this.state.username,
            "password" : this.state.password,
            "type" : type
        }

        axios.post('http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/registerUser', body).then((result)=>{
            console.log(result)
            this.setState({registeredUser: result.data.success, error: result.data.error})
        }).catch((err)=>{
            console.log(err)
        })
    }

    toggleAlarmRightArrow(){
        var sections = ['CBM']
        var countAlarm = this.state.countAlarm
        countAlarm = countAlarm +1
        this.setState({countAlarm : countAlarm})
        var currentSection = sections[countAlarm]
        if(currentSection){
            this.setState({alarmSection : currentSection, pressRightAlarmArrowWeight : true, pressLeftAlarmArrowWeight : false})
        }
    }

    toggleAlarmLeftArrow(){
        var sections = ['CBM']
        var countAlarm = this.state.countAlarm
        countAlarm = countAlarm -1
        this.setState({countAlarm : countAlarm})
        var currentSection = sections[countAlarm]
        if(currentSection){
            this.setState({alarmSection : currentSection, pressRightAlarmArrowWeight : false, pressLeftAlarmArrowWeight : true})
        }
    }

    toggleRightArrow(){
        var sections = ['CBM']
        var count = this.state.count
        count = count -1
        this.setState({count : count})
        var currentSection = sections[count]
        if(currentSection){
            this.setState({compactorSection : currentSection, pressRightArrowWeight : true, pressLeftArrowWeight : false})
        }
    }

    toggleLeftArrow(){
        var sections = ['CBM']
        var count = this.state.count
        count = count + 1
        this.setState({count : count})
        var currentSection = sections[count]
        if(currentSection){
            this.setState({compactorSection : currentSection, pressRightArrowWeight : false, pressLeftArrowWeight : true})
        }
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
                <Col style={{cursor : 'pointer'}}>Dashboard</Col>
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
                <Col style={{cursor:'pointer'}} onClick={this.handleRedirectToAdminPage} >Admin</Col>
            </Row>
        </Container>
</div>

if(this.state.handleRedirectToAdminPage){
    if(this.state.registeredUser){
        var message = 
        <Alert variant='success'>
            Successfully Registered User
        </Alert>
    }else{
        var message = <span></span>
    }
    return(
        <div className="grid-container-adminPage">
            <div className='grid-item grid-item-01-compactor whiteBG'>
                <NavBarContent userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
            </div>
            <div className="grid-item grid-container-adminPage-dashBoard whiteBG">

                <Container className="blueBG adjustPadding">
                    <Row>
                        <Col style={{textAlign : 'center'}}>Admin</Col>
                    </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                    <Row>
                        <Col style={{textAlign : 'center', cursor: 'pointer'}} onClick={()=>{
                            this.setState({handleRedirectToAdminPage : false})
                        }}>Dashboard</Col>
                    </Row>
                    </Container>
            </div>
            <div className="grid-item grid-container-adminPage-registerPage whiteBG">
                <div>&nbsp;</div>
                <Container>
                    <Row>
                        <Col style={{textAlign : 'center', fontSize: '1.4em'}}>Register User</Col>
                    </Row>
                </Container>
                <div>&nbsp;</div>
                <Container>
                    <Row>
                        <Col>
                            {message}
                            <Form>
                                <Form.Group onChange={this.handleRegisterUserType} controlId="exampleForm.ControlSelect1">
                                    <Form.Label>User Type</Form.Label>
                                    <Form.Control as="select">
                                    <option>User</option>
                                    <option>Enginner</option>
                                    <option>Admin</option>
                                    </Form.Control>
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                <div><Form.Label>Username</Form.Label></div>
                                    <Form.Control onChange={this.handleRegisterCreditials} name='username' type="username" placeholder="Enter username" />
                                </Form.Group>
                                <Form.Group controlId="formBasicPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control onChange={this.handleRegisterCreditials} name='password' type="password" placeholder="Password" />
                                </Form.Group>
                                <Button onClick={this.handleRegisterUser} variant="primary">
                                    Submit
                                </Button>
                                <span>&nbsp;</span>
                                <Button onClick={()=>{
                                    this.setState({handleRedirectToAdminPage : false})
                                }} variant="primary">
                                    Back
                                </Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>
    )
}
        if(this.state.liveAlarmsLoaded){

            var alarmsData = this.state.liveAlarmData

            if(this.state.renderReportPage){
                var allAlarmData = this.state.liveAllAlarmData
                //sort here
                allAlarmData = sortObjectsArray(allAlarmData, 'ID')
                var starttime = this.state.selectStartDate
                var endtime = this.state.selectEndDate

                var downloadUrl = false
                if(starttime && endtime){
                    var json = {"from" : starttime,"to" : endtime}
                    var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json), cryptKey).toString();
                    ciphertext = encodeURIComponent(ciphertext)
                    downloadUrl = `http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/generatePDF/${ciphertext}`
                }

                if(starttime !== '' && endtime !== ''){
                    var filterAlarmData = []
                    for(var i=0;i<allAlarmData.length;i++){
                        if(starttime !== endtime){
                            var todaydate = moment(allAlarmData[i]['ts']).format()
                            todaydate = new Date(todaydate).getTime()
                            var startTime = new Date(starttime).getTime()
                            var endTime = new Date(endtime).getTime()
                            if(startTime <= todaydate && endTime >= todaydate){
                                filterAlarmData.push(allAlarmData[i])
                            }
                        }
                        else{
                            var todaydate = moment(allAlarmData[i]['ts']).format()
                            todaydate = new Date(todaydate).getTime()
                            var startTime = new Date(starttime).getTime()
                            var endTime = new Date(endtime).getTime()
                            if(startTime <= todaydate){
                                filterAlarmData.push(allAlarmData[i])
                            }
                        }
                    }

                    allAlarmData = filterAlarmData
                    filterAlarmData = []
                }

                //paginate here
                const chunkyReportAlarm = (arr, size) =>
                Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                    arr.slice(i * size, i * size + size)
                );

                var maxLength = 11

                if(allAlarmData.length < maxLength){
                    var maxPage = 1
                }else{
                    var maxPage = Math.ceil((allAlarmData.length / maxLength))
                }
                var range = []
                for(i=1;i<=maxPage;i++){
                    range.push(i)
                }

                var alarmReportPaginate = range.map(page => <a onClick={()=>{this.setState(
                    {
                        paginationAlarmReportPage : page
                    }
                    )}} style={{cursor:'pointer'}}>{page}</a>)
                    
                    var paginationAlarmPages = 
                    <div style={{fontSize: '0.8em'}} className="pagination">
                        {alarmReportPaginate}
                    </div>

                if(allAlarmData.length <= 0){
                    var renderAlarms = 
                    <tr>
                    </tr>
                }else{
                    var paginatedAlarms = chunkyReportAlarm(allAlarmData,maxLength)
                    var renderAlarms = paginatedAlarms[this.state.paginationAlarmReportPage -1]
                    allAlarmData = renderAlarms.map(al => (
                        <tr>
                            <th>{al.ID}</th>
                            <th>{al.ts}</th>
                            <th>{al.Type}</th>
                            <th>{al.Status}</th>
                        </tr>
                    ))
                }

                if(downloadUrl){
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
                                  <Col style={{textAlign : 'center', cursor: 'pointer'}} onClick={()=>{
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
                                                var events = moment(value).format();
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
                                                var events = moment(value).endOf('day').format();
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
                                                <th>Alarm Trigger Timestamp</th>
                                                <th>Alarm Type</th>
                                                <th>Fault Type</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {allAlarmData}
                                            </tbody>
                                        </Table>
                                        {paginationAlarmPages}
                                        </Col>
                                    </Row> 
                                </Container>
                                <div>&nbsp;</div>
                                <Container>
                                    <Row> 
                                        <Col>
                                        <a style={{ textAlign: 'left', backgroundColor : '#1f4e78', borderRadius: '5px', color: 'white', padding : '3px'}} href={downloadUrl}>Generate</a>
                                            {/* <button style={{ textAlign: 'left', backgroundColor : '#1f4e78', borderRadius: '5px', color: 'white', padding : '3px'}}>Generate</button> */}
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
                                  <Col style={{textAlign : 'center', cursor: 'pointer'}} onClick={()=>{
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
                                                var events = moment(value).format();
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
                                                var events = moment(value).endOf('day').format();
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
                                                <th>Alarm Trigger Timestamp</th>
                                                <th>Alarm Type</th>
                                                <th>Fault Type</th>
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {allAlarmData}
                                            </tbody>
                                        </Table>
                                        {paginationAlarmPages}
                                        </Col>
                                    </Row> 
                                </Container>
                                <div>&nbsp;</div>
                                <Container>
                                    <Row> 
                                        <Col>
                                        <a style={{ textAlign: 'left', backgroundColor : 'gray', borderRadius: '5px', color: 'black', padding : '3px'}} disabled="disabled">Generate</a>
                                            {/* <button style={{ textAlign: 'left', backgroundColor : '#1f4e78', borderRadius: '5px', color: 'white', padding : '3px'}}>Generate</button> */}
                                        </Col> 
                                        <Col></Col> 
                                        <Col></Col> 
                                    </Row> 
                                </Container>
                          </div>
                          
                        </div>
                    )
                }
            }

            var alarms = []

            if(this.state.pressLeftAlarmArrowWeight || this.state.pressRightAlarmArrowWeight){
                var alarmSection = this.state.alarmSection
            }else{
                var alarmSection = 'CBM'
            }

            for(i=0;i<alarmsData.length;i++){
                if(alarmsData[i]['sectionArea'] == alarmSection){
                    alarms.push(alarmsData[i])
                }
            }
            //mark
            var chunkAlarm = (arr, size) =>
            Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
            arr.slice(i * size, i * size + size)
            );
            //mark
            alarms = sortObjectsArray(alarms, 'ts', {order: 'desc'})
            if(alarms.length < 5){
                var maxPage = 1
            }else{
                var maxPage = Math.ceil((alarms.length /5))
            }
            
            var range = []
            for(i=1;i<=maxPage;i++){
                range.push(i)
            }
            
            var alarmPages = range.map(page => <a onClick={()=>{this.setState(
                {
                    paginationAlarmDefaultPage : page
                }
                )}} style={{cursor:'pointer'}}>{page}</a>)
                
                var paginationAlarmPages = 
                <div style={{fontSize: '0.8em'}} className="pagination">
            {alarmPages}
          </div>

                if(alarms.length <= 0){
                    var renderAlarms = 
                    <tr>
                    </tr>
                }else{
                    var paginatedAlarms = chunkAlarm(alarms,5)
                    var renderAlarms = paginatedAlarms[this.state.paginationAlarmDefaultPage -1]
                    var alarmTable = renderAlarms.map(al => (
                        <tr>
                            <th>{al.ts}</th>
                            <th>{al.ID}</th>
                            <th>{al.Type}</th>
                            <th>{al.Status}</th>
                        </tr>
                    ))
                }
            var noOfAlarms = alarms.length
        }
        if(this.state.liveCompactorLoaded){
            
            var compactors = this.state.livecompactorData
            var filteredSectionData = []
            var currentSection = this.state.compactorSection
            for(var i=0;i<compactors.length;i++){
                console.log(currentSection)
                if(compactors[i].Section == currentSection){
                    filteredSectionData.push(compactors[i])
                }
            }
            compactors = filteredSectionData;
            console.log(compactors)
            var compactorsSort = compactors.reduce((r, a)=> {
                r[a.EquipmentID] = r[a.EquipmentID] || [];
                r[a.EquipmentID].push(a);
                return r;
            }, Object.create(null));
            var compactorData = []

            for (var key in compactorsSort) {
                compactorData.push(compactorsSort[key][( (compactorsSort[key].length) -1)])
            }

            compactors = compactorData
            var allCompactors = compactors
            if(this.state.handleRedirectToMap){
                allCompactors = sortObjectsArray(allCompactors, 'ID')
                var renderlistOfCompactorID = allCompactors.map(compactor => (
                    <Container onClick={()=>{
                        this.setState({currentCompactorID : compactor.ID})
                    }} style={{cursor:'pointer'}} className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col>{compactor.EquipmentID}</Col>
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
            }
            //mark
            console.log(compactors)
            var compactorInfo = <tr><th>Loading ......</th></tr>

            if(this.state.renderWeightInformation || this.state.renderEquipmentPage || this.state.handleRedirectToMap){
                const chunky = (arr, size) =>
                Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                    arr.slice(i * size, i * size + size)
                );

                if(this.state.handleRedirectToMap){
                    var maxLength = 3
                }else if(this.state.renderEquipmentPage){
                    var maxLength = 8
                }else{
                    var maxLength = 5
                }
                //mark
                compactors = sortObjectsArray(compactors, 'ts', {order: 'desc'})

                if(this.state.equipmentSearchResult !== ''){
                    //filter using search bar result
                    //filter only ID and ts
                    var filterSearch = []
                    for(var i=0;i<compactors.length;i++){
                        var compactorID = compactors[i].ID
                        var timestamp = compactors[i].ts
                        if(compactorID.includes(this.state.equipmentSearchResult) || timestamp.includes(this.state.equipmentSearchResult)){
                            filterSearch.push(compactors[i])
                        }
                    }
                    if(filterSearch.length > 0){
                        compactors = filterSearch
                    }
                }

                if(compactors.length < maxLength){
                    var maxPage = 1
                }else{
                    var maxPage = Math.ceil((compactors.length / maxLength))
                }
                var range = []
                for(i=1;i<=maxPage;i++){
                    range.push(i)
                }

                if(this.state.handleRedirectToMap){
                    var pages = range.map(page => <a onClick={()=>{this.setState(
                        {
                            paginationDefaultPage : page
                        }
                    )}} style={{cursor:'pointer', fontSize: '0.6em'}}>{page}</a>)
                }else{
                    var pages = range.map(page => <a onClick={()=>{this.setState(
                        {
                            paginationDefaultPage : page
                        }
                    )}} style={{cursor:'pointer'}}>{page}</a>)
                }
                var paginationPages = 
                <div style={{fontSize: '0.8em'}} className="pagination">
                {pages}
              </div>

                if(compactors.length <= 0){
                    compactorInfo = <tr><th></th></tr>
                }else{
                    for(var i=0;i<compactors.length;i++){
                        if(compactors[i]['Weight'] <= 0){
                            compactors[i]['Weight'] = 0
                            compactors[i]['FilledLevel-Weight'] = 0
                        }else{
                            compactors[i]['Weight'] = Math.round(compactors[i]['Weight'])
                            compactors[i]['FilledLevel-Weight'] = Math.round(compactors[i]['FilledLevel-Weight'])
                        }
                    }
                        var paginatedCompactors = chunky(compactors,maxLength)
                        var renderCompactors = paginatedCompactors[this.state.paginationDefaultPage -1]
                        compactorInfo = renderCompactors.map(compactor => (
                            <tr>
                                <th style={{textAlign : 'center'}}>{compactor["WeightInformation"]["ts"]}</th>
                                <th style={{textAlign : 'center'}}>{compactor.EquipmentID}</th>
                                <th style={{textAlign : 'center'}}>{compactor["WeightInformation"]["WeightValue"]}</th>
                                <th style={{textAlign : 'center'}}>{compactor["WeightInformation"]['FilledLevel']}</th>
                                <th style={{textAlign : 'center'}}>{Math.round(compactor["WeightInformation"]['FilledLevel']) <= 70 ? 
                                    <span><img
                                    src={require('./greendot.png')}
                                    width="30"
                                    height="30"
                                    className="d-inline-block align-top"
                                    alt="React Bootstrap logo"
                                    /></span> : 
                                    Math.round(compactor["WeightInformation"]['FilledLevel']) <= 90 ? 
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
          }

          if(this.state.renderEquipmentPage){
              console.log(this.state.equipmentSearchResult)
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
                    <Container>
                        <Row>
                            <Col>
                            </Col>
                            <Col>    
                            </Col>
                            <Col>    
                            </Col>
                            <Col>
                                <InputGroup className="mb-3">
                                    <FormControl onChange={this.handleEquipmentSearch}
                                    name="equipmentSearchResult"
                                    placeholder="Search"
                                    />
                                </InputGroup>
                            </Col>
                        </Row>
                    </Container>
                    <Table striped bordered hover responsive> 
                        <thead>
                        <tr>
                            <th style={{textAlign:'center'}}>TimeStamp</th>
                            <th style={{textAlign:'center'}}>Equipment ID</th>
                            <th style={{textAlign:'center'}}>Collected weight (KG)</th>
                            <th style={{textAlign:'center'}}>Collected weight (%)</th>
                            <th style={{textAlign:'center'}}>Level</th>
                        </tr>
                        </thead>
                        <tbody>
                        {compactorInfo}
                        </tbody>
                    </Table>
                    {paginationPages}
                    </div>
                </div>
            )
        }

          if(this.state.renderWeightInformation){
            var weight = 
            <div className="grid-item grid-item-weightDashboard whiteBG">
                <Table style={{fontSize : '0.9em'}} striped bordered hover> 
                    <thead>
                    <tr>
                        <th style={{textAlign : 'center'}}>TimeStamp</th>
                        <th style={{textAlign : 'center'}}>Equipment ID</th>
                        <th style={{textAlign : 'center'}}>Collected weight (KG)</th>
                        <th style={{textAlign : 'center'}}>Collected weight (%)</th>
                        <th style={{textAlign : 'center'}}>Level</th>
                    </tr>
                    </thead>
                    <tbody>
                    {compactorInfo}
                    </tbody>
                </Table>
                {paginationPages}
                <div>
                    <button onClick={()=>{this.setState({renderWeightInformation: false})}}>Back</button>
                </div>
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
            //mark
            var alarmsSection = 
            <div className="grid-item grid-item-alarmDashboard whiteBG">
                 <Table style={{fontSize: '0.9em'}} striped bordered hover>
                    <thead>
                    <tr>
                        <th>TimeStamp</th>
                        <th>Equipment ID</th>
                        <th>Failure Mode</th>
                        <th>Alarm Status</th>
                    </tr>
                    </thead>
                    <tbody>
                      {alarmTable}
                    </tbody>
                    {paginationAlarmPages}
                </Table>
                <button onClick={()=>{this.setState({renderAlarmInformation : false})}}>Back</button>
            </div>
    }else{
        var alarmsSection = 
            <div className="grid-item grid-item-alarmDashboard whiteBG">
                <Container>
                    <Row>
                        <Col className='alarmTitle'>No. of Alarms</Col>
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
                    <div className="grid-item grid-item-map-map whiteBG">

                        <Mapping handleRedirectToMap={this.state.handleRedirectToMap} currentCompactorID={this.state.currentCompactorID} compactorFilledLevel={this.state.compactorFilledLevel} token={this.props.location.state.token} />                        
                    </div>
                    <div className="grid-item grid-item-map-information whiteBG">
                        <div>
                            <Table style={{fontSize : '0.7em', padding: '0.3px'}} striped bordered hover responsive size="sm"> 
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
                            {paginationPages}
                        </div>
                    </div>
                    {/* <div className="grid-item grid-item-map-map whiteBG">
                Map
                        <Mapping handleRedirectToMap={this.state.handleRedirectToMap} currentCompactorID={this.state.currentCompactorID} compactorFilledLevel={this.state.compactorFilledLevel} token={this.props.location.state.token} />                        
                    </div> */}
                    <div className="grid-item-map-legend whiteBG">
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
                            <Col style={{textAlign: 'center'}}>Less than 70%</Col>
                            <Col style={{textAlign: 'center'}}>70 – 90%</Col>
                            <Col style={{textAlign: 'center'}}>More than 90%</Col>
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
                    <div className="grid-item grid-item-mapDashboard grayBG">
                    <Container>
                        <Row>
                            <Col ><GoogleApiWrapper/></Col>
                        </Row>
                    </Container>
                        {/* <Mapping compactorFilledLevel={this.state.compactorFilledLevel} token={this.props.location.state.token} /> */}
                    </div>
                </div>
            )
        }
    }
}

export default GridContainer