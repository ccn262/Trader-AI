import { resolve } from "node:path";

import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

const scanType = (process.argv[2] ?? "manual").toLowerCase();

if (!["morning", "evening", "manual"].includes(scanType)) {
  console.error("Invalid scan type. Use morning, evening, or manual.");
  process.exit(1);
}

const { runScan } = await import("../src/lib/scanning/run-scan.ts");

const summary = await runScan({
  scanType,
  triggerSource: "dev_script",
});

console.log(JSON.stringify(summary, null, 2));

process.exitCode = summary.completedSuccessfully ? 0 : 1;
