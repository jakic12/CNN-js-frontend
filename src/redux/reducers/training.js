import {
  START_TRAINING,
  STOP_TRAINING,
  TRAINING_PROGRESS,
} from "../actions/training";

const defaultState = {};

export default (state = defaultState, action) => {
  switch (action.type) {
    case START_TRAINING:
      return Object.assign({}, state, {
        [action.server.uniqueName]: Object.assign(
          {},
          state[action.server.uniqueName],
          {
            [action.network.id]: {
              dataset: Object.assign({}, action.dataset, { data: undefined }),
              epochs: action.epochs,
              epoch: `initializing`,
              learningRate: action.learningRate,
              learningRateArr: [],
              errArr: [],
              accuracyArr: [],
              trainingInstance: action.trainingInstance,
            },
          }
        ),
      });
    case STOP_TRAINING:
      return Object.assign({}, state, {
        [action.server.uniqueName]: Object.assign(
          {},
          state[action.server.uniqueName],
          { [action.network.id]: undefined }
        ),
      });
    case TRAINING_PROGRESS:
      return Object.assign({}, state, {
        [action.server.uniqueName]: Object.assign(
          {},
          state[action.server.uniqueName],
          {
            [action.network.id]: {
              epoch: action.epoch,
              epochs: action.epochs,
              err: action.err,
              accuracy: action.accuracy,
              learningRate: action.learningRate,
              dataset: Object.assign(
                {},
                state[action.server.uniqueName][action.network.id].dataset,
                { data: undefined }
              ),
              learningRateArr: Object.assign(
                [],
                state[action.server.uniqueName][action.network.id]
                  .learningRateArr,
                {
                  [action.epoch]: action.learningRate * -1,
                }
              ),
              errArr: Object.assign(
                [],
                state[action.server.uniqueName][action.network.id].errArr,
                {
                  [action.epoch]: action.err,
                }
              ),
              accuracyArr: Object.assign(
                [],
                state[action.server.uniqueName][action.network.id].accuracyArr,
                {
                  [action.epoch]: action.accuracy,
                }
              ),
              trainingInstance:
                state[action.server.uniqueName][action.network.id]
                  .trainingInstance,
            },
          }
        ),
      });
    default:
      return state;
  }
};
