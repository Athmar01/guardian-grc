// A simple in-memory cache for transient data like validation tokens.
// In a production, multi-server environment, this should be replaced with a distributed cache like Redis.

interface CacheEntry<T> {
    data: T;
    expiry: number;
}

const cache = new Map<string, CacheEntry<any>>();

const DEFAULT_TTL_MS = 10 * 60 * 1000; // 10 minutes

export function setCache<T>(key: string, value: T, ttl: number = DEFAULT_TTL_MS): void {
    const expiry = Date.now() + ttl;
    cache.set(key, { data: value, expiry });
}

export function getCache<T>(key: string): T | null {
    const entry = cache.get(key);
    if (!entry) {
        return null;
    }

    if (Date.now() > entry.expiry) {
        cache.delete(key); // Clean up expired entry
        return null;
    }

    return entry.data as T;
}

export function deleteCache(key: string): void {
    cache.delete(key);
}

// Periodically clean up expired keys to prevent memory leaks
setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of cache.entries()) {
        if (now > entry.expiry) {
            cache.delete(key);
        }
    }
}, 60 * 1000); // Run every minute
