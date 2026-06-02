import { resolve } from "node:path";

import dotenv from "dotenv";

import { createMockRnsAdapter } from "../src/lib/ingestion/source-adapters/mock-rns-adapter.ts";
import { ingestAnnouncementsFromAdapter } from "../src/lib/ingestion/announcement-ingestion-service.ts";

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

const url =
  process.env.SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_URL ??
  process.env.NEXT_PUBLIC_SUPABASE_PROJECT_URL ??
  null;

const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

async function main() {
  if (!url || !key) {
    const missing = [];

    if (!url) {
      missing.push("SUPABASE_URL");
    }

    if (!key) {
      missing.push("SUPABASE_SERVICE_ROLE_KEY");
    }

    console.error("Missing required Supabase environment variables for mock RNS ingestion.");
    console.error(`Checked project root .env.local at ${resolve(process.cwd(), ".env.local")}.`);
    console.error(`Still missing: ${missing.join(", ")}.`);
    console.error(
      "Add the missing values to .env.local or export them in the shell before running `npm run ingest:rns:mock`.",
    );
    return 1;
  }

  const result = await ingestAnnouncementsFromAdapter(createMockRnsAdapter(), {
    scanRunId: "1b7f5fb7-8e69-4ccd-a8e7-9d0242052601",
    triggerSource: "dev_script",
    sourceMode: "mock",
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

  if (result.failures.length) {
    return 1;
  }

  return 0;
}

const exitCode = await main();
process.exitCode = exitCode;
