import React from "react";
import styled from "styled-components";

import NetworkCard, { NetworkCardParent } from "./NetworkCard";
import Error, { translateError } from "./Error";
import ServerLogin from "../components/ServerLogin";

const Wrapper = styled.div`
  height: 100%;
  width: 100%;
`;

const FullCenter = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const Section = styled.div``;
/**
 *
 * @param {Array} sectionedData
 * structure:
 *  [
 *    {
 *      name:section name,
 *      data:[{
 *            name: "row1",
 *            icon: "icon1" <- optional
 *         },
 *        "row2"
 *      ]
 *    }
 *  ]
 */
const SelectableBigNetworkList = ({
  servers,
  networks,
  onSelect,
  refreshFunction,
  lastId,
}) => {
  const [selected, select] = React.useState(false);
  const [serversWithError, setServersWithError] = React.useState({});

  return selected ? (
    <FullCenter>
      <NetworkCard network={selected} onClick={() => {}} />
    </FullCenter>
  ) : (
    <Wrapper>
      {servers.servers.map((server, i) => {
        console.log(networks.networks[server.uniqueName]);
        if (
          !serversWithError[server.uniqueName] &&
          networks.error[server.uniqueName]
        ) {
          setServersWithError(
            Object.assign({}, serversWithError, { [server.uniqueName]: true })
          );
        }
        if (
          serversWithError[server.uniqueName] &&
          !networks.error[server.uniqueName]
        ) {
          setServersWithError(
            Object.assign({}, serversWithError, { [server.uniqueName]: false })
          );
          refreshFunction(server);
        }
        return (
          <NetworkCardParent
            key={`server_${i}_${server.uniqueName}`}
            title={server.uniqueName}
          >
            {networks.networks[server.uniqueName] &&
              Object.keys(networks.networks[server.uniqueName]).map(
                (networkId, j) => (
                  <NetworkCard
                    key={`network_sectioned_${j}`}
                    network={networks.networks[server.uniqueName][networkId]}
                    onClick={() => {
                      select(networks.networks[server.uniqueName][networkId]);
                      onSelect(server, networkId);
                    }}
                    id={
                      Object.keys(networks.networks[server.uniqueName]).length -
                        1 ===
                        j && lastId
                    }
                  />
                )
              )}

            {networks.error[server.uniqueName] &&
              networks.error[server.uniqueName] !== `Unauthorized` && (
                <div>
                  <Error
                    error={translateError(networks.error[server.uniqueName])}
                    retryFunction={() => refreshFunction(server)}
                  />
                </div>
              )}
            {networks.error[server.uniqueName] === `Unauthorized` && (
              <ServerLogin server={server} />
            )}
          </NetworkCardParent>
        );
      })}
    </Wrapper>
  );
};

export default SelectableBigNetworkList;
