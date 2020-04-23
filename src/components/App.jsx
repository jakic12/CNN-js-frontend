import React from "react";

import styled from "styled-components";

// components
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

// screens
import Dashboard from "../screens/Dashboard";
import Networks from "../screens/Networks";
import Network from "../screens/Network";
import Training from "../screens/Training";
import Datasets from "../screens/Datasets";

// router
import { HashRouter as Router, Switch, Route } from "react-router-dom";

// redux
import { connect } from "react-redux";

// resources
import { MdHome, MdSchool, MdPhotoLibrary } from "react-icons/md";
import { IoMdGitNetwork } from "react-icons/io";

const screens = [
  {
    path: `/`,
    fullName: `Dashboard`,
    component: Dashboard,
    exact: true,
    exactLink: true,
    icon: MdHome,
  },
  {
    path: `/networks`,
    fullName: `Networks`,
    component: Networks,
    exact: true,
    icon: ({ style }) => (
      <IoMdGitNetwork style={{ transform: `rotate(-90deg)`, ...style }} />
    ),
  },
  {
    path: `/datasets`,
    fullName: `Datasets`,
    component: Datasets,
    exact: true,
    icon: MdPhotoLibrary,
  },
  {
    path: `/networks/:serverUniqueName/:networkId`,
    component: Network,
  },
  {
    path: `/training`,
    fullName: `Training`,
    component: Training,
    exact: true,
    icon: MdSchool,
  },
];

const AppWrapper = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  background: ${(props) => props.background};
  color: ${(props) => props.textcolor};
`;

const SideAndScreens = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  flex-shrink: 1;
  overflow: auto;
`;

const ScreenSwitcher = styled.div`
  flex-shrink: 1;
  flex-grow: 1;
  height: 100%;
  overflow: auto;
`;

function App({ colors }) {
  return (
    <Router>
      <AppWrapper {...colors}>
        <TopBar />
        <SideAndScreens>
          <Sidebar screens={screens} />
          <ScreenSwitcher>
            {screens.map((screen) => (
              <Route
                path={screen.path}
                component={screen.component}
                exact={screen.exact}
              />
            ))}
          </ScreenSwitcher>
        </SideAndScreens>
      </AppWrapper>
    </Router>
  );
}

export default connect((state) => state)(App);
