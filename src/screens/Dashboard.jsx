import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";

import { MdSchool, MdPhotoLibrary } from "react-icons/md";
import { IoMdGitNetwork } from "react-icons/io";
import { Link, Redirect } from "react-router-dom";
import SpringButton from "../components/SpringButton";

import { AiFillGithub } from "react-icons/ai";

const DashboardWrapper = styled.div`
  padding: 1em;
`;

const Tab = styled.div``;

const CenterImage = styled.img`
  margin: 0 auto;
  max-width: 80%;
`;

const CenterChild = styled.div`
  display: flex;
  justify-content: center;
`;

const SidebarItemLink = styled(Link)`
  position: relative;
  display: inline-flex;
  flex-direction: row;
  align-items: center;
  padding: 5px;
  box-sizing: border-box;
  text-decoration: none;
  color: ${(props) => props.primarytextcolor};
  border-radius: 3px;
  background: ${(props) => props.primarycolor};
  &.linkActive {
    font-weight: bold;
    background: ${(props) => (props.darkMode ? props.primarycolor : `none`)};
  }
`;

const TabLink = connect((state) => state)(({ colors, tab }) => {
  const iconStyle = {
    height: `1em`,
    width: `1em`,
  };
  return (
    <>
      <SidebarItemLink to={tab} {...colors}>
        <div style={{ paddingRight: `0.5em` }}>
          {tab === `datasets` && <MdPhotoLibrary style={iconStyle} />}
          {tab === `networks` && (
            <IoMdGitNetwork
              style={{ transform: `rotate(-90deg)`, ...iconStyle }}
            />
          )}
          {tab === `training` && <MdSchool style={iconStyle} />}
        </div>
        {tab.charAt(0).toUpperCase() + tab.slice(1)}
      </SidebarItemLink>
    </>
  );
});

const GoBanner = styled.div`
  height: 20vh;
  width: 100%;

  display: flex;
  justify-content: center;
  align-items: center;
`;

export default connect(
  (state) => state,
  (dispatch) => ({
    startHints: () => dispatch({ type: "SET_HINT", hintId: 0 }),
    stopHints: () => dispatch({ type: "SET_HINT", hintId: -1 }),
  })
)(({ startHints, hints, stopHints }) => {
  const [redirectToNetworks, setRedirectToNetworks] = React.useState(false);

  return (
    <DashboardWrapper>
      {redirectToNetworks && hints.hintId === 0 && <Redirect to={`networks`} />}
      <h1>CNNjs demo</h1>
      <p>
        This is a demo that can train a Convolutional neural network in your
        browser, using a{" "}
        <a href="https://github.com/jakic12/CNN-js">training library</a> I made
        for javascript. You can upload your own dataset or use a reduced version
        of the{" "}
        <a href="https://www.cs.toronto.edu/~kriz/cifar.html">cifar-10</a>{" "}
        dataset already provided with the demo. You can also upload images and
        test the network from your browser. The trained network can be exported
        as json for further use.
      </p>
      <GoBanner>
        <SpringButton
          shrinkToContent={true}
          text={hints.hintId > -1 ? `Stop the tutorial` : `Start the tutorial`}
          textColor={`white`}
          color={`#dd2683`}
          onClick={() => {
            if (hints.hintId > -1) {
              stopHints();
              setRedirectToNetworks(false);
            } else {
              startHints();
              setRedirectToNetworks(true);
            }
          }}
        />
      </GoBanner>
      <p>
        Made by{" "}
        <a href="https://github.com/jakic12">
          <AiFillGithub />
          Jakob Drusany
        </a>
        .<br /> Mentored by prof. Boštjan Vouk.
      </p>
      <h1>Written instructions</h1>
      <ol>
        <h3>
          <li>Network</li>
        </h3>
        <p>
          First create a network on the <TabLink tab={`networks`} /> tab that we
          will use for training.
        </p>

        <CenterChild>
          <CenterImage
            src={process.env.PUBLIC_URL + `/tutorial_images/Screenshot_1.jpg`}
            alt="creating a network"
          />
        </CenterChild>

        <h3>
          <li>Dataset</li>
        </h3>
        <p>
          If you want to use your own dataset, you can upload it on the{" "}
          <TabLink tab={`datasets`} /> tab. If not, there is a sample of the{" "}
          <a href="https://www.cs.toronto.edu/~kriz/cifar.html">cifar-10</a>{" "}
          dataset already provided.
        </p>

        <CenterChild>
          <CenterImage
            src={process.env.PUBLIC_URL + `/tutorial_images/Screenshot_3.jpg`}
            alt="uploading a dataset"
            width="80%"
          />
        </CenterChild>

        <h3>
          <li>Training</li>
        </h3>
        <p>
          After you have your dataset and network ready, you can train the
          network. You can do that by clicking the "train a network" button on
          the <TabLink tab={`training`} /> tab and selecting your network and
          dataset. You can change the training parameters on the right and then
          hit "Start Training".
        </p>

        <CenterChild>
          <CenterImage
            src={process.env.PUBLIC_URL + `/tutorial_images/Screenshot_4.jpg`}
            alt="training a network"
          />
        </CenterChild>

        <h3>
          <li>Using the network</li>
        </h3>
        <p>
          After you have completed training, you can play around with the
          network. If you go to the <TabLink tab={`datasets`} /> tab and click
          on a dataset, you can build a confusion matrix on the dataset.
        </p>
        <CenterChild>
          <CenterImage
            src={process.env.PUBLIC_URL + `/tutorial_images/Screenshot_8.jpg`}
            alt="confusion matrix"
          />
        </CenterChild>
        <p>
          You can also click on a network on the <TabLink tab={`networks`} />{" "}
          tab and classify a single image from a dataset
        </p>

        <CenterChild>
          <CenterImage
            src={process.env.PUBLIC_URL + `/tutorial_images/Screenshot_7.jpg`}
            alt="Classifying a dataset image"
          />
        </CenterChild>

        <p>or upload your own image to classify.</p>

        <CenterChild>
          <CenterImage
            src={process.env.PUBLIC_URL + `/tutorial_images/Screenshot_6.jpg`}
            alt="Classifying an uploaded image"
          />
        </CenterChild>
      </ol>
    </DashboardWrapper>
  );
});
