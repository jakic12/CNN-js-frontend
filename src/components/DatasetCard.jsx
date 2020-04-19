import React from "react";

import styled, { css } from "styled-components";
//redux
import { connect } from "react-redux";

// router
import { Link } from "react-router-dom";

//res
import { MdPhotoLibrary } from "react-icons/md";

import { openDatasetFromBuffer } from "../CNN-js/datasetProcessor";

const cardWrapperCss = css`
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
  }

  background: ${(props) => props.backgroundbyelevation(1)};
  text-decoration: none;
  color: ${(props) => props.accenttextcolor};
  display: block;
`;

const CardWrapper = styled(Link)`
  ${cardWrapperCss}
`;

const CardWrapperNoLink = styled.div`
  ${cardWrapperCss}

  &:hover {
    cursor: pointer;
  }
`;

const DatasetImage = {
  width: `50%`,
  display: `block`,
  height: `50%`,
  flexGrow: 0,
};

const DatasetImageDiv = styled.div`
  height: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const BottomWrapper = styled.div`
  height: 30%;
  width: 100%;
  border-bottom-right-radius: 5px;
  border-bottom-left-radius: 5px;
`;

const DatasetTitle = styled.h2`
  height: 100%;
  width: 100%;
  text-align: center;
  margin: 0;
  &:before {
    content: "";
    display: inline-block;
    height: 100%;
    vertical-align: middle;
  }
`;

export default connect((state) => state)(
  ({ colors, dataset, serverId, onClick, getRef }) => {
    const Wrapper = onClick ? CardWrapperNoLink : CardWrapper;
    console.log(
      openDatasetFromBuffer(dataset.data, dataset.colorDepth, dataset.imageSize)
    );
    return (
      <Wrapper
        to={onClick ? "" : `/dataset/${serverId}/${dataset.id}`}
        onClick={onClick}
        ref={getRef && ((ref) => getRef(ref))}
        {...colors}
      >
        <DatasetImageDiv>
          <MdPhotoLibrary style={DatasetImage} />
        </DatasetImageDiv>
        <BottomWrapper>
          <DatasetTitle>
            {dataset.name +
              ` (${
                dataset.data.length /
                (dataset.imageSize * dataset.imageSize * dataset.colorDepth + 1)
              })`}
          </DatasetTitle>
        </BottomWrapper>
      </Wrapper>
    );
  }
);
