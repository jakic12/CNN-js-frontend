import React from "react";
import styled from "styled-components";

const ButtonWrapper = styled.div`
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  justify-content: center;
  background: ${(props) => props.color};
  color: ${(props) => props.textcolor};
  border-radius: 5px;
  margin-top: 1em;
  padding: 1em;

  &:hover {
    cursor: pointer;
  }
`;

const TwoPart = styled.div`
  width: 50%;
  height: 100%;
  text-align: center;
`;

export default ({ color, textcolor, text, onConfirm, style }) => {
  const [open, setOpen] = React.useState(false);
  return (
    <ButtonWrapper
      {...{ color, textcolor }}
      style={style}
      onClick={() => {
        if (!open) {
          setOpen(true);
        }
      }}
    >
      {!open && <div>{text}</div>}
      {open && (
        <>
          <TwoPart
            onClick={() => {
              onConfirm();
              setOpen(false);
            }}
          >
            confirm
          </TwoPart>
          <TwoPart
            onClick={() => {
              setOpen(false);
            }}
          >
            cancel
          </TwoPart>
        </>
      )}
    </ButtonWrapper>
  );
};
