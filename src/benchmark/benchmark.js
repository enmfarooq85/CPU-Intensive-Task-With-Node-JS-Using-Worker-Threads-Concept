import { execSync } from "node:child_process";

const workerCounts = [1, 2, 4, 8];

const workerResults = [];

for (const count of workerCounts) {
  console.log(`Running ${count} worker(s)...`);

  const output = execSync(`node src/multi/index.js ${count}`, {
    encoding: "utf8",
  });

  const line = output
    .split("\n")
    .find((line) => line.startsWith("BENCHMARK_RESULT:"));

  const result = JSON.parse(line.replace("BENCHMARK_RESULT:", ""));

  workerResults.push(result);
}

const singleThreadTime = workerResults[0].time;

console.log("\nBenchmark Summary\n");

console.table(
  workerResults.map((result) => ({
    Workers: result.workers,

    "Time (ms)": result.time.toFixed(2),

    Speedup: (singleThreadTime / result.time).toFixed(2) + "x",

    Efficiency:
      ((singleThreadTime / result.time / result.workers) * 100).toFixed(1) +
      "%",
  })),
);
