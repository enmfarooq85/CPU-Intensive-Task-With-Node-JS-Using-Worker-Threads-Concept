import { writePNG } from "../utils/pngwriter.js";
import { mandelbrot } from "./mandelbrot.js";
import { Timer } from "../utils/timer.js";

const width = 3000;
const height = 2000;
const maxIterations = 2000;

const pixels = new Uint8ClampedArray(width * height * 4);

setInterval(() => {
  console.log(`[Heartbeat] ${new Date().toLocaleTimeString()}`);
}, 1000);

const timer = new Timer();

// Start benchmark BEFORE CPU work
timer.start();

for (let y = 0; y < height; y++) {
  for (let x = 0; x < width; x++) {
    const cx = -2.5 + (x / width) * 3.5;
    const cy = -1.5 + (y / height) * 3;

    const iterations = mandelbrot(cx, cy, maxIterations);
    const index = (y * width + x) * 4;

    if (iterations === maxIterations) {
      pixels[index] = 0;
      pixels[index + 1] = 0;
      pixels[index + 2] = 0;
      pixels[index + 3] = 255;
    } else {
      const value = Math.floor((255 * iterations) / maxIterations);

      pixels[index] = value;
      pixels[index + 1] = value;
      pixels[index + 2] = value;
      pixels[index + 3] = 255;
    }
  }
}

writePNG("./output/single.png", width, height, pixels);

timer.stop();

timer.report({
  width,
  height,
  iterations: maxIterations,
  workers: 1,
});

console.log("Finished");
