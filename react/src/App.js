import React, {Component} from 'react';
import Cookies from 'universal-cookie';
import './App.scss';

import Login from './screens/Login.jsx'
import ScreenSelectMenu from './components/ScreenSelectMenu'

const cookies = new Cookies();

class App extends Component{
  constructor(props){
    super(props)

    this.state = {
      tab:0,
      token: cookies.get('apiToken')
    }

    this.login = this.login.bind(this)
    this.logout = this.logout.bind(this)
  }

  login(token){
    this.setState({ token })
    cookies.set('apiToken', token, { path: '/' })
  }
  
  logout(){
    this.setState({ token:undefined })
    cookies.remove(`apiToken`)
  }

  render(){
    if(!this.state.token){
      return (
        <div>
          <Login loginCallback={this.login} />
        </div>
      );
    }else{
      return (
        <div id="main">
          <div id="leftBar">
            <ScreenSelectMenu />
            <button style={{bottom:0, position:"absolute"}} onClick={ this.logout }>logout</button>
          </div>
          <div id="restOfTheScreen"></div>
        </div>
      );
    }
  }
}


export default App;
