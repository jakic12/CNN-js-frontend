import React, { Component } from "react";

// redux
import { connect } from "react-redux";
import {
  fetchNetworks,
  newNetwork,
  setNetwork,
} from "../redux/actions/networks";

// components
import NetworkCard, {
  NetworkCardParent,
  AddNetworkCard,
} from "../components/NetworkCard";
import ServerLogin from "../components/ServerLogin";
import Error, { translateError } from "../components/Error";

import { PropagateLoader } from "react-spinners";

import styled from "styled-components";
import AnimatedFullScreenCard from "../components/AnimatedFullScreenCard";
import Dropzone from "react-dropzone";

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

const InnerNetworkSelect = styled.div`
  border-radius: 5px;
  padding: 1em;
  overflow: hidden;
`;

const Title = styled.h3`
  margin: 0.5em;
  margin-left: 0;
  margin-right: 0;

  box-shadow: 0;
  box-sizing: border-box;
`;

const FileSelect = styled.div`
  padding: 1em;
  border-radius: 5px;
  margin-top: 1em;
  border: 1px solid gray;
  &:hover {
    cursor: pointer;
  }
`;

const ConfirmButton = styled.div`
  background: ${(props) => props.primarycolor};
  color: ${(props) => props.primarytextcolor};
  padding: 1em;
  border-radius: 5px;
  margin-top: 1em;
  &:hover {
    cursor: pointer;
  }
`;

class Networks extends Component {
  constructor(props) {
    super(props);

    this.state = {
      networkGroupsSmall: false,
      downloadRef: {},
      importServer: undefined,
      importNetworkName: undefined,
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
      <>
        <div>
          {this.props.servers.servers.map((server) => {
            return (
              <NetworkCardParent
                title={server.uniqueName}
                customRightButton={
                  <DownloadButton
                    ref={(r) =>
                      !this.state.downloadRef[server.uniqueName] &&
                      this.setState((prevState) => ({
                        downloadRef: Object.assign({}, prevState.downloadRef, {
                          [server.uniqueName]: r,
                        }),
                      }))
                    }
                    onClick={() => {
                      this.setState({ importServer: server });
                    }}
                    {...this.props.colors}
                  >
                    Import
                  </DownloadButton>
                }
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
                              this.props.networks.networks[server.uniqueName][
                                id
                              ]
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
        {this.state.importServer && (
          <AnimatedFullScreenCard
            startFromElement={
              this.state.downloadRef[this.state.importServer.uniqueName]
            }
            fullscreen={true}
            onCloseCallback={() => this.setState({ importServer: undefined })}
            contentFunction={(close) => (
              <InnerNetworkSelect {...this.props.colors}>
                <Title>Upload network file</Title>
                <Dropzone
                  onDrop={(acceptedFiles) => {
                    const file = acceptedFiles[0];

                    const reader = new FileReader();

                    reader.onabort = () =>
                      console.log("file reading was aborted");
                    reader.onerror = () =>
                      console.log("file reading has failed");
                    reader.onload = () => {
                      const networkJSON = JSON.parse(reader.result);
                      this.setState({
                        importNetworkName: networkJSON.name,
                        networkJSON,
                      });
                    };
                    reader.readAsText(file);
                  }}
                >
                  {({ getRootProps, getInputProps }) => (
                    <section>
                      <div {...getRootProps()}>
                        <input {...getInputProps()} />
                        <FileSelect>
                          {this.state.importNetworkName ||
                            `Drag 'n' drop some file here, or click to select files`}
                        </FileSelect>
                      </div>
                    </section>
                  )}
                </Dropzone>
                <ConfirmButton
                  {...this.props.colors}
                  onClick={() => {
                    this.props.setNetwork(
                      this.state.importServer,
                      this.state.networkJSON
                    );
                    close();
                  }}
                >
                  Confirm
                </ConfirmButton>
              </InnerNetworkSelect>
            )}
          />
        )}
      </>
    );
  }
}

export default connect(
  (state) => state,
  (dispatch) => ({
    getNetworks: (server) => fetchNetworks(server, dispatch),
    createNewNetwork: (name, shape, server) =>
      newNetwork(name, shape, server, dispatch),
    setNetwork: (server, network) => setNetwork(server, network, dispatch),
  })
)(Networks);
