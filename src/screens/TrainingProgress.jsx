import React from "react";
import { connect } from "react-redux";
import Error from "../components/Error";
import styled from "styled-components";
import { Link, Redirect } from "react-router-dom";

import { Line } from "react-chartjs-2";
import ButtonWithConfirmation from "../components/ButtonWithConfirmation";

const ChardCard = styled.div`
  background: ${(props) => props.backgroundbyelevation(1)};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  color: ${(props) => props.textcolor};
  border-radius: 5px;
  :not(:first-child) {
    margin-top: 1em;
  }
  padding: 1em;
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
  padding: 1em;
`;

const Table = connect((state) => ({
  colors: state.colors,
}))(({ colors, data, include, style }) => (
  <TableWrapper {...colors} style={style}>
    {(include || Object.keys(data)).map((key, i) => (
      <TableRow key={`data_row_${i}`}>
        <TableColumn>{key}</TableColumn>
        <TableColumn>{data[key]}</TableColumn>
      </TableRow>
    ))}
  </TableWrapper>
));

const TrainingProgressWrapper = styled.div`
  padding: 1em;
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
  padding: 1em;
  max-height: 100vh;
`;

class TrainingProgress extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <TrainingProgressWrapper>
        {this.props.match.params.serverUniqueName &&
        this.props.match.params.networkId ? (
          this.props.networks.networks[
            this.props.match.params.serverUniqueName
          ] &&
          this.props.networks.networks[
            this.props.match.params.serverUniqueName
          ][this.props.match.params.networkId] ? (
            this.props.training[this.props.match.params.serverUniqueName] &&
            this.props.training[this.props.match.params.serverUniqueName][
              this.props.match.params.networkId
            ] ? (
              <LeftRight>
                <LeftRightChild>
                  <ChartWrapper
                    colors={this.props.colors}
                    datasets={[
                      {
                        label: `error`,
                        data: this.props.training[
                          this.props.match.params.serverUniqueName
                        ][this.props.match.params.networkId].errArr,
                      },
                    ]}
                    title={`error`}
                    /*maxX={
                      this.props.training[
                        this.props.match.params.serverUniqueName
                      ][this.props.match.params.networkId].epochs
                    }*/
                    color={this.props.colors.primarycolor}
                  />
                  <ChartWrapper
                    colors={this.props.colors}
                    datasets={[
                      {
                        label: `accuracy`,
                        data: this.props.training[
                          this.props.match.params.serverUniqueName
                        ][this.props.match.params.networkId].accuracyArr.map(
                          (i) => i * 100
                        ),
                      },
                    ]}
                    title={`accuracy`}
                    /*maxX={
                      this.props.training[
                        this.props.match.params.serverUniqueName
                      ][this.props.match.params.networkId].epochs
                    }*/
                    color={this.props.colors.primarycolor}
                  />
                  {/*<ChartWrapper
                  colors={this.props.colors}
                    datasets={[
                      {
                        label: `learning rate`,
                        data: this.props.training[
                          this.props.match.params.serverUniqueName
                        ][this.props.match.params.networkId].learningRateArr,
                      },
                    ]}
                    title={`learning rate`}
                    // maxX={
                    //   this.props.training[
                    //     this.props.match.params.serverUniqueName
                    //   ][this.props.match.params.networkId].epochs
                    // }
                    color={this.props.colors.primarycolor}
                  />*/}
                </LeftRightChild>
                <LeftRightChild>
                  <Table
                    data={{
                      network: this.props.networks.networks[
                        this.props.match.params.serverUniqueName
                      ][this.props.match.params.networkId].name,
                      dataset:
                        this.props.training[
                          this.props.match.params.serverUniqueName
                        ] &&
                        this.props.training[
                          this.props.match.params.serverUniqueName
                        ][this.props.match.params.networkId].dataset.name,
                    }}
                  />
                  <Table
                    style={{ marginTop: `1em` }}
                    data={
                      this.props.training[
                        this.props.match.params.serverUniqueName
                      ][this.props.match.params.networkId]
                    }
                    include={[
                      `epoch`,
                      `epochs`,
                      `learningRate`,
                      `err`,
                      `accuracy`,
                    ]}
                  />

                  <ButtonWithConfirmation
                    color={this.props.colors.errorcolor}
                    textcolor={`white`}
                    text={`stop learning`}
                    onConfirm={() =>
                      this.props.training[
                        this.props.match.params.serverUniqueName
                      ][
                        this.props.match.params.networkId
                      ].trainingInstance.terminate()
                    }
                  />
                </LeftRightChild>
              </LeftRight>
            ) : (
              <>
                <Error error={`network isn't training`} />
                <Redirect to={`/training`} />
              </>
            )
          ) : (
            <Error error={`network doesn't exist`} />
          )
        ) : (
          <Error error={`invalid network or server`} />
        )}
      </TrainingProgressWrapper>
    );
  }
}

export default connect((state) => state)(TrainingProgress);
