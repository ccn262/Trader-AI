import type { RnsRawAnnouncementInput, RnsIngestionResult } from "./rns";
import { ingestRnsAnnouncements } from "./rns";
import { isMockEvidenceUrl, isValidExternalEvidenceUrl } from "@/lib/evidence-links";
import type {
  AnnouncementFetchOptions,
  AnnouncementSourceAdapter,
  FetchAnnouncementsResult,
  FetchedAnnouncement,
} from "./source-adapters/types";

export type AnnouncementIngestionSummary = RnsIngestionResult & {
  fetched: number;
  validExternalUrls: number;
  rejectedMockOrInvalidUrls: number;
  failed: number;
  sourceName: string;
  sourceMode: FetchAnnouncementsResult["sourceMode"];
  note: string;
};

function toRnsInput(announcement: FetchedAnnouncement): RnsRawAnnouncementInput {
  return {
    externalId: announcement.externalId ?? null,
    assetSymbol: announcement.assetSymbol ?? null,
    companyName: announcement.companyName ?? null,
    headline: announcement.headline,
    rawCategory: announcement.rawCategory ?? null,
    sourceUrl: announcement.sourceUrl ?? null,
    publishedAt: announcement.publishedAt ?? null,
    rawPayload: announcement.rawPayload ?? null,
  };
}

export async function ingestAnnouncementsFromAdapter(
  adapter: AnnouncementSourceAdapter,
  options?: AnnouncementFetchOptions,
): Promise<AnnouncementIngestionSummary> {
  const fetchResult = await adapter.fetchLatest(options);

  if (fetchResult.notConfigured) {
    return {
      insertedRawAnnouncements: 0,
      insertedIntelligenceItems: 0,
      duplicatesSkipped: 0,
      failures: [],
      fetched: fetchResult.fetched,
      validExternalUrls: 0,
      rejectedMockOrInvalidUrls: 0,
      failed: 0,
      sourceName: fetchResult.sourceName,
      sourceMode: fetchResult.sourceMode,
      note: fetchResult.note,
    };
  }

  const isRealSource = fetchResult.sourceMode === "real";
  let validExternalUrls = 0;
  let rejectedMockOrInvalidUrls = 0;

  const normalizedAnnouncements = fetchResult.announcements
    .map((announcement) => {
      const validation = adapter.validateAnnouncement(announcement);
      if (!validation.ok) {
        if (isRealSource) {
          rejectedMockOrInvalidUrls += 1;
        }
        return null;
      }

      const normalized = adapter.normaliseAnnouncement(announcement);
      if (!normalized) {
        if (isRealSource) {
          rejectedMockOrInvalidUrls += 1;
        }
        return null;
      }

      const sourceUrl = normalized.sourceUrl ?? null;
      const externalUrlValid = isValidExternalEvidenceUrl(sourceUrl);
      const mockUrl = isMockEvidenceUrl(sourceUrl);

      if (isRealSource) {
        if (!externalUrlValid || mockUrl) {
          rejectedMockOrInvalidUrls += 1;
          return null;
        }

        validExternalUrls += 1;
      }

      return normalized;
    })
    .filter((announcement): announcement is FetchedAnnouncement => announcement !== null);

  const result = await ingestRnsAnnouncements(
    normalizedAnnouncements.map(toRnsInput),
    {
      scanRunId: options?.scanRunId ?? null,
    },
  );

  return {
    ...result,
    fetched: fetchResult.fetched ?? normalizedAnnouncements.length,
    validExternalUrls,
    rejectedMockOrInvalidUrls,
    failed: result.failures.length,
    sourceName: fetchResult.sourceName,
    sourceMode: fetchResult.sourceMode,
    note: fetchResult.note,
  };
}
