import utils from './utils';

const [SIZE_STRETCH, SIZE_LIMIT, SIZE_CUT] = ['stretch', 'limit', 'cut'];
const [X_LEFT, X_CENTER, X_RIGHT] = ['left', 'center', 'right'];
const [Y_TOP, Y_MIDDLE, Y_BOTTOM] = ['top', 'middle', 'bottom'];

export function compressImage(obj, options) {
  let img;

  if (utils.isType(obj, 'File')) {
    img = document.createElement('img');
    img.src = URL.createObjectURL(obj);
  }

  options = options || {};
  options.eWidth = options.eWidth || 300;
  options.eHeight = options.eHeight || 300;
  options.size = options.size || SIZE_STRETCH;
  options.position = options.position || { x: X_LEFT, y: Y_TOP };

  return new Promise((resolve, reject) => {
    img.onload = () => {
      let { width, height, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight } = getDrawOptions(img, options);
      let canvas = document.createElement('canvas');
      let ctx = canvas.getContext('2d');

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight);

      canvas.toBlob(resolve);
    };

    img.src = URL.createObjectURL(obj);
  });
}

function getDrawOptions(img, options) {
  let drawOptions = {};
  let imgWidth = img.width;
  let imgHeight = img.height;

  if (options.size === SIZE_LIMIT) {
    if (options.eWidth / options.eHeight > imgWidth / imgHeight) {
      drawOptions.height = options.eHeight;
      drawOptions.width = imgWidth / imgHeight * drawOptions.height;
    } else {
      drawOptions.width = options.eWidth;
      drawOptions.height = imgHeight / imgWidth * drawOptions.width;
    }

    drawOptions.sx = 0;
    drawOptions.sy = 0;
    drawOptions.sWidth = imgWidth;
    drawOptions.sHeight = imgHeight;
  } else if (options.size === SIZE_CUT) {
    drawOptions.width = options.eWidth;
    drawOptions.height = options.eHeight;

    if (options.eWidth / options.eHeight > imgWidth / imgHeight) {
      let cutedImgHeight = options.eHeight / options.eWidth * imgWidth;

      drawOptions.sx = 0;
      drawOptions.sWidth = imgWidth;
      drawOptions.sHeight = cutedImgHeight;

      if (options.position.y === Y_MIDDLE) {
        let cutHeight = Math.floor((imgHeight - cutedImgHeight) / 2);

        drawOptions.sy = cutHeight;
      } else if (options.position.y === Y_BOTTOM) {
        let cutHeight = imgHeight - cutedImgHeight;

        drawOptions.sy = cutHeight;
      } else {
        drawOptions.sy = 0;
      }
    } else {
      let cutedImgWidth = options.eWidth / options.eHeight * imgHeight;

      drawOptions.sy = 0;
      drawOptions.sWidth = cutedImgWidth;
      drawOptions.sHeight = imgHeight;

      if (options.position.x === X_CENTER) {
        let cutWidth = Math.floor((imgWidth - cutedImgWidth) / 2);

        drawOptions.sx = cutWidth;
      } else if (options.position.x === X_RIGHT) {
        let cutWidth = imgWidth - cutedImgWidth;

        drawOptions.sx = cutWidth;
      } else {
        drawOptions.sx = 0;
      }
    }
  } else {
    drawOptions.width = options.eWidth;
    drawOptions.height = options.eHeight;
    drawOptions.sx = 0;
    drawOptions.sy = 0;
    drawOptions.sWidth = imgWidth;
    drawOptions.sHeight = imgHeight;
  }

  drawOptions.dx = 0;
  drawOptions.dy = 0;
  drawOptions.dWidth = drawOptions.width;
  drawOptions.dHeight = drawOptions.height;

  return drawOptions;
}