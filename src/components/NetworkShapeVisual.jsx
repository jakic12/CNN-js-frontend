import React from "react";
import styled from "styled-components";

import Error from "./Error";

const WrapperCard = styled.div`
  width: 100%;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
    0 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
`;

export default ({ network }) => (
  <WrapperCard>
    {network &&
      network.shape &&
      network.shape.map((layerShape, i) => (
        <div key={`network_layer_${i}`}>test</div>
      ))}
    {(!network || !network.shape) && <Error error={`invalid network shape`} />}
  </WrapperCard>
);
