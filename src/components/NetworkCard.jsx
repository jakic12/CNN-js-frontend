import React, { useState } from "react";
import styled, { css } from "styled-components";

//redux
import { connect } from "react-redux";

//res
import { TiPlus } from "react-icons/ti";

// router
import { Link } from "react-router-dom";

const cardWrapperCss = css`
  width: 13em;
  height: 15em;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
    0 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 0.7em;
  flex-grow: 0;
  flex-shrink: 0;

  transform: scale(1);
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.1);
  }

  background: white;
  text-decoration: none;
  color: black;
  display: block;
`;

const CardWrapper = styled(Link)`
  ${cardWrapperCss}
`;

const BottomWrapper = styled.div`
  background: white;
  height: 30%;
  width: 100%;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const NetworkTitle = styled.h2`
  height: 100%;
  width: 100%;
  text-align: center;
  margin: 0;
  &:before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`;

const NetworkImage = styled.img`
  width: 100%;
  display: block;
  flex-grow: 0;
`;

const NetworkImageDiv = styled.div`
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

export default ({ network, server }) => {
  return (
    <CardWrapper to={`/networks/${server}/${network.id}`}>
      <NetworkImageDiv>
        <NetworkImage
          src="https://miro.medium.com/max/2636/1*3fA77_mLNiJTSgZFhYnU0Q.png"
          alt="neural network icon"
        />
      </NetworkImageDiv>
      <BottomWrapper>
        <NetworkTitle>{network.name}</NetworkTitle>
      </BottomWrapper>
    </CardWrapper>
  );
};

const AddNetworkWrapper = styled.div`
  ${cardWrapperCss}
  border:2px ${props => props.color} dashed;
  display:flex;
  justify-content:center;
  flex-direction:row;
  align-items:center;
  background:none;
  box-sizing:border-box;
  font-size: 1em;
  position:relative;

  /* &:hover{
    cursor:pointer;
  } */

  ${props =>
    props.nohover &&
    css`
      &:hover {
        transform: scale(1);
      }
    `}
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;

const StyledSubmit = styled.input`
  position: absolute;
  bottom: 1em;
  width: calc(100% - 2em);
  box-sizing: border-box;
`;

const InputRow = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const StyledInput = styled.input`
  padding: 5px;
  box-sizing: border-box;
  border-radius: 5px;
  border: none;
  width: calc(100% - 5em);
  margin: 1em;
`;

export const AddNetworkCard = connect(state => state)(
  ({ colors, onclick, networks }) => {
    const [name, setName] = useState(``);
    const [networkShapeIndex, setNetworkShapeIndex] = useState(0);
    const [show, setShow] = useState(false);

    return (
      <AddNetworkWrapper
        color={colors.primaryColor}
        onClick={() => setShow(true)}
        nohover={show}
      >
        {show && (
          <StyledForm
            onSubmit={e => {
              e.preventDefault();
              if (name) {
                onclick(
                  name,
                  networks.networkArchitectures[
                    Object.keys(networks.networkArchitectures)[
                      networkShapeIndex
                    ]
                  ]
                );
              }
            }}
          >
            <StyledInput
              type="text"
              value={name}
              onChange={evt => setName(evt.target.value)}
              placeholder={`Network name`}
            />
            <select
              onChange={e => setNetworkShapeIndex(JSON.parse(e.target.value))}
              value={networkShapeIndex}
            >
              {Object.keys(networks.networkArchitectures).map((name, i) => {
                return <option value={i}>{name}</option>;
              })}
            </select>
            <StyledSubmit type="submit" />
          </StyledForm>
        )}
        {!show && <TiPlus color={colors.primaryColor} />}
      </AddNetworkWrapper>
    );
  }
);

const NetworkCardParentWrapper = styled.div`
  padding: 1em;
  /* padding-right: 0; */
  padding-bottom: 0;

  width: 100%;
  box-sizing: border-box;

  transition: 0.5s padding;

  ${props =>
    props.small &&
    css`
      padding-right: 1em;
    `}
`;

const Title = styled.h1`
  margin: 0.5em;
  margin-left: 0;
  margin-right: 0;

  box-shadow: 0;
  box-sizing: border-box;

  ${props =>
    props.cardMode &&
    css`
      box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14),
        0 1px 18px 0 rgba(0, 0, 0, 0.12), 0 3px 5px -1px rgba(0, 0, 0, 0.2);
      margin: 0;
      padding: 0.5em;
      border-radius: 5px;
    `}

  transition: .5s;
`;

const NetworkCards = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  overflow: auto;
  box-sizing: border-box;
  padding: 1em;
  padding-right: 0;
  box-sizing: border-box;
  height: auto;

  ${CardWrapper}:first-child {
    margin-left: 0;
  }

  transition: 0.5s height, 0.5s padding;
  ${props =>
    props.small &&
    css`
      height: 0;
      padding: 0;
    `}
`;

export const NetworkCardParent = ({ children, title, small }) => (
  <NetworkCardParentWrapper small={small}>
    <div>
      <Title cardMode={small}>{title}</Title>
    </div>
    <NetworkCards small={small}>{children}</NetworkCards>
  </NetworkCardParentWrapper>
);
