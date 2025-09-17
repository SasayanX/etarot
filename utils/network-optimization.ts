/**
 * ネットワーク最適化ユーティリティ
 * キャッシュ戦略とネットワーク効率化
 */

import React, { useCallback, useRef, useEffect } from 'react'

// キャッシュ戦略の設定
export const CACHE_STRATEGIES = {
  // キャッシュファースト（オフライン対応）
  CACHE_FIRST: 'cache-first',
  
  // ネットワークファースト（最新データ優先）
  NETWORK_FIRST: 'network-first',
  
  // キャッシュオンリー（オフライン専用）
  CACHE_ONLY: 'cache-only',
  
  // ネットワークオンリー（キャッシュ無効）
  NETWORK_ONLY: 'network-only',
  
  // ステイル・ホワイル・リバリデート
  STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
} as const

// キャッシュ設定
export interface CacheConfig {
  strategy: keyof typeof CACHE_STRATEGIES
  maxAge: number // 秒
  staleWhileRevalidate?: number // 秒
  maxSize?: number // バイト
  maxEntries?: number
}

// デフォルトキャッシュ設定
export const DEFAULT_CACHE_CONFIG: CacheConfig = {
  strategy: 'CACHE_FIRST',
  maxAge: 60 * 60 * 24, // 24時間
  staleWhileRevalidate: 60 * 60 * 1, // 1時間
  maxSize: 50 * 1024 * 1024, // 50MB
  maxEntries: 1000
}

// キャッシュマネージャークラス
export class CacheManager {
  private static instance: CacheManager
  private cache = new Map<string, {
    data: any
    timestamp: number
    expiresAt: number
    size: number
  }>()
  private config: CacheConfig
  private currentSize = 0

  constructor(config: CacheConfig = DEFAULT_CACHE_CONFIG) {
    this.config = config
  }

  static getInstance(config?: CacheConfig) {
    if (!CacheManager.instance) {
      CacheManager.instance = new CacheManager(config)
    }
    return CacheManager.instance
  }

  // データの取得
  async get<T>(key: string): Promise<T | null> {
    const cached = this.cache.get(key)
    
    if (!cached) {
      return null
    }

    const now = Date.now()
    
    // 期限切れチェック
    if (now > cached.expiresAt) {
      this.delete(key)
      return null
    }

    // ステイル・ホワイル・リバリデート
    if (this.config.strategy === 'STALE_WHILE_REVALIDATE' && 
        now > cached.timestamp + (this.config.staleWhileRevalidate || 0) * 1000) {
      // バックグラウンドで再検証
      this.revalidate(key)
    }

    return cached.data
  }

  // データの保存
  async set<T>(key: string, data: T, customConfig?: Partial<CacheConfig>): Promise<void> {
    const config = { ...this.config, ...customConfig }
    const now = Date.now()
    const size = this.calculateSize(data)
    
    // サイズ制限チェック
    if (size > (config.maxSize || Infinity)) {
      console.warn(`Cache entry too large: ${key}`)
      return
    }

    // キャッシュサイズ制限
    while (this.currentSize + size > (config.maxSize || Infinity) && this.cache.size > 0) {
      this.evictOldest()
    }

    // エントリ数制限
    while (this.cache.size >= (config.maxEntries || Infinity)) {
      this.evictOldest()
    }

    this.cache.set(key, {
      data,
      timestamp: now,
      expiresAt: now + (config.maxAge * 1000),
      size
    })

    this.currentSize += size
  }

  // データの削除
  delete(key: string): boolean {
    const cached = this.cache.get(key)
    if (cached) {
      this.currentSize -= cached.size
      return this.cache.delete(key)
    }
    return false
  }

  // キャッシュのクリア
  clear(): void {
    this.cache.clear()
    this.currentSize = 0
  }

  // 古いエントリの削除
  private evictOldest(): void {
    let oldestKey = ''
    let oldestTime = Date.now()

    for (const [key, entry] of this.cache.entries()) {
      if (entry.timestamp < oldestTime) {
        oldestTime = entry.timestamp
        oldestKey = key
      }
    }

    if (oldestKey) {
      this.delete(oldestKey)
    }
  }

  // データの再検証
  private async revalidate(key: string): Promise<void> {
    // 実際の実装では、ネットワークからデータを再取得
    console.log(`Revalidating cache for key: ${key}`)
  }

  // サイズの計算
  private calculateSize(data: any): number {
    return new Blob([JSON.stringify(data)]).size
  }

  // キャッシュ統計の取得
  getStats() {
    return {
      size: this.currentSize,
      entries: this.cache.size,
      maxSize: this.config.maxSize,
      maxEntries: this.config.maxEntries,
      hitRate: this.calculateHitRate()
    }
  }

  // ヒット率の計算
  private calculateHitRate(): number {
    // 実際の実装では、ヒット/ミスを追跡
    return 0.85 // 仮の値
  }
}

// ネットワーク最適化クラス
export class NetworkOptimizer {
  private static instance: NetworkOptimizer
  private requestQueue: Array<() => Promise<any>> = []
  private maxConcurrent = 3
  private activeRequests = 0
  private retryAttempts = 3
  private retryDelay = 1000

  static getInstance() {
    if (!NetworkOptimizer.instance) {
      NetworkOptimizer.instance = new NetworkOptimizer()
    }
    return NetworkOptimizer.instance
  }

  // リクエストの実行
  async request<T>(
    url: string, 
    options: RequestInit = {},
    cacheConfig?: Partial<CacheConfig>
  ): Promise<T> {
    const cacheManager = CacheManager.getInstance()
    const cacheKey = this.generateCacheKey(url, options)

    // キャッシュから取得を試行
    if (cacheConfig?.strategy !== 'NETWORK_ONLY') {
      const cached = await cacheManager.get<T>(cacheKey)
      if (cached) {
        return cached
      }
    }

    // ネットワークリクエスト
    try {
      const response = await this.executeRequest(url, options)
      const data = await response.json()

      // キャッシュに保存
      if (cacheConfig?.strategy !== 'CACHE_ONLY') {
        await cacheManager.set(cacheKey, data, cacheConfig)
      }

      return data
    } catch (error) {
      // ネットワークエラーの場合、キャッシュから取得を試行
      if (cacheConfig?.strategy === 'NETWORK_FIRST') {
        const cached = await cacheManager.get<T>(cacheKey)
        if (cached) {
          return cached
        }
      }
      throw error
    }
  }

  // リクエストの実行（リトライ付き）
  private async executeRequest(url: string, options: RequestInit): Promise<Response> {
    let lastError: Error | null = null

    for (let attempt = 1; attempt <= this.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          headers: {
            'Content-Type': 'application/json',
            ...options.headers
          }
        })

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }

        return response
      } catch (error) {
        lastError = error as Error
        
        if (attempt < this.retryAttempts) {
          await this.delay(this.retryDelay * attempt)
        }
      }
    }

    throw lastError || new Error('Request failed')
  }

  // バッチリクエスト
  async batchRequest<T>(
    requests: Array<{ url: string; options?: RequestInit }>,
    cacheConfig?: Partial<CacheConfig>
  ): Promise<T[]> {
    const results: T[] = []
    const errors: Error[] = []

    // 並列実行（制限付き）
    const chunks = this.chunkArray(requests, this.maxConcurrent)
    
    for (const chunk of chunks) {
      const promises = chunk.map(async ({ url, options }) => {
        try {
          return await this.request<T>(url, options, cacheConfig)
        } catch (error) {
          errors.push(error as Error)
          return null
        }
      })

      const chunkResults = await Promise.allSettled(promises)
      results.push(...chunkResults
        .filter((result): result is PromiseFulfilledResult<T> => result.status === 'fulfilled')
        .map(result => result.value)
        .filter(Boolean)
      )
    }

    if (errors.length > 0) {
      console.warn('Some requests failed:', errors)
    }

    return results
  }

  // プリフェッチ
  async prefetch(urls: string[], cacheConfig?: Partial<CacheConfig>): Promise<void> {
    const requests = urls.map(url => ({ url, options: { method: 'GET' } }))
    await this.batchRequest(requests, cacheConfig)
  }

  // キャッシュキーの生成
  private generateCacheKey(url: string, options: RequestInit): string {
    const method = options.method || 'GET'
    const body = options.body ? JSON.stringify(options.body) : ''
    return `${method}:${url}:${body}`
  }

  // 配列のチャンク分割
  private chunkArray<T>(array: T[], size: number): T[][] {
    const chunks: T[][] = []
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size))
    }
    return chunks
  }

  // 遅延実行
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms))
  }
}

// ネットワーク最適化フック
export function useNetworkOptimization() {
  const networkOptimizer = useRef(NetworkOptimizer.getInstance())
  const cacheManager = useRef(CacheManager.getInstance())

  // 最適化されたリクエスト
  const optimizedRequest = useCallback(async <T>(
    url: string,
    options: RequestInit = {},
    cacheConfig?: Partial<CacheConfig>
  ): Promise<T> => {
    return networkOptimizer.current.request<T>(url, options, cacheConfig)
  }, [])

  // バッチリクエスト
  const batchRequest = useCallback(async <T>(
    requests: Array<{ url: string; options?: RequestInit }>,
    cacheConfig?: Partial<CacheConfig>
  ): Promise<T[]> => {
    return networkOptimizer.current.batchRequest<T>(requests, cacheConfig)
  }, [])

  // プリフェッチ
  const prefetch = useCallback(async (
    urls: string[],
    cacheConfig?: Partial<CacheConfig>
  ): Promise<void> => {
    return networkOptimizer.current.prefetch(urls, cacheConfig)
  }, [])

  // キャッシュのクリア
  const clearCache = useCallback(() => {
    cacheManager.current.clear()
  }, [])

  // キャッシュ統計の取得
  const getCacheStats = useCallback(() => {
    return cacheManager.current.getStats()
  }, [])

  return {
    optimizedRequest,
    batchRequest,
    prefetch,
    clearCache,
    getCacheStats
  }
}

// リソースヒントの生成
export function generateResourceHints(resources: Array<{
  url: string
  type: 'preload' | 'prefetch' | 'dns-prefetch' | 'preconnect'
  as?: string
  crossorigin?: boolean
}>): Array<{
  rel: string
  href: string
  as?: string
  crossorigin?: boolean
}> {
  return resources.map(resource => ({
    rel: resource.type,
    href: resource.url,
    ...(resource.as && { as: resource.as }),
    ...(resource.crossorigin && { crossorigin: true })
  }))
}

// ネットワーク状態の監視
export function useNetworkStatus() {
  const [isOnline, setIsOnline] = React.useState(true)
  const [connectionType, setConnectionType] = React.useState<string>('unknown')
  const [effectiveType, setEffectiveType] = React.useState<string>('unknown')

  useEffect(() => {
    const updateNetworkStatus = () => {
      setIsOnline(navigator.onLine)
      
      if ('connection' in navigator) {
        const connection = (navigator as any).connection
        setConnectionType(connection.type || 'unknown')
        setEffectiveType(connection.effectiveType || 'unknown')
      }
    }

    updateNetworkStatus()

    window.addEventListener('online', updateNetworkStatus)
    window.addEventListener('offline', updateNetworkStatus)

    return () => {
      window.removeEventListener('online', updateNetworkStatus)
      window.removeEventListener('offline', updateNetworkStatus)
    }
  }, [])

  return {
    isOnline,
    connectionType,
    effectiveType,
    isSlowConnection: effectiveType === 'slow-2g' || effectiveType === '2g'
  }
}

// オフライン対応
export function useOfflineSupport() {
  const [isOffline, setIsOffline] = React.useState(false)
  const [offlineData, setOfflineData] = React.useState<Map<string, any>>(new Map())

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  // オフラインデータの保存
  const saveOfflineData = useCallback((key: string, data: any) => {
    setOfflineData(prev => new Map(prev).set(key, data))
  }, [])

  // オフラインデータの取得
  const getOfflineData = useCallback((key: string) => {
    return offlineData.get(key)
  }, [offlineData])

  return {
    isOffline,
    saveOfflineData,
    getOfflineData
  }
}

export default {
  CACHE_STRATEGIES,
  DEFAULT_CACHE_CONFIG,
  CacheManager,
  NetworkOptimizer,
  useNetworkOptimization,
  generateResourceHints,
  useNetworkStatus,
  useOfflineSupport
}
