import { SET_COLOR } from "../actions/colors";

const defaultState = {
  background: `white`,
  primarycolor: `#2261c6`,
  primarytextcolor: `white`
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_COLOR:
      return Object.assign({}, state, { [action.property]: action.value });
    default:
      return state;
  }
};
