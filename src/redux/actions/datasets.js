import {
  getDatasets,
  getDataset,
  newDataset as apiNewDataset,
} from "../../other/api";

export const FETCH_REDUCED_DATASETS_REQUEST = `FETCH_REDUCED_DATASETS_REQUEST`;
export const FETCH_REDUCED_DATASETS_SUCCESS = `FETCH_REDUCED_DATASETS_SUCCESS`;
export const FETCH_REDUCED_DATASETS_ERROR = `FETCH_REDUCED_DATASETS_ERROR`;

export const FETCH_DATASET_REQUEST = `FETCH_DATASET_REQUEST`;
export const FETCH_DATASET_SUCCESS = `FETCH_DATASET_SUCCESS`;
export const FETCH_DATASET_ERROR = `FETCH_DATASET_ERROR`;

export const NEW_DATASET_REQUEST = `NEW_DATASET_REQUEST`;
export const NEW_DATASET_SUCCESS = `NEW_DATASET_SUCCESS`;
export const NEW_DATASET_ERROR = `NEW_DATASET_ERROR`;

export const requestNewDataset = ({ dataset, server }) => ({
  type: NEW_DATASET_REQUEST,
  server,
  dataset,
});

export const newDatasetSuccess = ({ dataset, server }) => ({
  type: NEW_DATASET_SUCCESS,
  server,
  dataset,
});

export const newDatasetsError = ({ err, dataset, server }) => ({
  type: NEW_DATASET_ERROR,
  err,
  server,
  dataset,
});

export const requestDatasets = ({ server }) => ({
  type: FETCH_REDUCED_DATASETS_REQUEST,
  server,
});

export const datasetsSuccess = ({ datasets, server }) => ({
  type: FETCH_REDUCED_DATASETS_SUCCESS,
  server,
  datasets,
});

export const datasetsError = ({ err, server }) => ({
  type: FETCH_REDUCED_DATASETS_ERROR,
  err,
  server,
});

export const requestDataset = ({ datasetId, server }) => ({
  type: FETCH_DATASET_REQUEST,
  server,
  datasetId,
});

export const datasetSuccess = ({ dataset, server }) => ({
  type: FETCH_DATASET_SUCCESS,
  server,
  dataset,
});

export const datasetError = ({ err, datasetId, server }) => ({
  type: FETCH_DATASET_ERROR,
  err,
  server,
  datasetId,
});

export const fetchDatasets = (server, dispatch) => {
  dispatch(requestDatasets({ server }));
  getDatasets(server)
    .then((datasets) => {
      Object.keys(datasets).forEach((datasetId) => {
        if (!datasets[datasetId].full) datasets[datasetId].reduced = true;
      });

      dispatch(
        datasetsSuccess({
          server,
          datasets,
        })
      );
    })
    .catch((err) => {
      if (err.message) {
        err = err.message;
      }
      dispatch(datasetsError({ err, server }));
    });
};

export const fetchDataset = (datasetId, server, dispatch) => {
  dispatch(requestDataset({ datasetId, server }));
  getDataset(datasetId, server)
    .then((dataset) => {
      dispatch(datasetSuccess({ dataset, server }));
    })
    .catch((err) => {
      if (err.message) {
        err = err.message;
      }
      dispatch(datasetError({ err, datasetId, server }));
    });
};

export const newDataset = (dataset, server, dispatch) => {
  dispatch(requestNewDataset({ dataset, server }));
  apiNewDataset(dataset, server).then(() => {
    dispatch(newDatasetSuccess({ dataset, server }));
  });
};
