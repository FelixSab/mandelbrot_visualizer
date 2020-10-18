import { resolution } from './config.js';
import { Complex } from './utils.js';

export interface Canvas {
  topLeft: { r: number, i: number },
  length: number,
  resolution: number
}

export const initialCanvas = function(): Canvas {
  const topLeft = { r: -1.5, i: -1 };
  const length = 2;

  return {
    topLeft,
    length,
    resolution
  };
}();

function getStep(canvas: Canvas) {
  return canvas.length / canvas.resolution;
}

export function getComplex(canvas: Canvas, x: number, y: number, el?: HTMLElement): Complex {
  const xOffset = x * getStep(canvas);
  const yOffset = y * getStep(canvas);
  return { r: canvas.topLeft.r + xOffset, i: canvas.topLeft.i + yOffset };
}

export function zoomOnPosition(zoom: number, canvas: Canvas, x: number, y: number, el: HTMLElement): Canvas {
  const scale =  canvas.resolution / el.clientWidth;
  const position = getComplex(canvas, x * scale, y * scale);
  const length = canvas.length * zoom;
  const offsetXPercentage = (position.r - canvas.topLeft.r) / canvas.length;
  const offsetYPercentage = (position.i - canvas.topLeft.i) / canvas.length;
  console.log({ offsetXPercentage, offsetYPercentage, length });
  return {
    length,
    topLeft: {
      r: position.r - (offsetXPercentage * length),
      i: position.i - (offsetYPercentage * length)
    },
    resolution
  };
}
