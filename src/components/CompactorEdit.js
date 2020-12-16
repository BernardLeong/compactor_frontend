import React, { Component } from "react";
import './../css/compactorInfo.css'
import { Form, Button } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";

import DashboardTable from './DashboardTable';
const axios = require('axios');

class CompactorEdit extends Component {
    constructor(props){
      super(props)
        this.state = {
            'loadCompactorDetail' : false,
            'compactorType' : '',
            'address' : '',
            'sectionArea' : '',
            'loadGraph' : false
        }
        this.handleSelectChange = this.handleSelectChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
    }
    componentDidMount(){
        var token = this.props.token
    
        var config = {
          headers: { Authorization: `Bearer ${token}` }
        }
    
        var type = 'user'
        if(this.props.userType == 'Enginner'){
            type = 'serviceUser'
        }
        
        if(this.props.userType == 'Admin'){
            type = 'admin'
        }
    
        var apikeys = {
            'admin' : 'jnjirej9reinvuiriuerhuinui',
            'serviceUser' : 'juit959fjji44jcion4moij0kc',
        }

        
        if(type !== 'user'){
            config['headers']['apikey'] = apikeys[type]
        }      
        var currentCompactorID = this.props.currentCompactorID
        axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/getCompactorInfo/${currentCompactorID}`,config)
        .then((response)=> {
            console.log(response.data)
          this.setState({
            compactorInfo : response.data.compactorInfo,
            address : response.data.compactorInfo.address,
            compactorType : response.data.compactorInfo.compactorType,
            sectionArea : response.data.compactorInfo.sectionArea,
            loadUserDetails : true
          })
        })
        .catch(function (error) {
            console.log(error);
        })
    }

    handleSelectChange(event){ 
        var name = event.target.name
        this.setState({ 
            [name] : event.target.value
        });
    }

    handleSubmit(){
        var type = 'user'
        if(this.props.userType == 'Enginner'){
            type = 'serviceUser'
        }
        
        if(this.props.userType == 'Admin'){
            type = 'admin'
        }
        var currentCompactorID = this.props.currentCompactorID
        var body = {
            "compactorType" : this.state.compactorType,
            "address" : this.state.address,
            "sectionArea" : this.state.sectionArea,
            'compactorID' : currentCompactorID
        }
        
        var token = this.props.token
        var apikeys = {
            'admin' : 'jnjirej9reinvuiriuerhuinui',
            'serviceUser' : 'juit959fjji44jcion4moij0kc',
        }

        var config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        if(type !== 'user'){
            config['headers']['apikey'] = apikeys[type]
        }

        axios.post('http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/editCompactor', body, config).then((result)=>{
            console.log(result)
        }).catch((err)=>{
            console.log(err)
        })
        this.setState({
            loadGraph : true
        })
    }
    render(){
        if(this.state.loadUserDetails){
            if(this.state.loadGraph){
                return(
                    < DashboardTable userType={this.props.userType} token={this.props.token} currentCompactorID={this.state.currentCompactorID} allAlarms={this.props.alarmData}/>
                )
            }else{
                return(
                    <div className='grid-containerTwo'>
                    <div className='grid-item grid-item-4'>
                    </div>
                    <div className='grid-item grid-item-5'>
                    
                    </div>
                        <div className='grid-item grid-item-6'>
                            <Form>
                                <Form.Label>Edit User</Form.Label>
                                <Form.Group controlId="formBasicEmail">
                                <div><Form.Label>Compactor Type</Form.Label></div>
                                    <Form.Control onChange={this.handleSelectChange} value={this.state.compactorType} name='compactorType' />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                <div><Form.Label>Compactor Address</Form.Label></div>
                                    <Form.Control onChange={this.handleSelectChange} value={this.state.address} name='address' />
                                </Form.Group>
                                <Form.Group controlId="formBasicEmail">
                                <div><Form.Label>Compactor Section</Form.Label></div>
                                    <Form.Control onChange={this.handleSelectChange} value={this.state.sectionArea} name='sectionArea' />
                                </Form.Group>
                                <Button onClick={this.handleSubmit} variant="primary">
                                    Submit
                                </Button>
                            </Form>
                        </div>
                    </div>
                )
            }
        }else{
            return(
                <div className='lighttext'>Loading.....</div>
            )
        }
    }
}

export default CompactorEdit