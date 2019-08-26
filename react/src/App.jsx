import React, {Component} from 'react';
import handwithnote from './res/img/handwithnote.png'
import Cookies from 'universal-cookie';
import './App.scss';

import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import ScreenSelectMenu from './components/ScreenSelectMenu'

const cookies = new Cookies();

class App extends Component{
  constructor(props){
    super(props)

    this.state = {
      tab:0,
      token: cookies.get('apiToken'),
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

  displayError = e =>{
    this.setState({error:e})
  }

  render(){
    return (<div>
      <div id="errorDiv">
        {
          this.state.error && <ErrorDisplayer error={this.state.error} endSelf={() => {this.setState({error:undefined})}}/>
        }
      </div>
      {(() => {
        if(!this.state.token){
          return (
            <div>
              <Login loginCallback={this.login} onError={this.displayError} />
            </div>
          );
        }else{
          return (
            <div id="main">
              <div id="leftBar">
                <ScreenSelectMenu />
                <button style={{bottom:0, position:"absolute"}} onClick={ this.logout }>logout</button>
              </div>
              <div id="restOfTheScreen">
                {
                  (() => {switch(this.state.tab){
                      case 0:
                        return <Dashboard apiToken={this.state.token} onError={this.displayError}/>
                    }
                  })()
                }
              </div>
            </div>
          );
        }
      })()}
    </div>)
  }
}
class ErrorDisplayer extends Component {
  constructor(props){
    super(props)

    this.state = {
      showing:0
    }
  }

  componentDidMount(){
    setTimeout(() => {
      this.setState({showing:1})
    }, 100);
  }

  render(){
    console.error(this.props.error)
    return (
      <div>
        { !this.state.dead && 
          <div style={{position:`absolute`, height:`100vh`, width:`100vw`, overflow:`hidden`}} onClick={() => {
            if(this.state.showing === 1){
              this.setState({showing:0})
              setTimeout(() => {
                this.setState({dead:true},this.props.endSelf)
              }, 500);
            }
          }}>
            <div style={{position:`absolute`, left:`calc(50% - 411px/2)`, top:`calc(50% - 420px/2)`, zIndex:10000}}>
              <div style={{position:`relative`,transition:`transform 0.5s`, transform:`translate(${(1-this.state.showing)*100}vw, ${(1-this.state.showing)*100}vh) rotate(${(1-this.state.showing)*90}deg)`}}>
                <img style={{position:`absolute`}} src={handwithnote} alt="handwithnote"/>
                <div style={{
                  position:`absolute`,
                  width:`411px`,
                  height:`420px`,
                  padding:`10px`
                }}>{this.props.error.toString()}</div>
              </div>
            </div>
          </div>
        }
      </div>
    );
  }
}


export default App;
