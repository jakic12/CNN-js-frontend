import React from "react";

import styled, { css } from "styled-components";

// components
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import TrainingIndicator from "./TrainingIndicator";

// screens
import Dashboard from "../screens/Dashboard";
import Networks from "../screens/Networks";
import Network from "../screens/Network";
import Training from "../screens/Training";
import StartTraining from "../screens/StartTraining";
import Datasets from "../screens/Datasets";
import TrainingProgress from "../screens/TrainingProgress";

// router
import { HashRouter as Router, Switch, Route } from "react-router-dom";

// redux
import { connect } from "react-redux";

// resources
import { MdHome, MdSchool, MdPhotoLibrary } from "react-icons/md";
import { IoMdGitNetwork } from "react-icons/io";
import { FaQuestion } from "react-icons/fa";
import Dataset from "../screens/Dataset";

const screens = [
  {
    path: `/`,
    exact: true,
    exactLink: true,
    component: Dashboard,
    fullName: `About`,
    icon: FaQuestion,
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
    path: `/datasets/:serverUniqueName/:datasetId`,
    component: Dataset,
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
    customRightIcon: <TrainingIndicator />,
  },
  {
    path: `/training/:serverUniqueName/:networkId`,
    component: TrainingProgress,
  },
  {
    path: `/startTraining`,
    component: StartTraining,
    exact: true,
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
