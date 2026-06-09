import { NextRequest } from "next/server";

interface RateLimitInfo {
  timestamps: number[];
}

// Global in-memory map to store IP request timestamps
const memoryStore = new Map<string, RateLimitInfo>();

// Simple cleanup mechanism to prevent memory leak
let lastCleanup = Date.now();
const CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes

function cleanupStore() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL) return;
  lastCleanup = now;

  for (const [key, value] of memoryStore.entries()) {
    // Keep only timestamps from the last 15 minutes
    const filtered = value.timestamps.filter(t => now - t < 15 * 60 * 1000);
    if (filtered.length === 0) {
      memoryStore.delete(key);
    } else {
      memoryStore.set(key, { timestamps: filtered });
    }
  }
}

export function getClientIp(request: NextRequest): string {
  const xForwardedFor = request.headers.get("x-forwarded-for");
  if (xForwardedFor) {
    return xForwardedFor.split(",")[0].trim();
  }
  const xRealIp = request.headers.get("x-real-ip");
  if (xRealIp) {
    return xRealIp;
  }
  return (request as any).ip || "127.0.0.1";
}

interface RateLimitOptions {
  limit: number;      // max requests
  windowMs: number;   // time window in milliseconds
}

export async function rateLimit(
  request: NextRequest,
  keyPrefix: string,
  options: RateLimitOptions
) {
  cleanupStore();

  const ip = getClientIp(request);
  const key = `${keyPrefix}:${ip}`;
  const now = Date.now();

  let record = memoryStore.get(key);
  if (!record) {
    record = { timestamps: [] };
  }

  // Filter timestamps to only keep those within the window
  const activeTimestamps = record.timestamps.filter(t => now - t < options.windowMs);

  if (activeTimestamps.length >= options.limit) {
    const oldestTimestamp = activeTimestamps[0];
    const resetTime = oldestTimestamp + options.windowMs;
    const remainingSeconds = Math.ceil((resetTime - now) / 1000);

    return {
      success: false,
      limit: options.limit,
      remaining: 0,
      resetSeconds: remainingSeconds,
    };
  }

  activeTimestamps.push(now);
  memoryStore.set(key, { timestamps: activeTimestamps });

  return {
    success: true,
    limit: options.limit,
    remaining: options.limit - activeTimestamps.length,
    resetSeconds: Math.ceil(options.windowMs / 1000),
  };
}
