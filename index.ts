
function times(times: number, fn: (time: number) => void) {
  for (let i = 0; i < times; i++) {
    fn(i);
  }
}

const grid = document.getElementById('grid');

const resolution = 150;

grid.setAttribute('style', `
  grid-template-columns: repeat(${resolution}, 1fr);
  grid-template-rows: repeat(${resolution}, 1fr);
`);

times(resolution * resolution, () => grid.appendChild(document.createElement('div')));

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
    if (depth === rgbdiff) return depth;
    return fn(depth + 1, c, add(square(curr), c));
  }

  const erg = fn(0, t);
  return erg;
}

const children = grid.children;
times(children.length, (i) => {
  const child = children[i];
  const x = i % resolution;
  const y = Math.floor(i / resolution);

  const val = mandelbrot({ r: ((x / resolution) * 2) - 1.5, i: ((y / resolution) * 2) - 1 });

  const [r, g, b] = getRGBFromPercentage(val / rgbdiff);
  const color = `rgb(${r}, ${g}, ${b})`;
  child.setAttribute('style', `background-color: ${color}`);
});
