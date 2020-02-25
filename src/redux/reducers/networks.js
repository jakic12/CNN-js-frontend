import {
  FETCH_NETWORKS_REQUEST,
  FETCH_NETWORKS_SUCCESS,
  FETCH_NETWORKS_ERROR,
  UNLOAD_NETWORKS
} from "../actions/networks";

const defaultState = {
  networks: {},
  isLoading: {},
  error: {}
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_NETWORKS_REQUEST:
      return {
        networks: Object.assign({}, state.networks),
        isLoading: Object.assign({}, state.isLoading, {
          [action.server.uniqueName]: true
        }),
        error: Object.assign({}, state.error, {
          [action.server.uniqueName]: false
        })
      };
    case FETCH_NETWORKS_SUCCESS:
      return {
        networks: Object.assign({}, state.networks, {
          [action.server.uniqueName]: action.networks
        }),
        isLoading: Object.assign({}, state.isLoading, {
          [action.server.uniqueName]: false
        }),
        error: Object.assign({}, state.error, {
          [action.server.uniqueName]: false
        })
      };
    case FETCH_NETWORKS_ERROR:
      return {
        networks: Object.assign({}, state.networks),
        isLoading: Object.assign({}, state.isLoading, {
          [action.server.uniqueName]: false
        }),
        error: Object.assign({}, state.error, {
          [action.server.uniqueName]: action.error
        })
      };
    case UNLOAD_NETWORKS:
      return {
        networks: Object.assign({}, state.networks, {
          [action.server.uniqueName]: undefined
        }),
        isLoading: Object.assign({}, state.isLoading, {
          [action.server.uniqueName]: false
        }),
        error: Object.assign({}, state.error, {
          [action.server.uniqueName]: false
        })
      };
    default:
      return state;
  }
};
