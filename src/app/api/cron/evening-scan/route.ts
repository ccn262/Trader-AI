import { NextResponse } from "next/server";

import { isValidCronSecret } from "@/lib/scanning/auth";
import { runScan } from "@/lib/scanning/run-scan";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  if (!isValidCronSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const summary = await runScan({
    scanType: "evening",
    triggerSource: "cron",
  });

  return NextResponse.json(summary, {
    status: summary.completedSuccessfully ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}
