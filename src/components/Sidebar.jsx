import React from "react";
import styled from "styled-components";

// redux
import { connect } from "react-redux";

// router
import { Link } from "react-router-dom";

const SidebarWrapper = styled.aside`
  height: 100%;
  width: ${props => props.sidebarwidth};
  border-top-right-radius: 20px;
  background: ${props => props.primarycolor};
`;

const SidebarInside = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

const SidebarItemLink = styled(Link)`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-decoration: none;
  color: ${props => props.primarytextcolor};
`;

const SidebarItemIcon = styled.img`
  height: 1em;
  width: 1em;
`;

const Sidebar = ({ colors, screens, structure }) => {
  return (
    <SidebarWrapper {...colors} {...structure}>
      <SidebarInside>
        {screens.map(screen => {
          const ScreenIcon = screen.icon;
          return (
            <SidebarItemLink to={screen.path} {...colors}>
              <ScreenIcon
                style={{
                  paddingRight: `0.5em`,
                  height: `1.5em`,
                  width: `1.5em`,
                  color: colors.primarytextcolor
                }}
              />
              {screen.fullName}
            </SidebarItemLink>
          );
        })}
      </SidebarInside>
    </SidebarWrapper>
  );
};

export default connect(state => state)(Sidebar);
