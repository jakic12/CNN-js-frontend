import React, { useState } from "react";
import { imageToArray, resizeImage } from "../CNN-js/imageProcessor";
import { softmax } from "../CNN-js/math";
import styled from "styled-components";
import LayerCanvas from "./LayerCanvas";
import { deepNormalize, deepMap } from "../CNN-js/math";
import { connect } from "react-redux";
import { setNetwork } from "../redux/actions/networks";

const PropagationWrapper = styled.div`
  display: flex;
  flex-direction: row;
`;

const FirstLayerDisplay = styled.div`
  padding: 1em;
`;

const OutputLayer = styled.div`
  padding: 1em;
`;

export default connect(
  (state) => state,
  (dispatch) => ({
    setNetwork: (server, network) => setNetwork(server, network, dispatch),
  })
)(({ network, rawData, image, setNetwork, server }) => {
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
        console.log(imageArr);
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
        <table>
          <thead>
            <tr>
              <td>class</td>
              <td>label</td>
              <td>value</td>
              <td>softmax</td>
            </tr>
          </thead>
          <tbody>
            {output &&
              output
                .map((v, i) => ({ v, i }))
                .sort((a, b) => b.v - a.v)
                .map(({ v, i }) => {
                  return (
                    <tr>
                      <td>{i}</td>
                      <td>{network.labels && network.labels[i]}</td>
                      <td>{v}</td>
                      <td>{softmaxed && `${softmaxed[i] * 100}%`}</td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
      </OutputLayer>
    </PropagationWrapper>
  );
});
