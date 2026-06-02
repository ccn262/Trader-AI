export type EvidenceLinkMode = "external" | "internal" | "unavailable";

type EvidenceLinkInput = {
  sourceUrl?: string | null;
  intelligenceItemId?: string | null;
};

const mockFragments = [
  "/mock-",
  "mock-",
  "example.com",
  "placeholder",
  "demo",
  "localhost",
  "test",
] as const;

export function isMockEvidenceUrl(url?: string | null) {
  if (!url) return false;

  const normalized = url.toLowerCase();
  return mockFragments.some((fragment) => normalized.includes(fragment));
}

export function isValidExternalEvidenceUrl(url?: string | null) {
  if (!url || isMockEvidenceUrl(url)) {
    return false;
  }

  try {
    const parsed = new URL(url);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

export function getEvidenceLinkMode({
  sourceUrl,
  intelligenceItemId,
}: EvidenceLinkInput): EvidenceLinkMode {
  if (isValidExternalEvidenceUrl(sourceUrl)) {
    return "external";
  }

  if (intelligenceItemId && (isMockEvidenceUrl(sourceUrl) || !sourceUrl)) {
    return "internal";
  }

  return "unavailable";
}
