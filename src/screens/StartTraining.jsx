import React from "react";
import { connect } from "react-redux";

import { setTrainingParam } from "../redux/actions/training";
import KeyValueTable from "../components/KeyValueTable";

import styled from "styled-components";

import { fetchNetwork } from "../redux/actions/networks";
import { fetchDataset } from "../redux/actions/datasets";
import { startTraining } from "../redux/actions/training";

//components
import SpringButton from "../components/SpringButton";
import NetworkSelect from "../components/NetworkSelect";
import DatasetSelect from "../components/DatasetSelect";
import { Redirect } from "react-router-dom";
import Error from "../components/Error";

const TrainingWrapper = styled.div`
  height: 100%;
  padding: 1em;
`;

const Title = styled.h1`
  margin: 0.5em;
  margin-left: 0;
  margin-right: 0;

  box-shadow: 0;
  box-sizing: border-box;
`;

const TwoPart = styled.div`
  min-height: 100%;
  display: flex;
  flex-direction: row;
  width: 100%;
  @media only screen and (max-width: 900px) {
    & {
      flex-direction: column;
    }
  }
`;

const TwoPartChild = styled.div`
  width: 50%;
  @media only screen and (max-width: 900px) {
    & {
      width: 100%;
    }
  }
`;

const TwoPartVertical = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: 100%;
`;

const TwoPartVerticalChild = styled.div`
  height: 50%;
  display: flex;
  flex-direction: column;
`;

const StartTrainingButtonWrapper = styled.div`
  width: calc(100% - 4em);
  margin: 2em;
  margin-top: 0;
`;

class StartTraining extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      networkId: undefined,
      datasetId: undefined,
      datasetServer: undefined,
      networkServer: undefined,
      server: undefined,
      trainingProps: {
        epochs: 200,
        batch_size: 1,
        learningRate: -0.1,
        decay: 0.005,
      },
      redirect: false,
      error: false,
    };
  }
  render() {
    return this.state.redirect ? (
      <Redirect to={`/training`} />
    ) : (
      <TrainingWrapper>
        <TwoPart>
          <TwoPartChild>
            <TwoPartVertical>
              <TwoPartVerticalChild>
                <Title>Network</Title>
                <NetworkSelect
                  onNetworkSelect={(server, networkId) => {
                    if (
                      this.props.networks.networks[server.uniqueName][networkId]
                        .reduced
                    ) {
                      this.props.getNetwork(networkId, server);
                    }
                    this.setState({
                      networkId,
                      networkServer: server,
                      server,
                    });
                  }}
                />
              </TwoPartVerticalChild>
              <TwoPartVerticalChild>
                <Title>Dataset</Title>
                <DatasetSelect
                  onDatasetSelect={(server, datasetId) => {
                    if (
                      this.props.datasets.datasets[server.uniqueName][datasetId]
                        .reduced
                    ) {
                      this.props.getDataset(datasetId, server);
                    }
                    this.setState({ datasetId, datasetServer: server });
                  }}
                />
              </TwoPartVerticalChild>
            </TwoPartVertical>
          </TwoPartChild>
          <TwoPartChild>
            <KeyValueTable
              data={this.state.trainingProps}
              editFunction={(key, value) => {
                this.setState((prev) => ({
                  trainingProps: Object.assign({}, prev.trainingProps, {
                    [key]: value,
                  }),
                }));
              }}
            ></KeyValueTable>

            <StartTrainingButtonWrapper>
              <SpringButton
                text={`Start Training`}
                color={this.props.colors.primarycolor}
                textColor={this.props.colors.primarytextcolor}
                onClick={() => {
                  if (this.state.networkId && this.state.datasetId)
                    if (
                      this.props.networks.networks[
                        this.state.networkServer.uniqueName
                      ][this.state.networkId] &&
                      this.props.networks.networks[
                        this.state.networkServer.uniqueName
                      ][this.state.networkId]
                    ) {
                      this.props.startTraining({
                        server: this.state.server,
                        network: this.props.networks.networks[
                          this.state.networkServer.uniqueName
                        ][this.state.networkId],
                        dataset: this.props.datasets.datasets[
                          this.state.datasetServer.uniqueName
                        ][this.state.datasetId],
                        trainingParams: this.state.trainingProps,
                      });
                      this.setState({ redirect: true });
                    } else
                      this.setState({ error: "invalid network or dataset" });
                }}
              />
            </StartTrainingButtonWrapper>
            {this.state.error && <Error error={this.state.error} />}
          </TwoPartChild>
        </TwoPart>
      </TrainingWrapper>
    );
  }
}

export default connect(
  (state) => state,
  (dispatch) => ({
    getNetwork: (networkId, server) =>
      fetchNetwork(networkId, server, dispatch),
    getDataset: (datasetId, server) =>
      fetchDataset(datasetId, server, dispatch),
    startTraining: ({ server, network, dataset, trainingParams }) =>
      startTraining({ server, network, dataset, trainingParams, dispatch }),
  })
)(StartTraining);
