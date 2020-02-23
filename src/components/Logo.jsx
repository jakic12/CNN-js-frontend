import React from "react";
import styled from "styled-components";

// resources
import logo from "../res/cnnjs-logo.svg";

const Logo = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  align-items: center;
`;

const LogoImg = styled.img`
  height: 2em;
  width: 2em;
`;

const LogoText = styled.h2`
  margin: 0;
  color: ${props => props.textcolor};
`;

export default ({ textcolor }) => (
  <Logo>
    <LogoImg src={logo} alt="logo" />
    <LogoText textcolor={textcolor}>CNNjs</LogoText>
  </Logo>
);
