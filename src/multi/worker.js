import { parentPort, workerData } from "node:worker_threads";
import { mandelbrot } from "../single/mandelbrot.js";

const {
    width,
    height,
    startRow,
    endRow,
    maxIterations,
} = workerData;

const pixels = new Uint8ClampedArray(
    (endRow - startRow) * width * 4
);

const minX = -2.5;
const maxX = 1.0;

const minY = -1.5;
const maxY = 1.5;

const dx = (maxX - minX) / width;
const dy = (maxY - minY) / height;

let offset = 0;

for (let y = startRow; y < endRow; y++) {

    const cy = minY + y * dy;

    for (let x = 0; x < width; x++) {

        const cx = minX + x * dx;

        const iterations = mandelbrot(
            cx,
            cy,
            maxIterations
        );

        if (iterations === maxIterations) {

            pixels[offset++] = 0;
            pixels[offset++] = 0;
            pixels[offset++] = 0;
            pixels[offset++] = 255;

        } else {

            const value = Math.floor(
                (255 * iterations) / maxIterations
            );

            pixels[offset++] = value;
            pixels[offset++] = value;
            pixels[offset++] = value;
            pixels[offset++] = 255;
        }
    }
}

parentPort.postMessage({
    startRow,
    pixels,
});