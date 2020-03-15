import React, { useState } from "react";
import styled from "styled-components";
import { useSpring, animated } from "react-spring";

//utils
import { normalizeData } from "../other/utils";

// components
import Error from "./Error";
import { IoIosArrowRoundForward } from "react-icons/io";
import { connect } from "react-redux";

const LayerType = require("../CNN-js/cnn").LayerType;

const WrapperCard = styled.div`
  width: 100%;
`;

const NetworkVisualWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: row;
  overflow-x: auto;
  padding: 2em;
  box-sizing: border-box;
`;

const NetworkLayer = styled.div`
  width: 7em;
  height: 7em;
  margin: 1em;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const FilterLayer = styled.div`
  width: 16em;
  height: 7em;
  margin: 1em;
  overflow-y: auto;
  overflow-x: hidden;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;

const NetworkFilterAndInput = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const NetworkLayerWrapper = styled.div`
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
    0 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  padding: 10px;
  background: ${props => props.backgroundbyelevation(1)};
`;

const LayerTypeTitle = styled.h5`
  width: 100%;
  text-align: center;
`;

const LayerSpacer = styled.div`
  width: 1em;
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${0.83 + 1.67 + 1.3}em;
  padding: 10px;
`;

//NETWORK LAYERS
const minCONVSize = 1;
const maxCONVSize = 5;

const getSliceSize = (
  normalizedLayer,
  min = minCONVSize,
  max = maxCONVSize
) => ({
  w: min + normalizedLayer.w * (max - min),
  h: min + normalizedLayer.h * (max - min)
});

const LAYER_STACK_slice = styled(animated.div)`
  width: ${props => getSliceSize(props).w}em;
  height: ${props => getSliceSize(props).h}em;
  margin: 1em;
  background: ${props => props.backgroundbyelevation(3)};
  border: 1px solid grey;
  border-radius: 3px;
  position: absolute;
  z-index: ${props => 300 - props.i};
`;
const LAYER_STACK_filter_wrapper = styled(animated.div)`
  width: ${props => getSliceSize(props).w}em;
  height: ${props => getSliceSize(props).h}em;
  margin: 1em;

  position: absolute;
  z-index: ${props => 300 - props.i};
  display: flex;
  justify-content: center;
  flex-direction: row;
  align-items: center;
`;
const LAYER_STACK_FILTER_inner = styled(animated.div)`
  width: ${props => {
    const dir = getSliceSize(props);
    return Math.min(dir.w, dir.h) * props.f;
  }}em;
  height: ${props => {
    const dir = getSliceSize(props);
    return Math.min(dir.w, dir.h) * props.f;
  }}em;
  box-sizing: border-box;
  max-height: 100%;
  max-width: 100%;
  background: ${props => props.backgroundbyelevation(3)};
  border: 1px solid grey;
  border-radius: 3px;
`;
const LAYER_STACK_wrapper = styled(animated.div)`
  position: relative;
`;
const LAYER_STACK_slice_component = connect(state => ({
  colors: state.colors
}))(({ layer, i, withData, layerNormalized, extended, filter, colors }) => {
  const { w: slicewidth, h: sliceheight } = getSliceSize(layerNormalized);
  const layerSliceProps = useSpring({
    top: extended ? `${(sliceheight + 2) * i}em` : `-${i / 5}em`,
    //                                ^ don't forget the margin
    left: extended ? `0em` : `${i / 5}em`,
    opacity: extended ? `1` : `${Math.max(1 - i / 10, 0)}`,
    from:
      i < 10
        ? {
            left: `${i / 5}em`,
            top: `-${i / 5}em`,
            opacity: `${Math.max(1 - i / 10, 0)}`
          }
        : {}
  });

  const filterProps = useSpring({
    boxShadow: extended
      ? `0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12), 0 2px 4px -1px rgba(0,0,0,0.20)`
      : `0 0px 0px 0 rgba(0,0,0,0.14), 0 0px 0px 0 rgba(0,0,0,0.12), 0 0px 0px 0px rgba(0,0,0,0.20)`,
    from: {
      boxShadow: `0 0px 0px 0 rgba(0,0,0,0.14), 0 0px 0px 0 rgba(0,0,0,0.12), 0 0px 0px 0px rgba(0,0,0,0.20)`
    }
  });

  if (filter) {
    if (withData) {
      return <canvas></canvas>; //TODO: handle withData
    } else {
      return (
        <LAYER_STACK_filter_wrapper
          style={layerSliceProps}
          key={`LAYER_STACK_layer_filter_${i}`}
          w={layerNormalized.w}
          h={layerNormalized.h}
          i={i}
        >
          <LAYER_STACK_FILTER_inner
            {...colors}
            style={filterProps}
            f={layerNormalized.f}
            w={layerNormalized.w}
            h={layerNormalized.h}
          ></LAYER_STACK_FILTER_inner>
        </LAYER_STACK_filter_wrapper>
      );
    }
  } else {
    if (withData) {
      return <canvas></canvas>;
    } else {
      return (
        <LAYER_STACK_slice
          {...colors}
          style={Object.assign({}, layerSliceProps, filterProps)}
          key={`LAYER_STACK_layer_${i}`}
          w={layerNormalized.w}
          h={layerNormalized.h}
          i={i}
        ></LAYER_STACK_slice>
      );
    }
  }
});

const LAYER_STACK = ({
  layer,
  withData,
  layerNormalized,
  extended,
  withFilter
}) => {
  const { w: sliceWidth, h: sliceHeight } = getSliceSize(layerNormalized);
  const emPadding = 1 * 2;
  const wrapperStyle = useSpring({
    height: extended
      ? `${(sliceHeight + emPadding) * layer.d}em`
      : `${sliceHeight + emPadding}em`,
    width: `${sliceWidth + emPadding}em`,
    marginTop: `-${(sliceHeight + emPadding) / 2}em`,

    from: {
      height: `${sliceHeight + emPadding}em`,
      width: `${sliceWidth + emPadding}em`,
      marginTop: `-${(sliceHeight + emPadding) / 2}em`,
      marginLeft: `-${(sliceWidth + emPadding) / 2}em`
    }
  });
  return (
    <>
      {withFilter && (
        <div
          style={{
            height: 0,
            width: 0
          }}
        >
          <LAYER_STACK_wrapper style={wrapperStyle}>
            {new Array(layer.d)
              .fill(0)
              .map(
                (_, i) =>
                  (extended || i < 10) && (
                    <LAYER_STACK_slice_component
                      layer={layer}
                      i={i}
                      withData={withData}
                      layerNormalized={layerNormalized}
                      extended={extended}
                      filter={true}
                    />
                  )
              )}
          </LAYER_STACK_wrapper>
        </div>
      )}
      <div
        style={{
          height: 0,
          width: 0,
          marginLeft: withFilter ? `${sliceHeight + emPadding}em` : ``
        }}
      >
        <LAYER_STACK_wrapper style={wrapperStyle}>
          {new Array(layer.d)
            .fill(0)
            .map(
              (_, i) =>
                (extended || i < 10) && (
                  <LAYER_STACK_slice_component
                    layer={layer}
                    i={i}
                    withData={withData}
                    layerNormalized={layerNormalized}
                    extended={extended}
                  />
                )
            )}
        </LAYER_STACK_wrapper>
      </div>
    </>
  );
};

//NETWORK LAYERS

//normalize layers, normalize f as percentage of width and height minimum
const normalizeLayers = shape => {
  const out = normalizeData(shape, 0);
  shape.forEach((s, i) => {
    if (s.f) {
      out[i].f = s.f / Math.min(shape[i - 1].w, shape[i - 1].h);
    }
  });
  return out;
};

export default connect(state => ({
  colors: state.colors
}))(({ colors, network, small, withData }) => {
  const [extended, setExtended] = useState(
    new Array(network.shape.length).fill(false)
  );
  const [layersNormalized] = useState(
    network && network.shape ? normalizeLayers(network.shape) : undefined
  );

  console.log(network.shape, layersNormalized);
  return (
    <WrapperCard>
      {network && network.shape && (
        <NetworkVisualWrapper>
          {network.shape.map((layerShape, i) => {
            return (
              <>
                <div key={`network_layer_${i}`}>
                  <NetworkLayerWrapper
                    {...colors}
                    onClick={() => {
                      setExtended(
                        extended.map((_, i1) =>
                          i1 === i ? !extended[i1] : extended[i1]
                        )
                      );
                    }}
                  >
                    <NetworkFilterAndInput>
                      {layerShape.type === LayerType.CONV && (
                        <FilterLayer>
                          <LAYER_STACK
                            layer={layerShape}
                            layerNormalized={layersNormalized[i]}
                            withData={withData}
                            extended={extended[i]}
                            withFilter={true}
                          />
                        </FilterLayer>
                      )}
                      {layerShape.type !== LayerType.CONV && (
                        <NetworkLayer>
                          {layerShape.type === LayerType.INPUT && (
                            <LAYER_STACK
                              layer={layerShape}
                              layerNormalized={layersNormalized[i]}
                              withData={withData}
                              extended={extended[i]}
                            />
                          )}
                          {layerShape.type === LayerType.POOL && (
                            <LAYER_STACK
                              layer={layerShape}
                              layerNormalized={layersNormalized[i]}
                              withData={withData}
                              extended={extended[i]}
                            />
                          )}
                          {layerShape.type === LayerType.FC}
                          {layerShape.type === LayerType.FLATTEN}
                        </NetworkLayer>
                      )}
                    </NetworkFilterAndInput>
                    <LayerTypeTitle>
                      {Object.keys(LayerType).find(
                        key => LayerType[key] === layerShape.type
                      )}
                    </LayerTypeTitle>
                  </NetworkLayerWrapper>
                </div>

                <LayerSpacer>
                  {layerShape.type !== LayerType.FC && (
                    <IoIosArrowRoundForward />
                  )}
                </LayerSpacer>
              </>
            );
          })}
        </NetworkVisualWrapper>
      )}
      {(!network || !network.shape) && (
        <Error error={`invalid network shape`} />
      )}
    </WrapperCard>
  );
});
