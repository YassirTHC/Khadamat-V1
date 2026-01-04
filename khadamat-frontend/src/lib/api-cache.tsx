// @ts-nocheck
'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import apiClient from './api/client';

/**
 * Intelligent API Caching Layer
 *
 * This module provides a comprehensive caching solution for API requests
 * with support for TTL, cache invalidation, and request deduplication.
 */

// Cache entry type
interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number;
  status: 'fresh' | 'stale' | 'loading';
}

// Cache storage type
type ApiCache = Map<string, CacheEntry<any>>;

/**
 * Generate cache key from request parameters
 */
function generateCacheKey(method: string, url: string, params?: any): string {
  const paramString = params ? JSON.stringify(params) : '';
  return `${method}:${url}:${paramString}`;
}

/**
 * Check if cache entry is still valid
 */
function isCacheValid(entry: CacheEntry<any>): boolean {
  return Date.now() - entry.timestamp < entry.ttl;
}

/**
 * Main cache manager class
 */
class ApiCacheManager {
  private cache: ApiCache;
  private pending: Map<string, Promise<any>>;

  constructor() {
    this.cache = new Map();
    this.pending = new Map();
  }

  /**
   * Get cached data if available and valid
   */
  get<T>(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (isCacheValid(entry)) {
      return entry.data;
    }

    return null;
  }

  /**
   * Set cache entry with TTL
   */
  set<T>(key: string, data: T, ttl: number = 300000): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
      status: 'fresh'
    });
  }

  /**
   * Invalidate cache entry
   */
  invalidate(key: string): void {
    this.cache.delete(key);
  }

  /**
   * Clear all cache entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get pending request or create new one
   */
  getPending<T>(key: string, requestFn: () => Promise<T>): Promise<T> {
    if (this.pending.has(key)) {
      return this.pending.get(key)!;
    }

    const promise = requestFn().finally(() => {
      this.pending.delete(key);
    });

    this.pending.set(key, promise);
    return promise;
  }
}

// Global cache manager instance
export const cacheManager = new ApiCacheManager();

/**
 * React hook for cached API requests
 */
export function useApiCache<T>(
  method: 'get' | 'post' | 'put' | 'patch' | 'delete',
  url: string,
  params?: any,
  options: {
    ttl?: number;
    cacheKey?: string;
    enabled?: boolean;
    onSuccess?: (data: T) => void;
    onError?: (error: any) => void;
  } = {}
): {
  data: T | null;
  loading: boolean;
  error: any;
  refresh: () => Promise<T>;
  invalidate: () => void;
} {
  const {
    ttl = 300000, // 5 minutes default
    cacheKey: customCacheKey,
    enabled = true,
    onSuccess,
    onError
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<any>(null);
  const cacheKey = useMemo(() => customCacheKey || generateCacheKey(method, url, params), [method, url, params, customCacheKey]);

  // Check cache on mount
  useEffect(() => {
    if (!enabled) return;

    const cachedData = cacheManager.get<T>(cacheKey);
    if (cachedData) {
      setData(cachedData);
    }
  }, [cacheKey, enabled]);

  // Memoized fetch function
  const fetchData = useCallback(async (): Promise<T> => {
    if (!enabled) {
      throw new Error('Cache disabled');
    }

    // Check cache first
    const cachedData = cacheManager.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    setLoading(true);
    setError(null);

    try {
      // Use pending request if exists to prevent duplicate calls
      const response = await cacheManager.getPending(cacheKey, async () => {
        let response;
        switch (method) {
          case 'get':
            response = await apiClient.get<T>(url, { params });
            break;
          case 'post':
            response = await apiClient.post<T>(url, params);
            break;
          case 'put':
            response = await apiClient.put<T>(url, params);
            break;
          case 'patch':
            response = await apiClient.patch<T>(url, params);
            break;
          case 'delete':
            response = await apiClient.delete<T>(url, { params });
            break;
          default:
            throw new Error(`Unsupported method: ${method}`);
        }
        return response.data;
      });

      // Cache the response
      cacheManager.set(cacheKey, response, ttl);
      setData(response);

      if (onSuccess) {
        onSuccess(response);
      }

      return response;
    } catch (err) {
      setError(err);
      if (onError) {
        onError(err);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, [method, url, params, cacheKey, ttl, enabled, onSuccess, onError]);

  // Refresh function
  const refresh = useCallback(async () => {
    return fetchData();
  }, [fetchData]);

  // Invalidate cache
  const invalidate = useCallback(() => {
    cacheManager.invalidate(cacheKey);
    setData(null);
  }, [cacheKey]);

  return {
    data,
    loading,
    error,
    refresh,
    invalidate
  };
}

/**
 * Cached API client with automatic caching
 */
export class CachedApiClient {
  private cacheManager: ApiCacheManager;

  constructor() {
    this.cacheManager = new ApiCacheManager();
  }

  async get<T>(url: string, params?: any, ttl: number = 300000): Promise<T> {
    const cacheKey = generateCacheKey('get', url, params);

    // Check cache first
    const cachedData = this.cacheManager.get<T>(cacheKey);
    if (cachedData) {
      return cachedData;
    }

    // Make request
    const response = await apiClient.get<T>(url, { params });
    const data = response.data;

    // Cache the response
    this.cacheManager.set(cacheKey, data, ttl);

    return data;
  }

  async post<T>(url: string, data: any, ttl: number = 300000): Promise<T> {
    const cacheKey = generateCacheKey('post', url, data);

    // Make request (POST requests are not typically cached, but we support it)
    const response = await apiClient.post<T>(url, data);
    const responseData = response.data;

    // Cache the response
    this.cacheManager.set(cacheKey, responseData, ttl);

    return responseData;
  }

  // Invalidate cache for specific endpoint
  invalidate(url: string, method: string = 'get', params?: any): void {
    const cacheKey = generateCacheKey(method, url, params);
    this.cacheManager.invalidate(cacheKey);
  }

  // Clear all cache
  clearCache(): void {
    this.cacheManager.clear();
  }
}

/**
 * Cache provider for React context
 */
export const ApiCacheContext = React.createContext<{
  cacheManager: ApiCacheManager;
  cachedClient: CachedApiClient;
}>({
  cacheManager: new ApiCacheManager(),
  cachedClient: new CachedApiClient()
});

/**
 * Cache provider component
 */
export function ApiCacheProvider({ children }: { children: React.ReactNode }) {
  // ✅ CORRECTION : Utilisation de useMemo (stable) au lieu de useRef.current
  // Cela évite l'erreur "Cannot access refs during render"
  const cacheContextValue = useMemo(() => ({
    cacheManager: new ApiCacheManager(),
    cachedClient: new CachedApiClient()
  }), []);

  return (
    <ApiCacheContext.Provider value={cacheContextValue}>
      {children}
    </ApiCacheContext.Provider>
  );
}

/**
 * Hook to use cache context
 */
export function useApiCacheContext() {
  return React.useContext(ApiCacheContext);
}

/**
 * Cache strategy constants
 */
export const CacheStrategies = {
  // Short-lived cache (1 minute)
  SHORT: 60000,
  // Medium cache (5 minutes)
  MEDIUM: 300000,
  // Long cache (30 minutes)
  LONG: 1800000,
  // Session cache (until invalidated)
  SESSION: Number.MAX_SAFE_INTEGER,
  // No cache
  NONE: 0
};

/**
 * Cache invalidation strategies
 */
export function createCacheInvalidator() {
  const invalidators = new Map<string, (() => void)[]>();

  function onInvalidate(key: string, callback: () => void) {
    if (!invalidators.has(key)) {
      invalidators.set(key, []);
    }
    invalidators.get(key)!.push(callback);
  }

  function invalidate(key: string) {
    const callbacks = invalidators.get(key);
    if (callbacks) {
      callbacks.forEach(callback => callback());
    }
    invalidators.delete(key);
  }

  return {
    onInvalidate,
    invalidate
  };
}
