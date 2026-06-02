import { getSupabaseClient, hasSupabaseConfig } from "@/lib/supabase/server";
import type {
  IntelligenceItemRow,
  IntelligenceSourceRow,
  OpportunityAlertRow,
  OpportunityEvidenceRow,
  RawAnnouncementRow,
  ScanRunRow,
  ScoreHistoryRow,
} from "@/lib/supabase/types";
import { scoreAnnouncementImpact } from "@/lib/scoring/announcement-impact";
import { generateOpportunityAlertPayload } from "@/lib/scoring/opportunity-alert-generator";
import { ingestMockRnsAnnouncements } from "@/lib/ingestion/rns-mock";

export type ScanType = "morning" | "evening" | "manual";
export type ScanTriggerSource = "manual" | "cron" | "dev_script";

export type RunScanInput = {
  scanType: ScanType;
  triggerSource: ScanTriggerSource;
};

export type RunScanSummary = {
  scanRunId: string | null;
  scanType: ScanType;
  triggerSource: ScanTriggerSource;
  status: ScanRunRow["status"];
  completedSuccessfully: boolean;
  summary: string;
  marketHealthScore: number | null;
  startedAt: string | null;
  completedAt: string | null;
  totalIntelligenceItems: number;
  totalAlertsGenerated: number;
  highPriorityCount: number;
  speculativeCount: number;
  avoidOrReassessCount: number;
  insertedRawAnnouncements: number;
  insertedIntelligenceItems: number;
  duplicatesSkipped: number;
  errorMessage: string | null;
};

function toIsoNow() {
  return new Date().toISOString();
}

function valuesMatch(left: unknown, right: unknown) {
  return (left ?? null) === (right ?? null);
}

function createReasonKey(
  itemId: string,
  scoring: ReturnType<typeof scoreAnnouncementImpact>,
) {
  return `rns-impact:${itemId}:${scoring.classification}:${scoring.impactDirection}:${scoring.impactScore}:${scoring.riskLevel}:${scoring.priority}`;
}

async function ensureOrchestrationSchema(
  supabase: NonNullable<ReturnType<typeof getSupabaseClient>>,
) {
  const checks = [
    supabase
      .from("scan_runs")
      .select(
        "id,trigger_source,started_by,total_intelligence_items,total_alerts_generated,high_priority_count,speculative_count,avoid_or_reassess_count,error_message,completed_successfully",
      )
      .limit(1),
    supabase
      .from("intelligence_items")
      .select(
        "id,classification,impact_direction,impact_score,risk_level,priority,scoring_reason,scored_at",
      )
      .limit(1),
    supabase
      .from("opportunity_alerts")
      .select(
        "id,source_intelligence_item_id,generated_by,generation_reason,invalidation_notes,review_by,confidence_label",
      )
      .limit(1),
    supabase
      .from("opportunity_evidence")
      .select("id,evidence_type,is_primary")
      .limit(1),
  ];

  const results = await Promise.all(checks);
  const errorResult = results.find((result) => result.error);

  if (errorResult?.error) {
    return {
      ok: false,
      message:
        "Required scan orchestration columns are not available yet. Apply the Phase 10 migration before running scans.",
      detail: errorResult.error.message,
    } as const;
  }

  return { ok: true, message: null, detail: null } as const;
}

async function loadRnsSourceContext(
  supabase: NonNullable<ReturnType<typeof getSupabaseClient>>,
) {
  const [sourceResult, rawResult, itemResult, alertResult, evidenceResult, scoreResult] =
    await Promise.all([
      supabase
        .from("intelligence_sources")
        .select("id,name,source_type,confidence_score,is_active")
        .eq("source_type", "rns"),
      supabase
        .from("raw_announcements")
        .select("id,source_id,external_id,asset_symbol,company_name,headline,announcement_type,raw_category,source_url,published_at,raw_payload,ingestion_status,created_at,updated_at")
        .order("published_at", { ascending: false }),
      supabase
        .from("intelligence_items")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("opportunity_alerts")
        .select("*")
        .order("created_at", { ascending: false }),
      supabase
        .from("opportunity_evidence")
        .select("*")
        .order("created_at", { ascending: true }),
      supabase
        .from("score_history")
        .select("*")
        .in("score_type", ["market_health", "opportunity"])
        .order("calculated_at", { ascending: false }),
    ]);

  if (
    sourceResult.error ||
    rawResult.error ||
    itemResult.error ||
    alertResult.error ||
    evidenceResult.error ||
    scoreResult.error
  ) {
    const error =
      sourceResult.error ??
      rawResult.error ??
      itemResult.error ??
      alertResult.error ??
      evidenceResult.error ??
      scoreResult.error;

    return {
      ok: false,
      error: error?.message ?? "Unknown scan data load failure",
      sourceRows: [],
      rawRows: [],
      itemRows: [],
      alertRows: [],
      evidenceRows: [],
      scoreRows: [],
    } as const;
  }

  return {
    ok: true,
    sourceRows: (sourceResult.data ?? []) as IntelligenceSourceRow[],
    rawRows: (rawResult.data ?? []) as RawAnnouncementRow[],
    itemRows: (itemResult.data ?? []) as IntelligenceItemRow[],
    alertRows: (alertResult.data ?? []) as OpportunityAlertRow[],
    evidenceRows: (evidenceResult.data ?? []) as OpportunityEvidenceRow[],
    scoreRows: (scoreResult.data ?? []) as ScoreHistoryRow[],
  } as const;
}

async function insertRunningScanRow(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  supabase: any,
  input: RunScanInput,
) {
  const startedAt = toIsoNow();
  const { data, error } = await supabase
    .from("scan_runs")
    .insert([
      {
        scan_type: input.scanType,
        status: "running",
        started_at: startedAt,
        summary: null,
        market_health_score: null,
        notes: `Triggered by ${input.triggerSource} scan orchestration.`,
        trigger_source: input.triggerSource,
        started_by: input.triggerSource,
        total_intelligence_items: 0,
        total_alerts_generated: 0,
        high_priority_count: 0,
        speculative_count: 0,
        avoid_or_reassess_count: 0,
        error_message: null,
        completed_successfully: false,
      },
    ])
    .select("*")
    .single();

  if (error || !data) {
    throw new Error(error?.message ?? "Unable to create scan run row.");
  }

    return data as ScanRunRow & {
    trigger_source?: ScanTriggerSource;
    started_by?: string | null;
    total_intelligence_items?: number | null;
    total_alerts_generated?: number | null;
    high_priority_count?: number | null;
    speculative_count?: number | null;
    avoid_or_reassess_count?: number | null;
    error_message?: string | null;
    completed_successfully?: boolean | null;
  };
}

export async function runScan(input: RunScanInput): Promise<RunScanSummary> {
  const emptySummary = {
    scanRunId: null,
    scanType: input.scanType,
    triggerSource: input.triggerSource,
    status: "failed" as const,
    completedSuccessfully: false,
    summary: "Scan orchestration could not run.",
    marketHealthScore: null,
    startedAt: null,
    completedAt: null,
    totalIntelligenceItems: 0,
    totalAlertsGenerated: 0,
    highPriorityCount: 0,
    speculativeCount: 0,
    avoidOrReassessCount: 0,
    insertedRawAnnouncements: 0,
    insertedIntelligenceItems: 0,
    duplicatesSkipped: 0,
    errorMessage: null,
  };

  if (!hasSupabaseConfig()) {
    return {
      ...emptySummary,
      errorMessage:
        "Supabase environment variables are missing. Configure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY before running scans.",
    };
  }

  const supabase = getSupabaseClient();
  if (!supabase) {
    return {
      ...emptySummary,
      errorMessage: "Unable to create a Supabase client for scan orchestration.",
    };
  }

  const schemaCheck = await ensureOrchestrationSchema(supabase);
  if (!schemaCheck.ok) {
    return {
      ...emptySummary,
      errorMessage: `${schemaCheck.message} ${schemaCheck.detail ?? ""}`.trim(),
    };
  }

  let scanRun: (ScanRunRow & {
    trigger_source?: ScanTriggerSource;
    started_by?: string | null;
    total_intelligence_items?: number | null;
    total_alerts_generated?: number | null;
    high_priority_count?: number | null;
    speculative_count?: number | null;
    avoid_or_reassess_count?: number | null;
    error_message?: string | null;
    completed_successfully?: boolean | null;
  }) | null = null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const writeClient = supabase as any;

  try {
    scanRun = await insertRunningScanRow(supabase, input);

    const ingestResult = await ingestMockRnsAnnouncements({ scanRunId: scanRun.id });

    const sourceContext = await loadRnsSourceContext(supabase);
    if (!sourceContext.ok) {
      throw new Error(sourceContext.error);
    }

    const marketHealthRow = sourceContext.scoreRows.find(
      (row) =>
        row.score_type === "market_health" &&
        row.asset_symbol.toUpperCase() === input.scanType.toUpperCase(),
    );

    const rnsSourceIds = sourceContext.sourceRows.map((row) => row.id);
    const rawById = new Map(sourceContext.rawRows.map((row) => [row.id, row]));
    const sourceById = new Map(sourceContext.sourceRows.map((row) => [row.id, row]));
    const alertByItemId = new Map(
      sourceContext.alertRows
        .filter((row) => row.source_intelligence_item_id)
        .map((row) => [row.source_intelligence_item_id as string, row]),
    );
    const evidenceByAlertAndItem = new Map(
      sourceContext.evidenceRows
        .filter((row) => row.intelligence_item_id)
        .map((row) => [`${row.opportunity_alert_id}:${row.intelligence_item_id}`, row]),
    );

    const scoredItems = sourceContext.itemRows.filter(
      (row) =>
        row.source_id != null &&
        rnsSourceIds.includes(row.source_id) &&
        row.raw_announcement_id != null,
    );

    let totalIntelligenceItems = 0;
    let totalAlertsGenerated = 0;
    let highPriorityCount = 0;
    let speculativeCount = 0;
    let avoidOrReassessCount = 0;

    for (const item of scoredItems) {
      const rawAnnouncement = item.raw_announcement_id
        ? rawById.get(item.raw_announcement_id) ?? null
        : null;
      const source = item.source_id ? sourceById.get(item.source_id) ?? null : null;

      const scoring = scoreAnnouncementImpact({
        announcementType: rawAnnouncement?.announcement_type ?? item.classification,
        headline: rawAnnouncement?.headline ?? item.headline,
        rawCategory: rawAnnouncement?.raw_category ?? null,
        summary: item.summary ?? "",
        assetSymbol: rawAnnouncement?.asset_symbol ?? item.asset_symbol,
        companyName: rawAnnouncement?.company_name ?? null,
      });

      const scoringReason = scoring.scoringReason;
      const needsUpdate =
        !valuesMatch(item.classification, scoring.classification) ||
        !valuesMatch(item.impact_direction, scoring.impactDirection) ||
        Number(item.impact_score ?? 0) !== scoring.impactScore ||
        !valuesMatch(item.risk_level, scoring.riskLevel) ||
        !valuesMatch(item.priority, scoring.priority) ||
        !valuesMatch(item.scoring_reason, scoringReason) ||
        item.scored_at == null;

      totalIntelligenceItems += 1;
      if (scoring.priority === "high_priority_review") {
        highPriorityCount += 1;
      }
      if (scoring.priority === "speculative_review") {
        speculativeCount += 1;
      }
      if (scoring.priority === "avoid_or_reassess") {
        avoidOrReassessCount += 1;
      }

      if (needsUpdate) {
        const { error: updateError } = await writeClient
          .from("intelligence_items")
          .update({
            classification: scoring.classification,
            impact_direction: scoring.impactDirection,
            impact_score: scoring.impactScore,
            risk_level: scoring.riskLevel,
            priority: scoring.priority,
            scoring_reason: scoringReason,
            scored_at: toIsoNow(),
          })
          .eq("id", item.id);

        if (updateError) {
          throw new Error(
            `Failed to score intelligence item ${item.id}: ${updateError.message}`,
          );
        }

        const reasonKey = createReasonKey(item.id, scoring);
        const { data: existingHistory, error: historyLookupError } = await writeClient
          .from("score_history")
          .select("id")
          .eq("asset_symbol", item.asset_symbol)
          .eq("score_type", "opportunity")
          .eq("reason", reasonKey)
          .maybeSingle();

        if (historyLookupError) {
          throw new Error(
            `Failed to inspect score history for item ${item.id}: ${historyLookupError.message}`,
          );
        }

        if (!existingHistory && item.asset_symbol) {
          const { error: historyError } = await writeClient.from("score_history").insert([
            {
              asset_symbol: item.asset_symbol,
              score_type: "opportunity",
              score: scoring.impactScore,
              previous_score: item.impact_score == null ? null : Number(item.impact_score),
              score_delta:
                item.impact_score == null ? null : scoring.impactScore - Number(item.impact_score),
              reason: reasonKey,
              calculated_at: toIsoNow(),
            },
          ]);

          if (historyError) {
            throw new Error(
              `Failed to record score history for item ${item.id}: ${historyError.message}`,
            );
          }
        }

      }

      const generated = generateOpportunityAlertPayload(
        {
          id: item.id,
          scanRunId: item.scan_run_id,
          assetSymbol: item.asset_symbol,
          headline: item.headline,
          summary: item.summary,
          classification: scoring.classification,
          impactScore: scoring.impactScore,
          impactDirection: scoring.impactDirection,
          riskLevel: scoring.riskLevel,
          priority: scoring.priority,
          sourceConfidence: item.source_confidence,
          sourceName: source?.name ?? null,
          sourceUrl: item.source_url ?? rawAnnouncement?.source_url ?? null,
          companyName: rawAnnouncement?.company_name ?? null,
          publishedAt: item.published_at,
          rawAnnouncementId: item.raw_announcement_id,
        },
        {
          source,
          rawAnnouncement,
          portfolioContext: null,
        },
      );

      if (!generated) {
        continue;
      }

      const existingAlert = alertByItemId.get(item.id) ?? null;
      if (existingAlert) {
        const evidenceKey = `${existingAlert.id}:${item.id}`;
        if (!evidenceByAlertAndItem.has(evidenceKey)) {
          const evidencePayload = generated.evidence.map((evidence) => ({
            ...evidence,
            opportunity_alert_id: existingAlert.id,
          }));

          for (const evidenceRow of evidencePayload) {
            const { error: evidenceInsertError } = await writeClient
              .from("opportunity_evidence")
              .insert([evidenceRow]);

            if (evidenceInsertError) {
              throw new Error(
                `Failed to repair evidence for alert ${existingAlert.id}: ${evidenceInsertError.message}`,
              );
            }
          }
        }

        continue;
      }

      const { data: insertedAlert, error: alertInsertError } = await writeClient
        .from("opportunity_alerts")
        .insert([generated.alert])
        .select("id")
        .single();

      if (alertInsertError || !insertedAlert) {
        throw new Error(
          `Failed to insert opportunity alert for item ${item.id}: ${
            alertInsertError?.message ?? "Unknown error"
          }`,
        );
      }

      const evidencePayload = generated.evidence.map((evidence) => ({
        ...evidence,
        opportunity_alert_id: insertedAlert.id,
      }));

      for (const evidenceRow of evidencePayload) {
        const { error: evidenceInsertError } = await writeClient
          .from("opportunity_evidence")
          .insert([evidenceRow]);

        if (evidenceInsertError) {
          throw new Error(
            `Failed to insert evidence for alert ${insertedAlert.id}: ${evidenceInsertError.message}`,
          );
        }
      }

      totalAlertsGenerated += 1;
    }

    const completedAt = toIsoNow();
    const summary = [
      `${input.scanType.charAt(0).toUpperCase() + input.scanType.slice(1)} scan completed with`,
      `${totalIntelligenceItems} intelligence item${totalIntelligenceItems === 1 ? "" : "s"}`,
      `${totalAlertsGenerated} alert${totalAlertsGenerated === 1 ? "" : "s"} generated`,
      `${highPriorityCount} high priority`,
      `${speculativeCount} speculative`,
      `${avoidOrReassessCount} avoid or reassess`,
    ].join(", ");

    const { error: updateError } = await writeClient
      .from("scan_runs")
      .update({
        status: "completed",
        completed_at: completedAt,
        summary,
        market_health_score: marketHealthRow?.score ?? null,
        notes: `Triggered by ${input.triggerSource}. Review-only orchestration completed successfully.`,
        total_intelligence_items: totalIntelligenceItems,
        total_alerts_generated: totalAlertsGenerated,
        high_priority_count: highPriorityCount,
        speculative_count: speculativeCount,
        avoid_or_reassess_count: avoidOrReassessCount,
        completed_successfully: true,
        error_message: null,
      })
      .eq("id", scanRun.id);

    if (updateError) {
      throw new Error(`Failed to update scan run ${scanRun.id}: ${updateError.message}`);
    }

    const scanLabel =
      input.scanType.charAt(0).toUpperCase() + input.scanType.slice(1);
    return {
      scanRunId: scanRun.id,
      scanType: input.scanType,
      triggerSource: input.triggerSource,
      status: "completed",
      completedSuccessfully: true,
      summary: `${scanLabel} scan completed with ${totalIntelligenceItems} intelligence item${
        totalIntelligenceItems === 1 ? "" : "s"
      }, ${totalAlertsGenerated} alert${totalAlertsGenerated === 1 ? "" : "s"} generated, ${highPriorityCount} high priority, ${speculativeCount} speculative, ${avoidOrReassessCount} avoid or reassess`,
      marketHealthScore: marketHealthRow?.score ?? null,
      startedAt: scanRun.started_at ?? null,
      completedAt,
      totalIntelligenceItems,
      totalAlertsGenerated,
      highPriorityCount,
      speculativeCount,
      avoidOrReassessCount,
      insertedRawAnnouncements: ingestResult.insertedRawAnnouncements,
      insertedIntelligenceItems: ingestResult.insertedIntelligenceItems,
      duplicatesSkipped: ingestResult.duplicatesSkipped,
      errorMessage: null,
    };
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown scan orchestration failure";

    if (scanRun) {
      await writeClient
        .from("scan_runs")
        .update({
          status: "failed",
          completed_at: toIsoNow(),
          summary: `Scan failed: ${errorMessage}`,
          completed_successfully: false,
          error_message: errorMessage,
          notes: `Triggered by ${input.triggerSource}. Scan failed before completion.`,
        })
        .eq("id", scanRun.id);
    }

    return {
      ...emptySummary,
      scanRunId: scanRun?.id ?? null,
      scanType: input.scanType,
      triggerSource: input.triggerSource,
      status: "failed",
      summary: `Scan failed: ${errorMessage}`,
      startedAt: scanRun?.started_at ?? null,
      completedAt: scanRun ? toIsoNow() : null,
      marketHealthScore: null,
      errorMessage,
    };
  }
}
