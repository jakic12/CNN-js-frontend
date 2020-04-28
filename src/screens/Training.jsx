import React, { Component } from "react";
import { connect } from "react-redux";
import styled from "styled-components";
import { Link } from "react-router-dom";

const TrainingWrapper = styled.div`
  width: 100%;
  padding: 1em;
  box-sizing: border-box;
`;

const TrainingHeader = styled.div`
  padding: 1em;
  display: flex;
  flex-direction: row;
`;

const Card = styled(Link)`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  background: ${(props) => props.backgroundbyelevation(1)};
  color: ${(props) => props.textcolor};
  text-decoration: none;

  &:not(:first-child) {
    margin-top: 2em;
  }
  border-radius: 5px;
`;

const Column = styled.div`
  flex: 1 1 0px;
  padding: 1em;
  text-align: center;
`;

const round = (x, n) => parseInt(x * 10 ** n) / 10 ** n;

const TrainingList = connect((state) => state)(({ data, colors, networks }) => {
  console.log(data, colors);
  return (
    <>
      <TrainingHeader {...colors}>
        {[
          `network`,
          `server`,
          `epoch`,
          `learning rate`,
          `error`,
          `accuracy`,
        ].map((c, i) => (
          <Column key={`header_item_${i}`}>{c}</Column>
        ))}
      </TrainingHeader>
      <TrainingWrapper>
        {data.map((row, i) => (
          <Card
            key={`trainingList_${i}_row`}
            {...colors}
            to={`/training/${row.server}/${row.network}`}
          >
            <Column>{networks.networks[row.server][row.network].name}</Column>
            <Column>{row.server}</Column>
            <Column>
              {row.epoch === `initializing`
                ? `initializing`
                : `${row.epoch}/${row.epochs}`}
            </Column>
            <Column>{round(row.learningRate, 5)}</Column>
            <Column>{round(row.err, 5)}</Column>
            <Column>{`${round(row.accuracy, 4) * 100}%`}</Column>
          </Card>
        ))}
      </TrainingWrapper>
    </>
  );
});

const StartButton = styled(Link)`
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

const Title = styled.h3`
  margin: 0.5em;
  margin-left: 0;
  margin-right: 0;

  box-shadow: 0;
  box-sizing: border-box;
`;

const TrainingScreenWrapper = styled.div`
  padding: 1em;
`;

const TrainingScreenTitleWrapper = styled.div`
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

class Training extends Component {
  render() {
    return (
      <TrainingScreenWrapper>
        <TrainingScreenTitleWrapper>
          <Title>Training</Title>
          <FlexCenter>
            <StartButton to={`startTraining`} {...this.props.colors}>
              train a network
            </StartButton>
          </FlexCenter>
        </TrainingScreenTitleWrapper>

        <TrainingList
          data={Object.keys(this.props.training)
            .map((i) =>
              Object.keys(this.props.training[i]).map((j) =>
                Object.assign({}, this.props.training[i][j], {
                  server: i,
                  network: j,
                })
              )
            )
            .flat(1)}
        />
      </TrainingScreenWrapper>
    );
  }
}

export default connect((state) => ({
  training: state.training,
  colors: state.colors,
}))(Training);
