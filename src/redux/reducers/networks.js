import {
  FETCH_NETWORKS_REQUEST,
  FETCH_NETWORKS_SUCCESS,
  FETCH_NETWORKS_ERROR,
  UNLOAD_NETWORKS,
  NEW_NETWORK_REQUEST,
  NEW_NETWORK_SUCCESS,
  NEW_NETWORK_ERROR,
  FETCH_NETWORK_REQUEST,
  FETCH_NETWORK_SUCCESS,
  FETCH_NETWORK_ERROR,
  SET_NETWORK_SUCCESS,
} from "../actions/networks";

import { NetworkArchitectures } from "../../CNN-js/cnn";

const defaultState = {
  networks: {},
  isLoading: {},
  error: {},
  networkLoading: {},
  networkError: {},
  networkArchitectures: NetworkArchitectures,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_NETWORK_REQUEST:
      return Object.assign({}, state, {
        networkLoading: Object.assign({}, state.networkLoading, {
          [action.server.uniqueName + action.networkId]: true,
        }),
        networkError: Object.assign({}, state.networkError, {
          [action.server.uniqueName + action.networkId]: undefined,
        }),
      });
    case FETCH_NETWORK_SUCCESS:
      return Object.assign({}, state, {
        networkLoading: Object.assign({}, state.networkLoading, {
          [action.server.uniqueName + action.networkId]: false,
        }),
        networkError: Object.assign({}, state.networkError, {
          [action.server.uniqueName + action.networkId]: undefined,
        }),
        networks: Object.assign(state.networks, {
          [action.server.uniqueName]: Object.assign(
            {},
            state.networks[action.server.uniqueName],
            { [action.networkId]: action.network }
          ),
        }),
      });
    case SET_NETWORK_SUCCESS:
      return Object.assign({}, state, {
        networks: Object.assign({}, state.networks, {
          [action.server.uniqueName]: Object.assign(
            {},
            state.networks[action.server.uniqueName],
            {
              [action.network.id]: action.network,
            }
          ),
        }),
      });
    case FETCH_NETWORK_ERROR:
      return Object.assign({}, state, {
        networkLoading: Object.assign({}, state.networkLoading, {
          [action.server.uniqueName + action.networkId]: false,
        }),
        networkError: Object.assign({}, state.networkError, {
          [action.server.uniqueName + action.networkId]: action.err,
        }),
      });
    case NEW_NETWORK_REQUEST:
      return Object.assign({}, state, { isLoading: true });
    case NEW_NETWORK_SUCCESS:
      return Object.assign({}, state, { isLoading: false });
    case NEW_NETWORK_ERROR:
      return Object.assign({}, state, { error: action.error });
    case FETCH_NETWORKS_REQUEST:
      return Object.assign({}, state, {
        networks: Object.assign({}, state.networks),
        isLoading: Object.assign({}, state.isLoading, {
          [action.server.uniqueName]: true,
        }),
        error: Object.assign({}, state.error, {
          [action.server.uniqueName]: false,
        }),
        networkArchitectures: Object.assign({}, state.networkArchitectures),
      });
    case FETCH_NETWORKS_SUCCESS:
      return Object.assign({}, state, {
        networks: Object.assign({}, state.networks, {
          [action.server.uniqueName]: action.networks,
        }),
        isLoading: Object.assign({}, state.isLoading, {
          [action.server.uniqueName]: false,
        }),
        error: Object.assign({}, state.error, {
          [action.server.uniqueName]: false,
        }),
        networkArchitectures: Object.assign({}, state.networkArchitectures),
      });
    case FETCH_NETWORKS_ERROR:
      return Object.assign({}, state, {
        networks: Object.assign({}, state.networks),
        isLoading: Object.assign({}, state.isLoading, {
          [action.server.uniqueName]: false,
        }),
        error: Object.assign({}, state.error, {
          [action.server.uniqueName]: action.error,
        }),
        networkArchitectures: Object.assign({}, state.networkArchitectures),
      });
    case UNLOAD_NETWORKS:
      return Object.assign({}, state, {
        networks: Object.assign({}, state.networks, {
          [action.server.uniqueName]: undefined,
        }),
        isLoading: Object.assign({}, state.isLoading, {
          [action.server.uniqueName]: false,
        }),
        error: Object.assign({}, state.error, {
          [action.server.uniqueName]: false,
        }),
        networkArchitectures: Object.assign({}, state.networkArchitectures),
      });
    default:
      return state;
  }
};
