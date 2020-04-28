import {
  FETCH_REDUCED_DATASETS_REQUEST,
  FETCH_REDUCED_DATASETS_SUCCESS,
  FETCH_REDUCED_DATASETS_ERROR,
  FETCH_DATASET_REQUEST,
  FETCH_DATASET_SUCCESS,
  FETCH_DATASET_ERROR,
  NEW_DATASET_REQUEST,
  NEW_DATASET_SUCCESS,
  NEW_DATASET_ERROR,
} from "../actions/datasets";

const defaultState = {
  datasets: {},
  datasetsLoading: {},
  serverDatasetsLoading: {},
  serverDatasetsError: {},
  datasetsError: {},
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case FETCH_REDUCED_DATASETS_REQUEST:
      return {
        datasets: state.datasets,
        datasetsLoading: state.datasetsLoading,
        serverDatasetsLoading: Object.assign({}, state.serverDatasetsLoading, {
          [action.server.uniqueName]: true,
        }),
        serverDatasetsError: Object.assign({}, state.serverDatasetsError, {
          [action.server.uniqueName]: undefined,
        }),
        datasetsError: state.datasetsError,
      };
    case FETCH_REDUCED_DATASETS_SUCCESS:
      return {
        datasets: Object.assign(state.datasets, {
          [action.server.uniqueName]: Object.assign(
            {},
            state.datasets[action.server.uniqueName],
            action.datasets
          ),
        }),
        datasetsLoading: state.datasetsLoading,
        serverDatasetsLoading: Object.assign({}, state.serverDatasetsLoading, {
          [action.server.uniqueName]: undefined,
        }),
        serverDatasetsError: Object.assign({}, state.serverDatasetsError, {
          [action.server.uniqueName]: undefined,
        }),
        datasetsError: state.datasetsError,
      };
    case FETCH_REDUCED_DATASETS_ERROR:
      return {
        datasets: state.datasets,
        datasetsLoading: state.datasetsLoading,
        serverDatasetsLoading: Object.assign({}, state.serverDatasetsLoading, {
          [action.server.uniqueName]: undefined,
        }),
        serverDatasetsError: Object.assign({}, state.serverDatasetsError, {
          [action.server.uniqueName]: action.err,
        }),
        datasetsError: state.datasetsError,
      };

    case FETCH_DATASET_REQUEST:
      return {
        datasets: state.datasets,
        datasetsLoading: Object.assign({}, state.datasetsError, {
          [action.datasetId]: undefined,
        }),
        serverDatasetsLoading: state.serverDatasetsLoading,
        serverDatasetsError: state.serverDatasetsError,
        datasetsError: Object.assign({}, state.datasetsError, {
          [action.datasetId]: undefined,
        }),
      };
    case FETCH_DATASET_SUCCESS:
      return {
        datasets: Object.assign(state.datasets, {
          [action.server.uniqueName]: Object.assign(
            {},
            state.datasets[action.server.uniqueName],
            {
              [action.dataset.id]: action.dataset,
            }
          ),
        }),
        datasetsLoading: Object.assign({}, state.datasetsError, {
          [action.dataset.id]: undefined,
        }),
        serverDatasetsLoading: state.serverDatasetsLoading,
        serverDatasetsError: state.serverDatasetsError,
        datasetsError: Object.assign({}, state.datasetsError, {
          [action.dataset.id]: undefined,
        }),
      };
    case FETCH_DATASET_ERROR:
      return {
        datasets: state.datasets,
        datasetsLoading: Object.assign({}, state.datasetsError, {
          [action.datasetId]: undefined,
        }),
        serverDatasetsLoading: state.serverDatasetsLoading,
        serverDatasetsError: state.serverDatasetsError,
        datasetsError: Object.assign({}, state.datasetsError, {
          [action.datasetId]: action.err,
        }),
      };
    // case NEW_DATASET_REQUEST:
    //   return
    case NEW_DATASET_SUCCESS:
      return {
        datasets: Object.assign(state.datasets, {
          [action.server.uniqueName]: Object.assign(
            {},
            state.datasets[action.server.uniqueName],
            {
              [action.dataset.id]: action.dataset,
            }
          ),
        }),
        datasetsLoading: state.datasetsError,
        serverDatasetsLoading: state.serverDatasetsLoading,
        serverDatasetsError: state.serverDatasetsError,
        datasetsError: state.datasetsError,
      };
    // case NEW_DATASET_ERROR:
    //   return;
    default:
      return state;
  }
};
