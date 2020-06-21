export default (
  state = { hintId: parseInt(localStorage.getItem("hintIndex")) },
  action
) => {
  switch (action.type) {
    case "NEXT_HINT":
      localStorage.setItem("hintIndex", state.hintId + 1);
      return { hintId: state.hintId + 1 };
    case "SET_HINT":
      localStorage.setItem("hintIndex", action.hintId);
      return { hintId: action.hintId };
    default:
      return state;
  }
};
