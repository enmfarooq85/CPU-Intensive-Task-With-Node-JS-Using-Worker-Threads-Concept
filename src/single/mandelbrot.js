export function mandelbrot(cx, cy, maxIterations) {
  let zx = 0;
  let zy = 0;

  let iteration = 0;

  while (zx * zx + zy * zy <= 4 && iteration < maxIterations) {
    const temp = zx * zx - zy * zy + cx;

    zy = 2 * zx * zy + cy;

    zx = temp;

    iteration++;
  }

  return iteration;
}
