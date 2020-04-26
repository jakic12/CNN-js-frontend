import { SET_STRUCT_PROP } from "../actions/structure";

const defaultState = {
  sidebarwidth: `250px`,
  topbarheight: `80px`,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_STRUCT_PROP:
      return Object.assign({}, state, { [action.property]: action.value });
    default:
      return state;
  }
};
