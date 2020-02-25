import React, { useState } from "react";
import styled from "styled-components";

import { loginToServer } from "../redux/actions/servers";
import { connect } from "react-redux";

import { unloadNetworks } from "../redux/actions/networks";

const ServerLoginWrapper = styled.div`
  background: white;
  height: 2em;
  padding: 10px;
  box-shadow: 0 6px 10px 0 rgba(0, 0, 0, 0.14), 0 1px 18px 0 rgba(0, 0, 0, 0.12),
    0 3px 5px -1px rgba(0, 0, 0, 0.2);
  border-radius: 5px;
  display: flex;
  flex-direction: row;
`;

const StyledInput = styled.input`
  padding: 5px;
  &:not(:first-child) {
    margin-left: 1em;
  }
  height: 100%;
  box-sizing: border-box;
  border-radius: 5px;
  border: none;
`;

const StyledInputButton = styled.input`
  box-sizing: border-box;
  margin-left: 1em;
  border-radius: 5px;
  height: 100%;
`;

const ErrorDiv = styled.div`
  background: ${props => props.errorcolor};
  border-radius: 5px;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: row;
  margin: 10px;
  color: white;
`;

export default connect(
  state => state,
  dispatch => ({
    loginServer: (user, pass, server) =>
      loginToServer(user, pass, server, dispatch),
    unload: server => dispatch(unloadNetworks({ server }))
  })
)(({ server, loginServer, colors, unload }) => {
  const [user, setUser] = useState(``);
  const [pass, setPass] = useState(``);

  return (
    <>
      <ServerLoginWrapper>
        <form
          onSubmit={evt => {
            evt.preventDefault();
            unload(server);
            loginServer(user, pass, server);
          }}
        >
          <StyledInput
            type="text"
            value={user}
            onChange={event => setUser(event.target.value)}
            placeholder={`username`}
          />
          <StyledInput
            type="password"
            value={pass}
            onChange={event => setPass(event.target.value)}
            placeholder={`password`}
          />
          <StyledInputButton type="submit" value={`Login`} />
        </form>
      </ServerLoginWrapper>
      {server.error && <ErrorDiv {...colors}>{server.error}</ErrorDiv>}
    </>
  );
});
