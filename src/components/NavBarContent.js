import React, { Component } from "react";
import './../css/compactorInfo.css'
import { Navbar, Nav, Form, FormControl, Button  } from 'react-bootstrap'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
const axios = require('axios');

class NavBarContent extends Component {
    constructor(props){
      super(props)
      this.state = 
      {
        'logOut' : false,
        'currentUser' : ''
      }
      this.logout = this.logout.bind(this)
    }

    componentDidMount(){
      var token = this.props.token

      var config = {
          headers: { Authorization: `Bearer ${token}`}
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

      axios.get(`http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/getCurrentUser`,config)
      .then((response)=> {
        this.setState({
          currentUser : response.data.username,
        })

        this.props.saveCurrentUser(response.data.username)
      })
      .catch(function (error) {
        console.log(error);
      })
    }

    logout(){
      var body = {
        "token" : this.props.token
      }
      axios.post('http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/logout', body).then((result)=>{
      }).catch((err)=>{
        console.log(err)
      })

      this.setState(
        {
          logOut : true
        }
      )
    }

    render(){
      if(this.state.logOut){
        return(
          <Redirect to={{
              pathname: '/login'
            }}
          />
        )
      }else{
        return(
          <Navbar bg="light" variant="light">
            <Navbar.Brand>
              <img
                  src={require('./izeesync.png')}
                  width="70"
                  height="30"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
            </Navbar.Brand>
            <Form style={{cursor:'pointer'}} inline>
              &nbsp;&nbsp;<span onClick={this.logout} className='welcome'>Log Out</span>
            </Form>

            <Nav className="mr-auto">
            </Nav>
            <Form inline>
              <span className='welcome'>Welcome {this.state.currentUser}</span>
            </Form>
          </Navbar>
        )
      }
    }
}

export default NavBarContent