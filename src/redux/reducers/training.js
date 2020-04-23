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
          { [action.network.id]: {} }
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
              err: action.err,
              accuracy: action.accuracy,
              learningRate: action.learningRate,
            },
          }
        ),
      });
    default:
      return state;
  }
};
