import { resolve } from "node:path";

import dotenv from "dotenv";

import { createLseRnsAdapter } from "../src/lib/ingestion/source-adapters/lse-rns-adapter.ts";
import { ingestAnnouncementsFromAdapter } from "../src/lib/ingestion/announcement-ingestion-service.ts";

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

async function main() {
  const sourceMode = (process.env.RNS_SOURCE_MODE ?? "mock").toLowerCase();
  const realFetchEnabled = (process.env.RNS_REAL_FETCH_ENABLED ?? "").toLowerCase() === "true";

  if (sourceMode !== "real" || !realFetchEnabled) {
    console.log(
      JSON.stringify(
        {
          sourceName: "London Stock Exchange RNS",
          sourceMode: "unavailable",
          note:
            "Real RNS validation is disabled. Set RNS_SOURCE_MODE=real and RNS_REAL_FETCH_ENABLED=true to run a controlled manual fetch.",
          fetched: 0,
          validExternalUrls: 0,
          rejectedMockOrInvalidUrls: 0,
          insertedRawAnnouncements: 0,
          insertedIntelligenceItems: 0,
          duplicatesSkipped: 0,
          failed: 0,
        },
        null,
        2,
      ),
    );
    return 0;
  }

  const adapter = createLseRnsAdapter();
  const result = await ingestAnnouncementsFromAdapter(adapter, {
    scanRunId: "1b7f5fb7-8e69-4ccd-a8e7-9d0242052601",
    triggerSource: "dev_script",
    sourceMode: "real",
    limit: 5,
  });

  console.log(
    JSON.stringify(
      {
        sourceName: result.sourceName,
        sourceMode: result.sourceMode,
        note: result.note,
        fetched: result.fetched,
        validExternalUrls: result.validExternalUrls,
        rejectedMockOrInvalidUrls: result.rejectedMockOrInvalidUrls,
        insertedRawAnnouncements: result.insertedRawAnnouncements,
        insertedIntelligenceItems: result.insertedIntelligenceItems,
        duplicatesSkipped: result.duplicatesSkipped,
        failed: result.failed,
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

  if (result.validExternalUrls === 0) {
    return 1;
  }

  return result.failed ? 1 : 0;
}

const exitCode = await main();
process.exitCode = exitCode;
