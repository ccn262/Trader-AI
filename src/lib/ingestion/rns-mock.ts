import {
  createMockRnsAdapter,
  mockRnsAnnouncements,
} from "./source-adapters/mock-rns-adapter";
import { ingestAnnouncementsFromAdapter } from "./announcement-ingestion-service";

export { mockRnsAnnouncements, createMockRnsAdapter };

export async function ingestMockRnsAnnouncements(options?: {
  scanRunId?: string | null;
}) {
  return ingestAnnouncementsFromAdapter(createMockRnsAdapter(), {
    scanRunId: options?.scanRunId ?? null,
    triggerSource: "dev_script",
    sourceMode: "mock",
  });
}
