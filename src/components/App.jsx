import React from "react";

import styled from "styled-components";

// components
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

// screens
import Dashboard from "../screens/Dashboard";

// router
import { HashRouter as Router, Switch, Route } from "react-router-dom";

// redux
import { connect } from "react-redux";

// resources
import { MdHome } from "react-icons/md";

const screens = [
  {
    path: `/`,
    fullName: `Dashboard`,
    component: Dashboard,
    exact: true,
    icon: MdHome
  }
];

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${props => props.background};
`;

const SideAndScreens = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

const ScreenSwitcher = styled.div`
  flex-grow: 1;
  height: 100%;
  overflow: auto;
`;

function App({ colors }) {
  return (
    <AppWrapper {...colors}>
      <Router>
        <TopBar />
        <SideAndScreens>
          <Sidebar screens={screens} />
          <ScreenSwitcher>
            {screens.map(screen => (
              <Route
                path={screen.path}
                component={screen.component}
                exact={screen.exact}
              />
            ))}
          </ScreenSwitcher>
        </SideAndScreens>
      </Router>
    </AppWrapper>
  );
}

export default connect(state => state)(App);
