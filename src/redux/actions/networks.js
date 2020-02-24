import { getNetworks } from "../../other/api";

export const FETCH_NETWORKS_REQUEST = `FETCH_NETWORKS_REQUEST`;
export const FETCH_NETWORKS_SUCCESS = `FETCH_NETWORKS_SUCCESS`;
export const FETCH_NETWORKS_ERROR = `FETCH_NETWORKS_ERROR`;

export const requestNetworks = () => ({ type: FETCH_NETWORKS_REQUEST });
export const networksSuccess = networks => ({
  type: FETCH_NETWORKS_SUCCESS,
  networks
});
export const networksError = err => ({
  type: FETCH_NETWORKS_ERROR,
  error: err
});

export const fetchNetworks = (url, apiToken, dispatch) => {
  dispatch(requestNetworks());
  getNetworks(url, apiToken)
    .then(networks => {
      dispatch(networksSuccess(networks));
    })
    .catch(err => dispatch(networksError(err)));
};
