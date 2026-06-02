import { ingestRnsAnnouncements, type RnsRawAnnouncementInput } from "./rns";

export const mockRnsAnnouncements: RnsRawAnnouncementInput[] = [
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

export async function ingestMockRnsAnnouncements(options?: {
  scanRunId?: string | null;
}) {
  return ingestRnsAnnouncements(cloneAnnouncements(), options);
}
