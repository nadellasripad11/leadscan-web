import { IntelReport } from "./types";
import fs from "fs/promises";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), ".cache");
const CACHE_TTL = 30 * 24 * 60 * 60 * 1000; // 30 days in ms

interface CacheEntry {
  domain: string;
  report: IntelReport;
  timestamp: number;
}

async function ensureCacheDir() {
  try {
    await fs.mkdir(CACHE_DIR, { recursive: true });
  } catch {
    // dir already exists
  }
}

function getCachePath(domain: string): string {
  const safe = domain.replace(/[^a-z0-9.-]/gi, "_").toLowerCase();
  return path.join(CACHE_DIR, `${safe}.json`);
}

export async function getFromCache(domain: string): Promise<IntelReport | null> {
  try {
    await ensureCacheDir();
    const filePath = getCachePath(domain);
    const content = await fs.readFile(filePath, "utf-8");
    const entry: CacheEntry = JSON.parse(content);

    // Check if cache is still fresh
    if (Date.now() - entry.timestamp > CACHE_TTL) {
      await fs.unlink(filePath).catch(() => {}); // delete stale cache
      return null;
    }

    return entry.report;
  } catch {
    return null; // cache miss or error
  }
}

export async function saveToCache(domain: string, report: IntelReport): Promise<void> {
  try {
    await ensureCacheDir();
    const entry: CacheEntry = {
      domain,
      report,
      timestamp: Date.now(),
    };
    const filePath = getCachePath(domain);
    await fs.writeFile(filePath, JSON.stringify(entry, null, 2));
  } catch (err) {
    // silently fail cache write (don't break the request)
    console.error("Cache write error:", err);
  }
}

export async function clearCache(domain?: string): Promise<void> {
  try {
    await ensureCacheDir();
    if (domain) {
      const filePath = getCachePath(domain);
      await fs.unlink(filePath).catch(() => {});
    } else {
      const files = await fs.readdir(CACHE_DIR);
      for (const file of files) {
        await fs.unlink(path.join(CACHE_DIR, file));
      }
    }
  } catch (err) {
    console.error("Cache clear error:", err);
  }
}
