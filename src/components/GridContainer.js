import React, {Component} from 'react'
import './../css/compactorInfo.css'
import Alarm from './Alarm';
import CompactorInfo from './CompactorInfo';
import Mapping from './Mapping';
import NavBarContent from './NavBarContent';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Card, Table, Container, Row, Col } from 'react-bootstrap'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamation } from '@fortawesome/free-solid-svg-icons'

class GridContainer extends Component{
    constructor(props){
        super(props)
        this.state = 
        {
          'redirectTo': '',
          'compactorFilledLevel' : '',
          'selectedAddress' : ''
        }
        this.handleRedirect = this.handleRedirect.bind(this)
        this.handleInteractiveMap = this.handleInteractiveMap.bind(this)
        this.handleAddress = this.handleAddress.bind(this)
    }

    handleRedirect(path){
        this.setState({
            redirectTo : path
        })
    }

    handleInteractiveMap(color){
        this.setState({
            compactorFilledLevel : color
        })
    }

    handleAddress(address){
        this.setState(
            {
                selectedAddress : address
            }
        )
    }

    render(){    
        // if(this.props.location.state.userType == 'User' || this.props.location.state.userType == 'Admin'){

            if(this.state.redirectTo == 'Dashboard'){
                return(
                    <Redirect to={{
                        pathname: '/dashboard',
                        state: { 
                            userType: this.props.location.state.userType,
                            token: this.props.location.state.token
                        }
                    }}
                />
                )
            }
            
            if(this.state.redirectTo == 'userDetails'){
                return(
                    <Redirect to={{
                        pathname: '/editUser',
                        state: { 
                            userType: this.props.location.state.userType,
                            token: this.props.location.state.token
                        }
                    }}
                />
                )
            }else{
                return(
                    <div className='grid-container-compactor'>
                         <div className='grid-item grid-item-01-compactor'>
                             <NavBarContent userType={this.props.location.state.userType} handleRedirect={this.handleRedirect} token={this.props.location.state.token} />
                        </div>
                        <div className='grid-item grid-item-02-compactor'>
                            <Container>
                                <Row>
                                    <Col>
                                    </Col>
                                    <Col className='compactorTableTitle'>
                                        <div>Compactor Details</div>
                                    </Col>
                                    <Col>
                                    </Col>
                                </Row>
                            </Container>
                        </div>
                        <div className='grid-item grid-item-03-compactor'>
                            <CompactorInfo handleAddress={this.handleAddress} token={this.props.location.state.token} userType={this.props.location.state.userType} />
                        </div>


                        <div className='grid-item grid-item-05-compactor'>
                            <Mapping selectedAddress={this.state.selectedAddress} compactorFilledLevel={this.state.compactorFilledLevel} token={this.props.location.state.token} />
                        </div>
                    
                        <div className='grid-item grid-item-06-compactor markBGCompactor'>
                            <div>&nbsp;</div>
                            <div>&nbsp;</div>

                            <div>
                                <Container>
                                <Row>
                                    <Col><div className='legendTitle'>&nbsp;</div></Col>
                                </Row>
                                <div>&nbsp;</div>
                                    <Row>
                                        <Col className='lengendDes'>
                                            <span style={{cursor:'pointer'}} onClick={()=>{
                                                this.handleInteractiveMap('green')
                                            }}><img
                                                src={require('./greendot.png')}
                                                width="30"
                                                height="30"
                                                className="d-inline-block align-top"
                                                alt="React Bootstrap logo"
                                            /></span>
                                        </Col>
                                        <Col className='lengendDes'>
                                            <span style={{cursor:'pointer'}} onClick={()=>{
                                                this.handleInteractiveMap('yellow')
                                            }}><img
                                                src={require('./yellowdot.png')}
                                                width="30"
                                                height="30"
                                                className="d-inline-block align-top"
                                                alt="React Bootstrap logo"
                                            /></span></Col>
                                        <Col className='lengendDes'>
                                            <span style={{cursor:'pointer'}} onClick={()=>{
                                                this.handleInteractiveMap('red')
                                            }}><img
                                                src={require('./reddot.png')}
                                                width="30"
                                                height="30"
                                                className="d-inline-block align-top"
                                                alt="React Bootstrap logo"
                                            /></span>
                                        </Col>
                                    </Row>
                                    <div>&nbsp;</div>
                                    <Row>
                                        <Col className='lengendDes'>Compactor less than 25%</Col>
                                        <Col className='lengendDes'>Compactor less than 50%</Col>
                                        <Col className='lengendDes'>Compactor more than 75%</Col>
                                    </Row>
                                    <div>&nbsp;</div>
                                    <Row>
                                        <Col className='legendTitle'></Col>
                                        <Col onClick={()=>{
                                            this.handleInteractiveMap('renderAlarm')
                                        }}className='legendTitle'><FontAwesomeIcon icon={faExclamation} /></Col>
                                        <Col className='legendTitle'></Col>
                                    </Row>
                                    <Row>
                                        <Col className='lengendDes'></Col>
                                        <Col className='lengendDes'>Alarm Raised</Col>
                                        <Col className='lengendDes'></Col>
                                    </Row>
                                </Container>
                            </div>
                        </div>
                    </div>
                )
            }
        // }

    //     if(this.props.location.state.userType == 'Enginner'){
    //         return(
    //             <div className='grid-container'>
    //                 <Alarm userType={this.props.location.state.userType} token={this.props.location.state.token} />
    //             </div>
    //         )
    //     }else{
    //         return(
    //             <div className='grid-container'>
    //                 Pls Log In First
    //             </div>
    //         )
    //     }
    // }
    }
}

export default GridContainer