import type { NextRequest } from "next/server";

function getExpectedAdminSecret() {
  return process.env.TRADER_AI_ADMIN_SECRET ?? null;
}

function getExpectedCronSecrets() {
  return [process.env.CRON_SECRET, process.env.TRADER_AI_ADMIN_SECRET].filter(
    (value): value is string => Boolean(value),
  );
}

export function isValidAdminSecret(request: NextRequest | Request) {
  const expected = getExpectedAdminSecret();
  if (!expected) {
    return false;
  }

  const provided = request.headers.get("x-trader-ai-admin-secret");
  return provided === expected;
}

export function isValidCronSecret(request: NextRequest | Request) {
  const provided = request.headers.get("authorization");
  if (!provided) {
    return false;
  }

  return getExpectedCronSecrets().some((secret) => provided === `Bearer ${secret}`);
}
