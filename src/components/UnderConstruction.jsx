import React from "react";
import styled from "styled-components";

import gears from "../res/gears.svg";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const LoadingImage = styled.img`
  width: 30%;
  padding: 2em;
`;

export default () => (
  <Wrapper>
    <LoadingImage src={gears} alt="spinning gears" />
    <div>This component is still under construction</div>
  </Wrapper>
);
