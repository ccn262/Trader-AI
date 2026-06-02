import { resolve } from "node:path";

import dotenv from "dotenv";

import { createLseRnsAdapter } from "../src/lib/ingestion/source-adapters/lse-rns-adapter.ts";
import { ingestAnnouncementsFromAdapter } from "../src/lib/ingestion/announcement-ingestion-service.ts";

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

async function main() {
  const adapter = createLseRnsAdapter();
  const result = await ingestAnnouncementsFromAdapter(adapter, {
    scanRunId: "1b7f5fb7-8e69-4ccd-a8e7-9d0242052601",
    triggerSource: "dev_script",
    sourceMode: "real",
  });

  console.log(
    JSON.stringify(
      {
        sourceName: result.sourceName,
        sourceMode: result.sourceMode,
        note: result.note,
        fetched: result.fetched,
        insertedRawAnnouncements: result.insertedRawAnnouncements,
        insertedIntelligenceItems: result.insertedIntelligenceItems,
        duplicatesSkipped: result.duplicatesSkipped,
        failures: result.failures.length,
      },
      null,
      2,
    ),
  );

  if (result.sourceMode === "unavailable" || result.note.includes("not configured")) {
    return 0;
  }

  if (result.note.includes("could not validate")) {
    return 1;
  }

  return result.failures.length ? 1 : 0;
}

const exitCode = await main();
process.exitCode = exitCode;
