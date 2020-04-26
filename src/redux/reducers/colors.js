import { SET_COLOR } from "../actions/colors";

const darkMode = localStorage.getItem("darkMode");

const defaultState = {
  background: darkMode ? `#121212` : `#f4f8f9`,
  topbarbackground: darkMode ? `#121212` : `white`,
  backgroundbyelevation: (e) =>
    darkMode ? `rgb(${18 + e * 20},${18 + e * 20},${18 + e * 20})` : `white`,
  primarycolor: `#2261c6`,
  primarytextcolor: `white`,
  errorcolor: `#e74c3c`,
  textcolor: darkMode ? `white` : `black`,
  accenttextcolor: darkMode ? `white` : `black`,
  subaccenttextcolor: darkMode ? `white` : `black`,
  darkMode,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case SET_COLOR:
      return Object.assign({}, state, { [action.property]: action.value });
    default:
      return state;
  }
};
