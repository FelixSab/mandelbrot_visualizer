import { colorDepth, getRGBFromPercentage, RGBValue } from './rgb.js';
import { mandelbrot, perf } from './utils.js';

const resolution = 512;

function initGrid(container: HTMLElement) {
  const grid = document.getElementById('grid') as HTMLCanvasElement;
  const ctx = grid.getContext('2d') as CanvasRenderingContext2D;
  const gridLength = container.clientWidth;
  grid.setAttribute('width', `${resolution}`);
  grid.setAttribute('height', `${resolution}`);
  const scale = gridLength / resolution;
  grid.setAttribute('style', `transform: translate(-50%, -50%) scale(${scale})`);

  return (callback: (x: number, y: number) => RGBValue) => {
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

  const zoom = 2;
  const offset = { x: -.5 - zoom * .5, y: 0 - zoom * .5 };

  function generateGrid(zoom: number, offset: { x: number; y: number; }) {
    generateImage((x, y) => {
      const val = mandelbrot({ r: ((x / (resolution)) * zoom) + offset.x, i: ((y / (resolution)) * zoom) + offset.y });

      return getRGBFromPercentage(val / colorDepth);
    });
  }

  perf('generate-grid', () => generateGrid(zoom, offset));
}

window.onload = main;
