import { colorDepth, getRGBFromPercentage, RGBValue } from './rgb.js';
import { mandelbrot, perf } from './utils.js';

const resolution = 256;

function initGrid(container: HTMLElement) {
  const grid = document.getElementById('grid') as HTMLCanvasElement;
  const ctx = grid.getContext('2d') as CanvasRenderingContext2D;
  const gridLength = container.clientWidth;
  grid.setAttribute('width', `${resolution}`);
  grid.setAttribute('height', `${resolution}`);
  const scale = gridLength / resolution;
  grid.setAttribute('style', `transform: translate(-50%, -50%) scale(${scale})`);

  const createImage = () => {
    const imgData = ctx.createImageData(resolution, resolution);

    return {
      data: imgData.data,
      setPixelAt: (i: number, [r,g,b]: RGBValue) => {
        imgData.data[i+0] = r;
        imgData.data[i+1] = g;
        imgData.data[i+2] = b;
        imgData.data[i+3] = 255;
      },
      paint: () => {
        ctx.putImageData(imgData, 0, 0);
      }
    }
  };

  return createImage;
}

function main() {
  const container = document.getElementById('container');
  const createImage = initGrid(container);

  const zoom = 2;

  const offset = { x: -.5 - zoom * .5, y: 0 - zoom * .5 };

  function generateGrid(zoom: number, offset: { x: number; y: number; }) {
    const { data, paint, setPixelAt } = createImage();
    for (let i = 0; i < data.length; i += 4) {
      const res = resolution * 4;
      const x = i % res;
      const y = Math.floor(i / res);
      
      const val = mandelbrot({ r: ((x / res) * zoom) + offset.x, i: ((y / resolution) * zoom) + offset.y });
      
      const rgb = getRGBFromPercentage(val / colorDepth);
      setPixelAt(i, rgb);
    }
  
    paint();
  }

  perf('generate-grid', () => generateGrid(zoom, offset));
}

window.onload = main;
