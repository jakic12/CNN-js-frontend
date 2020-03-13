import { getNetworks, createNetwork, getNetwork } from "../../other/api";

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

export const newNetworkRequest = () => ({
  type: NEW_NETWORK_REQUEST
});
export const newNetworksSuccess = () => ({
  type: NEW_NETWORK_SUCCESS
});
export const newNetworkError = ({ error }) => ({
  type: NEW_NETWORK_ERROR,
  error
});

export const requestNetworks = ({ server }) => ({
  type: FETCH_NETWORKS_REQUEST,
  server
});
export const networksSuccess = ({ networks, server }) => ({
  type: FETCH_NETWORKS_SUCCESS,
  networks,
  server
});
export const networksError = ({ err, server }) => ({
  type: FETCH_NETWORKS_ERROR,
  error: err,
  server
});

export const unloadNetworks = ({ server }) => ({
  type: UNLOAD_NETWORKS,
  server
});

export const requestNetwork = ({ server, networkId }) => ({
  type: FETCH_NETWORK_REQUEST,
  networkId: networkId,
  server
});
export const networkSuccess = ({ server, network }) => ({
  type: FETCH_NETWORK_SUCCESS,
  network,
  networkId: network.id,
  server
});
export const networkError = ({ server, networkId, err }) => ({
  type: FETCH_NETWORK_ERROR,
  error: err,
  networkId: networkId,
  server
});

export const fetchNetworks = (server, dispatch) => {
  dispatch(requestNetworks({ server }));
  getNetworks(server)
    .then(networks => {
      Object.keys(networks).forEach(n => (networks[n].reduced = true));
      dispatch(networksSuccess({ networks, server }));
    })
    .catch(err => dispatch(networksError({ err, server })));
};

export const newNetwork = (name, shape, server, dispatch) => {
  dispatch(newNetworkRequest());
  createNetwork(name, shape, server)
    .then(() => {
      fetchNetworks(server, dispatch)
        .then(() => dispatch(newNetworksSuccess()))
        .catch(err => {
          throw err;
        });
    })
    .catch(err => {
      dispatch(newNetworkError({ error: err }));
    });
};

export const fetchNetwork = (networkId, server, dispatch) => {
  dispatch(requestNetwork({ server, networkId }));
  getNetwork(networkId, server)
    .then(net => {
      dispatch(networkSuccess({ server, network: net }));
    })
    .catch(err => {
      dispatch(networkError({ server, networkId, err }));
    });
};
