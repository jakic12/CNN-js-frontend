import React, { useState } from "react";

import { useSpring, animated, config } from "react-spring";

import styled from "styled-components";

import { connect } from "react-redux";

const Wrapper = styled(animated.div)`
  position: absolute;
  left: 0;
  top: 0;
  height: 100vh;
  width: 100vw;
`;

const AnimatedCard = styled(animated.div)`
  background: ${(props) => props.backgroundbyelevation(1)};
  position: absolute;
  z-index: 2000;
`;

const AnimFSC = ({
  startFromElement,
  contentFunction,
  colors,
  fullscreen,
  onCloseCallback,
}) => {
  const [innerDivRef, setInnerDivRef] = useState();
  const [wrapperRef, setWrapperRef] = useState();
  const [resizeUpdater, setResizeUpdater] = useState(0);
  const [closing, setClosing] = useState(false);
  const [closed, setClosed] = useState(false);
  const prevStyle = startFromElement.getBoundingClientRect();
  const startComputedStyle = window.getComputedStyle(startFromElement);

  if (startFromElement.style) {
    startFromElement.style.opacity = `0`;
  } else {
    startFromElement.style = `opacity:0`;
  }

  if (closed) {
    if (onCloseCallback) onCloseCallback();
  }

  const wrapperDivStyle = (wrapperRef &&
    wrapperRef.getBoundingClientRect()) || {
    top: 0,
    left: 0,
    height: 0,
    width: 0,
  };

  const innerDivStyle = (!fullscreen &&
    innerDivRef &&
    innerDivRef.getBoundingClientRect()) || {
    top: 0,
    left: 0,
    height: Math.max(0, wrapperDivStyle.height - 50),
    width: Math.max(0, wrapperDivStyle.width - 50),
  };

  const startAnimatedProps = {
    top: prevStyle.top + `px`,
    left: prevStyle.left + `px`,
    width: prevStyle.width + `px`,
    height: prevStyle.height + `px`,
    boxShadow: startComputedStyle.boxShadow,
    borderWidth:
      startComputedStyle.borderWidth || startComputedStyle["border-top-width"],
  };

  const cardProps = useSpring({
    from: startAnimatedProps,
    to: closing
      ? startAnimatedProps
      : {
          width: innerDivStyle.width + `px`,
          height: innerDivStyle.height + `px`,
          top:
            parseInt((wrapperDivStyle.height - innerDivStyle.height) / 2) +
            `px`,
          left:
            parseInt((wrapperDivStyle.width - innerDivStyle.width) / 2) + `px`,
          borderRadius: startComputedStyle["border-top-left-radius"],
          borderColor:
            startComputedStyle.borderColor ||
            startComputedStyle["border-top-color"],
          borderStyle:
            startComputedStyle.borderStyle ||
            startComputedStyle["border-top-style"],
          borderWidth: `0px`,
          opacity: 1,
        },
    config: closing ? { ...config.gentle, clamp: true } : config.gentle,
    onRest: () => {
      if (closing) {
        setClosed(true);
        setClosing(false);
        startFromElement.style.opacity = 1;
      }
    },
  });

  const wrapperProps = useSpring({
    to: {
      background: closing ? `rgba(0, 0, 0, 0)` : `rgba(0, 0, 0, 0.2)`,
    },
    from: {
      background: `rgba(0, 0, 0, 0)`,
    },
  });

  const resizeHandler = () => setResizeUpdater(Math.random());

  React.useEffect(() => {
    window.addEventListener("resize", resizeHandler);
    return () => {
      window.removeEventListener("resize", resizeHandler);
    };
  }, []);

  return (
    <Wrapper
      ref={(ref) => setWrapperRef(ref)}
      onClick={(e) => (e.target === wrapperRef ? setClosing(true) : false)}
      style={wrapperProps}
    >
      <AnimatedCard {...colors} style={cardProps}>
        <div
          ref={(ref) => setInnerDivRef(ref)}
          style={fullscreen ? { height: `100%`, width: `100%` } : {}}
        >
          {contentFunction(() => setClosing(true))}
        </div>
      </AnimatedCard>
    </Wrapper>
  );
};

export default connect((state) => state)(AnimFSC);
