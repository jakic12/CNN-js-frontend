import React from "react";
import styled from "styled-components";

// redux
import { connect } from "react-redux";

// components
import Logo from "./Logo";

const TopBarStyled = styled.div`
  height: ${(props) => props.topbarheight};
  width: 100%;
  flex-grow: 0;
  flex-shrink: 0;
  display: flex;
  flex-direction: row;
  box-shadow: ${(props) =>
    props.darkMode
      ? ``
      : `0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2)`};
  background: ${(props) => props.topbarbackground};
`;

const AboveSidebar = styled.div`
  width: ${(props) => props.sidebarwidth};
  height: 100%;
  padding-left: 30px;
  box-sizing: border-box;
  flex-grow: 0;
`;

const AboveScreens = styled.div`
  flex-grow: 1;
  height: 100%;
`;

const TopBar = ({ structure, colors }) => (
  <TopBarStyled {...structure} {...colors}>
    <AboveSidebar {...structure}>
      <Logo />
    </AboveSidebar>
    <AboveScreens>{/*< />*/}</AboveScreens>
  </TopBarStyled>
);

export default connect((state) => state)(TopBar);
