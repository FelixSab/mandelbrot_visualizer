import { colorDepth, getRGBFromPercentage, RGBValue } from './rgb.js';
import { mandelbrot, perf } from './utils.js';
import { resolution } from './config.js';
import { getComplex, initialCanvas, Canvas, zoomOnPosition } from './canvas.js';

function initGrid(container: HTMLElement) {
  const grid = document.getElementById('grid') as HTMLCanvasElement;
  const ctx = grid.getContext('2d') as CanvasRenderingContext2D;
  const gridLength = container.clientWidth;
  grid.setAttribute('width', `${resolution}`);
  grid.setAttribute('height', `${resolution}`);
  const scale = gridLength / resolution;
  grid.setAttribute('style', `transform: translate(-50%, -50%) scale(${scale})`);

  return (callback: (xIndex: number, yIndex: number) => RGBValue) => {
    const imgData = ctx.createImageData(resolution, resolution);
    for (let i = 0; i < imgData.data.length; i += 4) {
      const x = (i % (resolution * 4)) / 4;
      const y  = (Math.floor(i / (resolution * 4)));
      const [r, g, b] = callback(x, y);

      imgData.data[i+0] = r;
      imgData.data[i+1] = g;
      imgData.data[i+2] = b;
      imgData.data[i+3] = 255;
    }

    ctx.clearRect(0, 0, grid.width, grid.height);
    ctx.putImageData(imgData, 0, 0);
  };
};

function main() {
  const container = document.getElementById('container');
  const generateImage = initGrid(container);

  function generateGrid(canvas: Canvas) {
    generateImage((x, y) => {
      const coord = getComplex(canvas, x, y);
      const val = mandelbrot(coord);
      return getRGBFromPercentage(val / colorDepth);
    });
  }

  container.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    
    const canvas = zoomOnPosition(2, initialCanvas, e.offsetX, e.offsetY, container);
    generateGrid(canvas);
  });

  container.addEventListener('click', ({ offsetX, offsetY }) => {
    const canvas = zoomOnPosition(.5, initialCanvas, offsetX, offsetY, container);
    generateGrid(canvas);
  });

  perf('generate-grid', () => generateGrid(initialCanvas));
}

window.onload = main;
