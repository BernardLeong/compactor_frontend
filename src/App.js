import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import GridContainer from './components/GridContainer';
import UserDetails from './components/UserDetails';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import AlarmDetails from './components/AlarmDetails';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
class App extends Component {
  

  render() {
    
    return(
      <Router>
        <div>
          <Route path='/login' component={Login} />
          <Route path='/locationData' component={GridContainer} />
          <Route path='/editUser' component={UserDetails} />
          <Route path='/dashboard' component={Dashboard} />
          <Route path='/alarmDetails' component={AlarmDetails} />
          <Route path='/alarmDetails' component={AlarmDetails} />
        </div>
      </Router>

    )
  }
}

export default App