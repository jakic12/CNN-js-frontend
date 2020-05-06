import React from "react";
import styled from "styled-components";
import { connect } from "react-redux";
import TrainingController from "../other/TrainingController";
import { deepNormalize, max, deepMap } from "../CNN-js/math";
import { tint, mix } from "polished";
import { SyncLoader } from "react-spinners";
const CNN = require("../CNN-js/cnn").CNN;

const StyledTable = styled.table`
  height: 100%;
  width: 100%;
  padding: 0.5em;
  box-sizing: border-box;
  table-layout: fixed;
`;
const StyledRow = styled.tr``;
const StyledData = styled.td`
  text-align: center;
  background: ${(props) => tint(1 - props.opacity, props.primarycolor)};
  color: ${(props) =>
    props.opacity > 0.5 ? props.primarytextcolor : props.textcolor};
`;

const StyledDataFlipped = styled.td`
  text-align: center;
  color: ${(props) => props.textcolor};
  transform: rotate(-90deg);
  height: 5em;
`;
const StyledDataStart = styled.td`
  text-align: center;
  color: ${(props) => props.textcolor};
  width: 5em;
`;

const StyledCenterData = styled.td`
  text-align: center;
  background: ${(props) => tint(1 - props.opacity, props.primarycolor)};
  color: ${(props) =>
    props.opacity > 0.5 ? props.primarytextcolor : props.textcolor};
  border: 1px solid grey;

  border-radius: 2px;
`;

const TableContainer = styled.div`
  background: ${(props) => props.backgroundbyelevation(1)};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  color: ${(props) => props.textcolor};
  border-radius: 5px;
  :not(:first-child) {
    margin-top: 0.5em;
  }
  padding: 0.5em;
  height: 100%;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
  width: 100%;
  font-size: 0.5em;
`;

const TableMenuTop = styled.div`
  height: 1em;
  text-align: center;
  vertical-align: center;
`;

const TableMenuRestBottom = styled.div`
  height: calc(100% - 0.5em);
  display: flex;
  flex-direction: row;
`;
const TableMenuLeft = styled.div`
  width: 1em;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  transform: rotate(-90deg) translateZ(0);
  -webkit-font-smoothing: antialiased;
`;

const TableRest = styled.div`
  width: calc(100% - 0.5em);
  height: 100%;
`;

export default connect((state) => state)(
  ({ colors, network, dataset, updateVar, statsCallback }) => {
    const [cm, setCm] = React.useState(null);
    const [normalizedCm, setNormalizedCm] = React.useState(null);
    const [stats, setStats] = React.useState(null);
    const [loading, setLoading] = React.useState(false);

    const labels = dataset.labels;

    React.useEffect(() => {
      if (!loading) {
        setLoading(true);
        const instance = new TrainingController({ network, dataset });
        instance.addEventListener("confusionMatrix", (confusion) => {
          setCm(confusion);
          setNormalizedCm(deepNormalize(confusion, max(confusion)));
          const stats1 = CNN.confusionMatrixStats(confusion);
          setStats(stats1);
          if (statsCallback) statsCallback(stats1);
          setLoading(false);
        });
        instance.confusionMatrix();
      }
    }, [updateVar]);
    return cm && stats ? (
      <TableContainer {...colors}>
        <TableMenuTop>
          predicted{loading ? `(recalculating...)` : ``}
        </TableMenuTop>
        <TableMenuRestBottom>
          <TableMenuLeft>actual</TableMenuLeft>
          <TableRest>
            <StyledTable>
              {labels && (
                <StyledRow>
                  <StyledData {...colors} opacity={0}></StyledData>
                  {labels.map((l) => (
                    <StyledDataFlipped {...colors}>{l}</StyledDataFlipped>
                  ))}
                </StyledRow>
              )}
              {cm.map((row, i) => (
                <StyledRow>
                  {labels && (
                    <StyledDataStart {...colors}>{labels[i]}</StyledDataStart>
                  )}
                  {row.map((predictedCount, j) =>
                    i === j ? (
                      <StyledCenterData
                        {...colors}
                        opacity={normalizedCm[i][j]}
                      >
                        {predictedCount}
                      </StyledCenterData>
                    ) : (
                      <StyledData {...colors} opacity={normalizedCm[i][j]}>
                        {predictedCount}
                      </StyledData>
                    )
                  )}
                </StyledRow>
              ))}
            </StyledTable>
          </TableRest>
        </TableMenuRestBottom>
      </TableContainer>
    ) : (
      <div>
        <SyncLoader />
      </div>
    );
  }
);
