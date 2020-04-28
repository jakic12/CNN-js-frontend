/**
 * Computes the maximum of each property
 * @param {Array<Object>} dataArray array of data objects
 */
const maxProperties = (dataArray) => {
  const max = Object.assign({}, dataArray[0]);
  dataArray.forEach((d) => {
    Object.keys(d).forEach((key) => {
      if (d[key] > max[key] || max[key] == undefined) {
        max[key] = d[key];
      }
    });
  });
  return max;
};

/**
 * Computes the minimum of each property
 * @param {Array<Object>} dataArray array of data objects
 */
export const minProperties = (dataArray) => {
  const min = Object.assign({}, dataArray[0]);
  dataArray.forEach((d) => {
    Object.keys(d).forEach((key) => {
      if (d[key] < min[key] || min[key] == undefined) {
        min[key] = d[key];
      }
    });
  });
  return min;
};

/**
 * Normalizes all properties min-max -> 0-1
 * @param {Array<Object>} dataArray
 * @param {Number} nanValue (optional) if all props are the same, normalization returns NaN. Instead of NaN, this function returns `nanValue`
 */
export const normalizeData = (dataArray, nanValue = NaN) => {
  const max = maxProperties(dataArray);
  const min = minProperties(dataArray);
  const normalized = dataArray.map((data) => {
    const normalizedRecord = {};
    Object.keys(min).forEach((key) => {
      normalizedRecord[key] =
        data[key] === min[key]
          ? nanValue
          : (data[key] - min[key]) / (max[key] - min[key]);
    });
    return normalizedRecord;
  });
  return normalized;
};

export const exportText = (data, fileName) => {
  var a = window.document.createElement("a");
  a.href = window.URL.createObjectURL(new Blob([data], { type: "text/plain" }));
  a.download = fileName;

  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};
