import React from "react";

import styled from "styled-components";
import { connect } from "react-redux";

const TableWrapper = styled.div`
  background: ${(props) => props.backgroundbyelevation(1)};
  box-shadow: 0 2px 2px 0 rgba(0, 0, 0, 0.14),
    0 3px 1px -2px rgba(0, 0, 0, 0.12), 0 1px 5px 0 rgba(0, 0, 0, 0.2);
  color: ${(props) => props.textcolor};
  border-radius: 5px;
`;

const TableRow = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  &:not(:first-child) {
    border-top: 1px solid gray;
  }
`;

const TableColumn = styled.div`
  width: 50%;
  text-align: center;
  padding: 0.5em;
`;

export default connect((state) => ({
  colors: state.colors,
}))(({ colors, data, include, style }) => (
  <TableWrapper {...colors} style={style}>
    {(include || Object.keys(data)).map((key, i) => (
      <TableRow key={`data_row_${i}`}>
        <TableColumn>{key}</TableColumn>
        {typeof data[key] === `object` ? (
          <TableColumn>
            {Object.keys(data[key]).map((keyInner, j) => (
              <TableRow key={`data_row_row_${j}`}>
                <TableColumn>{keyInner}</TableColumn>
                <TableColumn>{data[key][keyInner]}</TableColumn>
              </TableRow>
            ))}
          </TableColumn>
        ) : (
          <TableColumn>{data[key]}</TableColumn>
        )}
      </TableRow>
    ))}
  </TableWrapper>
));
