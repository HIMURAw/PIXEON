"use server";

import { db } from "@/lib/db";
import { settings } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { FEATURE_FLAGS, type FeatureFlagKey } from "@/lib/feature-flags-registry";

const FLAG_KEY_PREFIX = "flag:";

export async function getFeatureFlag(key: FeatureFlagKey, defaultValue = true): Promise<boolean> {
  try {
    const [row] = await db
      .select()
      .from(settings)
      .where(eq(settings.key, FLAG_KEY_PREFIX + key))
      .limit(1);

    if (!row || row.value === null) return defaultValue;
    return row.value === "true";
  } catch (error) {
    console.error(`Error reading feature flag "${key}":`, error);
    return defaultValue;
  }
}

export async function getAllFeatureFlags(): Promise<Record<FeatureFlagKey, boolean>> {
  const entries = await Promise.all(
    FEATURE_FLAGS.map(async (flag) => [flag.key, await getFeatureFlag(flag.key, true)] as const)
  );
  return Object.fromEntries(entries) as Record<FeatureFlagKey, boolean>;
}

export async function setFeatureFlag(key: FeatureFlagKey, enabled: boolean) {
  try {
    const dbKey = FLAG_KEY_PREFIX + key;
    await db
      .insert(settings)
      .values({ key: dbKey, value: String(enabled), updatedAt: new Date() })
      .onDuplicateKeyUpdate({ set: { value: String(enabled), updatedAt: new Date() } });
    return { success: true };
  } catch (error) {
    console.error(`Error setting feature flag "${key}":`, error);
    const message = error instanceof Error ? error.message : "Özellik bayrağı güncellenemedi.";
    return { success: false, error: message };
  }
}
