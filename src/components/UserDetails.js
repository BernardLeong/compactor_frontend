import React, { Component } from "react";
import './../css/compactorInfo.css'
import { Form, Button } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
const axios = require('axios');

class UserDetails extends Component {
    constructor(props){
      super(props)
        this.state = {
            'username' : '',
            'password' : '',
            'loadUserDetails' : false,
            'redirectToLocationData' : false
        }
        this.handleSelectChange = this.handleSelectChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleRedirect = this.handleRedirect.bind(this)
    }

    componentDidMount(){
        var token = this.props.location.state.token
        var config = {
          headers: { Authorization: `Bearer ${token}` }
        }

        var type = 'user'
        if(this.props.location.state.userType == 'Enginner'){
            type = 'serviceUser'
        }
        
        if(this.props.location.state.userType == 'Admin'){
            type = 'admin'
        }
        
        var body = {
            "username" : this.state.username,
            "password" : this.state.password
        }
        
        var token = this.props.location.state.token
        var apikeys = {
            'admin' : 'jnjirej9reinvuiriuerhuinui',
            'serviceUser' : 'juit959fjji44jcion4moij0kc',
        }

        if(type !== 'user'){
            config['headers']['apikey'] = apikeys[type]
        }      
        axios.get('http://localhost:8080/getCurrentUser',config)
        .then((response)=> {
            console.log(response)
          this.setState({
            username : response.data.username,
            password : response.data.password,
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
        if(this.props.location.state.userType == 'Enginner'){
            type = 'serviceUser'
        }
        
        if(this.props.location.state.userType == 'Admin'){
            type = 'admin'
        }
        
        var body = {
            "username" : this.state.username,
            "password" : this.state.password
        }
        
        var token = this.props.location.state.token
        var apikeys = {
            'admin' : 'jnjirej9reinvuiriuerhuinui',
            'serviceUser' : 'juit959fjji44jcion4moij0kc',
        }

        var config = {
            headers: { Authorization: `Bearer ${token}` }
        }

        // if()
        // console.log(apikeys[type])
        if(type !== 'user'){
            config['headers']['apikey'] = apikeys[type]
        }

        axios.post('http://localhost:8080/editUser', body, config).then((result)=>{
            console.log(result)
        }).catch((err)=>{
            console.log(err)
        }) 

        this.setState(
            {
                redirectToLocationData : true,
                loadUserDetails : false
            }
        )
    }

    handleRedirect(){
        this.setState(
            {
                redirectToLocationData : true,
                loadUserDetails : false
            }
        )
    }
    render(){
        if(this.state.loadUserDetails){
            return(
                <div className='grid-containerTwo'>
                <div className='grid-item grid-item-4'>
                </div>
                <div className='grid-item grid-item-5'>
                
                </div>
                    <div className='grid-item grid-item-6 lighttext'>
                        <Form>
                            <Form.Label>Edit User</Form.Label>
                            <Form.Group controlId="formBasicEmail">
                            <div><Form.Label>Username</Form.Label></div>
                                <Form.Control onChange={this.handleSelectChange} value={this.state.username} name='username' placeholder="Enter username" />
                            </Form.Group>
                            <Form.Group controlId="formBasicPassword">
                                <Form.Label>Password</Form.Label>
                                <Form.Control onChange={this.handleSelectChange} value={this.state.password} name='password' placeholder="Password" />
                            </Form.Group>
                            <Button onClick={this.handleSubmit} variant="primary">
                                Submit
                            </Button>
                            &nbsp;
                            &nbsp;
                            <Button onClick={this.handleRedirect} variant="primary">
                                Back
                            </Button>
                        </Form>
                    </div>
                </div>
            )
        }else if(this.state.redirectToLocationData){
            return(
                <Redirect to={{
                    pathname: '/locationData',
                    state: { 
                        userType: this.props.location.state.userType,
                        token: this.props.location.state.token
                    }
                }}
            />
            )
        }else{
            return(
                <div className='lighttext'>Loading.....</div>
            )
        }
    }
}

export default UserDetails