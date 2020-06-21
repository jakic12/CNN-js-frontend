import React, { useState } from "react";

import { useSpring, animated, config } from "react-spring";

import styled from "styled-components";

const SpringButtonStyled = styled(animated.div)`
  width: ${(props) => (props.shrinkToContent ? `auto` : `100%`)};
  padding: 1em;
  background: ${(props) => props.color};
  color: ${(props) => props.textColor};
  border: none;
  border-radius: 3px;
  box-sizing: border-box;
  text-align: center;

  &:hover {
    cursor: pointer;
  }
`;

const SpringButton = ({
  color,
  textColor,
  text,
  onClick,
  shrinkToContent,
  id,
}) => {
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  const buttonStyle = useSpring({
    transform: `scale(${clicked ? 0.8 : hovered ? 1.1 : 1}`,
    config: config.gentle,
  });

  if (clicked) {
    setTimeout(() => setClicked(false), 200);
  }

  return (
    <SpringButtonStyled
      id={id}
      style={buttonStyle}
      color={color}
      textColor={textColor}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => {
        setHovered(false);
        setClicked(false);
      }}
      onClick={(e) => {
        if (onClick) onClick(e);
        setClicked(true);
      }}
      shrinkToContent={shrinkToContent}
    >
      {text}
    </SpringButtonStyled>
  );
};

export default SpringButton;
