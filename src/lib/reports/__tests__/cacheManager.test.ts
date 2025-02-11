import { CacheManager, defaultCacheOptions } from '../cacheManager';

describe('CacheManager', () => {
  let cache: CacheManager<string>;

  beforeEach(() => {
    cache = new CacheManager();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('stores and retrieves values', () => {
    cache.set('test-key', 'test-value');
    expect(cache.get('test-key')).toBe('test-value');
  });

  it('returns null for non-existent keys', () => {
    expect(cache.get('non-existent')).toBeNull();
  });

  it('respects TTL and removes expired entries', () => {
    cache.set('test-key', 'test-value');
    
    // Move forward in time past TTL
    jest.advanceTimersByTime(defaultCacheOptions.ttl + 1000);
    
    expect(cache.get('test-key')).toBeNull();
  });

  it('enforces maximum size limit', () => {
    // Add more items than max size
    for (let i = 0; i < defaultCacheOptions.maxSize + 5; i++) {
      cache.set(`key-${i}`, `value-${i}`);
    }

    // Check that oldest entries were removed
    expect(cache.get('key-0')).toBeNull();
    expect(cache.get('key-1')).toBeNull();
    expect(cache.get(`key-${defaultCacheOptions.maxSize + 4}`)).not.toBeNull();
  });

  it('handles custom options', () => {
    const customCache = new CacheManager<string>({
      ttl: 1000,
      maxSize: 2
    });

    customCache.set('key1', 'value1');
    customCache.set('key2', 'value2');
    customCache.set('key3', 'value3');

    expect(customCache.get('key1')).toBeNull();
    expect(customCache.get('key3')).toBe('value3');
  });

  it('clears all entries', () => {
    cache.set('key1', 'value1');
    cache.set('key2', 'value2');
    
    cache.clear();
    
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBeNull();
  });

  it('provides accurate cache statistics', () => {
    const timestamp = Date.now();
    jest.setSystemTime(timestamp);

    cache.set('key1', 'value1');
    jest.advanceTimersByTime(1000);
    cache.set('key2', 'value2');

    const stats = cache.getStats();
    expect(stats.size).toBe(2);
    expect(stats.oldestEntry).toBe(timestamp);
    expect(stats.newestEntry).toBe(timestamp + 1000);
  });

  it('handles cleanup of expired entries', () => {
    cache.set('key1', 'value1');
    jest.advanceTimersByTime(defaultCacheOptions.ttl / 2);
    cache.set('key2', 'value2');
    
    jest.advanceTimersByTime(defaultCacheOptions.ttl / 2 + 1000);

    // key1 should be expired, key2 should still be valid
    expect(cache.get('key1')).toBeNull();
    expect(cache.get('key2')).toBe('value2');
  });

  it('preserves type safety', () => {
    const numberCache = new CacheManager<number>();
    numberCache.set('number', 42);
    
    const value = numberCache.get('number');
    expect(typeof value).toBe('number');
  });

  it('handles complex objects', () => {
    interface TestObject {
      id: number;
      data: string[];
    }

    const objectCache = new CacheManager<TestObject>();
    const testObject = { id: 1, data: ['test'] };
    
    objectCache.set('object', testObject);
    const retrieved = objectCache.get('object');
    
    expect(retrieved).toEqual(testObject);
  });
});