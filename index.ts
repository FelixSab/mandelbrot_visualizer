
function times(times: number, fn: (time: number) => void) {
  for (let i = 0; i < times; i++) {
    fn(i);
  }
}

function perf<T>(name: string, fn: (timeStamp: () => void) => T) {
  console.time(name);
  const erg = fn(() => console.timeLog(name));
  console.timeEnd(name);
  return erg;
}

const grid = document.getElementById('grid') as HTMLCanvasElement;

const resolution = 400;

const zoom = 2;

const offset = { x: -.5 - zoom * .5, y: 0 - zoom * .5 };

type RGBValue = [r: number, g: number, b: number];

const violett: RGBValue = [255, 0, 255];
const blue: RGBValue = [0, 0, 255];
const türkis: RGBValue = [0, 255, 255];
const grün: RGBValue = [0, 255, 0];
const gelb: RGBValue = [255, 255, 0];
const rot: RGBValue = [255, 0, 0];

const colors = [
  violett,
  blue,
  türkis,
  grün,
  gelb,
  rot
];

const rgbdiff = 255 * 5;
const colorDepth = Math.floor(rgbdiff / 10);

function getRGBFromPercentage(percentage: number): RGBValue {
  const stepsAmount = Math.floor(percentage * rgbdiff);
  const breakpointsHit = Math.floor(stepsAmount / 255);
  const stepsAfterBreakpoint = stepsAmount % 255;
  const [r, g, b] = colors[breakpointsHit];

  switch (breakpointsHit) {
    case 0: return [r - stepsAfterBreakpoint, g, b];
    case 1: return [r, g + stepsAfterBreakpoint, b];
    case 2: return [r, g, b - stepsAfterBreakpoint];
    case 3: return [r + stepsAfterBreakpoint, g, b];
    case 4: return [r, g - stepsAfterBreakpoint, b];
    case 5: return [r, g, b + stepsAfterBreakpoint];
  }
}

type Complex = { r: number, i: number }

function add(...cs: Complex[]) {
  return cs.reduce((prev, curr) => ({
    r: prev.r + curr.r,
    i: prev.i + curr.i
  }));
}

function square(c: Complex): Complex {
  const a2 = { r: c.r ** 2, i: 0 };
  const ab = { r: 0, i: c.r * c.i * 2 };
  const b2 = { r: c.i ** 2 * -1, i: 0 };
  
  return add(a2, ab, b2);
}

function mandelbrot(t: Complex) {
  const fn = (depth: number, c: Complex, curr = { r: 0, i: 0 }) => {
    if (curr.r >= 2 || curr.r <= -2) return depth;
    if (depth === colorDepth) return depth;
    return fn(depth + 1, c, add(square(curr), c));
  }

  return fn(0, t);
}

function generateGrid() {
  const ctx = grid.getContext('2d') as CanvasRenderingContext2D;
  console.log({ grid, ctx })
  const imgData = ctx.createImageData(resolution, resolution);
  for (let i = 0; i < imgData.data.length; i += 4) {
    const res = resolution * 4;
    const x = i % res;
    const y = Math.floor(i / res);
  
    const val = mandelbrot({ r: ((x / res) * zoom) + offset.x, i: ((y / resolution) * zoom) + offset.y });
  
    const [r, g, b] = getRGBFromPercentage(val / colorDepth);
    imgData.data[i+0] = r;
    imgData.data[i+1] = g;
    imgData.data[i+2] = b;
    imgData.data[i+3] = 255;
  }

  ctx.putImageData(imgData, 0, 0);
}

function main() {
  perf('generate-grid', generateGrid);
}

window.onload = main;
