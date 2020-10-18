import { resolution } from './config.js';
import { Complex } from './utils.js';

interface Canvas {
  topLeft: { r: number, i: number },
  length: number,
  step: number
}

export const initialCanvas = function(): Canvas {
  const topLeft = { r: -1.5, i: -1 };
  const length = 2;
  const step = length / resolution;

  return {
    topLeft,
    length,
    step
  };
}();

export function getComplex(canvas: Canvas, x: number, y: number): Complex {
  const xOffset = x * canvas.step;
  const yOffset = y * canvas.step;
  return { r: canvas.topLeft.r + xOffset, i: canvas.topLeft.i + yOffset };
}
