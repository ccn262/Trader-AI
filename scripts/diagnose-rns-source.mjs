import { resolve } from "node:path";

import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

import {
  isMockEvidenceUrl,
  isValidExternalEvidenceUrl,
} from "../src/lib/evidence-links.ts";

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

const baseUrl = process.env.RNS_SOURCE_BASE_URL ?? null;
const persistDiagnostics =
  (process.env.SOURCE_DIAGNOSTIC_PERSIST ?? "").toLowerCase() === "true";
const sourceCandidateId = process.env.SOURCE_CANDIDATE_ID ?? null;

function stripHtml(text) {
  return text.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function getTitle(body) {
  const titleMatch = body.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  return titleMatch ? stripHtml(titleMatch[1]) : null;
}

function getAnchorHrefs(body) {
  const hrefs = [];
  const anchorRegex = /<a\b[^>]*href\s*=\s*["']([^"']+)["'][^>]*>/gi;

  for (const match of body.matchAll(anchorRegex)) {
    hrefs.push(match[1]);
  }

  return hrefs;
}

function getLikelyRnsHrefCount(hrefs) {
  const patterns = [
    "/news-article/",
    "rns",
    "regulatory-news",
    "announcement",
    "news",
  ];

  return hrefs.filter((href) => {
    const normalized = href.toLowerCase();
    return patterns.some((pattern) => normalized.includes(pattern));
  }).length;
}

function appearsJavaScriptRendered(body, anchorCount) {
  const scriptCount = (body.match(/<script\b/gi) ?? []).length;
  const hasNextData = body.includes("__NEXT_DATA__");
  const hasAppRoot =
    body.includes("id=\"__next\"") ||
    body.includes("id='__next'") ||
    body.includes("data-reactroot");
  const hasNoScriptHint = /enable javascript|javascript required|please enable javascript/i.test(
    body,
  );

  if (hasNoScriptHint) return true;
  if (hasNextData || hasAppRoot) return true;
  if (anchorCount === 0 && scriptCount >= 5) return true;
  if (anchorCount <= 2 && scriptCount >= 10) return true;

  return false;
}

async function fetchDiagnosticPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(url, {
      method: "GET",
      redirect: "follow",
      headers: {
        Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
      },
      signal: controller.signal,
    });

    const body = await response.text();
    const hrefs = getAnchorHrefs(body);
    const first20Hrefs = hrefs.slice(0, 20);

    return {
      ok: response.ok,
      status: response.status,
      contentType: response.headers.get("content-type") ?? "",
      responseLength: body.length,
      title: getTitle(body),
      anchorCount: hrefs.length,
      first20Hrefs,
      likelyRnsHrefCount: getLikelyRnsHrefCount(hrefs),
      appearsJavaScriptRendered: appearsJavaScriptRendered(body, hrefs.length),
    };
  } catch (error) {
    return {
      ok: false,
      status: 0,
      contentType: "",
      responseLength: 0,
      title: null,
      anchorCount: 0,
      first20Hrefs: [],
      likelyRnsHrefCount: 0,
      appearsJavaScriptRendered: false,
      error: error instanceof Error ? error.message : "Unknown fetch failure",
    };
  } finally {
    clearTimeout(timeout);
  }
}

function buildRecommendation(result) {
  if (!result.ok) {
    return "fetch_failed";
  }

  if (
    result.appearsJavaScriptRendered &&
    result.anchorCount === 0 &&
    result.likelyRnsHrefCount === 0
  ) {
    return "unsuitable_for_simple_parser";
  }

  if (
    result.likelyRnsHrefCount > 0 &&
    result.anchorCount > 0 &&
    !result.appearsJavaScriptRendered
  ) {
    return "manual_validation_candidate";
  }

  if (result.anchorCount === 0) {
    return "insufficient_links_for_parser";
  }

  return "manual_review";
}

function buildDiagnosticSummary(result) {
  if (!result.ok) {
    return result.error ?? "Diagnostic fetch failed.";
  }

  if (
    result.appearsJavaScriptRendered &&
    result.anchorCount === 0 &&
    result.likelyRnsHrefCount === 0
  ) {
    return "Reachable but JS-rendered; no extractable announcement links were exposed for a simple server fetch.";
  }

  if (result.likelyRnsHrefCount > 0) {
    return `Found ${result.likelyRnsHrefCount} likely RNS/news href(s) among ${result.anchorCount} anchors.`;
  }

  if (result.anchorCount === 0) {
    return "No anchor tags were exposed in the fetched HTML.";
  }

  return `Fetched page with ${result.anchorCount} anchors and no clear RNS pattern in the sample.`;
}

async function persistDiagnostic(result) {
  if (!persistDiagnostics) {
    return { persisted: false, note: null };
  }

  if (!sourceCandidateId) {
    return {
      persisted: false,
      note:
        "SOURCE_DIAGNOSTIC_PERSIST=true was set, but SOURCE_CANDIDATE_ID is missing. Nothing was saved.",
    };
  }

  const supabaseUrl = process.env.SUPABASE_URL ?? null;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? null;

  if (!supabaseUrl || !serviceRoleKey) {
    return {
      persisted: false,
      note:
        "Persistence is enabled, but SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.",
    };
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
  });

  const recommendation = buildRecommendation(result);
  const diagnosticSummary = buildDiagnosticSummary(result);
  const validExternalUrlsCount = result.first20Hrefs.filter((href) =>
    isValidExternalEvidenceUrl(href),
  ).length;
  const rejectedUrlsCount = result.first20Hrefs.filter(
    (href) => isMockEvidenceUrl(href) || !isValidExternalEvidenceUrl(href),
  ).length;
  const insertedAt = new Date().toISOString();

  const { data: diagnosticRow, error: insertError } = await supabase
    .from("source_diagnostics")
    .insert({
      source_candidate_id: sourceCandidateId,
      checked_url: baseUrl,
      http_status: result.status,
      content_type: result.contentType,
      response_length: result.responseLength,
      page_title: result.title,
      anchor_count: result.anchorCount,
      likely_rns_href_count: result.likelyRnsHrefCount,
      appears_javascript_rendered: result.appearsJavaScriptRendered,
      valid_external_urls_count: validExternalUrlsCount,
      rejected_urls_count: rejectedUrlsCount,
      diagnostic_summary: diagnosticSummary,
      recommendation,
      raw_sample: {
        first20Hrefs: result.first20Hrefs,
        error: result.error ?? null,
      },
      created_at: insertedAt,
    })
    .select("id")
    .single();

  if (insertError || !diagnosticRow) {
    return {
      persisted: false,
      note: `Diagnostic persistence failed: ${insertError?.message ?? "unknown error"}`,
    };
  }

  const { error: updateError } = await supabase
    .from("source_candidates")
    .update({
      last_checked_at: insertedAt,
      last_diagnostic_id: diagnosticRow.id,
    })
    .eq("id", sourceCandidateId);

  if (updateError) {
    return {
      persisted: true,
      note: `Diagnostic saved, but candidate metadata update failed: ${updateError.message}`,
    };
  }

  return {
    persisted: true,
    note: `Diagnostic saved for candidate ${sourceCandidateId}.`,
  };
}

async function main() {
  if (!baseUrl) {
    console.error(
      "Missing RNS_SOURCE_BASE_URL. Set it in .env.local before running `npm run diagnose:rns-source`.",
    );
    return 1;
  }

  try {
    new URL(baseUrl);
  } catch {
    console.error("RNS_SOURCE_BASE_URL must be a valid absolute http(s) URL.");
    return 1;
  }

  const result = await fetchDiagnosticPage(baseUrl);
  const recommendation = buildRecommendation(result);
  const persistenceResult = await persistDiagnostic(result);

  console.log(
    JSON.stringify(
      {
        url: baseUrl,
        ok: result.ok,
        status: result.status,
        contentType: result.contentType,
        responseLength: result.responseLength,
        title: result.title,
        anchorCount: result.anchorCount,
        first20Hrefs: result.first20Hrefs,
        likelyRnsHrefCount: result.likelyRnsHrefCount,
        appearsJavaScriptRendered: result.appearsJavaScriptRendered,
        recommendation,
        persisted: persistenceResult.persisted,
        persistenceNote: persistenceResult.note,
        error: result.error ?? null,
      },
      null,
      2,
    ),
  );

  if (persistDiagnostics) {
    if (!sourceCandidateId) {
      console.error(
        "SOURCE_DIAGNOSTIC_PERSIST=true requires SOURCE_CANDIDATE_ID so the diagnostic can be attached to a registry row.",
      );
      return 1;
    }

    if (persistenceResult.note && !persistenceResult.persisted) {
      console.error(persistenceResult.note);
      return 1;
    }

    if (persistenceResult.note && persistenceResult.persisted) {
      console.log(persistenceResult.note);
    }
  }

  return result.ok ? 0 : 1;
}

const exitCode = await main();
process.exitCode = exitCode;
