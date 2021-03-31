import React, {Component} from 'react'
import ReactDOM from "react-dom";
import './../css/compactorInfo.css'
import 'react-calendar/dist/Calendar.css';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import Mapping from './Mapping';
import ReportPage from './ReportPage';
import AdminPage from './AdminPage';
import GoogleApiWrapper from './GoogleApiWrapper';
import NavBarContent from './NavBarContent';
import { Alert, Table, Container, Breadcrumb, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faArrowRight, faStopwatch } from '@fortawesome/free-solid-svg-icons'
import {Bar, Line, Pie} from 'react-chartjs-2'
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
            'alarmType' : 'EStop',
            'currentCompactorID' : false,
            'currentCompactorCoordinates' : false,
            'equipmentSearchResult' : '',
            'filterSection' : '',
            'liveAllAlarmData' : [],
            'liveAlarmData' : [],
            'liveAlarmReport' : [],
            'livecompactorData' : [],
            'allAlarmReport' : [],
            'weightCollectionData' : [],
            'arrayofSelectedIDS' : [],
            'MapEquimentIndex' : 0,
            'count' : 0,
            'countAlarm' : 0,
            'countAlarmType' : 0,
            'noOfAlarms' : 0,
            'saveCurrentCompactorID' : '',
            'selectStartDate' : '',
            'selectEndDate' : '',
            'MapEquipmentIDLastPage' : false,
            'liveCompactorLoaded' : false,
            'liveAlarmsLoaded' : false,
            'renderWeightInformation' : false,
            'renderAlarmInformation' : false,
            'renderReportPage' : false,
            'renderWeightReportPage' : false,
            'renderEquipmentPage' : false,
            'pressLeftArrowWeight' : false,
            'pressRightAlarmArrowWeight' : false,
            'pressLeftAlarmArrowWeight' : false,
            'handleRedirectToMap' : false,
            'handleRedirectToAdminPage' : false,
            'registeredUser' : false,
            "showMapOnSide" : true,
            "showGraphOnSide" : false,
            'redirectsToLogin' : false,
            'barDataLoaded' : false,
            'renderMenuBar' : false,
            'currentUserLoaded' : false,
            'paginationDefaultPage' : 1,
            'paginationAlarmDefaultPage' : 1,
            'userTypeOption' : '',
            'username' : '',
            'password' : '',
            'currentUser': '',
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
        this.saveCurrentUser = this.saveCurrentUser.bind(this)
        this.renderWeightReportPage = this.renderWeightReportPage.bind(this)
    }

    componentDidMount(){
        if(typeof(this.props.location.state) !== 'undefined'){
            var token = this.props.location.state.token
            var userType = this.props.location.state.userType

            var apiKeys = {
                'admin' : "jnjirej9reinvuiriuerhuinui",
                'superUser' : "rk@RTpmcoQPmoE0renck&#0eor1",
                'serviceUser' : "juit959fjji44jcion4moij0kc",
            }

            var config = {
                headers: { Authorization: `Bearer ${token}`, apikey: apiKeys[userType] }
            }

            axios.get(`https://cert-manger.izeesyncbackend.com/listOfUsers`,config)
            .then((response)=> {
                this.setState({
                    userLists : response.data.userLists,
                    usersListLoaded: true
                })
            })
            .catch(function (error) {
            })
    
            axios.get(`https://cert-manger.izeesyncbackend.com/getAlarmReport/all`,config)
            .then((response)=> {
                console.log(response)
                this.setState({
                    liveAlarmReport : response.data.data,
                    liveAlarmsLoaded: true
                })
            })
            .catch(function (error) {
            })
    
            axios.get(`https://cert-manger.izeesyncbackend.com/alarmCurrentStatus/live`,config)
            .then((response)=> {
                this.setState({
                    liveAlarmData : response.data.alarms,
                    liveAlarmsLoaded: true
                })
            })
            .catch(function (error) {
            })
    
            axios.get(`https://cert-manger.izeesyncbackend.com/CompactorCurrentStatus/live`,config)
            .then((response)=> {
                this.setState({
                    livecompactorData : response.data.compactorInfo,
                    liveCompactorLoaded: true
                })
            })
            .catch(function (error) {
            })
    
            axios.get(`https://cert-manger.izeesyncbackend.com/getEquipmentWeightCollection/live`,config)
            .then((response)=> {
                this.setState({
                    weightCollectionData : response.data.weightCollection,
                    liveCompactorLoaded: true
                })
            })
            .catch(function (error) {
            })
    
            axios.get(`https://cert-manger.izeesyncbackend.com/getBarData/today`,config)
            .then((response)=> {
                console.log(response)
                this.setState({
                    barChartData : response.data,
                    barDataLoaded: true
                })
            })
            .catch(function (error) {
            })
        }else{
            setTimeout(()=>{
                this.setState({
                    redirectsToLogin : true
                })
            }, 3000);
        }
    }

    reduceFunc(total, num){
        return total + num
    }

    saveCurrentUser(currentUser){
        this.setState({
            currentUser : currentUser
        })
    }

    handleRedirectToMap(){
        this.setState({handleRedirectToMap : true})
    }

    handleRedirectToAdminPage(page=true){
        this.setState({handleRedirectToAdminPage : page})
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

        axios.post('https://cert-manger.izeesyncbackend.com/registerUser', body).then((result)=>{
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

    renderReportPage(returnPage=false){
        this.setState(
            {
                renderReportPage : returnPage
            }
        )
    }

    renderWeightReportPage(weightPage=true){
        this.setState(
            {
                renderWeightReportPage : weightPage
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
        var userTypeOptions = {
            'admin' : "Admin",
            'superUser' : 'Super',
            'serviceUser' : "Enginner",
            'user' : "User",
        }

        console.log(this.state.weightCollectionData)

        var usertype = this.props.location.state.userType
        usertype = userTypeOptions[usertype]
        if(typeof(this.props.location.state) == 'undefined'){
            if(this.state.redirectsToLogin){
                return(
                    <Redirect to={{
                        pathname: '/login',
                    }}
                />
                )
            }else{
                return(
                    <div style={{color: 'white'}}>Session has expired or user is not autheciated. You will be redirected in 3 seconds</div>
                )
            } 
        }else{
            if(usertype == 'Admin' || usertype == 'Super'){
                var dashboard = 
                <div className="grid-item grid-item-sideDashboard whiteBG">
                    <Container className="blueBG adjustPadding">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor : 'pointer'}}>Dashboard</Col>
                        </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor:'pointer'}} onClick={this.handleRedirectToMap}>Map</Col>
                        </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col style={{textAlign: 'center', cursor:'pointer'}} onClick={this.renderEquipmentPage}>Equipment</Col>
                        </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor:'pointer'}} onClick={this.renderReportPage}>Report</Col>
                        </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor:'pointer'}} onClick={this.handleRedirectToAdminPage} >Admin</Col>
                        </Row>
                    </Container>
                </div>
            }else if(usertype == 'Enginner'){
                var dashboard = 
                <div className="grid-item grid-item-sideDashboard whiteBG">
                    <Container className="blueBG adjustPadding">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor : 'pointer'}}>Dashboard</Col>
                        </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor:'pointer'}} onClick={this.handleRedirectToMap}>Map</Col>
                        </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor:'pointer'}} onClick={this.renderEquipmentPage}>Equipment</Col>
                        </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor:'pointer'}} onClick={this.renderReportPage}>Report</Col>
                        </Row>
                    </Container>
                </div>
            }else{
                var dashboard = 
                <div className="grid-item grid-item-sideDashboard whiteBG">
                    <Container className="blueBG adjustPadding">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor : 'pointer'}}>Dashboard</Col>
                        </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor:'pointer'}} onClick={this.handleRedirectToMap}>Map</Col>
                        </Row>
                    </Container>
                    <Container className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col style={{ textAlign: 'center', cursor:'pointer'}} onClick={this.renderEquipmentPage}>Equipment</Col>
                        </Row>
                    </Container>
                </div>
            }
    if(this.state.handleRedirectToAdminPage){
        //markAdmin
        return(
            <div><AdminPage handleRedirect={this.handleRedirect} saveCurrentUser={this.saveCurrentUser} handleRedirectToAdminPage={this.handleRedirectToAdminPage} userType={this.props.location.state.userType} token={this.props.location.state.token} userLists={this.state.userLists} usersListLoaded={this.state.usersListLoaded} /></div>
        )
    }
            if(this.state.liveAlarmsLoaded && this.state.liveCompactorLoaded){
    
                var alarmsData = this.state.liveAlarmData
                if(this.state.renderReportPage){
                    return(
                        // <div>hii</div>
                        <ReportPage livecompactorData={this.state.livecompactorData} weightCollectionData={this.state.weightCollectionData} WeightReportPage={this.renderWeightReportPage} renderWeightReportPage={this.state.renderWeightReportPage} weightCollectionData={this.state.weightCollectionData} userType={this.props.location.state.userType} renderReportPage={this.renderReportPage} liveAlarmReport={this.state.liveAlarmReport} userType={this.props.location.state.userType} allAlarmReport={this.state.allAlarmReport} token={this.props.location.state.token} />
                    )
                }
                var alarms = []
    
                if(this.state.pressLeftAlarmArrowWeight || this.state.pressRightAlarmArrowWeight){
                    var alarmSection = this.state.alarmSection
                }else{
                    var alarmSection = 'CBM'
                }
                //filter alarms only trigger and belong to section
                for(i=0;i<alarmsData.length;i++){
                    if(alarmsData[i]['Section'] == alarmSection && alarmsData[i]['CurrentStatus'] == 'Triggered'){
                        alarms.push(alarmsData[i])
                    }
                }
    
                var chunkAlarm = (arr, size) =>
                Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                arr.slice(i * size, i * size + size)
                );
    
    
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
                        for(i=0;i<alarms.length;i++){
                            var alarm = alarms[i]
                            var ts = alarm.ts
                            ts = ts.split(' ')
                            alarm['timestampday']= ts[0]
                            alarm['timestamptime']= ts[1]
                        }
                        var paginatedAlarms = chunkAlarm(alarms,5)
                        var renderAlarms = paginatedAlarms[this.state.paginationAlarmDefaultPage -1]
                        if(usertype == 'Super' || usertype == 'Admin' || usertype == 'Enginner' ){
                            var alarmTable = renderAlarms.map(al => (
                                <tr>
                                    <th style={{textAlign: 'center',fontWeight: 'normal'}}><div>{al['ts']}</div></th>
                                    <th style={{textAlign: 'center',fontWeight: 'normal'}}>{al.EquipmentID}</th>
                                    <th style={{textAlign: 'center',fontWeight: 'normal'}}>{al.shortAddress}</th>
                                    <th style={{textAlign: 'center',fontWeight: 'normal'}}>{al.Type}</th>
                                    <th style={{textAlign: 'center',fontWeight: 'normal'}}>{al.CurrentStatus}</th>
                                    <th style={{textAlign: 'center',fontWeight: 'normal'}}><FontAwesomeIcon style={{cursor:'pointer'}} icon={faStopwatch} onClick={()=>{
                                        var token = this.props.location.state.token
                                        var config = {
                                            headers: { Authorization: `Bearer ${token}`, apikey: 'jnjirej9reinvuiriuerhuinui' }
                                        }
                                        var body = {
                                            "ID" : al.EquipmentID, 
                                            "ts": al.ts, 
                                            "type" : al.Type, 
                                            "username" : this.state.currentUser
                                        }
                                        axios.post(`https://cert-manger.izeesyncbackend.com/publishMQTT`, body , config)
                                        .then((response)=> {
                                            console.log(response)
                                        })
                                        .catch(function (error) {
                                        })
                                    }} /></th>
                                </tr>
                            ))
                        }else{
                            var alarmTable = renderAlarms.map(al => (
                                <tr>
                                    <th style={{textAlign: 'center'}}><div>{al['timestampday']}</div><div>{al['timestamptime']}</div></th>
                                    <th style={{textAlign: 'center'}}>{al.EquipmentID}</th>
                                    <th style={{textAlign: 'center'}}>{al.Type}</th>
                                    <th style={{textAlign: 'center'}}>{al.CurrentStatus}</th>
                                </tr>
                            ))
                        }
                        
                    }
                var noOfAlarms = 0
    
                noOfAlarms = alarms.length
            }
            if(this.state.liveCompactorLoaded){
                
                var compactors = this.state.livecompactorData
                var filteredSectionData = []
                var currentSection = this.state.compactorSection
                for(var i=0;i<compactors.length;i++){
                    if(compactors[i].Section == currentSection){
                        filteredSectionData.push(compactors[i])
                    }
                }
    
                compactors = filteredSectionData;
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
                    allCompactors = sortObjectsArray(allCompactors, 'EquipmentID')
                    let maxlength = 15
    
                    const chunkyEquipmentIDS = (arr, size) =>
                    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                        arr.slice(i * size, i * size + size)
                    );
    
                    var paginatedIDList = chunkyEquipmentIDS(allCompactors, maxlength)
                    var allCompactorsData = paginatedIDList[this.state.MapEquimentIndex]
                    var renderlistOfCompactorID = allCompactorsData.map(compactor => (
                        <Container onClick={()=>{
                            this.setState({currentCompactorCoordinates: compactor.coordinates, currentCompactorID : compactor.EquipmentID})
                        }} style={{cursor:'pointer'}} className="blueBorder adjustPaddingContent">
                            <Row>
                                <Col>{compactor.EquipmentID}</Col>
                            </Row>
                        </Container>
                   ))
    
                   //assume first page
                   if(this.state.MapEquimentIndex == 0){
                    renderlistOfCompactorID = 
                    <span>
                    {/* {renderlistOfCompactorID} */}
                    <Container style={{cursor:'pointer'}} className="blueBorder adjustPaddingContent">
                        <Row>
                            <Col onClick={()=>{
                                var maxPage = paginatedIDList.length
                                var currentPage = (this.state.MapEquimentIndex + 1)
    
                                
                                if(this.state.MapEquimentIndex < maxPage && this.state.MapEquimentIndex !== maxPage){
                                    var currentPage = currentPage + 1
                                    this.setState({
                                        MapEquimentIndex : this.state.MapEquimentIndex + 1
                                    })
                                }
    
                                if(currentPage == maxPage){
                                    this.setState({
                                        MapEquipmentIDLastPage : true
                                    })
                                }
    
                            }}></Col>
                        </Row>
                    </Container>
                    </span>
                   }else if (this.state.MapEquimentIndex > 0 && !this.state.MapEquipmentIDLastPage){
                        renderlistOfCompactorID = 
                            <span>
                            {/* {renderlistOfCompactorID} */}
                            <Container style={{cursor:'pointer'}} className="blueBorder adjustPaddingContent">
                                <Row>
                                    <Col onClick={()=>{
                                        var pageNo = this.state.MapEquimentIndex
                                        if(pageNo !== 0){
                                            this.setState({
                                                MapEquimentIndex : pageNo -1
                                            })
                                        }
                                    }}><i class="arrow up"></i></Col>
                                </Row>
                            </Container>
                            <Container style={{cursor:'pointer'}} className="blueBorder adjustPaddingContent">
                                <Row>
                                    <Col onClick={()=>{
                                        var maxPage = paginatedIDList.length
                                        var currentPage = (this.state.MapEquimentIndex + 1)
    
                                        
                                        if(this.state.MapEquimentIndex < maxPage && this.state.MapEquimentIndex !== maxPage){
                                            var currentPage = currentPage + 1
                                            this.setState({
                                                MapEquimentIndex : this.state.MapEquimentIndex + 1
                                            })
                                        }
    
                                        if(currentPage == maxPage){
                                            this.setState({
                                                MapEquipmentIDLastPage : true
                                            })
                                        }
    
                                    }}></Col>
                                </Row>
                            </Container>
                            </span>
                   }else if(this.state.MapEquipmentIDLastPage){
                        renderlistOfCompactorID = 
                        <span>
                        {/* {renderlistOfCompactorID} */}
                        <Container style={{cursor:'pointer'}} className="blueBorder adjustPaddingContent">
                                <Row>
                                    <Col onClick={()=>{
                                        var pageNo = this.state.MapEquimentIndex
                                        if(pageNo !== 0){
                                            this.setState({
                                                MapEquimentIndex : pageNo -1
                                            })
                                        }
                                    }}></Col>
                                </Row>
                        </Container>
                        </span>
                   }
    
                   var mapDashboard = 
                    <div className="grid-item-map-sideDashboard whiteBG">
                        <Container className="blueBG adjustPadding">
                        <Row>
                            <Col style={{textAlign : 'center', cursor:'pointer'}}>Map</Col>
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
                                }} style={{ textAlign : 'center', cursor:'pointer'}}>Dashboard</Col>
                            </Row>
                        </Container>
                        {/* {renderlistOfCompactorID} */}
                    </div>
                }
    
                var reducer = (accumulator, currentValue) => accumulator + currentValue;
                var collectionWeights = []
                for(var i=0;i<compactors.length;i++){
                    var weight = compactors[i]["WeightValue"]
                    weight = parseFloat(weight)
                    weight = Math.round(weight)
    
                    if(!weight <= 0 || !isNaN(weight)){
                        collectionWeights.push(weight)
                    }
    
                }
                if(collectionWeights.length <= 0){
                    var totalCollectedWeight = 0;
                }else{
                    var totalCollectedWeight = collectionWeights.reduce(reducer)
                }
                //mark
                var compactorInfo = <tr><th>Loading ......</th></tr>
    
                if(this.state.renderWeightInformation || this.state.renderEquipmentPage || this.state.handleRedirectToMap){
                    const chunky = (arr, size) =>
                    Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
                        arr.slice(i * size, i * size + size)
                    );
    
                    var maxLength = 24
                    if(this.state.handleRedirectToMap){
                        maxLength = 3
                    }
                    //mark
                    compactors = sortObjectsArray(compactors, 'ts', {order: 'desc'})
    
                    if(this.state.equipmentSearchResult !== ''){
                        //filter using search bar result
                        //filter only ID and ts
                        var filterSearch = []
                        for(var i=0;i<compactors.length;i++){
                            var compactorID = compactors[i].EquipmentID
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
                            for(var i=0; i<compactors.length;i++){
                                var compactor = compactors[i]
                                var ts = compactor['ts']
                                if(ts == ''){
                                    compactor['timestampday'] = 'Equipment No Data'
                                    compactor['timestamptime'] = ''
                                }else{
                                    ts = ts.split(' ')
                                    compactor['timestampday'] = ts[0]
                                    compactor['timestamptime'] = ts[1]
                                }
                            }
                            var paginatedCompactors = chunky(compactors,maxLength)
                            var renderCompactors = paginatedCompactors[this.state.paginationDefaultPage -1]
                            compactorInfo = renderCompactors.map(compactor => (
                                <tr>
                                    {/* <th style={{textAlign : 'center'}}>{compactor['ts'] == '' ? 'Equipment No Data' : compactor['ts']}</th> */}
                                    <th style={{textAlign : 'center',fontWeight: 'normal'}}><div>{compactor.ts}</div></th>
                                    <th style={{textAlign : 'center',fontWeight: 'normal'}}>{compactor.EquipmentID}</th>
                                    <th style={{textAlign : 'center',fontWeight: 'normal'}}>{compactor.shortAddress}</th>
                                    <th style={{textAlign : 'center',fontWeight: 'normal'}}>{Math.round(compactor.WeightValue)}</th>
                                    <th style={{textAlign : 'center',fontWeight: 'normal'}}>{Math.round(compactor.FilledLevel)}</th>
                                    <th style={{textAlign : 'center',fontWeight: 'normal'}}>{Math.round(compactor['FilledLevel']) <= 70 ? 
                                        <span><img
                                        src={require('./greendot.png')}
                                        width="30"
                                        height="30"
                                        className="d-inline-block align-top"
                                        alt="React Bootstrap logo"
                                        /></span> : 
                                        Math.round(compactor['FilledLevel']) <= 90 ? 
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
                return(
                    <div className="grid-container-equipment">
                        <div className='grid-item grid-item-01-compactor'>
                            <NavBarContent saveCurrentUser={this.saveCurrentUser} userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
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
                                    }} style={{ textAlign: 'center', cursor:'pointer'}}>Dashboard</Col>
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
                        <Container>
                            <Row>
                                <Col>
                                    <table style={{fontFamily: "arial, sans-serif", borderCollapse: 'collapse', width: '100%'}}>
                                    <tr>
                                        <th style={{textAlign:'center'}}>TimeStamp</th>
                                        <th style={{textAlign:'center'}}>Equipment ID</th>
                                        <th style={{textAlign:'center'}}>Address</th>
                                        <th style={{textAlign:'center'}}>Collected weight (KG)</th>
                                        <th style={{textAlign:'center'}}>Collected weight (%)</th>
                                        <th style={{textAlign:'center'}}>Level</th>
                                    </tr>
                                    {compactorInfo}
                                    </table>
                                    {paginationPages}
                                </Col>
                            </Row>
                        </Container>
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
                            <th style={{textAlign:'center'}}>Address</th>
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
                    <div style={{marginTop: '2.9em'}}></div>
                    <button onClick={()=>{
                        //mark
                        this.setState(
                            {
                                renderEquipmentPage : true
                            }
                        )
                    }}>Collection Weight</button>
                </div>
            }
            if(this.state.renderAlarmInformation){
    //mark
                var alarmsSection = <div className="grid-item grid-item-alarmPage grayBG">
                    hi
                </div>
                if(usertype == 'Super' || usertype == 'Admin' || usertype == 'Enginner'){
                    var alarmsSection = 
                    <div className="grid-item grid-item-alarmPage whiteBG">
                        <Container>
                            <Row>
                                <Col>
                                    <table style={{fontFamily: "arial, sans-serif", borderCollapse: 'collapse', width: '100%'}}>
                                        <tr>
                                            <th style={{textAlign : 'center'}}>TimeStamp</th>
                                            <th style={{textAlign : 'center'}}>Equipment ID</th>
                                            <th style={{textAlign : 'center'}}>Address</th>
                                            <th style={{textAlign : 'center'}}>Fault Type</th>
                                            <th style={{textAlign : 'center'}}>Alarm Status</th>
                                            <th style={{textAlign : 'center'}}>Clear Alarm</th>
                                        </tr>
                                        {alarmTable}
                                    </table>
                                    {paginationAlarmPages}
                                </Col>
                            </Row>
                        </Container>
                        <button onClick={()=>{this.setState({renderAlarmInformation : false})}}>Back</button>
                    </div>
                }else{
                    var alarmsSection = 
                    <div className="grid-item grid-item-alarmPage whiteBG">
                        <Table style={{fontSize: '0.9em'}} striped bordered hover>
                            <thead>
                            <tr>
                                <th style={{textAlign : 'center'}}>TimeStamp</th>
                                <th style={{textAlign : 'center'}}>Equipment ID</th>
                                <th style={{textAlign : 'center'}}>Fault Type</th>
                                <th style={{textAlign : 'center'}}>Alarm Status</th>
                            </tr>
                            </thead>
                            <tbody>
                            {alarmTable}
                            </tbody>
                            <span style={{textAlign: 'center'}}>{paginationAlarmPages}</span>
                        </Table>
                        <button onClick={()=>{this.setState({renderAlarmInformation : false})}}>Back</button>
                    </div>
                }
        }else{
            var alarmsSection = 
                <div className="grid-item grid-item-alarmDashboard whiteBG">
                    <Container>
                        <Row>
                            <Col className='alarmTitle'>Uncleared Alarms</Col>
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
    
    
                    <button style={{marginTop: '2.9em'}} onClick={()=>{
                        this.setState({renderAlarmInformation : true})
                    }}>Equipment Fault</button>
                </div>
        }
    
            if(this.state.handleRedirectToMap){
                //markC
                var compactorsData = compactors
                var alarmData = alarms
                return(
                    <div className='grid-container-map'>
                         <div className='grid-item grid-item-01-compactor'>
                             <NavBarContent saveCurrentUser={this.saveCurrentUser} userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                        </div>
                        {mapDashboard}
                        <div className="grid-item grid-item-map-map whiteBG">
                            <Container>
                                <Row>
                                    <Col>
                                        <div><GoogleApiWrapper currentCompactorCoordinates={this.state.currentCompactorCoordinates} currentCompactorID={this.state.currentCompactorID} handleRedirectToMap={this.state.handleRedirectToMap} livealarmData={alarmData} liveAlarmsLoaded={this.state.liveAlarmsLoaded} liveCompactorLoaded={this.state.liveCompactorLoaded} compactorsData={compactorsData} /></div>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
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
                                <Col style={{textAlign: 'center'}}>Alarm Triggered</Col>
                            </Row>
                        </Container>
                        </div>
                    </div>
                )
            }
        
            else{
                var compactorsData = compactors
                var alarmData = alarms
                if(this.state.renderAlarmInformation){
                    return(
                        //mark
                        <div className='grid-container-alarm'>
                             <div className='grid-item grid-item-01-compactor'>
                                 
                                 <NavBarContent saveCurrentUser={this.saveCurrentUser} userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                            </div>
                            {dashboard} 
                            {alarmsSection}
                        </div>
                    )
                }else{
                    var sideContent = 
                <Container>
                    <Row>
                        <Col>
                            <div><GoogleApiWrapper currentCompactorCoordinates={this.state.currentCompactorCoordinates} currentCompactorID={this.state.currentCompactorID} handleRedirectToMap={this.state.handleRedirectToMap} livealarmData={alarmData} liveAlarmsLoaded={this.state.liveAlarmsLoaded} liveCompactorLoaded={this.state.liveCompactorLoaded} compactorsData={compactorsData} /></div>
                        </Col>
                    </Row>
                </Container>
    
    //marking
    
                var showGraphOnSide = this.state.showGraphOnSide
                var showMapOnSide = this.state.showMapOnSide
                if(showGraphOnSide && !showMapOnSide){
                    //create labels very hour
                    // console.log(moment().startOf('day').format())
                    // console.log(moment().format())
                    var endRange = moment().format()
                    endRange = endRange.split('T')
                    var today = endRange[0]
                    endRange = endRange[1].split(':')
                    endRange = parseInt(endRange[0]) + 1
                    var equipmentIDs = [
                        'DS-809'
                        ,'DS-810','DS-811'
                        ,'DS-812','DS-813','DS-814','DS-815','DS-816','DS-817','DS-818',
                        'DS-819','DS-820','DS-821','DS-822','DS-823','MM10-804','MM10-805','MM10-806','MM10-807','MM10-808',
                        'MM8-800','MM8-801','MM8-802','MM8-803'
                    ]

                    var selectedArr = this.state.arrayofSelectedIDS

                    selectedArr = selectedArr.sort();
                
                    var duplicate = []
                    selectedArr.forEach(function (value, index, arr){
                
                        let first_index = arr.indexOf(value);
                        let last_index = arr.lastIndexOf(value);
                        if(first_index !== last_index){
                            duplicate.push(value)
                        }
                    });

                    duplicate = [...new Set(duplicate)];

                    selectedArr = selectedArr.filter(item => !duplicate.includes(item))

                    var buttontext = {}
                    var buttoncolor = {}
                    for(var i=0;i<equipmentIDs.length;i++){
                        var equipmentID = equipmentIDs[i]
                        buttontext[equipmentID] = equipmentID
                        buttoncolor[equipmentID] = ''
                    }

                    var renderButtons = equipmentIDs.map((button=> {
                        var idSelected = selectedArr.length > 0
            
                        if(idSelected){
                            for(var i=0;i<selectedArr.length;i++){
            
                                var selectedID = selectedArr[i]
                                if(selectedID === button){
                                    buttontext[selectedID] = selectedID + ' ✓'
                                }
                            }
                        }
            //cater for selected again
            
                        if(buttontext[button].includes('✓')){
                            return <span><button  onClick={()=>{
                                var selectedIDs = selectedArr.slice(0)
                                selectedIDs.push(button)
                                this.setState(
                                    {
                                        arrayofSelectedIDS : selectedIDs
                                    }
                                )
                            }} style={{backgroundColor: 'white', color: '#1f4e78', padding: '8px', borderRadius: '8px'}}>{buttontext[button]}</button></span>     
                        }else{
                            return <span><button  onClick={()=>{
                                var selectedIDs = selectedArr.slice(0)
                                selectedIDs.push(button)
                                this.setState(
                                    {
                                        arrayofSelectedIDS : selectedIDs
                                    }
                                )
                            }} style={{backgroundColor: '#1f4e78', color: 'white', padding: '8px', borderRadius: '8px'}}>{buttontext[button]}</button></span>
                        }
                    }))

                    var weightCollectionData = this.state.weightCollectionData
    
                    var labels = []
                    for(var i=4; i<endRange; i++){
                        var time = `${i}:00:00`;
                        if(i < 10){
                            time = `0${i}:00:00`;
                        }
                        // var formatted = moment(time, "HH:mm").format();
                        labels.push(time)
                    }
    
                    var labelsTime = labels.map((label)=>{
                        return `${today} ${label}`
                    })
    
                    if(selectedArr.length > 0){
                        equipmentIDs = selectedArr
                    }
                    var datasets = []
                    var weightValues = []
                    for(var i=0; i<equipmentIDs.length; i++){
                        var equipmentID = equipmentIDs[i]
                        var obj = {
                            label: equipmentID,
                            data: [],
                            fill: true,
                            backgroundColor: borderColor
                        }
    
    
                        var borderColor = "black"
    
                        var weightCollection = weightCollectionData.map((weight)=>{
                            if(weight.EquipmentID == equipmentID){
                                return weight
                            }
                        })
    
                        // for()
                        weightCollection = weightCollection.filter(Boolean)
    
                        
                        var data = []
                        for(var x=0; x<labelsTime.length; x++){
                            var nextIndex = x+1
                            if(nextIndex > labelsTime.length){
                                nextIndex = labelsTime.length
                            }
    
    
                            if(nextIndex <= labelsTime.length){
                                var weightColl = weightCollection.map((weight)=>{
                                    var startTime = labelsTime[x]
                                    var endTime = labelsTime[nextIndex]
                                    var withinTS = startTime < weight.collectTS && endTime > weight.collectTS
    
                                    if(withinTS){
                                        return {data: weight.collectedWeight, labelsTimeIndex: x, collectTS: weight.collectTS, EquipmentID:  equipmentID, startTime: startTime, endTime: endTime}
                                    }
    
                                    if(i % 2){
                                        borderColor = "rgba(75,192,192,1)"
                                        obj['backgroundColor'] = borderColor
                                    }
    
                                    })
                                weightColl = weightColl.filter(Boolean)
                                weightValues.push(weightColl)
                            }
                        }
                        datasets.push(obj)
                    }
    
                    weightValues = weightValues.flat()
    
                    for(var x=0; x<weightValues.length; x++){
                        var nextIndex = x+1
                        var startTime = weightValues[x].startTime
                        var endTime = weightValues[x].endTime
                        var withinTS = startTime < data.collectTS && endTime > data.collectTS
                        
                    }
                    
                    var arr = []
                    for(var x=0; x<labelsTime.length; x++){
                        arr[x] = 0
                    }
                    
                    weightValues = weightValues.map((weight)=>{
                        var arrCopy = arr.slice(0)
                        arrCopy[weight.labelsTimeIndex] = weight.data
                        
                        var currentValue = 0
                        for(var x=0; x<arrCopy.length; x++){
                            var nextIndex = x+1
                            if(nextIndex > arrCopy.length){
                                nextIndex = arrCopy.length
                            }
                            var currentElement = arrCopy[x]
                            if(currentElement > 0){
                                currentValue = currentValue + currentElement
                            }
                        
                            if(currentValue > 0){
                                arrCopy[x] = currentValue
                            }
                        }
                        var obj = {
                            label: weight.EquipmentID,
                            data: arrCopy,
                            fill: false,
                            borderColor: borderColor
                        }
                        return obj
                    })
                    for(var x=0; x<weightValues.length; x++){
                        if(x%2){
                            weightValues[x]["borderColor"] = 'blue'
                        }
                    }
                    weightValues = [...new Map(weightValues.map(item => [item["label"], item])).values()]
                    var lineData = {
                        labels: labels,
                        // datasets: 
                        // [
                        //   {
                        //     label: "First dataset",
                        //     data: [33, 53, 85, 41, 44, 65],
                        //     fill: true,
                        //     backgroundColor: "rgba(75,192,192,0.2)",
                        //     borderColor: "rgba(75,192,192,1)"
                        //   },
                        //   {
                        //     label: "Second dataset",
                        //     data: [33, 25, 35, 51, 54, 200],
                        //     fill: false,
                        //     borderColor: "#742774"
                        //   }
                        // ]
                        datasets : weightValues
                      };
                    // var barData = this.state.barChartData
    
    
                    if(this.state.barDataLoaded){
                        var barData = 
                            [
                                this.state.barChartData["FireAlarm"],
                                this.state.barChartData["DischargeGateMotorTrip"],
                                this.state.barChartData["DischargeScrewMotorTrip"]
                            ]
                    }else{
                        var barData = [
                            0,0,0
                        ]
                    }
                    var chartData = {
                        labels: [
                            'Fire Alarm','DischargeGateMotorTrip','DischargeScrewMotorTrip'
                        ],
                        datasets: [
                            {
                                label: 'Severe Alarm Raised',
                                data: barData,
                                backgroundColor: [
                                    'rgba(255, 99, 132, 0.6)',
                                    'rgba(54, 162, 235, 0.6)',
                                    'rgba(255, 206, 86, 0.6)',
                                ]
                            }
                        ]
                    }
                    //markMenu
                    if(this.state.renderMenuBar){
                        var menuBar = <div style={{zIndex:'1'}} className="grid-item grid-item-mapDashboard_menu grayBG">
                               <div style={{marginTop: '0.8em'}}></div>
                                <Container>
                                <Row>
                                    <Col></Col>
                                    <Col style={{textAlign : 'center', fontSize: '1.4em'}}><strong>Search</strong>
                                    </Col>
                                    <Col style={{textAlign : 'right', cursor:'pointer'}} onClick={()=>{
                                        this.setState(
                                            {
                                                renderMenuBar : false
                                            }
                                        )
                                    } 
                                    }>X</Col>
                                </Row>
                                </Container>

                                <Container>
                                <div>&nbsp;</div>
                                <Row>
                                    <Col>
                                        Search By ID: 
                                    <div className="searchBorder" style={{position: 'relative', width: '700px', height: '300px', 
                                    }}>
                                    {renderButtons}
                                    </div>
                                    </Col>
                                </Row>
                                
                                </Container>
                                            </div>
                                        }else{
                                            var menuBar = <span></span>
                                        }
                        
                                        sideContent = 
                                        <div>
                                        <div>
                                    <Container>
                                        <Row>
                                            <Col>
                                            <div className='chart'>
                                                <Bar
                                                    data={chartData}
                                                    // width={100}
                                                    // height={50}
                                                    options={{
                                                    title: {
                                                        display: true,
                                                        text: `Severe Alarm Raised(${today})`,
                                                        fontSize: 25
                                                    },
                                                    scales: {
                                                        yAxes: [{
                                                        ticks: {
                                                            beginAtZero: true,
                                                            min: 0
                                                        }    
                                                        }]
                                                    }
                                                    // legend: {
                                                    //     display: true,
                                                    //     position: 'right'
                                                    // }
                                                    }
                                                }
                                                />
                                            </div>
                                            </Col>
                                        </Row>
                                    </Container>
                                    <div style={{cursor: 'pointer'}}  onClick={()=>{
                                        this.setState(
                                            {
                                                renderMenuBar : true
                                            }
                                        )
                                        }}><img
                                            src={require('./searchIcon.png')}
                                            width="35"
                                            height="30"
                                            className="d-inline-block align-top"
                                            alt="React Bootstrap logo"
                                        />
                                    </div>
                                    <Container>
                                        <Row>
                                            <Col>
                                            <div className='chart'>
                                                <Line
                                                    data={lineData}
                                                    // width={100}
                                                    // height={50}
                                                    options={{
                                                    title: {
                                                        display: true,
                                                        text: `Weight Collection(${today})`,
                                                        fontSize: 25
                                                    }
                                                    // legend: {
                                                    //     display: true,
                                                    //     position: 'right'
                                                    // }
                                                    }
                                                }
                                                />
                                            </div>
                                            </Col>
                                        </Row>
                                    </Container>
                </div>
                </div>
                }
                    return(
                        //mark
                        <div className='grid-container-compactor'>
                             <div className='grid-item grid-item-01-compactor'>
                                 
                                 <NavBarContent saveCurrentUser={this.saveCurrentUser} userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                            </div>
                            {dashboard} 
                            {weight}
                            
                            {alarmsSection}

                            <div className="grid-item grid-item-mapDashboard grayBG">
                            <Breadcrumb>
                                <Breadcrumb.Item onClick={()=>{
                                    this.setState(
                                        {
                                            showMapOnSide : true,
                                            showGraphOnSide : false
                                        }
                                    )
                                }} href="#">Map</Breadcrumb.Item>
                                <Breadcrumb.Item onClick={()=>{
                                    this.setState(
                                        {
                                            showMapOnSide : false,
                                            showGraphOnSide : true
                                        }
                                    )
                                }}
                                href="#">Graph Data</Breadcrumb.Item>
                            </Breadcrumb>
                               
                                {sideContent}
                            </div>
                            {menuBar}
                        </div>
                    )
                }
                
            }
        }
    }   
}

export default GridContainer