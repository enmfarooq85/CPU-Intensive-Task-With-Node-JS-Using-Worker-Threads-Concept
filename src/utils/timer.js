import { performance } from "node:perf_hooks";

export class Timer {
  constructor() {
    this.startTime = 0;
    this.endTime = 0;
    this.cpuStart = null;
    this.cpuEnd = null;
    this.executionTime = 0;
  }

  start() {
    this.startTime = performance.now();
    this.cpuStart = process.cpuUsage();
  }

  stop() {
    this.endTime = performance.now();
    this.cpuEnd = process.cpuUsage(this.cpuStart);
    this.executionTime = this.endTime - this.startTime;
  }

  report({ width, height, iterations, workers = 1 }) {
    const elapsedMs = this.endTime - this.startTime;
    const elapsedSeconds = elapsedMs / 1000;

    const memory = process.memoryUsage();
    const totalPixels = width * height;

    console.log("\n==============================");
    console.log(" Mandelbrot Benchmark");
    console.log("==============================");

    console.log(`Workers           : ${workers}`);
    console.log(`Resolution        : ${width} x ${height}`);
    console.log(`Iterations        : ${iterations}`);

    console.log(`Execution Time    : ${elapsedMs.toFixed(2)} ms`);
    console.log(
      `CPU User          : ${(this.cpuEnd.user / 1000).toFixed(2)} ms`,
    );
    console.log(
      `CPU System        : ${(this.cpuEnd.system / 1000).toFixed(2)} ms`,
    );

    console.log(
      `RSS Memory        : ${(memory.rss / 1024 / 1024).toFixed(2)} MB`,
    );
    console.log(
      `Heap Used         : ${(memory.heapUsed / 1024 / 1024).toFixed(2)} MB`,
    );

    console.log(
      `Pixels/sec        : ${Math.round(totalPixels / elapsedSeconds).toLocaleString()}`,
    );

    console.log("==============================\n");
  }
}
