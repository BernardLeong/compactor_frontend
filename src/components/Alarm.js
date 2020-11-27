import Axios from 'axios'
import React, {Component} from 'react'
import axios from 'axios'
import './../css/compactorInfo.css'
class Alarm extends Component{
    constructor(props){
        super(props)
        this.state = 
        {
          'alarms': [],
          'enginnerAPIKey' : 'juit959fjji44jcion4moij0kc',
          'adminAPIKey' : 'jnjirej9reinvuiriuerhuinui',
          'alarmsLoaded' : false
        }
      }

      componentDidMount(){
        var token = this.props.token
        var config = {
          headers: { Authorization: `Bearer ${token}` }
      }
        if(this.props.userType == 'Enginner'){
          config = {
            headers: { Authorization: `Bearer ${token}`, apikey: this.state.enginnerAPIKey }
          }
        }

        if(this.props.userType == 'Admin'){
          config = {
            headers: { Authorization: `Bearer ${token}`, apikey: this.state.adminAPIKey }
          }
        }
          var url = `http://localhost:8080/getAllAlarm`
        axios.get(url,config).then((result)=>{
          this.setState({
            alarms: result.data.alarmInfo,
            alarmsLoaded: true
          })
        })
      }

      offAlarm(compactorID){
        var url = `http://localhost:8080/offMachine`
        var token = this.props.token
        var config = {
          headers: { Authorization: `Bearer ${token}` }
        }
        var body = {
          "compactorID" : compactorID
        }
        if(this.props.userType == 'Enginner'){
          config = {
            headers: { Authorization: `Bearer ${token}`, apikey: this.state.enginnerAPIKey }
          }
        }

        if(this.props.userType == 'Admin'){
          config = {
            headers: { Authorization: `Bearer ${token}`, apikey: this.state.adminAPIKey }
          }
        }
        axios.post(url, body, config).then((result)=>{
          if(result.data.success){
            this.setState({load: result})
          }
        })
      }

    render(){
      var alarmsInfo = null
      if(this.state.alarmsLoaded){
        var alarms = this.state.alarms
        alarmsInfo = alarms.map(alarm => (
            <div>
                <div>&nbsp;</div>
              <div><span>CompactorID</span> : {alarm.compactorID}</div>
              <div><span>Time Raised</span> : {alarm.humanReadableTS}</div>
              <div><span>Status</span> : {alarm.status}</div>
              <div><span>Type</span> : {alarm.type}</div>
            </div>
          ))
          if(this.props.userType == 'Admin' || this.props.userType == 'Enginner'){
            alarmsInfo = alarms.map(alarm => (
              <div>
                  <div>&nbsp;</div>
                <div><span>CompactorID</span> : {alarm.compactorID}</div>
                <div><span>Time Raised</span> : {alarm.humanReadableTS}</div>
                <div><span>Status</span> : {alarm.status}</div>
                <div><span>Type</span> : {alarm.type}</div>
                <div><button onClick={this.offAlarm.bind(this, alarm.compactorID)}>Off Alarm</button></div>
              </div>
            ))
          }
      }
        

      
        return(
            <div className='grid-item grid-item-3 background'>
                <h3>Alarms raised</h3>
                {alarmsInfo}
            </div>
        )
    }
}

export default Alarm
