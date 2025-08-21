interface CacheEntry<T> {
  data: T;
  expiresAt: number;
  timestamp: number;
}

interface CatalogCacheOptions {
  ttl?: number;
}

class CatalogCacheService {
  private cache = new Map<string, CacheEntry<any>>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutes

  private generateKey(catalog: string, linkType: 'CATALOG' | 'LIST', searchTerm?: string): string {
    const base = `${linkType}:${catalog}`;
    return searchTerm ? `${base}:${searchTerm}` : base;
  }

  private isExpired(entry: CacheEntry<any>): boolean {
    return Date.now() > entry.expiresAt;
  }

  get<T>(catalog: string, linkType: 'CATALOG' | 'LIST', searchTerm?: string): null | T {
    const key = this.generateKey(catalog, linkType, searchTerm);
    const entry = this.cache.get(key);

    if (!entry || this.isExpired(entry)) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  set<T>(
    catalog: string,
    linkType: 'CATALOG' | 'LIST',
    data: T,
    searchTerm?: string,
    options: CatalogCacheOptions = {},
  ): void {
    const key = this.generateKey(catalog, linkType, searchTerm);
    const ttl = options.ttl ?? this.defaultTTL;

    this.cache.set(key, {
      data,
      expiresAt: Date.now() + ttl,
      timestamp: Date.now(),
    });
  }

  invalidate(catalog: string, linkType?: 'CATALOG' | 'LIST'): void {
    if (linkType) {
      const prefix = `${linkType}:${catalog}`;
      for (const key of this.cache.keys()) {
        if (key.startsWith(prefix)) {
          this.cache.delete(key);
        }
      }
    } else {
      // Invalidate all entries for catalog
      for (const key of this.cache.keys()) {
        if (key.includes(`:${catalog}`)) {
          this.cache.delete(key);
        }
      }
    }
  }

  clear(): void {
    this.cache.clear();
  }

  // Get cache stats for debugging
  getStats() {
    const now = Date.now();
    let valid = 0;
    let expired = 0;

    for (const entry of this.cache.values()) {
      if (now > entry.expiresAt) {
        expired++;
      } else {
        valid++;
      }
    }

    return {
      expired,
      total: this.cache.size,
      valid,
    };
  }
}

export const catalogCacheService = new CatalogCacheService();
