
import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import DayPickerInput from 'react-day-picker/DayPickerInput';
import { DateUtils } from 'react-day-picker';
import 'react-day-picker/lib/style.css';
import dateFnsFormat from 'date-fns/format';
import dateFnsParse from 'date-fns/parse';
import NavBarContent from './NavBarContent';
import 'react-day-picker/lib/style.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import { Alert, Table, Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap'
const axios = require('axios');
const moment = require("moment")
const CryptoJS = require("crypto-js");
const sortObjectsArray = require('sort-objects-array');
const cryptKey = "someKey"

class ReportPage extends Component {
    constructor(props){
        super(props)
        this.state = 
        {
            'paginationAlarmReportPage' : 1,
            'liveAlarmReport' : false,
            'selectStartDate' : '',
            'selectEndDate' : '',
            'renderStartCalender' : false,
            'renderMenu' : false,
            'arrayofSelectedIDS' : [],
            'startDate' : '',
            'endDate' : '',
        }
    }

    parseDate(str, format, locale) {
        const parsed = dateFnsParse(str, format, new Date(), { locale });
        if (DateUtils.isDate(parsed)) {
            console.log(parsed)
            return parsed;
        }
        return undefined; 
    }

    formatDate(date, format, locale) {
        return dateFnsFormat(date, format, { locale });
    }


    render(){
        var allData = this.props.liveAlarmReport

        var dashboardArea = 
        <div className="grid-item grid-item-report-sideDashboard whiteBG">
            <Container className="blueBG adjustPadding">
              <Row>
                  <Col style={{textAlign : 'center'}}>Alarm Report</Col>
              </Row>
            </Container>
            <Container className="blueBorder adjustPaddingContent">
              <Row>
                  <Col style={{textAlign : 'center', cursor: 'pointer'}} onClick={this.props.WeightReportPage}
                  >Weight Report</Col>
              </Row>
            </Container>
              <Container className="blueBorder adjustPaddingContent">
              <Row>
                  <Col style={{textAlign : 'center', cursor: 'pointer'}} onClick={()=>{
                      this.props.renderReportPage(false)
                  }}>Dashboard</Col>
              </Row>
              </Container>
        </div>

        var tableHeaders = 
        <tr>
        <th style={{textAlign: 'center'}}>Equipment ID</th>
        <th style={{textAlign: 'center'}}>Alarm Trigger Timestamp</th>
        <th style={{textAlign: 'center'}}>Alarm Clear Timestamp</th>
        <th style={{textAlign: 'center'}}>Duration for Alarm Deactivation</th>
        <th style={{textAlign: 'center'}}>Alarm Type</th>
        <th style={{textAlign: 'center'}}>Alarm Status</th>
      </tr>
        var title = 
        <Container>
            <Row>
                <Col style={{textAlign: 'center' ,fontSize: '1.5em'}}>
                    Alarm Report
                </Col>
            </Row>
        </Container>
        var timestampfield = 'ts'

        if(this.props.renderWeightReportPage){
            allData = this.props.weightCollectionData
            timestampfield = 'collectTS'
        var tableHeaders = 
        <tr>
            <th style={{textAlign : 'center'}}>Equipment ID</th>
            <th style={{textAlign : 'center'}}>Address</th>
            <th style={{textAlign : 'center'}}>Collection Time</th>
            <th style={{textAlign : 'center'}}>Amount Collected(kg)</th>
            <th style={{textAlign : 'center'}}>Equipment Remaining Weight(kg)</th>
        </tr>
        var title = 
        <Container>
            <Row>
                <Col style={{textAlign: 'center' ,fontSize: '1.5em'}}>
                    Weight Collection Report
                </Col>
            </Row>
        </Container>

        dashboardArea = 
        <div className="grid-item grid-item-report-sideDashboard whiteBG">
            <Container className="blueBG adjustPadding">
            <Row>
                <Col style={{textAlign : 'center'}}
                >Weight Report</Col>
            </Row>
            </Container>
            <Container className="blueBorder adjustPaddingContent">
            <Row>
                <Col style={{textAlign : 'center', cursor: 'pointer'}} onClick={()=>{
                    this.props.WeightReportPage(false)
                }}>Alarm Report</Col>
            </Row>
            </Container>
            <Container className="blueBorder adjustPaddingContent">
            <Row>
                <Col style={{textAlign : 'center', cursor: 'pointer'}} onClick={()=>{
                    this.props.renderReportPage(false)
                }}>Dashboard</Col>
            </Row>
            </Container>
        </div>

        }

        var equipments = this.props.livecompactorData

        var equipmentIDs = equipments.map((alarm=>{
            return alarm.EquipmentID
        }))

        allData = sortObjectsArray(allData, 'ts', {order: 'desc'})


        var buttontext = {}
        var buttoncolor = {}
        for(var i=0;i<equipmentIDs.length;i++){
            var equipmentID = equipmentIDs[i]
            buttontext[equipmentID] = equipmentID
            buttoncolor[equipmentID] = ''
        }

        var selectedArr = this.state.arrayofSelectedIDS
        //if selectTwice remove the id
        
        // selectedArr = [...new Set(selectedArr)];

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
        
        var breakCol = 6;

        var tempArray = []
        var tempArr = []

        
        var startDate = this.state.startDate
        var endDate = this.state.endDate
        var dateRangeSelected = (startDate !== '' || endDate !== '') && (startDate < endDate)

        var idSelected = selectedArr.length > 0
        if(idSelected){
            for(var i=0;i<selectedArr.length;i++){
                var id = selectedArr[i]
                for(var index=0;index<allData.length;index++){
                    var alarm = allData[index]
                    if(alarm.EquipmentID == id){
                        tempArr.push(allData[index])
                    }
                }
            }
            tempArr = sortObjectsArray(tempArr, timestampfield, {order: 'desc'})
            allData = tempArr
        }
       
        if(dateRangeSelected){
            console.log(allData)
            for(var i=0;i<allData.length;i++){
                var startDate = this.state.startDate
                var endDate = this.state.endDate
                var data = allData[i]
                console.log(timestampfield)
                console.log(data[timestampfield])
                if(startDate !== '' || endDate !== ''){
                    if(startDate <= endDate){
                        if(data[timestampfield] >= startDate && data[timestampfield] <= endDate){
                            tempArray.push(allData[i])
                        }
                    }
                }
            }

            allData = tempArray
        }

        if(idSelected && dateRangeSelected){
            for(var i=0;i<selectedArr.length;i++){
                var id = selectedArr[i]
                for(var index=0;index<allData.length;index++){
                    var alarm = allData[index]
                    if(alarm.EquipmentID == id){
                        tempArr.push(allData[index])
                    }
                }
            }

            for(var i=0;i<tempArr.length;i++){
                var startDate = this.state.startDate
                var endDate = this.state.endDate
                var data = tempArr[i]
                if(startDate !== '' || endDate !== ''){
                    if(startDate <= endDate){
                        if(data[timestampfield] >= startDate && data[timestampfield] <= endDate){
                            tempArray.push(allData[i])
                        }
                    }
                }
            }

            allData = tempArray
        }


        if(idSelected || dateRangeSelected){
            allData = allData.filter(Boolean)
        }

        if(allData.length > 0){
            allData = sortObjectsArray(allData, timestampfield, {order: 'desc'})
        }

        var breakArr = []
        for(var i=1;i<=breakCol;i++){
            breakArr.push(i)
        }

        var columns = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
        );

        var maxLength = 22

        if(allData.length < maxLength){
            var maxPage = 1
        }else{
            var maxPage = Math.ceil((allData.length / maxLength))
        }
        var range = []
        for(var i=1;i<=maxPage;i++){
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
            <div>
                <a style={{ textAlign: 'left', backgroundColor : '#1f4e78', borderRadius: '5px', color: 'white', padding : '3px'}} href={this.state.downloadUrl}
                onClick={()=>{
                    //marking
                    var data = {}
                    data['selectType'] = 'all'
                    if(idSelected){
                        data["selectedID"] = this.state.arrayofSelectedIDS
                        data['selectType'] = 'filter'
                    }

                    if(dateRangeSelected){
                        var object = {}
                        object['starttime'] = this.state.startDate
                        object['endtime'] = this.state.endDate
                        data["dateRange"] = object
                        data['selectType'] = 'filter'
                    }
                    var cryptKey = "somekey"

                    data = JSON.stringify(data)
                    var ciphertext = CryptoJS.AES.encrypt(data, cryptKey).toString();
                    ciphertext = encodeURIComponent(ciphertext)
                    var downloadUrl = `http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/generatexlxs/alarmreport/${ciphertext}` 
                    if(this.props.renderWeightReportPage){
                        downloadUrl = `http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/generatexlxs/weightreport/${ciphertext}` 
                    }
                    this.setState(
                        {
                            downloadUrl : downloadUrl
                        }
                    )

                }} >Generate</a>
            </div>
        </div>

        if(allData.length <= 0){
            var renderAlarms = []
        }else{
            var paginatedAlarms = columns(allData,maxLength)
            var renderAlarms = paginatedAlarms[this.state.paginationAlarmReportPage -1]
        }
        // console.log(renderAlarms)
        
        allData = renderAlarms.map(al => (
            <tr>
                <th style={{textAlign: 'center',fontWeight: 'normal'}} >{al.EquipmentID}</th>
                <th style={{textAlign: 'center',fontWeight: 'normal'}} >{al.ts}</th>
                <th style={{textAlign: 'center',fontWeight: 'normal'}} >{al.ClearedTS}</th>
                <th style={{textAlign: 'center',fontWeight: 'normal'}}>{al.timeDifference}</th>
                <th style={{textAlign: 'center',fontWeight: 'normal'}}>{al.Type}</th>
                <th style={{textAlign: 'center',fontWeight: 'normal'}}>{al.Status}</th>
            </tr>
        ))

        if(this.props.renderWeightReportPage){
            allData = renderAlarms.map(al => (
                <tr>
                    <th style={{textAlign: 'center',fontWeight: 'normal'}} >{al.EquipmentID}</th>
                    <th style={{textAlign: 'center',fontWeight: 'normal'}}>{al.shortAddress}</th>
                    <th style={{textAlign: 'center',fontWeight: 'normal'}}>{al.collectTS}</th>
                    <th style={{textAlign: 'center',fontWeight: 'normal'}}><div>{al.collectedWeight}</div></th>
                    <th style={{textAlign: 'center',fontWeight: 'normal'}}><div>{al.currentWeight}</div></th>
                </tr>
            ))
        }
        const FORMAT = 'DD/MM/YYYY';

        if(this.state.renderMenu){
            var renderMenu = <div style={{zIndex:'1'}} className="grid-item grid-item-report-searchMenu markBGCompactor">
            <div style={{marginTop: '0.8em'}}></div>
            <Container>
            <Row>
                <Col></Col>
                <Col style={{textAlign : 'center', fontSize: '1.4em'}}><strong>Search</strong>
                </Col>
                <Col style={{textAlign : 'right', cursor:'pointer'}} onClick={()=>{
                    this.setState(
                        {
                            renderMenu : false
                        }
                    )
                } 
                }>X</Col>
            </Row>
            </Container>
            <Container>
            <Row>
                <Col style={{textAlign : 'left', cursor: 'pointer'}} onClick={()=>{
                    this.props.renderReportPage(false)
                }}><strong>Date range: </strong>
                </Col>
            </Row>
            
            </Container>
            <Container>
            <Row>
                <Col style={{textAlign : 'left', cursor: 'pointer'}}>
                <div style={{marginTop: '1em'}}></div>
                <div>
                    Start Date :  <DayPickerInput
                    formatDate={this.formatDate}
                    format={FORMAT}
                    parseDate={this.parseDate}
                    dayPickerProps={{
                        modifiers: {
                          disabled: [
                            {
                              after: new Date()
                            }
                          ]
                        }
                      }}
                    placeholder={'DD-MM--YYYY'}
                    onDayChange={(event)=>{
                        if(event){

                            var date = event.toISOString();
                            date = date.split('T')
                            date = date[0]
                            this.setState(
                                {
                                    startDate: date
                                }
                            )
                        }
                    }} />
                </div>  
                <div>&nbsp;</div>
                <div>
                    End Date : <DayPickerInput
                    formatDate={this.formatDate}
                    format={FORMAT}
                    parseDate={this.parseDate}
                    dayPickerProps={{
                        modifiers: {
                          disabled: [
                            {
                              after: new Date()
                            }
                          ]
                        }
                      }}
                    placeholder={'DD-MM--YYYY'}
                    onDayChange={(event)=>{
                        if(event){

                            var date = event.toISOString();
                            date = date.split('T')
                            date = date[0]
                            this.setState(
                                {
                                    endDate: date
                                }
                            )
                        }
                    }} />
                </div>
                </Col>
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
            var renderMenu = <span></span>
        }

        return(
            <div className="grid-container-report">
                <div className='grid-item grid-item-01-compactor'>
                <NavBarContent userType={this.props.userType} token={this.props.token}/>
                </div>
                <div className='grid-item grid-item-report-table whiteBG'>
                    <div>&nbsp;</div>
                <div style={{cursor: 'pointer'}}  onClick={()=>{
                        this.setState(
                            {
                                renderMenu : true
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
                    {title}
                    <div>&nbsp;</div>
                    <Container>
                        <Row>
                            <Col>   
                                <table style={{fontFamily: "arial, sans-serif", borderCollapse: 'collapse', width: '100%'}}>
                                    {tableHeaders}
                                    {allData}
                                </table>
                                {paginationAlarmPages}
                            </Col>
                        </Row>
                    </Container>
                        </div>
                    {dashboardArea}
                    {renderMenu}
            </div>
        )
    }
}
export default ReportPage