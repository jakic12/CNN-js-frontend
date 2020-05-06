import React from "react";
import { connect } from "react-redux";
import Error from "../components/Error";
import styled from "styled-components";
import { Link, Redirect } from "react-router-dom";

import { Line } from "react-chartjs-2";
import ButtonWithConfirmation from "../components/ButtonWithConfirmation";

import ConfusionMatrix from "../components/ConfusionMatrix";
import { getDataset } from "../other/api";

const ChardCard = styled.div`
  background: ${(props) => props.backgroundbyelevation(1)};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  color: ${(props) => props.textcolor};
  border-radius: 5px;
  :not(:first-child) {
    margin-top: 0.5em;
  }
  padding: 0.5em;
`;

class ChartWrapper extends React.Component {
  componentDidUpdate() {
    if (this.chartRef) {
      this.chartRef.chartInstance.update();
    }
  }

  render() {
    return (
      <ChardCard {...this.props.colors}>
        <Line
          data={{
            datasets: this.props.datasets.map((d) =>
              Object.assign({}, d, {
                fill: false,
                borderColor: this.props.color,
                data: d.data.map((y, x) => ({
                  x,
                  y,
                })),
              })
            ),
          }}
          options={{
            legend: { display: false },
            title: { display: true, text: this.props.title },
            scales: {
              xAxes: [
                {
                  type: `linear`,
                  ticks: this.props.maxX
                    ? {
                        suggestedMin: 0,
                        suggestedMax: this.props.maxX,
                      }
                    : {},
                },
              ],
            },
          }}
          ref={(reference) => (this.chartRef = reference)}
        />
      </ChardCard>
    );
  }
}

const TopBottom = styled.div`
  height: 100%;
`;

const TopBottomChild = styled.div`
  height: 50%;
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
`;

const TableWrapper = styled.div`
  background: ${(props) => props.backgroundbyelevation(1)};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  color: ${(props) => props.textcolor};
  border-radius: 5px;
`;

const TableRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  &:not(:first-child) {
    border-top: 1px solid gray;
  }
`;

const TableColumn = styled.div`
  width: 50%;
  text-align: center;
  padding: 0.5em;
`;

const Table = connect((state) => ({
  colors: state.colors,
}))(({ colors, data, include, style }) => (
  <TableWrapper {...colors} style={style}>
    {(include || Object.keys(data)).map((key, i) => (
      <TableRow key={`data_row_${i}`}>
        <TableColumn>{key}</TableColumn>
        {typeof data[key] === `object` ? (
          <TableColumn>
            {Object.keys(data[key]).map((keyInner, j) => (
              <TableRow key={`data_row_row_${j}`}>
                <TableColumn>{keyInner}</TableColumn>
                <TableColumn>{data[key][keyInner]}</TableColumn>
              </TableRow>
            ))}
          </TableColumn>
        ) : (
          <TableColumn>{data[key]}</TableColumn>
        )}
      </TableRow>
    ))}
  </TableWrapper>
));

const TrainingProgressWrapper = styled.div`
  padding: 0.5em;
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

class TrainingProgress extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stats: {},
    };
  }

  render() {
    const trained =
      this.props.match.params.serverUniqueName === `trained` &&
      this.props.training.trained[this.props.match.params.networkId];
    const serverName = trained
      ? this.props.training.trained[this.props.match.params.networkId].server
      : this.props.match.params.serverUniqueName;
    const networkId = trained
      ? this.props.training.trained[this.props.match.params.networkId].network
      : this.props.match.params.networkId;

    const trainingData = trained
      ? this.props.training.trained[this.props.match.params.networkId]
      : this.props.training[serverName] &&
        this.props.training[serverName][networkId];
    return (
      <TrainingProgressWrapper>
        {serverName && networkId ? (
          this.props.networks.networks[serverName] &&
          this.props.networks.networks[serverName][networkId] ? (
            trained || (this.props.training[serverName] && trainingData) ? (
              <>
                <LeftRight>
                  <LeftRightChild>
                    <TopBottom>
                      <TopBottomChild>
                        <ChartWrapper
                          colors={this.props.colors}
                          datasets={[
                            {
                              label: `error`,
                              data: trainingData.errArr,
                            },
                          ]}
                          title={`error`}
                          /*maxX={
                      this.props.training[
                        serverName
                      ][networkId].epochs
                    }*/
                          color={this.props.colors.primarycolor}
                        />
                      </TopBottomChild>
                      <TopBottomChild>
                        <ChartWrapper
                          colors={this.props.colors}
                          datasets={[
                            {
                              label: `accuracy`,
                              data: trainingData.accuracyArr.map(
                                (i) => i * 100
                              ),
                            },
                          ]}
                          title={`accuracy`}
                          /*maxX={
                      this.props.training[
                        serverName
                      ][networkId].epochs
                    }*/
                          color={this.props.colors.primarycolor}
                        />
                        {/*<ChartWrapper
                  colors={this.props.colors}
                    datasets={[
                      {
                        label: `learning rate`,
                        data: this.props.training[
                          serverName
                        ][networkId].learningRateArr,
                      },
                    ]}
                    title={`learning rate`}
                    // maxX={
                    //   this.props.training[
                    //     serverName
                    //   ][networkId].epochs
                    // }
                    color={this.props.colors.primarycolor}
                  />*/}
                      </TopBottomChild>
                    </TopBottom>
                  </LeftRightChild>
                  <LeftRightChild>
                    <TopBottom>
                      <TopBottomChild>
                        <Table
                          data={{
                            network: this.props.networks.networks[serverName][
                              networkId
                            ].name,
                            dataset:
                              this.props.training[serverName] &&
                              trainingData.dataset.name,
                          }}
                        />
                        <Table
                          style={{ marginTop: `0.5em` }}
                          data={trainingData}
                          include={[
                            `epoch`,
                            `epochs`,
                            `learningRate`,
                            `err`,
                            `accuracy`,
                          ]}
                        />
                      </TopBottomChild>
                      <TopBottomChild>
                        <LeftRight>
                          <LeftRightChild style={{ paddingRight: `0.5em` }}>
                            <ConfusionMatrix
                              updateVar={trainingData.epoch}
                              network={
                                this.props.networks.networks[serverName][
                                  networkId
                                ]
                              }
                              dataset={
                                this.props.datasets.datasets[serverName][
                                  trainingData.dataset.id
                                ]
                              }
                              statsCallback={(stats) =>
                                this.setState({ stats })
                              }
                            />
                          </LeftRightChild>
                          <LeftRightChild style={{ paddingLeft: `0.5em` }}>
                            <Table data={this.state.stats.avg || {}} />
                            {!trained && (
                              <ButtonWithConfirmation
                                color={this.props.colors.errorcolor}
                                textcolor={`white`}
                                text={`stop learning`}
                                onConfirm={() =>
                                  this.props.training[serverName][
                                    networkId
                                  ].trainingInstance.terminate()
                                }
                              />
                            )}
                          </LeftRightChild>
                        </LeftRight>
                      </TopBottomChild>
                    </TopBottom>
                  </LeftRightChild>
                </LeftRight>
              </>
            ) : (
              <>
                <Error error={`network isn't training`} />
                <Redirect to={`/training`} />
              </>
            )
          ) : (
            <Error error={`network isn't training`} />
          )
        ) : (
          <Error error={`invalid network or server`} />
        )}
      </TrainingProgressWrapper>
    );
  }
}

export default connect(
  (state) => state,
  (dispatch) => ({ fetchDataset: (id, server) => getDataset(id, server) })
)(TrainingProgress);
