import React, { Component } from "react";

import { Redirect } from "react-router-dom";

// redux
import { connect } from "react-redux";

// components
import NetworkShapeVisual from "../components/NetworkShapeVisual";
import styled from "styled-components";
import Error from "../components/Error";
import KeyValueTable from "../components/KeyValueTable";

// redux actions
import { fetchNetwork } from "../redux/actions/networks";

// utils
import { exportText } from "../other/utils";

const NetworkWrapper = styled.div`
  padding: 20px;
  box-sizing: border-box;
`;

const Title = styled.h2`
  margin: 0.5em;
  margin-left: 0;
  margin-right: 0;

  box-shadow: 0;
  box-sizing: border-box;
`;

const Subtitle = styled.h3`
  margin: 0.5em;
  margin-left: 0;
  margin-right: 0;

  box-shadow: 0;
  box-sizing: border-box;
`;

const NetworkScreenTitleWrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const DownloadButton = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  background: ${(props) => props.primarycolor};
  color: ${(props) => props.primarytextcolor};
  border: none;
  text-decoration: none;
  border-radius: 5px;
  box-sizing: content-box;
  padding: 1em;

  &:hover {
    cursor: pointer;
  }
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
        (server) =>
          server.uniqueName === this.props.match.params.serverUniqueName
      ),
    };

    this.checkForError = this.checkForError.bind(this);
  }

  componentDidMount() {
    this.checkForError();
  }

  checkForError() {
    const network =
      this.props.match.params.serverUniqueName &&
      this.props.match.params.networkId &&
      this.props.networks.networks[this.props.match.params.serverUniqueName] &&
      this.props.networks.networks[this.props.match.params.serverUniqueName][
        this.props.match.params.networkId
      ];
    if (network !== this.state.network) this.setState({ network });
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
      } else {
        if (!this.state.refreshRequestSent) {
          this.setState({ needToRefreshNetwork: true });
        }
      }
    } else if (
      !this.props.networks.networks[this.props.match.params.serverUniqueName][
        this.props.match.params.networkId
      ]
    ) {
      error = `network has not been cached`;
      if (!this.state.refreshRequestSent)
        this.setState({ needToRefreshNetwork: true });
    }

    if (network && network.reduced) {
      if (!this.state.refreshRequestSent)
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
    this.checkForError();
    if (this.state.needToRefreshNetwork) {
      this.setState(
        { needToRefreshNetwork: false, refreshRequestSent: true },
        () => {
          this.props.getNetwork(
            this.props.match.params.networkId,
            this.state.server
          );
        }
      );
    }

    if (this.state.notLoggedIn) {
      setTimeout(() => {
        this.setState({
          notLoggedIn: false,
          redirect: true,
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
              pathname: "/networks",
            }}
          />
        )}
        {this.state.network && (
          <>
            <NetworkScreenTitleWrapper>
              <Title>{this.state.network.name}</Title>
              <FlexCenter>
                <DownloadButton
                  onClick={() => {
                    exportText(
                      JSON.stringify(this.state.network),
                      this.state.network.name.replace(` `, `_`) + `.cnn`
                    );
                  }}
                  {...this.props.colors}
                >
                  Export
                </DownloadButton>
              </FlexCenter>
            </NetworkScreenTitleWrapper>
            <NetworkShapeVisual network={this.state.network} />
            <Subtitle>Parameters</Subtitle>
            <KeyValueTable
              data={this.state.network}
              include={[`name`, `learningRate`]}
              editFunction={(key, newValue) => {}}
            />
          </>
        )}
        {this.props.networks.networkLoading[
          this.props.match.params.serverUniqueName +
            this.props.match.params.networkId
        ] && <div>Loading</div>}
        {!this.props.networks.networkLoading[
          this.props.match.params.serverUniqueName +
            this.props.match.params.networkId
        ] &&
          this.state.error && <Error error={this.state.error} />}
      </NetworkWrapper>
    );
  }
}

export default connect(
  (state) => state,
  (dispatch) => ({
    getNetwork: (networkId, server) =>
      fetchNetwork(networkId, server, dispatch),
  })
)(Network);
