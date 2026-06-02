"use server";

import { revalidatePath } from "next/cache";

import { getSupabaseClient, hasSupabaseConfig } from "./server";

type TableWriter = {
  update(values: Record<string, unknown>): {
    eq(column: string, value: string): Promise<unknown>;
  };
  insert(values: Record<string, unknown>): Promise<unknown>;
};

function nowIso() {
  return new Date().toISOString();
}

function stringValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function nullableString(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  return value.length ? value : null;
}

function numberValue(formData: FormData, key: string) {
  const value = stringValue(formData, key);
  if (!value) return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function booleanValue(formData: FormData, key: string) {
  const value = formData.get(key);
  return value === "on" || value === "true" || value === "1";
}

function revalidateTraderAi(symbol?: string) {
  revalidatePath("/");
  revalidatePath("/watchlists");
  revalidatePath("/portfolio");
  revalidatePath("/journal");
  revalidatePath("/alerts");
  revalidatePath("/settings");
  if (symbol) {
    revalidatePath(`/assets/${symbol}`);
  }
}

function getClient() {
  const client = getSupabaseClient();
  if (!client || !hasSupabaseConfig()) {
    return null;
  }
  return client;
}

export async function saveAssetAction(formData: FormData) {
  const client = getClient();
  if (!client) return;

  const id = nullableString(formData, "id");
  const symbol = stringValue(formData, "symbol").toUpperCase();
  if (!symbol) return;

  const payload = {
    watchlist_id: nullableString(formData, "watchlist_id"),
    ticker: symbol,
    name: stringValue(formData, "name") || symbol,
    market: nullableString(formData, "market"),
    asset_type: stringValue(formData, "asset_type") || "other",
    currency: stringValue(formData, "currency") || "GBP",
    risk_level: stringValue(formData, "risk_level") || "medium",
    status: stringValue(formData, "status") || "watch",
    notes: nullableString(formData, "notes"),
    archived_at: null,
  };
  const assetsTable = client.from("assets") as unknown as TableWriter;

  if (id) {
    await assetsTable.update(payload).eq("id", id);
  } else {
    await assetsTable.insert(payload);
  }

  revalidateTraderAi(symbol);
}

export async function archiveAssetAction(formData: FormData) {
  const client = getClient();
  if (!client) return;

  const id = nullableString(formData, "id");
  const symbol = stringValue(formData, "symbol").toUpperCase();
  if (!id) return;

  await (client.from("assets") as unknown as TableWriter)
    .update({ archived_at: nowIso() })
    .eq("id", id);
  revalidateTraderAi(symbol);
}

export async function savePortfolioPositionAction(formData: FormData) {
  const client = getClient();
  if (!client) return;

  const id = nullableString(formData, "id");
  const assetId = nullableString(formData, "asset_id");
  if (!assetId) return;

  const payload = {
    asset_id: assetId,
    quantity: numberValue(formData, "quantity") ?? 0,
    average_buy_price: numberValue(formData, "average_buy_price") ?? 0,
    current_price: numberValue(formData, "current_price") ?? 0,
    currency: stringValue(formData, "currency") || "GBP",
    account_type: stringValue(formData, "account_type") || "other",
    strategy: stringValue(formData, "strategy") || "learning",
    target_allocation: numberValue(formData, "target_allocation") ?? 0,
    notes: nullableString(formData, "notes"),
    archived_at: null,
  };
  const positionsTable = client.from("portfolio_positions") as unknown as TableWriter;

  if (id) {
    await positionsTable.update(payload).eq("id", id);
  } else {
    await positionsTable.insert(payload);
  }

  revalidateTraderAi();
}

export async function archivePortfolioPositionAction(formData: FormData) {
  const client = getClient();
  if (!client) return;

  const id = nullableString(formData, "id");
  if (!id) return;

  await (client.from("portfolio_positions") as unknown as TableWriter)
    .update({ archived_at: nowIso() })
    .eq("id", id);

  revalidateTraderAi();
}

export async function saveJournalEntryAction(formData: FormData) {
  const client = getClient();
  if (!client) return;

  const id = nullableString(formData, "id");
  const assetId = nullableString(formData, "asset_id");
  const thesisReason = stringValue(formData, "thesis_reason");
  const riskNotes = stringValue(formData, "risk_notes");
  const reviewDate = stringValue(formData, "review_date");
  const manualExecutionConfirmed = booleanValue(formData, "manual_execution_confirmed");

  if (!assetId || !thesisReason || !riskNotes || !reviewDate || !manualExecutionConfirmed) {
    return;
  }

  const payload = {
    asset_id: assetId,
    action: stringValue(formData, "action") || "add",
    amount: numberValue(formData, "amount") ?? 0,
    entry_price: numberValue(formData, "entry_price"),
    thesis_reason: thesisReason,
    risk_notes: riskNotes,
    risk_amount: numberValue(formData, "risk_amount"),
    stop_loss_idea: stringValue(formData, "stop_loss_idea"),
    review_date: reviewDate,
    manual_execution_confirmed: true,
    emotion_before: nullableString(formData, "emotion_before"),
    result: nullableString(formData, "result"),
    lesson_learned: nullableString(formData, "lesson_learned"),
    archived_at: null,
  };
  const journalTable = client.from("trade_journal") as unknown as TableWriter;

  if (id) {
    await journalTable.update(payload).eq("id", id);
  } else {
    await journalTable.insert(payload);
  }

  revalidateTraderAi();
}

export async function archiveJournalEntryAction(formData: FormData) {
  const client = getClient();
  if (!client) return;

  const id = nullableString(formData, "id");
  if (!id) return;

  await (client.from("trade_journal") as unknown as TableWriter)
    .update({ archived_at: nowIso() })
    .eq("id", id);

  revalidateTraderAi();
}

export async function saveAlertAction(formData: FormData) {
  const client = getClient();
  if (!client) return;

  const id = nullableString(formData, "id");
  const payload = {
    asset_id: nullableString(formData, "asset_id"),
    alert_type: stringValue(formData, "alert_type") || "manual",
    threshold_value: numberValue(formData, "threshold_value"),
    message: stringValue(formData, "message"),
    due_at: nullableString(formData, "due_at"),
    is_active: true,
    triggered_at: null,
  };
  const alertsTable = client.from("alerts") as unknown as TableWriter;

  if (!payload.message) return;

  if (id) {
    await alertsTable.update(payload).eq("id", id);
  } else {
    await alertsTable.insert(payload);
  }

  revalidateTraderAi();
}

export async function markAlertReviewedAction(formData: FormData) {
  const client = getClient();
  if (!client) return;

  const id = nullableString(formData, "id");
  if (!id) return;

  await (client.from("alerts") as unknown as TableWriter)
    .update({ reviewed_at: nowIso(), is_active: false })
    .eq("id", id);

  revalidateTraderAi();
}

export async function archiveAlertAction(formData: FormData) {
  const client = getClient();
  if (!client) return;

  const id = nullableString(formData, "id");
  if (!id) return;

  await (client.from("alerts") as unknown as TableWriter)
    .update({ archived_at: nowIso(), is_active: false })
    .eq("id", id);

  revalidateTraderAi();
}
