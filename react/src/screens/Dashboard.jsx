import React, {Component} from 'react'
import '../styles/Dash.scss'
import {
  getNetworks,
  createNetworks
} from '../Api'
import NetworkVisualisation from '../components/NetworkVisualisation'

class Dashboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      networks:[],
    }

    this.updateNetworkList = this.updateNetworkList.bind(this)
  }

  componentDidMount(){
    this.updateNetworkList()
  }

  updateNetworkList(){
    getNetworks(this.props.apiToken)
    .then(networks => {
      this.setState({networks:networks})
    })
    .catch(this.props.onError)
  }

  updateNetworkData(){
    fetch(`http://localhost:3005/getNetwork/${this.state.selectedNetwork}`,{
      method: `GET`,
      headers: {
        'Authorization': `Bearer ${this.props.apiToken}`
      }
    }).then(response => response.json())
    .then(json => {
      if(json.err)
        throw new Error(json.err)

      console.log(json)
      this.setState({networkData:json})
    })
    .catch(this.props.onError)
  }

  updateFilters(){
    //TODO add update filters
  }

  render(){
    return (
      <div>
        <div className="rightRest">
          {
            this.state.networkData && <div>
              <NetworkVisualisation networkData={this.state.networkData} />
            </div>
          }
        </div>
        <div className="rightSidebar headerText">
          <div className="head">
            <div className="leftText">
              Your networks
            </div>
            <div className="rightText" onClick={() => {
              createNetworks(this.props.apiToken)
              .then(() => {
                this.updateNetworkList()
              })
              .catch(this.props.onError)
            }}>
              new
            </div>
          </div>
          <div className="listOfNetworks ">
            <ul>
              {
                this.state.networks.map((el) => <li onClick={
                  () => {this.setState({selectedNetwork:el}, this.updateNetworkData)}
                } key={el} id={el}>{el}</li>)
              }
            </ul>
          </div>
        </div>
      </div>
    );
  }
}
  
  export default Dashboard;
  