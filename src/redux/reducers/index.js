import { combineReducers } from "redux";

// reducers
import colors from "./colors";
import structure from "./structure";
import networks from "./networks";
import config from "./config";

export default combineReducers({
  colors,
  structure,
  networks,
  config
});
