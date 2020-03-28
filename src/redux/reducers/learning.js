import { SET_LEARNING_PARAM } from "../actions/learning";

const defaultState = {
  epochs: 1,
  batch_size: 1
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_LEARNING_PARAM:
      return Object.assign({}, state, { [action.key]: action.value });
    default:
      return state;
  }
};
