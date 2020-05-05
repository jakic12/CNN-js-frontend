import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import TrainingController from "../other/TrainingController";
const CNN = require("../CNN-js/cnn").CNN;

const StyledTable = styled.table``;
const StyledRow = styled.tr``;
const StyledData = styled.td``;

export default ({ network, dataset }) => {
  const [cm, setCm] = React.useState(null);
  const [stats, setStats] = React.useState(null);

  React.useEffect(() => {
    setCm(null);
    setStats(null);
    const instance = new TrainingController({ network, dataset });
    instance.addEventListener("confusionMatrix", (confusion) => {
      setCm(confusion);
      setStats(CNN.confusionMatrixStats(confusion));
    });
    instance.confusionMatrix();
  }, [network, dataset]);
  return cm && stats ? (
    <StyledTable>
      {cm.map((row) => (
        <StyledRow>
          {row.map((predictedCount) => (
            <StyledData>{predictedCount}</StyledData>
          ))}
        </StyledRow>
      ))}
    </StyledTable>
  ) : (
    <div>loading</div>
  );
};
