import { colorDepth } from './rgb';

export function perf<T>(name: string, fn: (timeStamp: () => void) => T) {
  console.time(name);
  const erg = fn(() => console.timeLog(name));
  console.timeEnd(name);
  return erg;
}

export type Complex = { r: number, i: number }

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

export function mandelbrot(t: Complex) {
  let curr = { r: 0, i: 0 };
  let depth = 0;
  for (; depth < colorDepth; depth++) {
    if (curr.r >= 2 || curr.r <= -2) break;
    curr = add(square(curr), t);
  }

  return depth;
}
