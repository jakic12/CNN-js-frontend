import React, {Component} from 'react'
import '../styles/Dash.scss'

const LayerType = {
  CONV: 0,
  POOL: 1,
  FC:2,
  INPUT:3,
  FLATTEN:4
}

class Dashboard extends Component {
  constructor(props){
    super(props)

    this.state = {
      networks:[],
    }
  }

  componentDidMount(){
    fetch(`http://localhost:3005/getNetworks`,{
      method: `GET`,
      headers: {
        'Authorization': `Bearer ${this.props.apiToken}`
      }
    }).then(response => response.json())
    .then(json => {
      if(json.err)
        throw new Error(json.err)

      console.log(json)
      this.setState({networks:json})
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

  render(){
    return (
      <div>
        <div className="rightRest">
          {
            this.state.networkData && <div>
              <div className="visualization">
                {
                  this.state.networkData.shape.map((el, lI) => {
                    return <div style={{display:`inline-block`, padding:`10px`, verticalAlign:`middle`}}>
                    {(() => {
                      if(el.type == LayerType.INPUT){
                        return Array(el.d).fill(0).map((_,dI) => // depth index
                          <div key={lI} style={{background:`white`, width:el.w, height:el.h, margin:`2px`}}></div>
                        )
                      }else if(el.type == LayerType.CONV || el.type == LayerType.POOl){
                        return Array(el.d).fill(0).map((_,dI) => // depth index
                          <div>
                            <div key={lI} style={{background:`white`, width:el.f, height:el.f, margin:`2px`, display:`inline-block`, verticalAlign:`middle`}}></div>
                            <div key={lI} style={{background:`white`, width:el.w, height:el.h, margin:`2px`, display:`inline-block`, verticalAlign:`middle`}}></div>
                          </div>
                        )
                      }
                    })()}</div>
                  })
                }
              </div>
            </div>
          }
        </div>
        <div className="rightSidebar headerText">
          <div className="head">
            Your networks
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
  