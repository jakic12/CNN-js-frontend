import { getNetworks } from "../../other/api";

export const FETCH_NETWORKS_REQUEST = `FETCH_NETWORKS_REQUEST`;
export const FETCH_NETWORKS_SUCCESS = `FETCH_NETWORKS_SUCCESS`;
export const FETCH_NETWORKS_ERROR = `FETCH_NETWORKS_ERROR`;
export const UNLOAD_NETWORKS = `UNLOAD_NETWORKS`;

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

export const fetchNetworks = (server, dispatch) => {
  dispatch(requestNetworks({ server }));
  getNetworks(server)
    .then(networks => {
      dispatch(networksSuccess({ networks, server }));
    })
    .catch(err => dispatch(networksError({ err, server })));
};
