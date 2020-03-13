import React, { Component } from "react";

import { Redirect } from "react-router-dom";

// redux
import { connect } from "react-redux";

// components
import NetworkShapeVisual from "../components/NetworkShapeVisual";
import styled from "styled-components";
import Error from "../components/Error";

import { fetchNetwork } from "../redux/actions/networks";

const NetworkWrapper = styled.div`
  padding: 20px;
  padding-top: 0;
  box-sizing: border-box;
`;

class Network extends Component {
  constructor(props) {
    super(props);
    this.state = {
      network:
        props.match.params.serverUniqueName &&
        props.match.params.networkId &&
        props.networks.networks[props.match.params.serverUniqueName] &&
        props.networks.networks[props.match.params.serverUniqueName][
          props.match.params.networkId
        ],
      error: undefined,
      server: this.props.servers.servers.find(
        server => server.uniqueName === this.props.match.params.serverUniqueName
      )
    };
  }

  componentDidMount() {
    const network =
      this.props.match.params.serverUniqueName &&
      this.props.match.params.networkId &&
      this.props.networks.networks[this.props.match.params.serverUniqueName] &&
      this.props.networks.networks[this.props.match.params.serverUniqueName][
        this.props.match.params.networkId
      ];
    let error = undefined;
    if (!this.props.match.params.serverUniqueName) {
      error = `invalid server name`;
    } else if (!this.props.match.params.networkId) {
      error = `invalid network name`;
    } else if (
      !this.props.networks.networks[this.props.match.params.serverUniqueName]
    ) {
      error = `server has no networks`;
      if (!this.state.server.apiToken) {
        error = `not logged in, redirecting...`;
        this.setState({ notLoggedIn: true });
      }
    } else if (
      !this.props.networks.networks[this.props.match.params.serverUniqueName][
        this.props.match.params.networkId
      ]
    ) {
      error = `network has not been cached`;
      this.setState({ needToRefreshNetwork: true });
    }

    if (network && network.reduced) {
      this.setState({ needToRefreshNetwork: true });
    }

    error =
      this.props.networks.networkError[
        this.props.match.params.serverUniqueName +
          this.props.match.params.networkId
      ] || error;
    if (this.state.error !== error) {
      this.setState({ error });
    }
  }

  componentDidUpdate() {
    if (this.state.needToRefreshNetwork) {
      this.setState({ needToRefreshNetwork: false }, () =>
        this.props.getNetwork(
          this.props.match.params.networkId,
          this.state.server
        )
      );
    }

    if (this.state.notLoggedIn) {
      setTimeout(() => {
        this.setState({
          notLoggedIn: false,
          redirect: true
        });
      }, 3000);
    }
  }

  render() {
    return (
      <NetworkWrapper>
        {this.state.redirect && (
          <Redirect
            to={{
              pathname: "/networks"
            }}
          />
        )}
        {this.state.network && (
          <NetworkShapeVisual network={this.state.network} />
        )}
        {this.props.networks.networkLoading[
          this.props.match.params.serverUniqueName +
            this.props.match.params.networkId
        ] && <div>Loading</div>}
        {this.state.error && <Error error={this.state.error} />}
      </NetworkWrapper>
    );
  }
}

export default connect(
  state => state,
  dispatch => ({
    getNetwork: (networkId, server) => fetchNetwork(networkId, server, dispatch)
  })
)(Network);
