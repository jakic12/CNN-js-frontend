import { login } from "../../other/api";

export const FETCH_SERVER_LOGIN_REQUEST = `FETCH_SERVER_LOGIN_REQUEST`;
export const FETCH_SERVER_LOGIN_SUCCESS = `FETCH_SERVER_LOGIN_SUCCESS`;
export const FETCH_SERVER_LOGIN_ERROR = `FETCH_SERVER_LOGIN_ERROR`;

export const requestLogin = ({ server }) => ({
  type: FETCH_SERVER_LOGIN_REQUEST,
  server
});

export const loginSuccess = ({ server, apiToken }) => ({
  type: FETCH_SERVER_LOGIN_SUCCESS,
  server,
  apiToken
});

export const loginError = ({ err, server }) => ({
  type: FETCH_SERVER_LOGIN_ERROR,
  error: err,
  server
});

export const loginToServer = (user, pass, server, dispatch) => {
  dispatch(requestLogin({ server }));
  login(user, pass, server)
    .then(apiToken => {
      dispatch(loginSuccess({ apiToken, server }));
    })
    .catch(err => dispatch(loginError({ err, server })));
};
