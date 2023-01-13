/**
 * @param {HTMLCanvasElement} srcCanvas
 * @param {string} color
 */
export const addBackgroundToCanvas = (srcCanvas, color = "#FFFFFF") => {
  const destinationCanvas = document.createElement("canvas");
  destinationCanvas.width = srcCanvas.width;
  destinationCanvas.height = srcCanvas.height;

  const destCtx = destinationCanvas.getContext("2d");

  destCtx.fillStyle = color;
  destCtx.fillRect(0, 0, srcCanvas.width, srcCanvas.height);

  destCtx.drawImage(srcCanvas, 0, 0);

  return destinationCanvas.toDataURL();
};
