
import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
import { Alert, Table, Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap'
const axios = require('axios');
class MapTest extends Component {
  constructor(props){
    super(props)
    this.state = 
    {
      'livecompactorDataMap': [],
      'liveCompactorAddressesMap' : [],
      'liveCompactorLoadedMap' : false,
      'liveCompactorAddressLoadedMap' : false,
      'showingInfoWindow': true,
      'activeMarker': {},
      'selectedPlace': {},
      'activate' : false,
      'center' : {lat: 1.3552, lng: 103.7972},
      'currentObject' : {},
      'markerColor' : {
        'green' : "https://imagesmapicon.s3-ap-southeast-1.amazonaws.com/goggle_marker_green.png",
        'yellow' : "https://imagesmapicon.s3-ap-southeast-1.amazonaws.com/goggle_marker_yellow.png",
        'red' : "https://imagesmapicon.s3-ap-southeast-1.amazonaws.com/goggle_marker_red.png",

      }
    }
    this.onMarkerClick = this.onMarkerClick.bind(this)
  }

  onMarkerClick(props, marker, e){
    // console.log(props)
    // console.log(props.name.address)
    // console.log(marker)
    // console.log(e)

    this.setState({
      currentObject : props.name,
      // center : props.position,
      selectedPlace: props,
      activeMarker: marker,
      showingInfoWindow: true
    });
  }

  render() {

    if(this.props.handleRedirectToMap){
      var mapStyle = { width: '68em', height: '46em'}
    }else{
      var mapStyle = { width: '30em', height: '67.5em'}
    }
    var alarmArr = []
    var currentCompactorID = false

    if(this.props.currentCompactorID){
      currentCompactorID = this.props.currentCompactorID
    }

    if(this.props.liveCompactorLoaded && this.props.liveAlarmsLoaded){
      var compactorsData = this.props.compactorsData
      var alarmsData = this.props.livealarmData
      console.log(alarmsData)
      for(var i=0;i<compactorsData.length;i++){
        var compactor = compactorsData[i]
        for(var y=0;y<alarmsData.length;y++){
          var alarm = alarmsData[y]
          if(compactor.EquipmentID == alarm.EquipmentID){            
            alarmArr.push(alarm)
          }
        }
      }

      for(var i=0;i<alarmArr.length;i++){
        var alarm = alarmArr[i]
        var nextIndex = i+1

        if(nextIndex < alarmArr.length){
          if(alarm.ts > alarmArr[nextIndex].ts && alarm.EquipmentID == alarmArr[nextIndex].EquipmentID){
            //dun want the next alarm
            alarmArr[nextIndex] = false
          }else if(alarm.ts < alarmArr[nextIndex].ts && alarm.EquipmentID == alarmArr[nextIndex].EquipmentID){
            alarmArr[i] = false
          }
        }
      }

      alarmArr = alarmArr.filter(Boolean);
      for(var i=0;i<compactorsData.length;i++){
        var compactor = compactorsData[i]
        for(var y=0;y<alarmArr.length;y++){
          var alarm = alarmArr[y]
          
          if(compactor.EquipmentID == alarm.EquipmentID){   
            compactorsData[i]["CurrentStatus"] = alarm.CurrentStatus
            compactorsData[i]["Type"] = alarm.Type
            compactorsData[i]["Alarmts"] = alarm.ts
          }
        }
      }

      for(var i=0;i<compactorsData.length;i++){
        var compactor = compactorsData[i]
        if(compactor.FilledLevel <= 70){
          compactorsData[i]["Level"] = 'green'
        }else if(compactor.FilledLevel <= 90){
          compactorsData[i]["Level"] = 'yellow'
        }else if(compactor.FilledLevel > 90){
          compactorsData[i]["Level"] = 'red'
        }

        if(compactorsData[i]["CurrentStatus"]){
          compactorsData[i]["Level"] = 'red'
        }
      }

      var markerColor = this.state.markerColor
      var markers = compactorsData.map(al => (
        <Marker
                  name={al}
                  onClick={this.onMarkerClick}
                  position={{lat: al.coordinates.lat, lng: al.coordinates.long}}
                  icon={{
                  url: markerColor[al.Level],
                  anchor: new window.google.maps.Point(12,32),
                  scaledSize: new window.google.maps.Size(32,32)
                  }}
        />
      ))
      // console.log(this.props.currentCompactorCoordinates)
      // console.log(this.state.center)
      // var center = {lat: 1.3552, lng: 103.7972}
      // if(this.props.currentCompactorCoordinates){
      //   var currentCompactorCoordinates = this.props.currentCompactorCoordinates
      //   var obj = {}
      //   obj["lat"] = currentCompactorCoordinates["lat"]
      //   obj['lng'] = currentCompactorCoordinates["long"]
      //   // var center = {lat: 1.3552, lng: 105.7972}
      //   center = obj
      // }
      // console.log(center)
      return(
        <Map google={window.google}
            style={mapStyle}
            initialCenter={this.state.center }
            zoom={12}
            >
        {markers}
        <InfoWindow
          marker={this.state.activeMarker}
          visible={this.state.showingInfoWindow}
          >
            <div>
              <Table striped bordered hover>
                <tbody>
                  <tr>
                    <td>EquipmentID</td>
                    <td>{this.state.currentObject.EquipmentID}</td>
                  </tr>
                  <tr>
                    <td>Location</td>
                    <td>{this.state.currentObject.address}</td>
                  </tr>
                  <tr>
                    <td>Weight(%)</td>
                    <td>{Math.round(this.state.currentObject.FilledLevel)}</td>
                  </tr>
                  <tr>
                    <td>Fill Status</td>
                    <td>{
                    this.state.currentObject.FilledLevel < 70 ? "Normal" : 
                    this.state.currentObject.FilledLevel <= 90 ? "Strained" : 
                    'ExceedWeight'
                    }</td>
                  </tr>
                  <tr>
                    <td>Fault Status</td>
                    <td>{this.state.currentObject.CurrentStatus ? this.state.currentObject.CurrentStatus : 'No Fault'}</td>
                  </tr>
                  <tr>
                    <td>Fault Type</td>
                    <td>{this.state.currentObject.Type ? this.state.currentObject.Type : 'No Fault'}</td>
                  </tr>
                  <tr>
                    <td>Fault Time/Date</td>
                    <td>{this.state.currentObject.Alarmts ? this.state.currentObject.Alarmts : 'No Fault'}</td>
                  </tr>
                </tbody>
              </Table>
            </div>
        </InfoWindow>
        </Map>
    )
    }else{
      return(
        <Map google={window.google}
            style={mapStyle}
            initialCenter={{lat: 1.3552, lng: 103.7972}}
            zoom={14}>
        </Map>
    )
    }
    }
}


export default GoogleApiWrapper({
    
    apiKey: ("AIzaSyA30fI4ukYd3vqN8D0kYsCPbQ3e6wcv3gY")
})(MapTest)