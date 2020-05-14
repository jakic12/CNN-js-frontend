import React from "react";
import GridLoader from "react-spinners/GridLoader";
import { connect } from "react-redux";

export default connect((state) => state)((props) => {
  const items = Object.keys(props.training)
    .map((i) => {
      return (
        i !== "trained" &&
        Object.keys(props.training[i]).map((j) => props.training[i][j])
      );
    })
    .flat(1)
    .filter((i) => !!i);
  return items.length > 0 ? (
    <GridLoader size={5} color={`white`} />
  ) : (
    <div></div>
  );
});
