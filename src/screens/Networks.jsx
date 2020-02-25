import React, { Component } from "react";

// redux
import { connect } from "react-redux";
import { fetchNetworks } from "../redux/actions/networks";

// components
import NetworkCard, { NetworkCardParent } from "../components/NetworkCard";
import ServerLogin from "../components/ServerLogin";

class Networks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      networkGroupsSmall: false
    };
  }

  componentWillMount() {
    this.props.servers.servers.map(server => {
      this.props.getNetworks(server);
    });
  }
  componentWillUpdate() {
    this.props.servers.servers.map(server => {
      if (
        !this.props.networks.networks[server.uniqueName] &&
        !this.props.networks.isLoading[server.uniqueName] &&
        !this.props.networks.error[server.uniqueName]
      )
        this.props.getNetworks(server);
    });
  }

  render() {
    return (
      <div>
        {this.props.servers.servers.map(server => {
          return (
            <NetworkCardParent
              title={server.uniqueName}
              small={this.props.networkGroupsSmall}
              key={`${server.uniqueName}_network_display_group`}
            >
              {!this.props.networks.isLoading[server.uniqueName] &&
                !this.props.networks.error[server.uniqueName] &&
                this.props.networks.networks[server.uniqueName] &&
                Object.keys(
                  this.props.networks.networks[server.uniqueName]
                ).map(id => {
                  return (
                    <NetworkCard
                      network={
                        this.props.networks.networks[server.uniqueName][id]
                      }
                    />
                  );
                })}
              {this.props.networks.isLoading[server.uniqueName] && (
                <div>loading</div>
              )}
              {this.props.networks.error[server.uniqueName] &&
                this.props.networks.error[server.uniqueName] !==
                  `Unauthorized` && (
                  <div>
                    error: {this.props.networks.error[server.uniqueName]}
                  </div>
                )}
              {this.props.networks.error[server.uniqueName] ===
                `Unauthorized` && <ServerLogin server={server} />}
            </NetworkCardParent>
          );
        })}
      </div>
    );
  }
}

export default connect(
  state => state,
  dispatch => ({
    getNetworks: server => fetchNetworks(server, dispatch)
  })
)(Networks);
