import React, { Component } from "react";
import './../css/compactorInfo.css'
import { Navbar, Nav, Form, FormControl, Button  } from 'react-bootstrap'
class NavBarContent extends Component {
    constructor(props){
      super(props)
      this.state = 
      {
        'data': []
      }
    }
    render(){
        return(
            // <div>
            //   <img src={require('./izeem_logo.png')}  width="100" height="90"></img>
            // </div>
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
    <Nav className="mr-auto">
    </Nav>
    <Form inline>
      <span className='welcome'>Welcome User</span>
    </Form>
  </Navbar>
        )
    }
}

export default NavBarContent