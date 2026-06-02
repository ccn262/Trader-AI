import type {
  AnnouncementFetchOptions,
  AnnouncementSourceAdapter,
  FetchAnnouncementsResult,
  FetchedAnnouncement,
} from "./types";

export const mockRnsAnnouncements: FetchedAnnouncement[] = [
  {
    externalId: "RNS-MOCK-20260605-RR-FINAL",
    assetSymbol: "RR.L",
    companyName: "Rolls-Royce Holdings plc",
    headline: "Final Results for the year ended 31 December 2025",
    rawCategory: "Results",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/RR./final-results/mock-001",
    publishedAt: "2026-06-05T07:05:00Z",
    rawPayload: {
      summary:
        "Official final results announcement with improved cash generation and stable guidance.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-ITM-TRADING",
    assetSymbol: "ITM.L",
    companyName: "ITM Power plc",
    headline: "Trading Update and revised full-year expectations",
    rawCategory: "Trading Update",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/ITM/trading-update/mock-002",
    publishedAt: "2026-06-05T07:12:00Z",
    rawPayload: {
      summary:
        "Official trading update noting slower conversion and revised near-term expectations.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-BARC-DD",
    assetSymbol: "BARC.L",
    companyName: "Barclays plc",
    headline: "Director/PDMR Shareholding",
    rawCategory: "Director Dealings",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/BARC/director-pdmr-shareholding/mock-003",
    publishedAt: "2026-06-05T07:18:00Z",
    rawPayload: {
      summary: "Official director dealing disclosure with a modest open-market purchase.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-SOLG-DRILL",
    assetSymbol: "SOLG",
    companyName: "SolGold plc",
    headline: "Cascabel drilling update reports additional mineralisation",
    rawCategory: "Exploration Update",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/SOLG/drilling-update/mock-004",
    publishedAt: "2026-06-05T07:25:00Z",
    rawPayload: {
      summary:
        "Official exploration update referencing additional mineralisation and follow-up work.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-AAL-PLACING",
    assetSymbol: "AAL.L",
    companyName: "Anglesey Mining plc",
    headline: "Placing and Subscription to support project funding",
    rawCategory: "Fundraising",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/AAL/placing-and-subscription/mock-005",
    publishedAt: "2026-06-05T07:31:00Z",
    rawPayload: {
      summary:
        "Official fundraising announcement highlighting dilution and ongoing funding needs.",
    },
  },
  {
    externalId: "RNS-MOCK-20260605-XYZ-GOINGCONCERN",
    assetSymbol: "XYZ.L",
    companyName: "Example Exploration plc",
    headline: "Going Concern Statement and financing uncertainty",
    rawCategory: "Risk Update",
    sourceUrl:
      "https://www.londonstockexchange.com/news-article/XYZ/going-concern/mock-006",
    publishedAt: "2026-06-05T07:40:00Z",
    rawPayload: {
      summary:
        "Official announcement highlighting going-concern language and financing uncertainty.",
    },
  },
];

function cloneAnnouncements() {
  return mockRnsAnnouncements.map((announcement) => ({
    ...announcement,
    rawPayload: announcement.rawPayload ? { ...announcement.rawPayload } : null,
  }));
}

function normalizeString(value?: string | null) {
  const trimmed = value?.trim() ?? "";
  return trimmed.length ? trimmed : null;
}

function getLimitedAnnouncements(
  announcements: FetchedAnnouncement[],
  options?: AnnouncementFetchOptions,
) {
  if (!options?.since && !options?.limit) {
    return announcements;
  }

  let result = announcements;

  if (options.since) {
    const since = new Date(options.since).getTime();
    if (!Number.isNaN(since)) {
      result = result.filter((announcement) => {
        if (!announcement.publishedAt) {
          return true;
        }

        const publishedAt = new Date(announcement.publishedAt).getTime();
        return Number.isNaN(publishedAt) ? true : publishedAt >= since;
      });
    }
  }

  if (typeof options.limit === "number" && options.limit >= 0) {
    result = result.slice(0, options.limit);
  }

  return result;
}

export function createMockRnsAdapter(): AnnouncementSourceAdapter {
  return {
    sourceName: "London Stock Exchange RNS (mock/demo)",
    sourceType: "rns",
    async fetchLatest(options?: AnnouncementFetchOptions): Promise<FetchAnnouncementsResult> {
      const announcements = getLimitedAnnouncements(cloneAnnouncements(), options);

      return {
        sourceName: "London Stock Exchange RNS (mock/demo)",
        sourceType: "rns",
        sourceMode: "mock",
        fetched: announcements.length,
        announcements,
        note:
          "Mock/demo source active. No real external RNS feed was requested.",
      };
    },
    normaliseAnnouncement(raw: unknown) {
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
