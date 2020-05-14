import {
  FETCH_SERVER_LOGIN_REQUEST,
  FETCH_SERVER_LOGIN_SUCCESS,
  FETCH_SERVER_LOGIN_ERROR,
} from "../actions/servers";

let savedServers_array = localStorage.getItem("servers_store");
if (savedServers_array) savedServers_array = JSON.parse(savedServers_array);
const savedServers = savedServers_array ? {} : null;
if (savedServers_array)
  savedServers_array.forEach((i) => {
    savedServers[i.uniqueName] = i;
  });

const defaultState = {
  servers: [
    {
      url: `local`,
      uniqueName: `Local storage`,
      apiToken: `not needed`,
    },
    /*{
      url: `http://localhost:3005`,
      //apiToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0YWY2NDdjNWQ0Yjc5MGJhN2ExNGIzZDZjOTY2ZTY0ZTM2ZTAyMzRiM2U4YzY0NmZlYzZjZjk5YzdhNmYyNDU5IiwiaWF0IjoxNTgyNTc3MzE1LCJleHAiOjE1ODMxODIxMTV9.EsPP7BQO8R4aKCjwxCN_xspVjqKQ3BR5BwJrRHL7GrA`,
      uniqueName: `Local server`,
      isLoading: false,
      error: false,
      apiToken:
        savedServers &&
        savedServers[`Local server`] &&
        savedServers[`Local server`].apiToken
    },
    {
      url: `http://localhost:3005`,
      //apiToken: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI0YWY2NDdjNWQ0Yjc5MGJhN2ExNGIzZDZjOTY2ZTY0ZTM2ZTAyMzRiM2U4YzY0NmZlYzZjZjk5YzdhNmYyNDU5IiwiaWF0IjoxNTgyNTc3MzE1LCJleHAiOjE1ODMxODIxMTV9.EsPP7BQO8R4aKCjwxCN_xspVjqKQ3BR5BwJrRHL7GrA`,
      uniqueName: `Local server1`,
      isLoading: false,
      error: false,
      apiToken:
        savedServers &&
        savedServers[`Local server1`] &&
        savedServers[`Local server1`].apiToken
    }*/
  ],
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_SERVER_LOGIN_REQUEST:
      return {
        servers: state.servers.map((server) =>
          Object.assign(
            {},
            server,
            action.server.uniqueName === server.uniqueName
              ? { isLoading: true, error: false }
              : {}
          )
        ),
      };
    case FETCH_SERVER_LOGIN_SUCCESS:
      const servers_store = state.servers.map((server) =>
        Object.assign(
          {},
          server,
          action.server.uniqueName === server.uniqueName
            ? { isLoading: false, error: false, apiToken: action.apiToken }
            : {}
        )
      );
      localStorage.setItem("servers_store", JSON.stringify(servers_store));
      return {
        servers: servers_store,
      };
    case FETCH_SERVER_LOGIN_ERROR:
      return {
        servers: state.servers.map((server) =>
          Object.assign(
            {},
            server,
            action.server.uniqueName === server.uniqueName
              ? { isLoading: false, error: action.error }
              : {}
          )
        ),
      };
    default:
      return state;
  }
};
