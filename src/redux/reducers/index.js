import { combineReducers } from "redux";

// reducers
import colors from "./colors";
import structure from "./structure";
import networks from "./networks";
import servers from "./servers";
import learning from "./learning";

export default combineReducers({
  colors,
  structure,
  networks,
  servers,
  learning
});
