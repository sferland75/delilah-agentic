interface CacheEntry<T> {
  value: T;
  timestamp: number;
  key: string;
}

export interface CacheOptions {
  ttl: number;        // Time to live in milliseconds
  maxSize: number;    // Maximum number of items to cache
}

export const defaultCacheOptions: CacheOptions = {
  ttl: 30 * 60 * 1000,  // 30 minutes
  maxSize: 100
};

export class CacheManager<T> {
  private cache: Map<string, CacheEntry<T>>;
  private options: CacheOptions;

  constructor(options: Partial<CacheOptions> = {}) {
    this.options = { ...defaultCacheOptions, ...options };
    this.cache = new Map();
  }

  private generateKey(data: any): string {
    // Simple key generation - could be made more sophisticated
    return typeof data === 'string' 
      ? data 
      : JSON.stringify(data);
  }

  private isExpired(entry: CacheEntry<T>): boolean {
    const now = Date.now();
    return (now - entry.timestamp) > this.options.ttl;
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, entry] of this.cache.entries()) {
      if (this.isExpired(entry)) {
        this.cache.delete(key);
      }
    }
  }

  set(key: string, value: T): void {
    // Clean up expired entries first
    this.cleanup();

    // If we're at capacity, remove oldest entry
    if (this.cache.size >= this.options.maxSize) {
      const oldestKey = Array.from(this.cache.entries())
        .sort(([, a], [, b]) => a.timestamp - b.timestamp)[0][0];
      this.cache.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      key
    });
  }

  get(key: string): T | null {
    const entry = this.cache.get(key);
    
    if (!entry) {
      return null;
    }

    if (this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  clear(): void {
    this.cache.clear();
  }

  getStats(): {
    size: number;
    oldestEntry: number;
    newestEntry: number;
  } {
    const entries = Array.from(this.cache.values());
    return {
      size: this.cache.size,
      oldestEntry: Math.min(...entries.map(e => e.timestamp)),
      newestEntry: Math.max(...entries.map(e => e.timestamp))
    };
  }
}