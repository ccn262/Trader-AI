import { resolve } from "node:path";

import dotenv from "dotenv";

dotenv.config({ path: resolve(process.cwd(), ".env.local"), quiet: true });

const baseUrl = process.env.RNS_SOURCE_BASE_URL ?? null;

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
        error: result.error ?? null,
      },
      null,
      2,
    ),
  );

  return result.ok ? 0 : 1;
}

const exitCode = await main();
process.exitCode = exitCode;
