
import React, { Component } from "react";
import {Map, InfoWindow, Marker, GoogleApiWrapper} from 'google-maps-react';
const axios = require('axios');
class Mapping extends Component {
  constructor(props){
    super(props)
    this.state = 
    {
      'data': []
    }
  }

  componentDidMount(){
    var token = this.props.token
    var config = {
      headers: { Authorization: `Bearer ${token}` }
  }
    var url = 'http://localhost:8080/allCompactorInfo'
    axios.get(url,config).then((result)=>{
      // console.log(result.data.compactorInfo)
      this.setState({
        data: result.data.compactorInfo
      })
    })
  }
  
  render() {
    let compactors = this.state.data
    var coordinateArr = []
  
    compactors.map(compactor => {
      if(compactor.description){
        let buffer = new Buffer(compactor.description)
        let string = buffer.toString('base64')
        return coordinateArr.push(`&marker=latLng:${compactor.coordinate.lat},${compactor.coordinate.long}!colour:red!iwt:${string}`)
      }else{
        return coordinateArr.push(`&marker=latLng:${compactor.coordinate.lat},${compactor.coordinate.long}!colour:red!`)
      }
    })
    var coordinates = coordinateArr.join('')
    var coordinates = `https://www.onemap.sg/amm/amm.html?mapStyle=Default&zoomLevel=20${coordinates}`
    return(
      <div>
        <iframe src={coordinates} height="780vh" width="100%" scrolling="no" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
      </div>
    )
}
}

export default Mapping