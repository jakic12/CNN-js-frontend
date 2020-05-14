import React, { useState } from "react";
import { imageToArray, resizeImage } from "../CNN-js/imageProcessor";
import { softmax } from "../CNN-js/math";
import styled from "styled-components";
import LayerCanvas from "./LayerCanvas";
import { deepNormalize, deepMap } from "../CNN-js/math";
import { connect } from "react-redux";
//import { setNetwork as setNetworkAction } from "../redux/actions/networks";

const PropagationWrapper = styled.div`
  padding-top: 1em;
  display: flex;
  justify-content: center;
  flex-direction: row;
`;

const FirstLayerDisplay = styled.div`
  padding: 1em;
`;

const OutputLayer = styled.div`
  padding: 1em;
`;

const Row = styled.tr`
  background: lightgray;

  & td {
    text-align: center;
    padding: 0.5em;
  }
`;

const OutputTable = styled.table`
  border-radius: 5px;
`;

const Prediction = styled.tr`
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
    0 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  background: ${(props) => props.backgroundbyelevation(1)};

  font-weight: bold;

  & td {
    padding: 1em;
    text-align: center;
  }
`;

const round = (x, c) => parseInt(x * 10 ** c) / 10 ** c;

export default connect(
  (state) => state
  /*(dispatch) => ({
    setNetwork: (server, network) =>
      setNetworkAction(server, network, dispatch),
  })*/
)(({ network, rawData, image, setNetwork, server, colors }) => {
  const [output, setOutput] = useState();
  const [imageArray, setImageArray] = useState();
  const [softmaxed, setSoftmaxed] = useState();

  React.useEffect(() => {
    (async () => {
      if (image || rawData) {
        const imageArr = image
          ? deepNormalize(
              await imageToArray(image, {
                y: network.layers[0][0].length,
                x: network.layers[0][0][0].length,
                z: network.layers[0].length,
              }),
              255
            )
          : rawData;
        const out = network.forwardPropagate(imageArr);

        setImageArray(deepMap(imageArr, (x) => x * 255));
        setOutput(out);
        setSoftmaxed(softmax(out));
        //setNetwork(server, network);
      }
    })();
  }, [image, rawData]);

  return (
    <PropagationWrapper>
      <FirstLayerDisplay
        width={network.layers[0][0].length}
        height={network.layers[0][0][0].length}
      >
        {imageArray && (
          <LayerCanvas width={`10em`} height={`10em`} array={imageArray} />
        )}
      </FirstLayerDisplay>
      <OutputLayer>
        {output && (
          <OutputTable {...colors}>
            <thead>
              <tr style={{ textAlign: `center` }}>
                <td>class</td>
                <td>label</td>
                <td>value</td>
                <td>softmax</td>
              </tr>
            </thead>
            <tbody>
              {output
                .map((v, i) => ({ v, i }))
                .sort((a, b) => b.v - a.v)
                .map(({ v, i }, j) => {
                  const inner = (
                    <>
                      <td>{i}</td>
                      <td>{network.labels && network.labels[i]}</td>
                      <td>{round(v, 2)}</td>
                      <td>
                        {`${round(
                          parseInt(softmaxed && softmaxed[i] * 100),
                          2
                        )}%`}
                      </td>
                    </>
                  );

                  if (j == 0) {
                    return <Prediction {...colors}>{inner}</Prediction>;
                  }
                  return <Row>{inner}</Row>;
                })}
            </tbody>
          </OutputTable>
        )}
      </OutputLayer>
    </PropagationWrapper>
  );
});
