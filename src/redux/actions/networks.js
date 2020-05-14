import {
  getNetworks,
  createNetwork,
  getNetwork,
  setNetwork as setNetworkApi,
} from "../../other/api";

import { CNN } from "../../CNN-js/cnn";

export const FETCH_NETWORKS_REQUEST = `FETCH_NETWORKS_REQUEST`;
export const FETCH_NETWORKS_SUCCESS = `FETCH_NETWORKS_SUCCESS`;
export const FETCH_NETWORKS_ERROR = `FETCH_NETWORKS_ERROR`;
export const UNLOAD_NETWORKS = `UNLOAD_NETWORKS`;

export const NEW_NETWORK_REQUEST = `NEW_NETWORK_REQUEST`;
export const NEW_NETWORK_SUCCESS = `NEW_NETWORK_SUCCESS`;
export const NEW_NETWORK_ERROR = `NEW_NETWORK_ERROR`;

export const FETCH_NETWORK_REQUEST = `FETCH_NETWORK_REQUEST`;
export const FETCH_NETWORK_SUCCESS = `FETCH_NETWORK_SUCCESS`;
export const FETCH_NETWORK_ERROR = `FETCH_NETWORK_ERROR`;

export const SET_NETWORK_REQUEST = `SET_NETWORK_REQUEST`;
export const SET_NETWORK_SUCCESS = `SET_NETWORK_SUCCESS`;
export const SET_NETWORK_ERROR = `SET_NETWORK_ERROR`;

export const setNetworkRequest = ({ server, network }) => ({
  type: SET_NETWORK_REQUEST,
  server,
  network,
});

export const setNetworkSuccess = ({ server, network }) => ({
  type: SET_NETWORK_SUCCESS,
  server,
  network,
});

export const setNetworkError = ({ server, network, err }) => ({
  type: SET_NETWORK_ERROR,
  server,
  network,
  err,
});

export const newNetworkRequest = () => ({
  type: NEW_NETWORK_REQUEST,
});
export const newNetworksSuccess = () => ({
  type: NEW_NETWORK_SUCCESS,
});
export const newNetworkError = ({ error }) => ({
  type: NEW_NETWORK_ERROR,
  error,
});

export const requestNetworks = ({ server }) => ({
  type: FETCH_NETWORKS_REQUEST,
  server,
});
export const networksSuccess = ({ networks, server }) => ({
  type: FETCH_NETWORKS_SUCCESS,
  networks,
  server,
});
export const networksError = ({ err, server }) => ({
  type: FETCH_NETWORKS_ERROR,
  error: err,
  server,
});

export const unloadNetworks = ({ server }) => ({
  type: UNLOAD_NETWORKS,
  server,
});

export const requestNetwork = ({ server, networkId }) => ({
  type: FETCH_NETWORK_REQUEST,
  networkId: networkId,
  server,
});
export const networkSuccess = ({ server, network }) => ({
  type: FETCH_NETWORK_SUCCESS,
  network,
  networkId: network.id,
  server,
});
export const networkError = ({ server, networkId, err }) => ({
  type: FETCH_NETWORK_ERROR,
  error: err,
  networkId: networkId,
  server,
});

export const fetchNetworks = (server, dispatch) => {
  dispatch(requestNetworks({ server }));
  getNetworks(server)
    .then((networks) => {
      Object.keys(networks).forEach((n) => (networks[n].reduced = true));
      dispatch(networksSuccess({ networks, server }));
    })
    .catch((err) => dispatch(networksError({ err, server })));
};

export const newNetwork = (name, shape, server, dispatch) => {
  dispatch(newNetworkRequest());
  createNetwork(name, shape, server)
    .then(() => {
      console.log(`complete`);
      fetchNetworks(server, dispatch)
        .then(() => {
          dispatch(newNetworksSuccess());
        })
        .catch((err) => {
          throw err;
        });
    })
    .catch((err) => {
      dispatch(newNetworkError({ error: err }));
    });
};

export const fetchNetwork = (networkId, server, dispatch) => {
  dispatch(requestNetwork({ server, networkId }));
  getNetwork(networkId, server)
    .then((net) => {
      dispatch(networkSuccess({ server, network: net }));
    })
    .catch((err) => {
      dispatch(networkError({ server, networkId, err }));
    });
};

export const setNetwork = (
  server,
  network,
  dispatch
  //fetchNetworksAfter = true
) => {
  if (!(network instanceof CNN)) {
    network = Object.assign(new CNN(network), {
      id: network.id,
      name: network.name,
    });
  }

  dispatch(setNetworkRequest({ server, network }));
  setNetworkApi(network, server)
    .then(() => {
      //if (fetchNetworksAfter) fetchNetworks(server, dispatch);
      dispatch(setNetworkSuccess({ server, network }));
    })
    .catch((err) => dispatch(setNetworkError({ server, network, err })));
};
