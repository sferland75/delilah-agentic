interface CacheEntry<T> {
    data: T;
    timestamp: number;
    hash: string;
}

export class ExtractionCache<T> {
    private cache: Map<string, CacheEntry<T>>;
    private readonly ttl: number; // Time to live in milliseconds

    constructor(ttlMinutes: number = 30) {
        this.cache = new Map();
        this.ttl = ttlMinutes * 60 * 1000;
    }

    /**
     * Generate hash for content
     */
    private generateHash(content: string): string {
        let hash = 0;
        for (let i = 0; i < content.length; i++) {
            const char = content.charCodeAt(i);
            hash = ((hash << 5) - hash) + char;
            hash = hash & hash; // Convert to 32-bit integer
        }
        return hash.toString(16);
    }

    /**
     * Check if cache entry is valid
     */
    private isValid(entry: CacheEntry<T>): boolean {
        return (Date.now() - entry.timestamp) < this.ttl;
    }

    /**
     * Get cached data if available
     */
    get(content: string): T | null {
        const hash = this.generateHash(content);
        const entry = this.cache.get(hash);

        if (entry && this.isValid(entry)) {
            return entry.data;
        }

        if (entry) {
            this.cache.delete(hash);
        }

        return null;
    }

    /**
     * Store data in cache
     */
    set(content: string, data: T): void {
        const hash = this.generateHash(content);
        this.cache.set(hash, {
            data,
            timestamp: Date.now(),
            hash
        });
    }

    /**
     * Clear expired entries
     */
    clearExpired(): void {
        for (const [hash, entry] of this.cache.entries()) {
            if (!this.isValid(entry)) {
                this.cache.delete(hash);
            }
        }
    }

    /**
     * Clear all entries
     */
    clearAll(): void {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    getStats(): {
        totalEntries: number;
        validEntries: number;
        expiredEntries: number;
    } {
        let valid = 0;
        let expired = 0;

        for (const entry of this.cache.values()) {
            if (this.isValid(entry)) {
                valid++;
            } else {
                expired++;
            }
        }

        return {
            totalEntries: this.cache.size,
            validEntries: valid,
            expiredEntries: expired
        };
    }
}
