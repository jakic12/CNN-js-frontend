import React, { useState } from "react";
import { deepMap } from "../CNN-js/math";

export default ({ style, array, slice, width, height }) => {
  const [ref, setRef] = useState(null);

  if (ref) {
    let imageData = [];
    let width, height;
    if (array) {
      for (let i = 0; i < array[0].length; i++) {
        imageData = imageData.concat(
          array[0][i].reduce(
            (prev, d, j) =>
              prev.concat([
                array[0][i][j],
                (array[1] && array[1][i][j]) || array[0][i][j],
                (array[2] && array[2][i][j]) || array[0][i][j],
                255,
              ]),
            []
          )
        );
      }
      width = array[0][0].length;
      height = array[0].length;
    } else if (slice) {
      const positiveSlice = deepMap(slice, (x) => Math.max(0, x));
      const negativeSlice = deepMap(slice, (x) => Math.min(0, x));

      for (let i = 0; i < slice.length; i++) {
        imageData = imageData.concat(
          slice[i].reduce(
            (prev, d, j) =>
              prev.concat([
                negativeSlice[i][j] * 255,
                positiveSlice[i][j] * 255,
                0,
                255,
              ]),
            []
          )
        );
      }

      width = slice[0].length;
      height = slice.length;
    }
    ref
      .getContext("2d")
      .putImageData(
        new ImageData(new Uint8ClampedArray(imageData), width, height),
        0,
        0
      );
  }

  return (
    <canvas
      style={height && width ? { width, height, ...style } : style}
      height={array ? array[0].length : slice.length}
      width={array ? array[0][0].length : slice[0].length}
      ref={(r) => setRef(r)}
    ></canvas>
  );
};
