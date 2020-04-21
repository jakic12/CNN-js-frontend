import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import { connect } from "react-redux";
import { MdReplay } from "react-icons/md";

const ErrorDiv = styled.div`
  background: ${(props) => props.errorcolor};
  padding: 10px;
  border-radius: 5px;
  color: white;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const translateError = (error) => {
  let strError = `${error}`;
  console.error(error);
  console.error(error.stack);
  return `Server unavailable`;
};

const rotate = keyframes`
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(-360deg);
  }
`;

const StyledReplay = styled(MdReplay)`
  margin-left: 5px;
  animation: ${(props) => (props.spinning ? rotate : `none`)} 2s linear infinite;
  &:hover {
    cursor: pointer;
  }
`;

export default connect((state) => state)(({ error, colors, retryFunction }) => {
  const [animation, setAnimation] = useState(false);
  console.log(error);
  if (!(error instanceof String)) error = error.toString() || error;
  return (
    <ErrorDiv errorcolor={colors.errorcolor}>
      {error}
      {retryFunction && (
        <StyledReplay
          spinning={animation}
          onClick={(props) => {
            setAnimation(true);
            retryFunction(props);
          }}
        />
      )}
    </ErrorDiv>
  );
});
