import React, {Component} from 'react'
import './../css/compactorInfo.css'
import Alarm from './Alarm';
import CompactorInfo from './CompactorInfo';
import Mapping from './Mapping';
import NavBarContent from './NavBarContent';
import { BrowserRouter as Router, Switch, Route, Link, Redirect } from "react-router-dom";
import { Card, Table } from 'react-bootstrap'
class GridContainer extends Component{
    constructor(props){
        super(props)
        this.state = 
        {
          'redirectTo': ''
        }
        this.handleRedirect = this.handleRedirect.bind(this)
    }

    handleRedirect(path){
        this.setState({
            redirectTo : path
        })
    }
    render(){       
        // if(this.props.location.state.userType == 'User' || this.props.location.state.userType == 'Admin'){
            console.log(this.props)
            if(this.state.redirectTo == 'locationMap'){
                return(
                    <div>Hi</div>
                )
            }

            if(this.state.redirectTo == 'Dashboard'){
                return(
                    <Redirect to={{
                        pathname: '/dashboard',
                        state: { 
                            userType: this.props.location.state.userType,
                            token: this.props.location.state.token,
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
                    <div className='grid-container'>
                         <div className='grid-item grid-item-01'>
                             <NavBarContent/>
                        </div>
                        <div className='grid-item grid-item-02 darkbg'>
                        <Table striped bordered hover variant="dark">
                            <thead>
                            <tr>
                            <th onClick={()=>{
                                this.handleRedirect('userDetails')
                            }} >User Details</th>
                            <th onClick={()=>{
                                this.handleRedirect('Dashboard')
                            }} >Dashboard</th>
                            </tr>
                            </thead>
                        </Table>
                        </div>
                        <div className='grid-item grid-item-03 darkbg'>
                            <CompactorInfo token={this.props.location.state.token} userType={this.props.location.state.userType} />
                        </div>
                        <div className='grid-item grid-item-04'>
                            <Mapping token={this.props.location.state.token} />
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