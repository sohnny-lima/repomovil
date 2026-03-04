/**
 * Simple in-memory TTL cache (no extra dependencies).
 * Used to avoid repeated DB queries for public, rarely-changing data.
 */

class SimpleCache {
  constructor() {
    this._store = new Map();
  }

  /**
   * Get a value from cache. Returns undefined if missing or expired.
   * @param {string} key
   */
  get(key) {
    const entry = this._store.get(key);
    if (!entry) return undefined;
    if (Date.now() > entry.expiresAt) {
      this._store.delete(key);
      return undefined;
    }
    return entry.value;
  }

  /**
   * Set a value in cache with a TTL in seconds.
   * @param {string} key
   * @param {*} value
   * @param {number} ttlSeconds
   */
  set(key, value, ttlSeconds = 60) {
    this._store.set(key, {
      value,
      expiresAt: Date.now() + ttlSeconds * 1000,
    });
  }

  /**
   * Delete one or more keys from cache.
   * @param {...string} keys
   */
  invalidate(...keys) {
    keys.forEach((k) => this._store.delete(k));
  }

  /** Clear all cached entries. */
  flush() {
    this._store.clear();
  }
}

// Export a single shared instance
const cache = new SimpleCache();
module.exports = cache;
