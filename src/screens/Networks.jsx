import React, { Component } from "react";

// redux
import { connect } from "react-redux";
import { fetchNetworks } from "../redux/actions/networks";

// components
import NetworkCard, { NetworkCardParent } from "../components/NetworkCard";

class Networks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      networkGroupsSmall: false
    };
  }
  componentWillMount() {
    this.props.getNetworks(
      this.props.config.apiUrl,
      `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0YWY2NDdjNWQ0Yjc5MGJhN2ExNGIzZDZjOTY2ZTY0ZTM2ZTAyMzRiM2U4YzY0NmZlYzZjZjk5YzdhNmYyNDU5IiwiaWF0IjoxNTgyNTc3MzE1LCJleHAiOjE1ODMxODIxMTV9.EsPP7BQO8R4aKCjwxCN_xspVjqKQ3BR5BwJrRHL7GrA`
    );
  }
  render() {
    return (
      <div>
        <NetworkCardParent
          title={`Local`}
          small={this.state.networkGroupsSmall}
        >
          {this.props.networks.networks &&
            Object.keys(this.props.networks.networks).map(id => {
              return <NetworkCard network={this.props.networks.networks[id]} />;
            })}
        </NetworkCardParent>

        <NetworkCardParent
          title={`Server1`}
          small={this.state.networkGroupsSmall}
        >
          {this.props.networks.networks &&
            Object.keys(this.props.networks.networks).map(id => (
              <NetworkCard network={this.props.networks.networks[id]} />
            ))}
        </NetworkCardParent>
      </div>
    );
  }
}

export default connect(
  state => state,
  dispatch => ({
    getNetworks: (url, apiToken) => fetchNetworks(url, apiToken, dispatch)
  })
)(Networks);
