import type {
  AnnouncementSourceAdapter,
  FetchAnnouncementsResult,
  FetchedAnnouncement,
} from "./types";
import { isMockEvidenceUrl, isValidExternalEvidenceUrl } from "@/lib/evidence-links";

const DEFAULT_SOURCE_NAME = "London Stock Exchange RNS";
const DEFAULT_FETCH_LIMIT = 5;
const MAX_FETCH_LIMIT = 5;

function normalizeString(value?: string | null) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

function getConfiguredMode() {
  return normalizeString(process.env.RNS_SOURCE_MODE)?.toLowerCase() ?? "mock";
}

function isRealFetchEnabled() {
  return normalizeString(process.env.RNS_REAL_FETCH_ENABLED)?.toLowerCase() === "true";
}

function clampFetchLimit(value?: number | null) {
  if (value == null || Number.isNaN(value)) {
    return DEFAULT_FETCH_LIMIT;
  }

  const limited = Math.floor(value);
  if (limited < 1) {
    return 1;
  }

  return Math.min(limited, MAX_FETCH_LIMIT);
}

function getFetchLimit(optionsLimit?: number | null) {
  const envLimit = process.env.RNS_REAL_FETCH_LIMIT;
  const parsedEnvLimit = envLimit == null ? null : Number(envLimit);
  return clampFetchLimit(optionsLimit ?? parsedEnvLimit ?? DEFAULT_FETCH_LIMIT);
}

function stripHtml(text: string) {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function headlineFromUrl(url: string) {
  try {
    const parsed = new URL(url);
    const pathParts = parsed.pathname.split("/").filter(Boolean);
    const lastPart = pathParts[pathParts.length - 1] ?? parsed.hostname;
    return lastPart
      .replace(/[-_]+/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  } catch {
    return "Real RNS announcement";
  }
}

function extractRssItems(xml: string, baseUrl: string, limit: number) {
  const items: FetchedAnnouncement[] = [];
  const rejectedMockOrInvalidUrls: string[] = [];
  const itemRegex = /<item[\s\S]*?<\/item>/gi;
  const titleRegex = /<title[^>]*>([\s\S]*?)<\/title>/i;
  const linkRegex = /<link[^>]*>([\s\S]*?)<\/link>/i;

  for (const itemMatch of xml.matchAll(itemRegex)) {
    if (items.length >= limit) break;

    const item = itemMatch[0];
    const title = stripHtml((item.match(titleRegex)?.[1] ?? "").trim());
    const link = stripHtml((item.match(linkRegex)?.[1] ?? "").trim());

    if (!link) {
      continue;
    }

    let resolvedUrl: string | null = null;
    try {
      resolvedUrl = new URL(link, baseUrl).toString();
    } catch {
      rejectedMockOrInvalidUrls.push(link);
      continue;
    }

    if (!isValidExternalEvidenceUrl(resolvedUrl) || isMockEvidenceUrl(resolvedUrl)) {
      rejectedMockOrInvalidUrls.push(resolvedUrl);
      continue;
    }

    items.push({
      headline: title || headlineFromUrl(resolvedUrl),
      sourceUrl: resolvedUrl,
      rawPayload: {
        sourceMode: "real",
        parser: "rss",
        sourcePageUrl: baseUrl,
      },
    });
  }

  return { announcements: items, rejectedMockOrInvalidUrls };
}

function extractAnchorItems(html: string, baseUrl: string, limit: number) {
  const items: FetchedAnnouncement[] = [];
  const rejectedMockOrInvalidUrls: string[] = [];
  const anchorRegex = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;

  for (const anchorMatch of html.matchAll(anchorRegex)) {
    if (items.length >= limit) break;

    const href = anchorMatch[1];
    const anchorText = stripHtml(anchorMatch[2] ?? "");

    let resolvedUrl: string | null = null;
    try {
      resolvedUrl = new URL(href, baseUrl).toString();
    } catch {
      rejectedMockOrInvalidUrls.push(href);
      continue;
    }

    if (!isValidExternalEvidenceUrl(resolvedUrl) || isMockEvidenceUrl(resolvedUrl)) {
      rejectedMockOrInvalidUrls.push(resolvedUrl);
      continue;
    }

    items.push({
      headline: anchorText || headlineFromUrl(resolvedUrl),
      sourceUrl: resolvedUrl,
      rawPayload: {
        sourceMode: "real",
        parser: "html-anchor",
        sourcePageUrl: baseUrl,
      },
    });
  }

  return { announcements: items, rejectedMockOrInvalidUrls };
}

function extractCandidateAnnouncements(content: string, baseUrl: string, limit: number) {
  if (content.includes("<item") && content.includes("<link")) {
    return extractRssItems(content, baseUrl, limit);
  }

  return extractAnchorItems(content, baseUrl, limit);
}

async function fetchContent(baseUrl: string) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(baseUrl, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "application/rss+xml,application/xml,text/html,application/xhtml+xml",
      },
      signal: controller.signal,
    });

    const body = await response.text();

    return {
      ok: response.ok,
      status: response.status,
      statusText: response.statusText,
      body,
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      statusText: error instanceof Error ? error.message : "Unknown connectivity failure",
      body: "",
    };
  } finally {
    clearTimeout(timeout);
  }
}

export function createLseRnsAdapter(): AnnouncementSourceAdapter {
  return {
    sourceName: DEFAULT_SOURCE_NAME,
    sourceType: "rns",
    async fetchLatest(options): Promise<FetchAnnouncementsResult> {
      const configuredMode = getConfiguredMode();
      const baseUrl = normalizeString(process.env.RNS_SOURCE_BASE_URL);

      if (configuredMode !== "real" || !baseUrl || !isRealFetchEnabled()) {
        return {
          sourceName: DEFAULT_SOURCE_NAME,
          sourceType: "rns",
          sourceMode: "unavailable",
          fetched: 0,
          announcements: [],
          notConfigured: true,
          note:
            "Real RNS source not configured. Set RNS_SOURCE_MODE=real, RNS_REAL_FETCH_ENABLED=true, and RNS_SOURCE_BASE_URL before manual validation.",
        };
      }

      const fetchLimit = getFetchLimit(options?.limit ?? null);
      const response = await fetchContent(baseUrl);
      if (!response.ok) {
        return {
          sourceName: DEFAULT_SOURCE_NAME,
          sourceType: "rns",
          sourceMode: "real",
          fetched: 0,
          announcements: [],
          note:
            `Real RNS source fetch skeleton could not validate ${baseUrl}. Parsing is intentionally disabled until the source is validated. (${response.statusText || response.status})`,
        };
      }

      const extracted = extractCandidateAnnouncements(response.body, baseUrl, fetchLimit);

      return {
        sourceName: DEFAULT_SOURCE_NAME,
        sourceType: "rns",
        sourceMode: "real",
        fetched: extracted.announcements.length,
        announcements: extracted.announcements,
        note: extracted.announcements.length
          ? `Real RNS source validation path active. Parsed ${extracted.announcements.length} candidate announcement(s) from a manually validated source.`
          : `Real RNS source connectivity validated, but no valid announcement links were extracted from ${baseUrl}. Parsing remains conservative until the source format is validated.`,
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
