
import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
const axios = require('axios');
class MapTest extends Component {
  constructor(props){
    super(props)
    this.state = 
    {
      'livecompactorDataMap': [],
      'liveCompactorAddressesMap' : [],
      'liveCompactorLoadedMap' : false,
      'liveCompactorAddressLoadedMap' : false
    }
  }

  
  render() {
        return(
            <Map google={window.google}
                style={{width: '30em', height: '67.5em'}}
                initialCenter={{lat: 1.3552, lng: 103.7972}}
                zoom={11}>
                    <Marker
                    name={'Your position'}
                    position={{lat: 1.287953, lng: 103.851784}}
                    icon={{
                    url: "https://imagesmapicon.s3-ap-southeast-1.amazonaws.com/goggle_marker_yellow.png",
                    anchor: new window.google.maps.Point(12,32),
                    scaledSize: new window.google.maps.Size(32,32)
                    }}
                    />
                     <Marker
                    name={'Your position'}
                    position={{lat: 1.2789, lng: 103.751784}}
                    icon={{
                    url: "https://imagesmapicon.s3-ap-southeast-1.amazonaws.com/goggle_marker_yellow.png",
                    anchor: new window.google.maps.Point(12,32),
                    scaledSize: new window.google.maps.Size(32,32)
                    }}
                    />
            </Map>
        )
    }
}


export default GoogleApiWrapper({
    apiKey: ("AIzaSyA30fI4ukYd3vqN8D0kYsCPbQ3e6wcv3gY")
})(MapTest)