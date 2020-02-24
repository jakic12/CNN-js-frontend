import React from "react";

import { useParams } from "react-router-dom";

import UnderConstruction from "../components/UnderConstruction";

export default () => {
  const { networkId } = useParams();
  return (
    <>
      <UnderConstruction />
      <div>{networkId}</div>
    </>
  );
};
