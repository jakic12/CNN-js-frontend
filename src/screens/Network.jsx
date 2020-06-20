import React, { Component } from "react";

import { Redirect } from "react-router-dom";

// redux
import { connect } from "react-redux";

// components
import NetworkShapeVisual from "../components/NetworkShapeVisual";
import styled from "styled-components";
import Error from "../components/Error";
import KeyValueTable from "../components/KeyValueTable";
import Dropdown from "react-dropdown";
import "react-dropdown/style.css";

// redux actions
import { fetchNetwork } from "../redux/actions/networks";

// utils
import { exportText } from "../other/utils";
import NetworkPropagation from "../components/NetworkPropagation";
import Dropzone from "react-dropzone";
import { fetchDatasets } from "../redux/actions/datasets";
import { openDatasetFromBuffer } from "../CNN-js/datasetProcessor";
import { deepNormalize } from "../CNN-js/math";

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

const ImageSelect = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const UploadRoot = styled.div`
  padding: 1em;
  border: 1px solid gray;
  border-radius: 5px;
  margin-right: 1em;
`;

const getDatasetLen = (dataset) => {
  return (
    dataset &&
    dataset.data &&
    dataset.data.length / (dataset.imageSize ** 2 * dataset.colorDepth + 1)
  );
};

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
      uploadedImage: null,
      selectedDatasetImageIndex: 0,
    };

    this.checkForError = this.checkForError.bind(this);
  }

  componentDidMount() {
    this.checkForError();

    this.props.servers.servers.map((s) => {
      this.props.fetchDatasets(s);
    });
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
            <NetworkShapeVisual
              network={this.state.networkNew || this.state.network}
              withData={false}
            />
            <Subtitle>Classify</Subtitle>
            <ImageSelect>
              <Dropzone
                accept={".jpg, .png"}
                onDrop={(acceptedFiles) => {
                  acceptedFiles.forEach((file) => {
                    const reader = new FileReader();

                    reader.onabort = () =>
                      console.log("file reading was aborted");
                    reader.onerror = () =>
                      console.log("file reading has failed");
                    reader.onload = () => {
                      this.setState({
                        uploadedImage: reader.result,
                        selectedDatasetIndex: null,
                      });
                    };
                    reader.readAsArrayBuffer(file);
                  });
                }}
              >
                {({ getRootProps, getInputProps }) => (
                  <section>
                    <UploadRoot {...getRootProps()}>
                      <input {...getInputProps()} />
                      Drag 'n' drop image file here, or click to select it
                    </UploadRoot>
                  </section>
                )}
              </Dropzone>
              <div style={{ padding: `1em` }}>or</div>
              <Dropdown
                placeholder="Select a dataset"
                options={(() => {
                  const out = Object.keys(this.props.datasets.datasets).map(
                    (s) => ({
                      type: `group`,
                      name: s,
                      items: Object.keys(this.props.datasets.datasets[s]).map(
                        (dId) => ({
                          value: dId,
                          label:
                            this.props.datasets.datasets[s][dId].name +
                            ` (${
                              this.props.datasets.datasets[s][dId].data.length /
                              (this.props.datasets.datasets[s][dId].imageSize **
                                2 *
                                this.props.datasets.datasets[s][dId]
                                  .colorDepth +
                                1)
                            })`,
                        })
                      ),
                    })
                  );
                  return out;
                })()}
                onChange={(v) => {
                  this.setState({ selectedDatasetIndex: v.value });
                }}
                value={this.state.selectedDatasetIndex}
              />
              <input
                type="number"
                min={0}
                max={
                  this.state.selectedDatasetIndex &&
                  getDatasetLen(
                    this.props.datasets.datasets[this.state.server.uniqueName][
                      this.state.selectedDatasetIndex
                    ]
                  ) - 1
                }
                value={this.state.selectedDatasetImageIndex}
                onChange={(e) => {
                  this.setState({
                    selectedDatasetImageIndex:
                      (e.target.value || e.target.value === 0) &&
                      e.target.value <
                        getDatasetLen(
                          this.props.datasets.datasets[
                            this.state.server.uniqueName
                          ][this.state.selectedDatasetIndex]
                        )
                        ? parseInt(e.target.value)
                        : this.state.selectedDatasetImageIndex,
                    uploadedImage: null,
                  });
                }}
                style={{ padding: `8px`, width: `5em`, fontSize: `1em` }}
              />

              {/*<DownloadButton
                {...this.props.colors}
                style={{ marginLeft: `1em` }}
                onClick={

                }
              >
                Classify
              </DownloadButton>*/}
            </ImageSelect>
            <NetworkPropagation
              network={this.state.network}
              image={this.state.uploadedImage}
              server={this.state.server}
              rawData={(() => {
                if (this.state.selectedDatasetIndex) {
                  const inputDataset = openDatasetFromBuffer(
                    this.props.datasets.datasets[this.state.server.uniqueName][
                      this.state.selectedDatasetIndex
                    ].data
                  );

                  const inputArray =
                    inputDataset[this.state.selectedDatasetImageIndex].input;

                  //debugger;

                  const datasetProps = this.props.datasets.datasets[
                    this.state.server.uniqueName
                  ][this.state.selectedDatasetIndex];
                  if (datasetProps.normalizeMax) {
                    return deepNormalize(inputArray, datasetProps.normalizeMax);
                  } else {
                    return inputArray;
                  }
                }
              })()}
            />
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
    fetchDatasets: (server) => fetchDatasets(server, dispatch),
  })
)(Network);
