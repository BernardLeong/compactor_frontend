
import React, { Component } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoffee } from '@fortawesome/free-solid-svg-icons'
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
    var url = 'http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/allCompactorInfo'
    axios.get(url,config).then((result)=>{
      // console.log(result.data.compactorInfo)
      this.setState({
        data: result.data.compactorInfo
      })
    })
  }
  
  render() {
    var compactors = this.state.data
    var coordinateArr = []
    var color = this.props.compactorFilledLevel || ''
    var compactorArr = []
    var selectedAddress = this.props.selectedAddress || ''
    if(this.props.selectedAddress){
      // console.log('ciorejioej')
      for(var i=0;i<compactors.length;i++){
        if(compactors[i].address == selectedAddress){
          compactorArr.push(compactors[i])
        }
      }
    }else if(color != ''){
      for(var i=0;i<compactors.length;i++){
        var percentage = Math.round((compactors[i].current_weight / compactors[i].max_weight)*100 )
        var alarmRaised = compactors[i].alarmRaised
        
        if(percentage < 25 && color == 'green'){
          compactorArr.push(compactors[i])
        }else if(percentage > 25 && percentage < 50 && color == 'yellow'){
          compactorArr.push(compactors[i])
        }else if(percentage >50 && color == 'red'){
          compactorArr.push(compactors[i])
        }else if(alarmRaised && color == 'renderAlarm'){
          compactorArr.push(compactors[i])
        }
      }
    }

    if(compactorArr.length > 0 && (color !== '' || selectedAddress !== '')){
      compactors = compactorArr
    }
    
    compactors.map(compactor => {
      let percentage = Math.round((compactor.current_weight / compactor.max_weight)*100 )
      if(percentage < 25){
        color = 'green'
      }else if(percentage < 50){
        color = 'lightgreen'
      }else{
        color = 'red'
      }
      if(compactor.description){
        let buffer = new Buffer(compactor.description)
        let string = buffer.toString('base64')

        if(compactor.alarmRaised){
          return coordinateArr.push(`&marker=latLng:${compactor.coordinate.lat},${compactor.coordinate.long}!colour:${color}!iwt:${string}!icon:fa-exclamation`)
        }else{
          return coordinateArr.push(`&marker=latLng:${compactor.coordinate.lat},${compactor.coordinate.long}!colour:${color}!iwt:${string}`)
        }
       
      }else{
        return coordinateArr.push(`&marker=latLng:${compactor.coordinate.lat},${compactor.coordinate.long}!colour:${color}!icon:fa-exclamation`)
      }
    })
    var coordinates = coordinateArr.join('')
    var coordinates = `https://www.onemap.sg/amm/amm.html?mapStyle=Default&zoomLevel=20${coordinates}`
    return(
      <div>
        <iframe src={coordinates} height="630vh" width="100%" scrolling="no" frameborder="0" allowfullscreen="allowfullscreen"></iframe>
      </div>
    )
}
}

export default Mapping