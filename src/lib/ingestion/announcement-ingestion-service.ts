import type { RnsRawAnnouncementInput, RnsIngestionResult } from "./rns";
import { ingestRnsAnnouncements } from "./rns";
import type {
  AnnouncementFetchOptions,
  AnnouncementSourceAdapter,
  FetchAnnouncementsResult,
  FetchedAnnouncement,
} from "./source-adapters/types";

export type AnnouncementIngestionSummary = RnsIngestionResult & {
  fetched: number;
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
      sourceName: fetchResult.sourceName,
      sourceMode: fetchResult.sourceMode,
      note: fetchResult.note,
    };
  }

  const normalizedAnnouncements = fetchResult.announcements
    .map((announcement) => adapter.normaliseAnnouncement(announcement))
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
    sourceName: fetchResult.sourceName,
    sourceMode: fetchResult.sourceMode,
    note: fetchResult.note,
  };
}
