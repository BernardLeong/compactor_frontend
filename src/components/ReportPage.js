
import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
import NavBarContent from './NavBarContent';
import { Alert, Table, Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap'
import Calendar from 'react-calendar';
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
            'liveAlarmReport' : false
        }
    }

    render(){
        var allAlarmData = this.props.liveAlarmReport

        allAlarmData = sortObjectsArray(allAlarmData, 'ts', {order: 'desc'})
        var starttime = this.state.selectStartDate
        var endtime = this.state.selectEndDate
        console.log(allAlarmData)

        var downloadUrl = false
        var filterUrl = false
        if(starttime && endtime){
            var json = {"from" : starttime,"to" : endtime}
            var ciphertext = CryptoJS.AES.encrypt(JSON.stringify(json), cryptKey).toString();
            ciphertext = encodeURIComponent(ciphertext)
            downloadUrl = `http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/generatePDF/${ciphertext}`
            filterUrl = `http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/getAlarmReport/${ciphertext}`
            var token = this.props.token
            var config = {
                headers: { Authorization: `Bearer ${token}` }
            }
            var rawAlarmData = axios.get(filterUrl ,config)
            .then((response)=> {
                console.log(response)
                this.setState({
                    liveAlarmReport : response.data.data
                })
            })
            .catch(function (error) {
            })    
        }

        if(this.state.liveAlarmReport){
            allAlarmData = this.state.liveAlarmReport
        }

        // if(starttime !== '' && endtime !== ''){
        //     var filterAlarmData = []
        //     for(var i=0;i<allAlarmData.length;i++){
        //         if(starttime !== endtime){
        //             var todaydate = moment(allAlarmData[i]['ts']).format()
        //             todaydate = new Date(todaydate).getTime()
        //             var startTime = new Date(starttime).getTime()
        //             var endTime = new Date(endtime).getTime()
        //             if(startTime <= todaydate && endTime >= todaydate){
        //                 filterAlarmData.push(allAlarmData[i])
        //             }
        //         }
        //         else{
        //             var todaydate = moment(allAlarmData[i]['ts']).format()
        //             todaydate = new Date(todaydate).getTime()
        //             var startTime = new Date(starttime).getTime()
        //             var endTime = new Date(endtime).getTime()
        //             if(startTime <= todaydate){
        //                 filterAlarmData.push(allAlarmData[i])
        //             }
        //         }
        //     }

        //     allAlarmData = filterAlarmData
        //     filterAlarmData = []
        // }

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

        if(allAlarmData.length <= 0){
            var renderAlarms = 
            <tr>
            </tr>
        }else{
            var paginatedAlarms = chunkyReportAlarm(allAlarmData,maxLength)
            console.log(this.state.paginationAlarmReportPage)
            var renderAlarms = paginatedAlarms[this.state.paginationAlarmReportPage -1]
            allAlarmData = renderAlarms.map(al => (
                <tr>
                    <th style={{textAlign: 'center'}} >{al.EquipmentID}</th>
                    <th style={{textAlign: 'center'}}>{al.ts}</th>
                    <th style={{textAlign: 'center'}}>{al.ClearedTS}</th>
                    <th style={{textAlign: 'center'}}>{al.timeDifference}</th>
                    <th style={{textAlign: 'center'}}>{al.Type}</th>
                    <th style={{textAlign: 'center'}}>{al.Status}</th>
                </tr>
            ))
        }

        if(downloadUrl){
            return(
                <div className="grid-container-report">
                      <div className='grid-item grid-item-01-compactor'>
                       <NavBarContent userType={this.props.userType} token={this.props.token} />
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
                                        <th style={{textAlign : 'center'}}>Equipment ID</th>
                                        <th style={{textAlign : 'center'}}>Alarm Trigger Timestamp</th>
                                        <th style={{textAlign : 'center'}}>Alarm Clear Timestamp</th>
                                        <th style={{textAlign : 'center'}}>Time Difference</th>
                                        <th style={{textAlign : 'center'}}>Alarm Type</th>
                                        <th style={{textAlign : 'center'}}>Alarm Status</th>
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
                       <NavBarContent userType={this.props.userType} token={this.props.token}/>
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
                                        <th style={{textAlign : 'center'}}>Equipment ID</th>
                                        <th style={{textAlign : 'center'}}>Alarm Trigger Timestamp</th>
                                        <th style={{textAlign : 'center'}}>Alarm Clear Timestamp</th>
                                        <th style={{textAlign : 'center'}}>Time Difference</th>
                                        <th style={{textAlign : 'center'}}>Alarm Type</th>
                                        <th style={{textAlign : 'center'}}>Alarm Status</th>
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
}
export default ReportPage