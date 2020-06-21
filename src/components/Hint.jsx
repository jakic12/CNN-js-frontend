import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import arrow from "../res/arrow.png";

const HintWrapper = styled.div`
  position: absolute;
  left: ${(props) => props.x}px;
  top: ${(props) => props.y}px;
  right: ${(props) => props.xRight}px;
  bottom: ${(props) => props.yBottom}px;

  display: flex;
  flex-direction: row;

  z-index: 99999;
`;

const ArrowImage = styled.img`
  height: 2em;
  padding: 0.4em;
`;

const HintText = styled.div`
  margin-top: ${(props) => !props.yFlip && `1em`};
  margin-bottom: ${(props) => props.yFlip && `1em`};
  background: rgba(255, 255, 255, 1);
  border-radius: 8px;
  padding: 0.4em;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
    0 3px 5px -1px rgba(0, 0, 0, 0.2);
`;

const Hint = ({
  domId,
  text,
  onClick,
  forceFlipY,
  forceDontFlipY,
  disablePadding,
}) => {
  const [updater, setUpdater] = React.useState();
  let ref = document.getElementById(domId);

  const clickListener = () => {
    setUpdater(Math.random());

    document.removeEventListener("click", clickListener);
  };

  React.useEffect(() => {
    document.addEventListener("click", clickListener);
    const eventListener = function () {
      onClick();
      //debugger;
      ref.removeEventListener("click", this);
    };
    if (ref) {
      ref.addEventListener("click", eventListener);
    }
    return () => {
      document.removeEventListener("click", clickListener);
      if (ref) ref.removeEventListener("click", eventListener);
    };
  });

  console.log(ref);

  if (ref) {
    const pos = ref.getBoundingClientRect();

    const flipX = pos.x + pos.width / 2 >= window.innerWidth / 2;
    const flipY =
      !forceDontFlipY &&
      (forceFlipY ||
        pos.y + pos.height + !disablePadding * 20 >= window.innerHeight / 2);

    console.log(forceFlipY, flipY);

    return (
      <HintWrapper
        disablePadding={disablePadding}
        x={!flipX && pos.x + pos.width / 2}
        xRight={flipX && window.innerWidth - pos.x - pos.width / 2}
        y={!flipY && pos.y + pos.height + !disablePadding * 20}
        yBottom={flipY && window.innerHeight - pos.y + !disablePadding * 20}
      >
        {flipX && <HintText yFlip={flipY}>{text}</HintText>}
        <ArrowImage
          disablePadding={disablePadding}
          src={arrow}
          style={{
            transform: `${flipX ? `scaleX(-1)` : ``} ${
              flipY ? `scaleY(-1)` : ``
            }`,
          }}
        />
        {!flipX && <HintText yFlip={flipY}>{text}</HintText>}
      </HintWrapper>
    );
  } else {
    setTimeout(() => {
      setUpdater(Math.random());
    }, 500);
  }
  return <div></div>;
};

export const HintList = connect(
  (state) => state,
  (dispatch) => ({
    nextHint: () => dispatch({ type: `NEXT_HINT` }),
    stopHints: () => dispatch({ type: "SET_HINT", hintId: -1 }),
  })
)(({ hints, hintArray, nextHint, stopHints }) => {
  if (hints.hintId >= hintArray.length) {
    stopHints();
  }
  return hints.hintId >= 0 && hints.hintId < hintArray.length ? (
    <Hint onClick={() => nextHint()} {...hintArray[hints.hintId]} />
  ) : (
    <div></div>
  );
});

export default Hint;
