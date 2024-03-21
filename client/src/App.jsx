require('dotenv').config();

import { Component } from 'react';
import axios from 'axios';
import Smartcar from '@smartcar/auth';

import Connect from './components/Connect';
import Vehicle from './components/Vehicle';

class App extends Component {
  //default constructor initialization
  constructor(props) {
    super(props);

    this.state = {
      vehicle: {},
    };

    this.authorize = this.authorize.bind(this);
    this.onComplete = this.onComplete.bind(this);

    //Create the instance of the Smartcar object.
    this.Smartcar = new Smartcar({
      clientId: process.env.REACT_APP_SMARTCAR_CLIENT_ID,
      redirectUri: process.env.REACT_APP_SMARTCAR_REDIRECT_URI,
      scope: ['required:read_vehicle_info'],
      mode: 'test',
      onComplete: this.onComplete,
  });
}
}

export default App;