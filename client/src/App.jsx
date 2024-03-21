require('dotenv').config();

import { Component } from 'react';
import axios from 'axios';
import smartcar from '@smartcar/auth';

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
    const client = new smartcar.AuthClient({
      mode: 'test',
  });
}

onComplete(err, code, status) {
  return axios
  .get(`${process.env.REACT_APP_SERVER}/exchange?code=${code}`)
  .then(_ => {
    return axios.get(`${process.env.REACT_APP_SERVER}/vehicle`);
  })
  .then(res => {
    this.setState({vehicle: res.data});
  });
}

authorize() {
    this.smartcar.openDialog({ forcePrompt: true });
  }

  render() {
    return Object.keys(this.state.vehicle).length !== 0 ? (
      <Vehicle info={this.state.vehicle} />
    ) : (
      <Connect onClick={this.authorize} />
    );
  }
}

export default App;