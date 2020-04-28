import React, { Component } from "react";

// redux
import { connect } from "react-redux";
import { fetchNetworks, newNetwork } from "../redux/actions/networks";

// components
import NetworkCard, {
  NetworkCardParent,
  AddNetworkCard,
} from "../components/NetworkCard";
import ServerLogin from "../components/ServerLogin";
import Error, { translateError } from "../components/Error";

import { NetworkArchitectures } from "../CNN-js/cnn";
import { PropagateLoader } from "react-spinners";

class Networks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      networkGroupsSmall: false,
    };
  }

  componentWillMount() {
    this.props.servers.servers.map((server) => {
      this.props.getNetworks(server);
    });
  }
  componentWillUpdate() {
    this.props.servers.servers.map((server) => {
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
        {this.props.servers.servers.map((server) => {
          return (
            <NetworkCardParent
              title={server.uniqueName}
              small={this.props.networkGroupsSmall}
              key={`${server.uniqueName}_network_display_group`}
            >
              {!this.props.networks.isLoading[server.uniqueName] &&
                !this.props.networks.error[server.uniqueName] &&
                this.props.networks.networks[server.uniqueName] && (
                  <>
                    {Object.keys(
                      this.props.networks.networks[server.uniqueName]
                    ).map((id) => {
                      return (
                        <NetworkCard
                          network={
                            this.props.networks.networks[server.uniqueName][id]
                          }
                          draggable={true}
                          server={server.uniqueName}
                        />
                      );
                    })}
                    <AddNetworkCard
                      onclick={(name, shape) => {
                        this.props.createNewNetwork(name, shape, server);
                      }}
                    />
                  </>
                )}

              {this.props.networks.isLoading[server.uniqueName] && (
                <div>
                  <PropagateLoader />
                </div>
              )}
              {this.props.networks.error[server.uniqueName] &&
                this.props.networks.error[server.uniqueName] !==
                  `Unauthorized` && (
                  <div>
                    <Error
                      error={translateError(
                        this.props.networks.error[server.uniqueName]
                      )}
                      retryFunction={() => this.props.getNetworks(server)}
                    />
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
  (state) => state,
  (dispatch) => ({
    getNetworks: (server) => fetchNetworks(server, dispatch),
    createNewNetwork: (name, shape, server) =>
      newNetwork(name, shape, server, dispatch),
  })
)(Networks);
