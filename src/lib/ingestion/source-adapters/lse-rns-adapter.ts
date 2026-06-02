import type {
  AnnouncementSourceAdapter,
  FetchAnnouncementsResult,
  FetchedAnnouncement,
} from "./types";

const DEFAULT_SOURCE_NAME = "London Stock Exchange RNS";

function normalizeString(value?: string | null) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

function getConfiguredMode() {
  return normalizeString(process.env.RNS_SOURCE_MODE)?.toLowerCase() ?? "mock";
}

async function validateConnectivity(baseUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(baseUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: error instanceof Error ? error.message : "Unknown connectivity failure",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function createLseRnsAdapter(): AnnouncementSourceAdapter {
  return {
    sourceName: DEFAULT_SOURCE_NAME,
    sourceType: "rns",
    async fetchLatest(): Promise<FetchAnnouncementsResult> {
      const configuredMode = getConfiguredMode();
      const baseUrl = normalizeString(process.env.RNS_SOURCE_BASE_URL);

      if (configuredMode !== "real" || !baseUrl) {
        return {
          sourceName: DEFAULT_SOURCE_NAME,
          sourceType: "rns",
          sourceMode: "unavailable",
          fetched: 0,
          announcements: [],
          notConfigured: true,
          note:
            "Real RNS source not configured. Set RNS_SOURCE_MODE=real and RNS_SOURCE_BASE_URL before manual validation.",
        };
      }

      const connectivity = await validateConnectivity(baseUrl);
      if (!connectivity.ok) {
        return {
          sourceName: DEFAULT_SOURCE_NAME,
          sourceType: "rns",
          sourceMode: "real",
          fetched: 0,
          announcements: [],
          note:
            `Real RNS source fetch skeleton could not validate ${baseUrl}. Parsing is intentionally disabled until the source is validated. (${connectivity.statusText || connectivity.status})`,
        };
      }

      return {
        sourceName: DEFAULT_SOURCE_NAME,
        sourceType: "rns",
        sourceMode: "real",
        fetched: 0,
        announcements: [],
        note:
          "Real RNS source connectivity validated. Parsing and unattended ingestion remain disabled until source behaviour is confirmed.",
      };
    },
    normaliseAnnouncement(raw: unknown): FetchedAnnouncement | null {
      if (!raw || typeof raw !== "object") {
        return null;
      }

      const candidate = raw as Partial<FetchedAnnouncement>;
      const headline = normalizeString(candidate.headline);
      if (!headline) {
        return null;
      }

      return {
        externalId: normalizeString(candidate.externalId),
        assetSymbol: normalizeString(candidate.assetSymbol),
        companyName: normalizeString(candidate.companyName),
        headline,
        rawCategory: normalizeString(candidate.rawCategory),
        sourceUrl: normalizeString(candidate.sourceUrl),
        publishedAt: normalizeString(candidate.publishedAt),
        rawPayload:
          candidate.rawPayload && typeof candidate.rawPayload === "object"
            ? { ...candidate.rawPayload }
            : null,
      };
    },
    validateAnnouncement(raw: unknown) {
      if (!raw || typeof raw !== "object") {
        return { ok: false, reason: "Expected an announcement object." };
      }

      const candidate = raw as Partial<FetchedAnnouncement>;
      if (!normalizeString(candidate.headline)) {
        return { ok: false, reason: "Headline is required." };
      }

      return { ok: true };
    },
  };
}
