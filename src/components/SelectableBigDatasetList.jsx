import React from "react";
import styled from "styled-components";

import { NetworkCardParent } from "./NetworkCard";
import DatasetCard from "./DatasetCard";
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

const SelectableBigDatasetList = ({
  servers,
  datasets,
  onSelect,
  refreshFunction,
}) => {
  const [selected, select] = React.useState(false);
  const [serversWithError, setServersWithError] = React.useState({});

  return selected ? (
    <FullCenter>
      <DatasetCard dataset={selected} onClick={() => {}} />
    </FullCenter>
  ) : (
    <Wrapper>
      {servers.servers.map((server, i) => {
        if (
          !serversWithError[server.uniqueName] &&
          datasets.serverDatasetsError[server.uniqueName]
        ) {
          setServersWithError(
            Object.assign({}, serversWithError, { [server.uniqueName]: true })
          );
        }
        if (
          serversWithError[server.uniqueName] &&
          !datasets.serverDatasetsError[server.uniqueName]
        ) {
          setServersWithError(
            Object.assign({}, serversWithError, { [server.uniqueName]: false })
          );
          refreshFunction(server);
        }
        return (
          <NetworkCardParent
            key={`server_${i}_${server.uniqueName}_datasets`}
            title={server.uniqueName}
          >
            {datasets.datasets[server.uniqueName] &&
              Object.keys(datasets.datasets[server.uniqueName]).map(
                (datasetId, j) => (
                  <DatasetCard
                    key={`dataset_sectioned_${j}`}
                    dataset={datasets.datasets[server.uniqueName][datasetId]}
                    onClick={() => {
                      select(datasets.datasets[server.uniqueName][datasetId]);
                      onSelect(server, datasetId);
                    }}
                  />
                )
              )}

            {datasets.serverDatasetsError[server.uniqueName] &&
              datasets.serverDatasetsError[server.uniqueName] !==
                `Unauthorized` && (
                <div>
                  <Error
                    error={translateError(
                      datasets.serverDatasetsError[server.uniqueName]
                    )}
                    retryFunction={() => refreshFunction(server)}
                  />
                </div>
              )}
            {datasets.serverDatasetsError[server.uniqueName] ===
              `Unauthorized` && <ServerLogin server={server} />}
          </NetworkCardParent>
        );
      })}
    </Wrapper>
  );
};

export default SelectableBigDatasetList;
