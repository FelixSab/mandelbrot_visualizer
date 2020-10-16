
export type RGBValue = [r: number, g: number, b: number];

const violett: RGBValue = [255, 0, 255];
const blue: RGBValue = [0, 0, 255];
const türkis: RGBValue = [0, 255, 255];
const grün: RGBValue = [0, 255, 0];
const gelb: RGBValue = [255, 255, 0];
const rot: RGBValue = [255, 0, 0];

export const colors = [
  violett,
  blue,
  türkis,
  grün,
  gelb,
  rot
];

export const rgbdiff = 255 * 5;
export const colorDepth = Math.floor(rgbdiff / 10);

export function getRGBFromPercentage(percentage: number): RGBValue {
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
