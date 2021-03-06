import { combineReducers } from "redux";

// reducers
import colors from "./colors";
import structure from "./structure";
import networks from "./networks";
import servers from "./servers";
import training from "./training";
import datasets from "./datasets";
import hints from "./hints";

export default combineReducers({
  colors,
  structure,
  networks,
  servers,
  training,
  datasets,
  hints,
});
