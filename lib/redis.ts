import { Redis } from '@upstash/redis'

const globalForRedis = globalThis as unknown as { redis: Redis }

export const redis =
  globalForRedis.redis ||
  new Redis({
    url: process.env.UPSTASH_REDIS_REST_URL!,
    token: process.env.UPSTASH_REDIS_REST_TOKEN!,
  })

if (process.env.NODE_ENV !== 'production') globalForRedis.redis = redis

// Cache TTLs (seconds)
export const CACHE_TTL = {
  PRICE_INDEX: 300,       // 5 min
  ZONE_PRICING: 300,      // 5 min
  PRODUCT_LIST: 60,       // 1 min
  STOCK_LEVEL: 30,        // 30 sec
  SITE_SETTINGS: 600,     // 10 min
}

export async function getCached<T>(key: string): Promise<T | null> {
  try {
    return await redis.get<T>(key)
  } catch {
    return null
  }
}

export async function setCached<T>(key: string, value: T, ttl: number): Promise<void> {
  try {
    await redis.setex(key, ttl, value)
  } catch {
    // Silent fail — cache is best-effort
  }
}

export async function invalidateCache(pattern: string): Promise<void> {
  try {
    const keys = await redis.keys(pattern)
    if (keys.length > 0) {
      await redis.del(...keys)
    }
  } catch {
    // Silent fail
  }
}
