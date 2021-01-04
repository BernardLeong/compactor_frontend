
import React, { Component } from "react";
import './../css/compactorInfo.css'
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Form, Button, Alert, Container, Row, Col } from 'react-bootstrap'
const axios = require('axios');

class Login extends Component {
    constructor(props){
        super(props)
        this.state = {
            'username' : '',
            'password' : '',
            'selectOption' : 'User',
            'error' : ''
        }
        this.handleSubmit = this.handleSubmit.bind(this)
        this.handleChange = this.handleChange.bind(this)
        this.handleSelectChange = this.handleSelectChange.bind(this)
    }

    handleSelectChange(event){ 
        this.setState({ 
            selectOption : event.target.value
        });
    }

    handleChange(event){
        var name = event.target.name
        this.setState({ 
            [name] : event.target.value
        });
    }

    handleSubmit(){
        //call backend to edit compactor\
       
        var type = 'user'
        if(this.state.selectOption == 'Enginner'){
            type = 'serviceUser'
        }

        if(this.state.selectOption == 'Admin'){
            type = 'admin'
        }

        var body = {
            "username" : this.state.username,
            "password" : this.state.password,
            "type" : type
        }

        axios.post('http://ec2-18-191-176-57.us-east-2.compute.amazonaws.com/loginUser', body).then((result)=>{
            this.setState({token: result.data.token, success: result.data.success, error: result.data.error})
        }).catch((err)=>{
            console.log(err)
        })

        this.setState({
            renderList : true
        })
    }

    render(){
        if(this.state.success){
            return(
                <Redirect to={{
                    pathname: '/locationData',
                    state: { 
                        userType: this.state.selectOption,
                        token: this.state.token
                    }
                }}
            />
            )
        }else{
            if(this.state.error){
                var error = this.state.error
                return(
                    <div> 
                        <div className='grid-container-login'>
                        <div className='grid-item grid-container-login-login whiteBG'>
                            <Container>
                                <Row>
                                    <Col>
                                        <Alert variant='danger'>
                                            {error}
                                        </Alert>
                                        <Form>
                                            <Form.Label style={{fontSize: '2em',textAlign: 'center'}} >Login</Form.Label>
                                            <Form.Group onChange={this.handleSelectChange} controlId="exampleForm.ControlSelect1">
                                                <Form.Label>User Type</Form.Label>
                                                <Form.Control as="select">
                                                <option>User</option>
                                                <option>Enginner</option>
                                                <option>Admin</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="formBasicEmail">
                                            <div><Form.Label>Username</Form.Label></div>
                                                <Form.Control onChange={this.handleChange} name='username' placeholder="Enter username" />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control onChange={this.handleChange}  name='password' type="password" placeholder="Password" />
                                            </Form.Group>
                                            <Button onClick={this.handleSubmit} variant="primary">
                                                Submit
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        </div>
                    </div>
                )
            }else{
                return(
                    <div> 
                        <div className='grid-container-login'>
                        <div className='grid-item grid-container-login-login whiteBG'>
                            <Container>
                                <Row>
                                    <Col>
                                        <Form>
                                            <Form.Label style={{fontSize: '2em',textAlign: 'center'}} >Login</Form.Label>
                                            <Form.Group onChange={this.handleSelectChange} controlId="exampleForm.ControlSelect1">
                                                <Form.Label>User Type</Form.Label>
                                                <Form.Control as="select">
                                                <option>User</option>
                                                <option>Enginner</option>
                                                <option>Admin</option>
                                                </Form.Control>
                                            </Form.Group>
                                            <Form.Group controlId="formBasicEmail">
                                            <div><Form.Label>Username</Form.Label></div>
                                                <Form.Control onChange={this.handleChange} name='username' placeholder="Enter username" />
                                            </Form.Group>
                                            <Form.Group controlId="formBasicPassword">
                                                <Form.Label>Password</Form.Label>
                                                <Form.Control onChange={this.handleChange}  name='password' type="password" placeholder="Password" />
                                            </Form.Group>
                                            <Button onClick={this.handleSubmit} variant="primary">
                                                Submit
                                            </Button>
                                        </Form>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        </div>
                    </div>
                )
            }
        }
    }
}


export default Login