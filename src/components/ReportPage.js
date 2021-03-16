
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
// import Calendar from "react-calendar";
// import Calendar from 'react-calendar';
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

        allData = sortObjectsArray(allData, 'ts', {order: 'desc'})
        //get all the EquipmentID
        var equipmentIDs = allData.map((alarm=>{
            return alarm.EquipmentID
        }))
        equipmentIDs = [...new Set(equipmentIDs)];
        var renderButtons = equipmentIDs.map((button=> 
            <span><button  onClick={()=>{
                var selectedIDs = this.state.arrayofSelectedIDS.slice(0)
                selectedIDs.push(button)
                this.setState(
                    {
                        arrayofSelectedIDS : selectedIDs
                    }
                )
            }} style={{backgroundColor: '#1f4e78', color: 'white', padding: '8px', borderRadius: '8px'}}>{button}</button></span>
        ))
        var breakCol = 6;

        var tempArray = []
        var tempArr = []

        var idSelected = this.state.arrayofSelectedIDS.length > 0
        var startDate = this.state.startDate
        var endDate = this.state.endDate
        var dateRangeSelected = (startDate !== '' || endDate !== '') && (startDate < endDate)

        if(idSelected){
            var selectedArr = this.state.arrayofSelectedIDS
            selectedArr = [...new Set(selectedArr)];
            for(var i=0;i<selectedArr.length;i++){
                var id = selectedArr[i]
                for(var index=0;index<allData.length;index++){
                    var alarm = allData[index]
                    if(alarm.EquipmentID == id){
                        tempArr.push(allData[index])
                    }
                }
            }
            tempArr = sortObjectsArray(tempArr, 'ts', {order: 'desc'})
            allData = tempArr
        }

        if(dateRangeSelected){
            for(var i=0;i<allData.length;i++){
                var startDate = this.state.startDate
                var endDate = this.state.endDate
                var data = allData[i]
                if(startDate !== '' || endDate !== ''){
                    if(startDate <= endDate){
                        if(data.ts >= startDate && data.ts <= endDate){
                            tempArray.push(allData[i])
                        }
                    }
                }
            }
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
        </div>

        if(allData.length <= 0){
            var renderAlarms = []
        }else{
            var paginatedAlarms = columns(allData,maxLength)
            console.log(paginatedAlarms)
            console.log(this.state.paginationAlarmReportPage -1)
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
        const FORMAT = 'DD/MM/YYYY';
        var tableHeaders = 
        <tr>
        <th style={{textAlign: 'center'}}>Equipment ID</th>
        <th style={{textAlign: 'center'}}>Alarm Trigger Timestamp</th>
        <th style={{textAlign: 'center'}}>Alarm Clear Timestamp</th>
        <th style={{textAlign: 'center'}}>Duration for Alarm Deactivation</th>
        <th style={{textAlign: 'center'}}>Alarm Type</th>
        <th style={{textAlign: 'center'}}>Alarm Status</th>
      </tr>
      var today = new Date();
        var renderedTable = 
        <Container>
            <Row> 
                <Col> 
                <Table striped bordered hover responsive> 
                    {tableHeaders}
                    <tbody>
                    {allData}
                    </tbody>
                </Table>
                {paginationAlarmPages}
                </Col>
            </Row> 
        </Container>

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
        var dashboardArea = 
        <div className="grid-item grid-item-report-sideDashboard whiteBG">
            <Container className="blueBG adjustPadding">
              <Row>
                  <Col style={{textAlign : 'center'}}>Alarm Report</Col>
              </Row>
            </Container>
            <Container className="blueBorder adjustPaddingContent">
              <Row>
                  <Col style={{textAlign : 'center'}}
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


        return(
            <div className="grid-container-report">
                <div className='grid-item grid-item-01-compactor'>
                <NavBarContent userType={this.props.userType} token={this.props.token}/>
                </div>
                <div className='grid-item grid-item-report-table whiteBG'>
                <FontAwesomeIcon icon={faEye} onClick={()=>{
                        this.setState(
                            {
                                renderMenu : true
                            }
                        )
                    }}/>
                    <Container>
                        <Row>
                            <Col style={{textAlign: 'center' ,fontSize: '1.5em'}}>
                                Alarm Report
                            </Col>
                        </Row>
                    </Container>
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