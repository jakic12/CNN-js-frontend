export const SET_LEARNING_PARAM = "SET_LEARNING_PARAM";

export const setLearningParam = (key, value) => ({
  type: SET_LEARNING_PARAM,
  key,
  value
});
