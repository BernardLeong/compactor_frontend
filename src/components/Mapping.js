
import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
const axios = require('axios');
class Mapping extends Component {
  constructor(props){
    super(props)
    this.state = 
    {}
  }

  // componentDidMount(){
  //   var token = this.props.token
  //   var config = {
  //     headers: { Authorization: `Bearer ${token}` }
  //   }
   
  // }
  
  render() {
    if(this.props.liveCompactorLoaded){
      var liveCompactorData = this.props.livecompactorData
      
      var color = ''

      console.log(liveCompactorData)
      var currentCompactorID = this.props.currentCompactorID
      // console.log(currentCompactorID)
      var coordinateArr = []

      var filteredCompactorData = []

      for(var index =0; index<liveCompactorData.length; index++){
        if(currentCompactorID !== '' && currentCompactorID == liveCompactorData[index].EquipmentID){
          filteredCompactorData.push(liveCompactorData[index])
        }
      }

      if(filteredCompactorData.length > 0){
        liveCompactorData = filteredCompactorData
      }

      liveCompactorData.map(compactor => {
        let percentage = compactor['FilledLevel']
        if(percentage <= 70){
          color = 'green'
        }else if(percentage <= 90){
          color = 'lightgreen'
        }else{
          color = 'red'
        }
        let buffer = new Buffer(
          `Compactor ID: ${compactor.EquipmentID}
          `
          )
        let string = buffer.toString('base64')
          return coordinateArr.push(`&marker=latLng:${compactor.coordinates.lat},${compactor.coordinates.long}!colour:${color}!iwt:${string}`)
      })
      var coordinates = coordinateArr.join('')
      var coordinates = `https://www.onemap.sg/amm/amm.html?mapStyle=Default&zoomLevel=20${coordinates}`
      if(this.props.handleRedirectToMap){
          return(
            <div>
              <iframe src={coordinates} height="700vh" width="100%" scrolling="no" frameBorder="0" allowFullScreen="allowfullscreen"></iframe>
            </div>
          )
      }else{
        return(
          <div>
            <iframe src={coordinates} height="1100vh" width="100%" scrolling="no" frameBorder="0" allowFullScreen="allowfullscreen"></iframe>
          </div>
        )
      }
    }else{
      return(<div>Loading...</div>)
    }
  }
}

export default Mapping