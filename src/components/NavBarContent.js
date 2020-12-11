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

      axios.get(`http://localhost:8080/getCurrentUser`,config)
      .then((response)=> {
        this.setState({
          currentUser : response.data.username,
        })
      })
      .catch(function (error) {
        console.log(error);
      })
    }

    logout(){
      var body = {
        "token" : this.props.token
      }
      axios.post('http://localhost:8080/logout', body).then((result)=>{
        console.log(result)
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
      console.log(this.state)
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
                  src={require('./izeem_logo.png')}
                  width="50"
                  height="50"
                  className="d-inline-block align-top"
                  alt="React Bootstrap logo"
                />
            </Navbar.Brand>
            <Nav.Link target="_blank" href="https://www.sembcorp.com/en/"><span className='welcome'>Home</span></Nav.Link>
            <Form style={{cursor:'pointer'}} inline>
              &nbsp;&nbsp;<span onClick={this.logout} className='welcome'>Log Out</span>
            </Form>

            <Nav className="mr-auto">
            </Nav>
            <Form inline>
              <span className='welcome'>Welcome <span style={{cursor:'pointer'}} onClick={()=>{
                this.props.handleRedirect('userDetails')
              }}>{this.state.currentUser}</span></span>
            </Form>
          </Navbar>
        )
      }
    }
}

export default NavBarContent