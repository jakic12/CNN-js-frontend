import React from "react";

import styled, { css } from "styled-components";
//redux
import { connect } from "react-redux";

// router
import { Link } from "react-router-dom";

//res
import { MdPhotoLibrary } from "react-icons/md";
import { AiOutlineUpload } from "react-icons/ai";

import { openDatasetFromBuffer } from "../CNN-js/datasetProcessor";
import AnimatedFullScreenCard from "./AnimatedFullScreenCard";

import Dropzone from "react-dropzone";
import { newDataset } from "../redux/actions/datasets";
import Error from "./Error";

const cardWrapperCss = css`
  width: 13em;
  height: 15em;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
    0 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  margin: 0.7em;
  flex-grow: 0;
  flex-shrink: 0;
  &:hover {
    cursor: pointer;
  }
  background: ${(props) => props.backgroundbyelevation(1)};
  text-decoration: none;
  color: ${(props) => props.accenttextcolor};
  display: block;
`;

const CardWrapper = styled(Link)`
  ${cardWrapperCss}
  transform: scale(1);
  transition: transform 0.5s;

  &:hover {
    transform: scale(1.1);
    cursor: pointer;
  }
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

const DatasetTitle = styled.h4`
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

    return (
      <Wrapper
        to={onClick ? "" : `/datasets/${serverId}/${dataset.id}`}
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

const AddDatasetWrapper = styled.div`
  ${cardWrapperCss}
  border:2px ${(props) => props.color} dashed;
  display:flex;
  justify-content:center;
  flex-direction:row;
  align-items:center;
  background:${(props) => props.backgroundbyelevation(1)};
  box-sizing:border-box;
  font-size: 1em;
`;

const InnerDatasetSelect = styled.div`
  border-radius: 5px;
  padding: 1em;
`;

const Title = styled.h3`
  margin: 0.5em;
  margin-left: 0;
  margin-right: 0;

  box-shadow: 0;
  box-sizing: border-box;
`;

const Subtitle = styled.h5`
  margin: 0.5em;
  margin-left: 0;
  margin-right: 0;

  box-shadow: 0;
  box-sizing: border-box;
`;

const FileSelect = styled.div`
  padding: 1em;
  border-radius: 5px;
  margin-top: 1em;
  border: 1px solid gray;
  &:hover {
    cursor: pointer;
  }
`;

const ConfirmButton = styled.div`
  background: ${(props) => props.primarycolor};
  color: ${(props) => props.primarytextcolor};
  padding: 1em;
  border-radius: 5px;
  &:hover {
    cursor: pointer;
  }
  margin: calc(0.8em - 1px);
`;

const ParameterRow = styled.div`
  margin-top: 1em;
  display: flex;
  flex-direction: row;
`;

const ParameterName = styled.div`
  padding: 1em;
`;

const ParameterInput = styled.input`
  border: none;
  background: none;
  border-bottom: 1px solid black;
  text-align: center;
`;

const LeftRight = styled.div`
  display: flex;
  width: 100%;
  flex-direction: row;
  justify-content: space-between;
  height: 100%;
`;

const LeftRightChild = styled.div`
  width: 50%;
  max-height: 100vh;
  box-sizing: border-box;
`;

const StyledTextAreaWrapper = styled.div`
  padding: 1em;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
`;

const StyledTextArea = styled.textarea`
  width: 100%;
  height: 100%;
  resize: none;
  border-radius: 5px;
`;

export const AddDatasetCard = connect(
  (state) => state,
  (dispatch) => ({
    newDatasetConnected: (dataset, server) =>
      newDataset(dataset, server, dispatch),
  })
)(({ colors, server, newDatasetConnected }) => {
  const [open, setOpen] = React.useState(false);
  const [wrapperRef, setWrapperRef] = React.useState();
  const [rawDataset, setRawDataset] = React.useState();
  const [fileName, setFileName] = React.useState();

  const [imageSize, setImageSize] = React.useState(32);
  const [colorDepth, setColorDepth] = React.useState(3);
  const [normalizeMax, setNormalizeMax] = React.useState(255);
  const [crop, setCrop] = React.useState(`no`);
  const [name, setName] = React.useState();

  const [error, setError] = React.useState();
  const [labels, setLabels] = React.useState();
  return (
    <>
      <AddDatasetWrapper
        color={colors.primaryColor}
        backgroundbyelevation={colors.backgroundbyelevation}
        ref={(r) => setWrapperRef(r)}
        onClick={() => setOpen(true)}
      >
        <AiOutlineUpload color={colors.primaryColor} size={25} />
      </AddDatasetWrapper>
      {open && (
        <AnimatedFullScreenCard
          startFromElement={wrapperRef}
          fullscreen={true}
          onCloseCallback={() => setOpen(false)}
          contentFunction={(close) => (
            <InnerDatasetSelect {...colors}>
              <Title>Upload dataset file</Title>
              <Subtitle>
                A dataset file is a binary file with the following formatting:
                <br />
                The file consists of chunks. Each chunk is a "row" of images,
                although there is <b>nothing delimiting the rows</b>. The first
                byte of the chunk is the label of the image(number), the next
                n-bytes(image_depth * image_height * image_width) are the values
                of the pixels.
              </Subtitle>
              <LeftRight>
                <LeftRightChild>
                  <Dropzone
                    accept={".bin"}
                    onDrop={(acceptedFiles) => {
                      acceptedFiles.forEach((file) => {
                        setFileName(file.name);
                        setName(file.name.split(".")[0]);
                        const reader = new FileReader();

                        reader.onabort = () =>
                          console.log("file reading was aborted");
                        reader.onerror = () =>
                          console.log("file reading has failed");
                        reader.onload = () => {
                          const binaryStr = reader.result;
                          setRawDataset(new Uint8Array(binaryStr));
                        };
                        reader.readAsArrayBuffer(file);
                      });
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div {...getRootProps()}>
                          <input {...getInputProps()} />
                          <FileSelect>
                            {fileName ||
                              `Drag 'n' drop binary file here, or click to select it`}
                          </FileSelect>
                        </div>
                      </section>
                    )}
                  </Dropzone>
                  <ParameterRow>
                    <ParameterName>dataset name</ParameterName>
                    <ParameterInput
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </ParameterRow>
                  <ParameterRow>
                    <ParameterName>image size</ParameterName>
                    <ParameterInput
                      value={imageSize}
                      onChange={(e) => setImageSize(e.target.value)}
                    />
                  </ParameterRow>
                  <ParameterRow>
                    <ParameterName>color depth</ParameterName>
                    <ParameterInput
                      value={colorDepth}
                      onChange={(e) => setColorDepth(e.target.value)}
                    />
                  </ParameterRow>
                  <ParameterRow>
                    <ParameterName>normalize max</ParameterName>
                    <ParameterInput
                      value={normalizeMax}
                      onChange={(e) => setNormalizeMax(e.target.value)}
                    />
                  </ParameterRow>
                  <ParameterRow>
                    <ParameterName>crop dataset</ParameterName>
                    <ParameterInput
                      value={crop}
                      onChange={(e) => setCrop(e.target.value)}
                    />
                  </ParameterRow>
                </LeftRightChild>
                <LeftRightChild>
                  <StyledTextAreaWrapper>
                    <StyledTextArea
                      placeholder="Paste labels here, labels should be separated by a newline"
                      onChange={(e) => setLabels(e.target.value)}
                    ></StyledTextArea>
                  </StyledTextAreaWrapper>
                </LeftRightChild>
              </LeftRight>
              <ConfirmButton
                {...colors}
                onClick={() => {
                  setError();
                  if (rawDataset) {
                    if (
                      rawDataset.length %
                        (imageSize * imageSize * colorDepth + 1) !==
                      0
                    ) {
                      setError(
                        `Dataset invalid - length of stream doesn't match the parameters`
                      );
                    } else {
                      newDatasetConnected(
                        {
                          id: `d` + new Date().getTime(),
                          name,
                          imageSize,
                          colorDepth,
                          data:
                            crop === `no`
                              ? rawDataset
                              : rawDataset.subarray(
                                  0,
                                  crop *
                                    (imageSize * imageSize * colorDepth + 1)
                                ),
                          vectorize: true,
                          normalizeMax,
                          labels: labels && labels.split("\n"),
                        },
                        server
                      );
                      close();
                    }
                  } else {
                    setError(`file not loaded yet`);
                  }
                }}
              >
                Confirm
              </ConfirmButton>
              {error && <Error error={error} />}
            </InnerDatasetSelect>
          )}
        />
      )}
    </>
  );
});
