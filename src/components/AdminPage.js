import React, { Component } from "react";
import { Alert, Table, Container, Row, Col, Form, Button, InputGroup, FormControl } from 'react-bootstrap'
const axios = require('axios');
const sortObjectsArray = require('sort-objects-array');

class AdminPage extends Component {
    constructor(props){
        super(props)
        this.state = 
        {
            "userListPage" : 1,
            "renderEditUser" : false,
            "selectedUserName" : '',
            "selectedUserType" : '',
            'uDetails' : {}
        }
    }

    handleEditUser(){

        var body = this.state.uDetails

        axios.post('https://cert-manger.izeesyncbackend.com/edituser', body).then((result)=>{
            console.log(result)
        }).catch((err)=>{
            console.log(err)
        })
    }

    render(){
        var body = this.state.uDetails

        console.log(body)
        var userLists = []
        if(this.props.usersListLoaded){
            //render 
            userLists = this.props.userLists
            userLists = sortObjectsArray(userLists, 'userType')

            var tableHeaders = 
            <tr>
            <th style={{textAlign: 'center'}}>User Name</th>
            <th style={{textAlign: 'center'}}>User Access</th>
        </tr>
         var title = 
         <Container>
             <Row>
                 <Col style={{textAlign: 'center' ,fontSize: '1.5em'}}>
                    User Lists
                 </Col>
             </Row>
         </Container>

        }else{
                var content = <span>Loading.....</span>
        }

        var columns = (arr, size) =>
        Array.from({ length: Math.ceil(arr.length / size) }, (v, i) =>
        arr.slice(i * size, i * size + size)
        );

        var maxLength = 22

        if(userLists.length < maxLength){
            var maxPage = 1
        }else{
            var maxPage = Math.ceil((userLists.length / maxLength))
        }
        var range = []
        for(var i=1;i<=maxPage;i++){
            range.push(i)
        }

        var userListPaginate = range.map(page => <a onClick={()=>{this.setState(
        {
            userListPage : page
        }
        )}} style={{cursor:'pointer'}}>{page}</a>)

        userListPaginate = 
        <div style={{fontSize: '0.8em'}} className="pagination">
            {userListPaginate}
        </div>

        if(userLists.length > 0){
            var userListColumns = columns(userLists,maxLength)
            var renderUserList = userListColumns[this.state.userListPage -1]
            
            var userLists = renderUserList.map(user => (
                <tr>
                    <th onClick={()=>{
                        this.setState(
                            {
                                renderEditUser : true,
                                selectedUserName: user.username,
                                selectedUserType: user.userType,
                            }
                        )
                    }} style={{textAlign: 'center', cursor: 'pointer', fontWeight: 'normal'}} >{user.username}</th>
                    <th style={{textAlign: 'center', cursor: 'pointer', fontWeight: 'normal'}} >{user.userType}</th>
                </tr>
            ))

            content = 
        <div className="grid-item grid-container-adminPage-registerPage whiteBG">        
        {title}
        <div>&nbsp;</div>
            <Container>
                <Row>
                    <Col>   
                        <table style={{fontFamily: "arial, sans-serif", borderCollapse: 'collapse', width: '100%'}}>
                            {tableHeaders}
                            {userLists}
                        </table>
                        {userListPaginate}
                    </Col>
                </Row>
            </Container>
        </div>
        }

        if(this.state.renderEditUser){
            var userTypeOptions = {
                'admin' : "Admin",
                'serviceUser' : "Enginner",
                'user' : "User",
            }
    
            return(
                <div className="grid-container-adminPage">
                    <div className="grid-item grid-container-adminPage-dashBoard whiteBG">
                       <div>&nbsp;</div>
                       <Container className="blueBG adjustPadding">
                           <Row>
                               <Col style={{textAlign : 'center'}}>Admin</Col>
                           </Row>
                           </Container>
                           <Container className="blueBorder adjustPaddingContent">
                           <Row>
                               <Col style={{textAlign : 'center', cursor: 'pointer'}} onClick={()=>{

                                   this.setState({handleRedirectToAdminPage : false})
                               }}>Dashboard</Col>
                           </Row>
                           </Container>
                   </div>
                    <div className="grid-item grid-container-adminPage-registerPage whiteBG">        
                        <Container>
                        <Row>
                            <Col style={{textAlign : 'center', fontSize: '1.4em'}}>Edit User</Col>
                        </Row>
                        </Container>
                        <div>&nbsp;</div>
                        <Container>
                        <Row>
                            <Col>
                                <Form>
                                    <Form.Group onChange={this.handleRegisterUserType} controlId="exampleForm.ControlSelect1">
                                        <Form.Label>User Type</Form.Label>
                                        <Form.Control defaultValue={userTypeOptions[this.state.selectedUserType]} as="select">
                                            <option>User</option>
                                            <option>Enginner</option>
                                            <option>Admin</option>
                                        </Form.Control>
                                    </Form.Group>
                                    <Form.Group controlId="formBasicEmail">
                                    <div><Form.Label>Username</Form.Label></div>
                                        <Form.Control value={this.state.selectedUserName} onChange={(event)=>{
                                            // console.log(event.target.username)
                                            this.setState(
                                                {
                                                    selectedUserName: event.target.username
                                                }
                                            )
                                        }} name='username' type="username" placeholder="Enter username" />
                                    </Form.Group>
                                    <Form.Group controlId="formBasicPassword">
                                        <Form.Label>Password</Form.Label>
                                        <Form.Control value="" name='password' type="password" placeholder="Password" />
                                    </Form.Group>
                                    <Button onClick={this.handleRegisterUser} variant="primary">
                                        Submit
                                    </Button>
                                    <span>&nbsp;</span>
                                    <Button onClick={()=>{
                                        this.setState({handleRedirectToAdminPage : false})
                                    }} variant="primary">
                                        Back
                                    </Button>
                                </Form>
                            </Col>
                        </Row>
                        </Container>
                    </div>
                </div>
            )
        }else{
            return(
                <div className="grid-container-adminPage">
                   {/* <div className='grid-item grid-item-01-compactor whiteBG'>
                       <NavBarContent saveCurrentUser={this.saveCurrentUser} userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                   </div> */}
                   <div className="grid-item grid-container-adminPage-dashBoard whiteBG">
                       
                       <div>&nbsp;</div>
                       <Container className="blueBG adjustPadding">
                           <Row>
                               <Col style={{textAlign : 'center'}}>Admin</Col>
                           </Row>
                           </Container>
                           <Container className="blueBorder adjustPaddingContent">
                           <Row>
                               <Col style={{textAlign : 'center', cursor: 'pointer'}} onClick={()=>{
                                   this.setState({handleRedirectToAdminPage : false})
                               }}>Dashboard</Col>
                           </Row>
                           </Container>
                   </div>
                   {content}
               </div>
          )
        }
    }
}
export default AdminPage