import React, { Component } from "react";

import { Redirect } from "react-router-dom";

// redux
import { connect } from "react-redux";

// redux actions
import { fetchDataset } from "../redux/actions/datasets";

// utils
import styled from "styled-components";
import { openDatasetFromBuffer } from "../CNN-js/datasetProcessor";
import LayerCanvas from "../components/LayerCanvas";

import { AiOutlineArrowLeft, AiOutlineArrowRight } from "react-icons/ai";
import NetworkSelect from "../components/NetworkSelect";
import ConfusionMatrix from "../components/ConfusionMatrix";
import Table from "../components/Table";

const DatasetWrapper = styled.div`
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

const FlexCenter = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const PreviewWrapper = styled.div`
  max-width: 100%;
`;

const Preview = styled.div`
  display: flex;
  flex-direction: row;
  padding: 1em;
  flex-wrap: wrap;
`;

const PreviewControls = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;

const PreviewButton = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  background: ${(props) => props.primarycolor};
  color: ${(props) => props.primarytextcolor};
  border: none;
  text-decoration: none;
  border-radius: 5px;
  box-sizing: content-box;
  padding: 0.2em 0.5em;
  margin-right: 1em;

  display: flex;
  justify-content: center;

  &:hover {
    cursor: pointer;
  }
`;

const LeftRight = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
`;

const LeftRightChild = styled.div`
  width: 50%;
  max-height: 100vh;
  box-sizing: border-box;
`;

const getDatasetLen = (dataset) => {
  return (
    dataset &&
    dataset.data &&
    dataset.data.length / (dataset.imageSize ** 2 * dataset.colorDepth + 1)
  );
};

const round = (x, c) => parseInt(x * 10 ** c) / 10 ** c;

class Dataset extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataset:
        props.match.params.serverUniqueName &&
        props.match.params.datasetId &&
        props.datasets.datasets[props.match.params.serverUniqueName] &&
        props.datasets.datasets[props.match.params.serverUniqueName][
          props.match.params.datasetId
        ],
      error: undefined,
      server: this.props.servers.servers.find(
        (server) =>
          server.uniqueName === this.props.match.params.serverUniqueName
      ),

      datasetData: undefined,
      datasetPreviewIndex: 0,
      datasetPreviewSize: 50,
      selectedNetwork: undefined,
      selectedNetworkServer: undefined,
      confusionStats: undefined,
    };

    this.checkForError = this.checkForError.bind(this);
  }

  componentDidMount() {
    this.checkForError();

    if (this.state.dataset)
      this.setState({
        datasetData: openDatasetFromBuffer(
          this.state.dataset.data,
          this.state.dataset.colorDepth,
          this.state.dataset.imageSize
        ),
      });
  }

  checkForError() {
    const dataset =
      this.props.match.params.serverUniqueName &&
      this.props.match.params.datasetId &&
      this.props.datasets.datasets[this.props.match.params.serverUniqueName] &&
      this.props.datasets.datasets[this.props.match.params.serverUniqueName][
        this.props.match.params.datasetId
      ];
    if (dataset !== this.state.dataset) this.setState({ dataset });
    let error = undefined;
    if (!this.props.match.params.serverUniqueName) {
      error = `invalid server name`;
    } else if (!this.props.match.params.datasetId) {
      error = `invalid network name`;
    } else if (
      !this.props.datasets.datasets[this.props.match.params.serverUniqueName]
    ) {
      error = `server has no networks`;
      if (!this.state.server.apiToken) {
        error = `not logged in, redirecting...`;
        this.setState({ notLoggedIn: true });
      } else {
        if (!this.state.refreshRequestSent) {
          this.setState({ needToRefreshDataset: true });
        }
      }
    } else if (
      !this.props.datasets.datasets[this.props.match.params.serverUniqueName][
        this.props.match.params.datasetId
      ]
    ) {
      error = `network has not been cached`;
      if (!this.state.refreshRequestSent)
        this.setState({ needToRefreshDataset: true });
    }

    error =
      this.props.datasets.datasetsError[
        this.props.match.params.serverUniqueName +
          this.props.match.params.datasetId
      ] || error;
    if (this.state.error !== error) {
      this.setState({ error });
    }
  }

  componentDidUpdate() {
    this.checkForError();
    if (this.state.needToRefreshDataset) {
      this.setState(
        { needToRefreshDataset: false, refreshRequestSent: true },
        () => {
          this.props.getDataset(
            this.props.match.params.datasetId,
            this.state.server
          );
        }
      );
    }
    if (this.state.dataset && this.state.refreshRequestSent) {
      this.setState({
        datasetData: openDatasetFromBuffer(
          this.state.dataset.data,
          this.state.dataset.colorDepth,
          this.state.dataset.imageSize
        ),
        refreshRequestSent: false,
      });
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
      <DatasetWrapper>
        {this.state.redirect && (
          <Redirect
            to={{
              pathname: "/datasets",
            }}
          />
        )}
        {this.state.dataset && (
          <>
            <Title>{this.state.dataset.name}</Title>
            <FlexCenter>
              <PreviewWrapper>
                <Preview>
                  {this.state.datasetData &&
                    this.state.datasetData
                      .slice(
                        this.state.datasetPreviewIndex,
                        this.state.datasetPreviewIndex +
                          this.state.datasetPreviewSize
                      )
                      .map((d) => (
                        <LayerCanvas
                          style={{ paddingLeft: `.5em`, paddingTop: `.5em` }}
                          array={d.input}
                          width={`5em`}
                          height={`5em`}
                        />
                      ))}
                </Preview>
                <PreviewControls>
                  {this.state.datasetData &&
                    this.state.datasetPreviewIndex > 0 && (
                      <PreviewButton
                        {...this.props.colors}
                        onClick={() =>
                          this.setState((prevState) => ({
                            datasetPreviewIndex:
                              prevState.datasetPreviewIndex -
                              prevState.datasetPreviewSize,
                          }))
                        }
                      >
                        <AiOutlineArrowLeft />
                      </PreviewButton>
                    )}
                  {this.state.datasetData &&
                    this.state.datasetPreviewIndex +
                      this.state.datasetPreviewSize <
                      this.state.datasetData.length && (
                      <PreviewButton
                        {...this.props.colors}
                        onClick={() =>
                          this.setState((prevState) => ({
                            datasetPreviewIndex:
                              prevState.datasetPreviewIndex +
                              prevState.datasetPreviewSize,
                          }))
                        }
                      >
                        <AiOutlineArrowRight />
                      </PreviewButton>
                    )}
                </PreviewControls>
              </PreviewWrapper>
            </FlexCenter>
            <Title>Generate confusion matrix</Title>
            <LeftRight>
              <LeftRightChild>
                <NetworkSelect
                  onNetworkSelect={(server, networkId) => {
                    this.setState({
                      selectedNetworkServer: server,
                      selectedNetwork: networkId,
                    });
                  }}
                />
              </LeftRightChild>
              <LeftRightChild>
                {this.state.selectedNetwork && (
                  <LeftRight>
                    <LeftRightChild>
                      <ConfusionMatrix
                        updateVar={this.state.selectedNetwork}
                        network={
                          this.props.networks.networks[
                            this.state.selectedNetworkServer.uniqueName
                          ][this.state.selectedNetwork]
                        }
                        dataset={this.state.dataset}
                        statsCallback={(confusionStats) =>
                          this.setState({ confusionStats })
                        }
                      />
                    </LeftRightChild>
                    <LeftRightChild>
                      {this.state.confusionStats && (
                        <Table
                          data={
                            Object.keys(this.state.confusionStats.avg).reduce(
                              (prev, current) =>
                                Object.assign(prev, {
                                  [current]: `${round(
                                    this.state.confusionStats.avg[current] *
                                      100,
                                    2
                                  )}%`,
                                }),
                              {}
                            ) || {}
                          }
                        />
                      )}
                    </LeftRightChild>
                  </LeftRight>
                )}
              </LeftRightChild>
            </LeftRight>
          </>
        )}
      </DatasetWrapper>
    );
  }
}

export default connect(
  (state) => state,
  (dispatch) => ({
    getDataset: (datasetId, server) =>
      fetchDataset(datasetId, server, dispatch),
  })
)(Dataset);
