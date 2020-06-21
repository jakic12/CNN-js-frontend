import React from "react";
import styled, { css } from "styled-components";

// redux
import { connect } from "react-redux";

// router
import { NavLink } from "react-router-dom";

const SidebarWrapper = styled.aside`
  height: 100%;
  width: ${(props) => props.sidebarwidth};
  /*border-top-right-radius: 20px;*/
  background: ${(props) =>
    props.darkMode ? props.background : props.primarycolor};
  flex-shrink: 0;
`;

const SidebarInside = styled.div`
  height: 100%;
  width: 100%;
  padding: 10px;
  box-sizing: border-box;
`;

const SidebarItemLink = styled(NavLink).attrs({
  activeClassName: `linkActive`,
})`
  position: relative;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  text-decoration: none;
  color: ${(props) => props.primarytextcolor};
  border-radius: 8px;

  &.linkActive {
    font-weight: bold;
    background: ${(props) => (props.darkMode ? props.primarycolor : `none`)};
  }
`;

const SidebarItemIcon = styled.img`
  height: 1em;
  width: 1em;
`;

const CustomRightIcon = styled.div`
  position: absolute;
  right: 0;
  transform: translateX(-100%);
`;

const Sidebar = ({ colors, screens, structure }) => {
  return (
    <SidebarWrapper {...colors} {...structure}>
      <SidebarInside>
        {screens.map((screen) => {
          const ScreenIcon = screen.icon;
          if (screen.fullName)
            return (
              <>
                <SidebarItemLink
                  id={screen.sidebarId}
                  to={screen.path}
                  {...colors}
                  exact={screen.exactLink}
                >
                  <div style={{ paddingRight: `0.5em` }}>
                    <ScreenIcon
                      style={{
                        height: `1.5em`,
                        width: `1.5em`,
                      }}
                    />
                  </div>
                  {screen.fullName}
                  {screen.customRightIcon && (
                    <CustomRightIcon>{screen.customRightIcon}</CustomRightIcon>
                  )}
                </SidebarItemLink>
              </>
            );
        })}
      </SidebarInside>
    </SidebarWrapper>
  );
};

export default connect((state) => state)(Sidebar);
