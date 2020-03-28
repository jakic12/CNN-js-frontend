import React from "react";
import { connect } from "react-redux";

import { setLearningParam } from "../redux/actions/learning";
import KeyValueTable from "../components/KeyValueTable";

import styled from "styled-components";

//components
import SpringButton from "../components/SpringButton";
import NetworkSelect from "../components/NetworkSelect";
import AnimatedFullScreenCard from "../components/AnimatedFullScreenCard";

const LearningWrapper = styled.div`
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

const StartLearningButtonWrapper = styled.div`
  width: calc(100% - 4em);
  margin: 2em;
  margin-top: 0;
`;

class Learning extends React.Component {
  render() {
    return (
      <LearningWrapper>
        <TwoPart>
          <TwoPartChild>
            <TwoPartVertical>
              <TwoPartVerticalChild>
                <Title>Network</Title>
                <NetworkSelect />
              </TwoPartVerticalChild>
              <TwoPartVerticalChild>
                <Title>Dataset</Title>
              </TwoPartVerticalChild>
            </TwoPartVertical>
          </TwoPartChild>
          <TwoPartChild>
            <KeyValueTable
              data={this.props}
              include={[`batch_size`, `epochs`]}
              editFunction={(key, value) => {
                this.props.setLearningParam(key, value);
              }}
            ></KeyValueTable>

            <StartLearningButtonWrapper>
              <SpringButton
                text={`Start learning`}
                color={this.props.colors.primarycolor}
                textColor={this.props.colors.primarytextcolor}
              />
            </StartLearningButtonWrapper>
          </TwoPartChild>
        </TwoPart>
      </LearningWrapper>
    );
  }
}

export default connect(
  state => ({ ...state.learning, colors: state.colors }),
  dispatch => ({
    setLearningParam: (key, value) => dispatch(setLearningParam(key, value))
  })
)(Learning);
