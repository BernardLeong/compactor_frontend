import React, { Component } from "react";
import logo from './logo.svg';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import GridContainer from './components/GridContainer';
import Login from './components/Login';

import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
class App extends Component {
  

  render() {
    
    return(
      <Router>
        <div>
          <Route path='/login' component={Login} />
          <Route path='/locationData' component={GridContainer} />>
        </div>
      </Router>

    )
  }
}

export default App