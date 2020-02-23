export const SET_STRUCT_PROP = `SET_STRUCT_PROP`;

export const setColor = (property, value) => ({
  type: SET_STRUCT_PROP,
  property,
  value
});
