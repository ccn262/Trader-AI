import { NextResponse } from "next/server";

import { isValidAdminSecret } from "@/lib/scanning/auth";
import { runScan, type ScanType } from "@/lib/scanning/run-scan";

export const dynamic = "force-dynamic";

function isValidScanType(value: unknown): value is ScanType {
  return value === "morning" || value === "evening" || value === "manual";
}

export async function POST(request: Request) {
  if (!isValidAdminSecret(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let body: { scanType?: unknown } = {};

  try {
    body = (await request.json()) as { scanType?: unknown };
  } catch {
    body = {};
  }

  const scanType = body.scanType ?? "manual";
  if (!isValidScanType(scanType)) {
    return NextResponse.json(
      { error: "Invalid scanType. Use morning, evening, or manual." },
      { status: 400 },
    );
  }

  const summary = await runScan({
    scanType,
    triggerSource: "manual",
  });

  return NextResponse.json(summary, {
    status: summary.completedSuccessfully ? 200 : 500,
    headers: {
      "Cache-Control": "no-store",
    },
  });
}

export function GET() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
