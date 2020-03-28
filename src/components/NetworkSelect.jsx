import React, { useState } from "react";

import { connect } from "react-redux";

import styled from "styled-components";
import AnimatedFullScreenCard from "./AnimatedFullScreenCard";
import SelectableBigNetworkList from "./SelectableBigNetworkList";
import { fetchNetworks } from "../redux/actions/networks";
import NetworkCard from "./NetworkCard";

const NetworkSelectWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const SelectNetworkWrapper = styled.div`
  width: 13em;
  height: 15em;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
    0 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 0.7em;
  flex-grow: 0;
  flex-shrink: 0;

  transform: scale(1);
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.1);
    cursor: pointer;
  }

  background: ${props => props.backgroundbyelevation(1)};
  text-decoration: none;
  color: ${props => props.accenttextcolor};
  display: block;

  border: 2px ${props => props.color} dashed;
  box-sizing: border-box;
  font-size: 1em;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const InnerNoOverflow = styled.div`
  width: 100%;
  height: 100%;
  overflow-x: hidden;
  overflow-y: scroll;
`;

const NetworkSelect = ({
  colors,
  innerRef,
  servers,
  networks,
  getNetworks
}) => {
  const [selectedId, selectId] = useState();
  const [open, setOpen] = useState(false);
  const [wrapperRef, setWrapperRef] = useState();

  React.useEffect(() => {
    servers.servers.map(s => {
      getNetworks(s);
    });
  }, []);

  console.log(servers.servers, networks.networks);

  return (
    <NetworkSelectWrapper onClick={() => setOpen(true)}>
      {(!selectedId || open) && (
        <>
          <SelectNetworkWrapper {...colors} ref={ref => setWrapperRef(ref)}>
            Select network
          </SelectNetworkWrapper>
          {open && (
            <AnimatedFullScreenCard
              startFromElement={wrapperRef}
              fullscreen={true}
              onCloseCallback={() => {
                setOpen(false);
              }}
              contentFunction={closeCard => {
                return (
                  <InnerNoOverflow>
                    <SelectableBigNetworkList
                      servers={servers}
                      networks={networks}
                      onSelect={(serverId, networkId) => {
                        closeCard(false);
                        selectId({ server: serverId, network: networkId });
                      }}
                      refreshFunction={server => getNetworks(server)}
                    />
                  </InnerNoOverflow>
                );
              }}
            />
          )}
        </>
      )}
      {!open && selectedId && (
        <NetworkCard
          network={networks.networks[selectedId.server][selectedId.network]}
          onClick={() => {
            setOpen(true);
          }}
          getRef={ref => setWrapperRef(ref)}
        />
      )}
    </NetworkSelectWrapper>
  );
};

export default connect(
  state => state,
  dispatch => ({
    getNetworks: server => fetchNetworks(server, dispatch)
  })
)(NetworkSelect);
