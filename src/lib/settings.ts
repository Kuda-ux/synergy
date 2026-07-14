import "server-only";
import { db } from "./db";
import { SETTING_KEYS } from "./constants";

export async function getSetting(key: string): Promise<string | null> {
  const row = await db.setting.findUnique({ where: { key } });
  return row?.value ?? null;
}

/** Admin-controlled ZWG rate in ZWG cents per USD. Null when ZWG display is disabled. */
export async function getZwgRate(): Promise<number | null> {
  const [enabled, rate] = await Promise.all([
    getSetting(SETTING_KEYS.zwgEnabled),
    getSetting(SETTING_KEYS.zwgPerUsd),
  ]);
  if (enabled !== "true" || !rate) return null;
  const parsed = Number.parseInt(rate, 10);
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : null;
}

export async function getAnnouncements(): Promise<string[]> {
  const raw = await getSetting(SETTING_KEYS.announcements);
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter((m): m is string => typeof m === "string") : [];
  } catch {
    return [];
  }
}

export async function getStoreHours(): Promise<string> {
  return (await getSetting(SETTING_KEYS.storeHours)) ?? "Store hours to be confirmed";
}
