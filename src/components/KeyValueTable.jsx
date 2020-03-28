import React from "react";

import { connect } from "react-redux";
import styled from "styled-components";

const Card = styled.div`
  box-shadow: 0 4px 5px 0 rgba(0, 0, 0, 0.14), 0 1px 10px 0 rgba(0, 0, 0, 0.12),
    0 2px 4px -1px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: row;
  background: ${props => props.backgroundbyelevation(1)};

  &:not(:first-child) {
    margin-top: 2em;
  }
  border-radius: 5px;
`;

const Key = styled.div`
  width: 50%;
  height: 100%;
  padding: 1em;
  text-align: right;
`;

const Value = styled.div`
  width: 50%;
  height: 100%;
  padding: 1em;
`;

const StyledInput = styled.input`
  padding: 5px;
  height: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  border: none;
  background: none;
  color: ${props => props.subaccenttextcolor};
`;

const KeyValueWrapper = styled.div`
  padding: 2em;
`;

const KeyValueTable = ({ data, editFunction, colors, include }) => (
  <KeyValueWrapper>
    {!include &&
      Object.keys(data).map(key => (
        <Card {...colors} key={`key_value_table_${key}`}>
          <Key>{key}</Key>
          <Value>
            <StyledInput
              value={data[key]}
              onChange={evt => editFunction(key, evt.target.value)}
            />
          </Value>
        </Card>
      ))}
    {include &&
      include.map(key => (
        <Card {...colors} key={`key_value_table_${key}`}>
          <Key>{key}</Key>
          <Value>
            <StyledInput
              value={data[key]}
              onChange={evt => editFunction(key, evt.target.value)}
            />
          </Value>
        </Card>
      ))}
  </KeyValueWrapper>
);

export default connect(state => state)(KeyValueTable);
