import React, { useState } from "react";

import { connect } from "react-redux";

import styled from "styled-components";
import AnimatedFullScreenCard from "./AnimatedFullScreenCard";
import SelectableBigDatasetList from "./SelectableBigDatasetList";
import { fetchDatasets } from "../redux/actions/datasets";
import DatasetCard from "./DatasetCard";

const DatasetSelectWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const SelectDatasetWrapper = styled.div`
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

  background: ${(props) => props.backgroundbyelevation(1)};
  text-decoration: none;
  color: ${(props) => props.accenttextcolor};
  display: block;

  border: 2px ${(props) => props.color} dashed;
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

const DatasetSelect = ({
  colors,
  innerRef,
  servers,
  datasets,
  getDatasets,
  onDatasetSelect, //(server, networkId) => {}
  id,
}) => {
  const [selectedId, selectId] = useState();
  const [open, setOpen] = useState(false);
  const [wrapperRef, setWrapperRef] = useState();

  React.useEffect(() => {
    servers.servers.map((s) => {
      getDatasets(s);
    });
  }, []);

  return (
    <DatasetSelectWrapper>
      {(!selectedId || open) && (
        <>
          <SelectDatasetWrapper
            onClick={() => setOpen(true)}
            {...colors}
            ref={(ref) => setWrapperRef(ref)}
            id={id}
          >
            Select dataset
          </SelectDatasetWrapper>
          {open && (
            <AnimatedFullScreenCard
              startFromElement={wrapperRef}
              fullscreen={true}
              onCloseCallback={() => {
                setOpen(false);
              }}
              contentFunction={(closeCard) => {
                return (
                  <InnerNoOverflow>
                    <SelectableBigDatasetList
                      firstId={id + `First`}
                      servers={servers}
                      datasets={datasets}
                      onSelect={(server, datasetId) => {
                        closeCard(false);
                        onDatasetSelect(server, datasetId);
                        selectId({
                          server: server.uniqueName,
                          dataset: datasetId,
                        });
                      }}
                      refreshFunction={(server) => getDatasets(server)}
                    />
                  </InnerNoOverflow>
                );
              }}
            />
          )}
        </>
      )}
      {!open && selectedId && (
        <DatasetCard
          dataset={datasets.datasets[selectedId.server][selectedId.dataset]}
          onClick={() => {
            setOpen(true);
          }}
          getRef={(ref) => setWrapperRef(ref)}
        />
      )}
    </DatasetSelectWrapper>
  );
};

export default connect(
  (state) => state,
  (dispatch) => ({
    getDatasets: (server) => fetchDatasets(server, dispatch),
  })
)(DatasetSelect);
