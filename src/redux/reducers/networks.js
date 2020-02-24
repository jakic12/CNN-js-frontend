import {
  FETCH_NETWORKS_REQUEST,
  FETCH_NETWORKS_SUCCESS,
  FETCH_NETWORKS_ERROR
} from "../actions/networks";

const defaultState = {
  networks: [],
  isLoading: false,
  error: undefined
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_NETWORKS_REQUEST:
      return { isLoading: true, error: undefined, networks: state.networks };
    case FETCH_NETWORKS_SUCCESS:
      return { isLoading: false, error: undefined, networks: action.networks };
    case FETCH_NETWORKS_ERROR:
      return {
        isLoading: false,
        error: action.error,
        networks: state.networks
      };
    default:
      return state;
  }
};
