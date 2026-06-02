export type AnnouncementSourceType = "rns";

export type AnnouncementFetchMode = "mock" | "real" | "unavailable";

export type AnnouncementFetchOptions = {
  limit?: number;
  since?: string | null;
  scanRunId?: string | null;
  triggerSource?: "manual" | "cron" | "dev_script";
  sourceMode?: "mock" | "real";
};

export type FetchedAnnouncement = {
  externalId?: string | null;
  assetSymbol?: string | null;
  companyName?: string | null;
  headline: string;
  rawCategory?: string | null;
  sourceUrl?: string | null;
  publishedAt?: string | null;
  rawPayload?: Record<string, unknown> | null;
};

export type FetchAnnouncementsResult = {
  sourceName: string;
  sourceType: AnnouncementSourceType;
  sourceMode: AnnouncementFetchMode;
  fetched: number;
  announcements: FetchedAnnouncement[];
  note: string;
  notConfigured?: boolean;
};

export type AnnouncementValidationResult = {
  ok: boolean;
  reason?: string;
};

export interface AnnouncementSourceAdapter {
  sourceName: string;
  sourceType: AnnouncementSourceType;
  fetchLatest(
    options?: AnnouncementFetchOptions,
  ): Promise<FetchAnnouncementsResult>;
  normaliseAnnouncement(raw: unknown): FetchedAnnouncement | null;
  validateAnnouncement(raw: unknown): AnnouncementValidationResult;
}
