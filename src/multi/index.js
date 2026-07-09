import os from "node:os";
import path from "node:path";
import { Worker } from "node:worker_threads";

import { writePNG } from "../utils/pngwriter.js";
import { Timer } from "../utils/timer.js";

const width = 3000;
const height = 2000;
const maxIterations = 2000;

const maxWorkers = os.cpus().length;

const requestedWorkers = Number(process.argv[2]);

const workers =
  requestedWorkers > 0 ? Math.min(requestedWorkers, maxWorkers) : maxWorkers;

console.log(`Using ${workers} worker(s)`);

const rowsPerWorker = Math.ceil(height / workers);

const image = new Uint8ClampedArray(width * height * 4);

const timer = new Timer();

timer.start();

const promises = [];

for (let i = 0; i < workers; i++) {
  const startRow = i * rowsPerWorker;

  const endRow = Math.min(startRow + rowsPerWorker, height);

  const promise = new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve("src/multi/worker.js"), {
      workerData: {
        width,
        height,
        startRow,
        endRow,
        maxIterations,
      },
    });

    worker.on("message", resolve);

    worker.on("error", reject);
  });

  promises.push(promise);
}

const results = await Promise.all(promises);

for (const result of results) {
  const offset = result.startRow * width * 4;

  image.set(result.pixels, offset);
}

writePNG("./output/multi.png", width, height, image);

timer.stop();

timer.report({
  width,
  height,
  iterations: maxIterations,
  workers,
});

console.log(
  `BENCHMARK_RESULT:${JSON.stringify({
    workers,
    time: timer.executionTime,
  })}`,
);

console.log("Finished!");
