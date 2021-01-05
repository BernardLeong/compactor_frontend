
import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
const axios = require('axios');
class Mapping extends Component {
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

  componentDidMount(){
    var token = this.props.token
    var config = {
      headers: { Authorization: `Bearer ${token}` }
    }
    var url = 'http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/allCompactorInfos/live'
    axios.get(url,config).then((result)=>{
      this.setState({
        livecompactorDataMap: result.data.compactorInfo,
        liveCompactorLoadedMap: true
      })
    })

    axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/allCompactorAddresses/live`,config)
      .then((response)=> {
          this.setState({
              liveCompactorAddressesMap : response.data.compactorAddresses,
              liveCompactorAddressLoadedMap: true
          })
      })
      .catch(function (error) {
          console.log(error);
    })
  }
  
  render() {
    if(this.state.liveCompactorLoadedMap && this.state.liveCompactorAddressLoadedMap){
      var liveCompactorData = this.state.livecompactorDataMap
      var liveCompactorAddresses = this.state.liveCompactorAddressesMap
      var color = this.props.compactorFilledLevel || ''
      var filterSection = this.props.filterSection
  
      var compactorsSort = liveCompactorData.reduce((r, a)=> {
        r[a.ID] = r[a.ID] || [];
        r[a.ID].push(a);
        return r;
      }, Object.create(null));
      var compactorData = []
  
      for (var key in compactorsSort) {
          compactorData.push(compactorsSort[key][( (compactorsSort[key].length) -1)])
      }
      liveCompactorData = compactorData
      var compactorArr = []
      if(filterSection !== ''){
        for(var i=0;i<liveCompactorData.length;i++){
          if(liveCompactorData[i].sectionArea == filterSection){
            compactorArr.push(liveCompactorData[i])
          }
        }
      }
      console.log(liveCompactorData)
  
      if(compactorArr.length > 0 && (filterSection !== '')){
        liveCompactorData = compactorArr
      }
      
      for(var i=0;i<liveCompactorAddresses.length;i++){
        for(var y=0;y<liveCompactorData.length;y++){
          if(liveCompactorData[y].ID == liveCompactorAddresses[i].EquipmentID){
            liveCompactorData[y]['coordinates'] = liveCompactorAddresses[i]['coordinates']
          }
        }
      }

      var liveCompactor = []
      var currentCompactorID = this.props.currentCompactorID
      if(this.props.currentCompactorID){
        for(i=0;i<liveCompactorData.length;i++){
          if(liveCompactorData[i].ID == currentCompactorID){
            liveCompactor.push(liveCompactorData[i])
          }
        }
        liveCompactorData = liveCompactor
      }

      var coordinateArr = []
      liveCompactorData.map(compactor => {
        let percentage = compactor['FilledLevel-Weight']
        if(percentage < 25){
          color = 'green'
        }else if(percentage < 50){
          color = 'lightgreen'
        }else{
          color = 'red'
        }
        let buffer = new Buffer(
          `Compactor ID: ${compactor.ID}`
          )
        let string = buffer.toString('base64')
        return coordinateArr.push(`&marker=latLng:${compactor.coordinates.lat},${compactor.coordinates.long}!colour:${color}!iwt:${string}`)
        // if(compactor.description){
        //     let buffer = new Buffer(compactor.description)
        //     let string = buffer.toString('base64')
        // if(compactor.alarmRaised){
        //   return coordinateArr.push(`&marker=latLng:${compactor.coordinates.lat},${compactor.coordinates.long}!colour:${color}!iwt:${string}!icon:fa-exclamation`)
        // }else{
        //   return coordinateArr.push(`&marker=latLng:${compactor.coordinates.lat},${compactor.coordinates.long}!colour:${color}!iwt:${string}`)
        // }
        // }else{
        //   return coordinateArr.push(`&marker=latLng:${compactor.coordinates.lat},${compactor.coordinates.long}!colour:${color}!icon:fa-exclamation`)
        // }
      })
      var coordinates = coordinateArr.join('')
      var coordinates = `https://www.onemap.sg/amm/amm.html?mapStyle=Default&zoomLevel=20${coordinates}`
      if(this.props.handleRedirectToMap){
        return(
          <div>
            <iframe src={coordinates} height="730vh" width="100%" scrolling="no" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
          </div>
        )
      }else{
        return(
          <div>
            <iframe src={coordinates} height="1100vh" width="100%" scrolling="no" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
          </div>
        )
      }
    }else{
      return(<div>Loading...</div>)
    }
  }
}

export default Mapping