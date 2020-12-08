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
        'logOut' : false
      }
      this.logout = this.logout.bind(this)
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
              }}>User</span></span>
            </Form>
          </Navbar>
        )
      }
    }
}

export default NavBarContent