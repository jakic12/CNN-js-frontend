import React from "react";
import styled from "styled-components";

// redux
import { connect } from "react-redux";

// components
import Logo from "./Logo";

const TopBarStyled = styled.div`
  height: ${props => props.topbarheight};
  width: 100%;
`;

const AboveSidebar = styled.div`
  width: ${props => props.sidebarwidth};
  height: 100%;
`;

const TopBar = ({ structure, colors }) => (
  <TopBarStyled {...structure}>
    <AboveSidebar {...structure}>
      <Logo height={structure.topbarheight} />
    </AboveSidebar>
  </TopBarStyled>
);

export default connect(state => state)(TopBar);
