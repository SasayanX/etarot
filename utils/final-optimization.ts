/**
 * 最終的なパフォーマンス調整ユーティリティ
 * 全体的な最適化の統合と微調整
 */

import React, { useCallback, useRef, useEffect, useMemo } from 'react'
import { MemoryMonitor } from './memory-optimization'
import { NetworkOptimizer } from './network-optimization'
import { CacheManager } from './network-optimization'

// パフォーマンス監視の統合クラス
export class PerformanceMonitor {
  private static instance: PerformanceMonitor
  private memoryMonitor: MemoryMonitor
  private networkOptimizer: NetworkOptimizer
  private cacheManager: CacheManager
  private performanceMetrics: {
    renderTime: number[]
    memoryUsage: number[]
    networkLatency: number[]
    cacheHitRate: number[]
  } = {
    renderTime: [],
    memoryUsage: [],
    networkLatency: [],
    cacheHitRate: []
  }

  constructor() {
    this.memoryMonitor = MemoryMonitor.getInstance()
    this.networkOptimizer = NetworkOptimizer.getInstance()
    this.cacheManager = CacheManager.getInstance()
  }

  static getInstance() {
    if (!PerformanceMonitor.instance) {
      PerformanceMonitor.instance = new PerformanceMonitor()
    }
    return PerformanceMonitor.instance
  }

  // レンダリング時間の記録
  recordRenderTime(componentName: string, renderTime: number) {
    this.performanceMetrics.renderTime.push(renderTime)
    
    // 最新100件のみ保持
    if (this.performanceMetrics.renderTime.length > 100) {
      this.performanceMetrics.renderTime = this.performanceMetrics.renderTime.slice(-100)
    }

    // 遅いレンダリングの警告
    if (renderTime > 16) { // 60fpsを下回る
      console.warn(`🐌 Slow render: ${componentName} (${renderTime.toFixed(2)}ms)`)
    }
  }

  // メモリ使用量の記録
  recordMemoryUsage() {
    const memoryStats = this.memoryMonitor.getMemoryUsage()
    this.performanceMetrics.memoryUsage.push(memoryStats.used)
    
    if (this.performanceMetrics.memoryUsage.length > 100) {
      this.performanceMetrics.memoryUsage = this.performanceMetrics.memoryUsage.slice(-100)
    }
  }

  // ネットワーク遅延の記録
  recordNetworkLatency(latency: number) {
    this.performanceMetrics.networkLatency.push(latency)
    
    if (this.performanceMetrics.networkLatency.length > 100) {
      this.performanceMetrics.networkLatency = this.performanceMetrics.networkLatency.slice(-100)
    }
  }

  // キャッシュヒット率の記録
  recordCacheHitRate(hitRate: number) {
    this.performanceMetrics.cacheHitRate.push(hitRate)
    
    if (this.performanceMetrics.cacheHitRate.length > 100) {
      this.performanceMetrics.cacheHitRate = this.performanceMetrics.cacheHitRate.slice(-100)
    }
  }

  // パフォーマンスレポートの生成
  generateReport() {
    const renderTimes = this.performanceMetrics.renderTime
    const memoryUsages = this.performanceMetrics.memoryUsage
    const networkLatencies = this.performanceMetrics.networkLatency
    const cacheHitRates = this.performanceMetrics.cacheHitRate

    return {
      rendering: {
        average: renderTimes.length > 0 ? renderTimes.reduce((a, b) => a + b, 0) / renderTimes.length : 0,
        max: renderTimes.length > 0 ? Math.max(...renderTimes) : 0,
        min: renderTimes.length > 0 ? Math.min(...renderTimes) : 0,
        slowRenders: renderTimes.filter(time => time > 16).length
      },
      memory: {
        average: memoryUsages.length > 0 ? memoryUsages.reduce((a, b) => a + b, 0) / memoryUsages.length : 0,
        max: memoryUsages.length > 0 ? Math.max(...memoryUsages) : 0,
        current: this.memoryMonitor.getMemoryUsage()
      },
      network: {
        averageLatency: networkLatencies.length > 0 ? networkLatencies.reduce((a, b) => a + b, 0) / networkLatencies.length : 0,
        maxLatency: networkLatencies.length > 0 ? Math.max(...networkLatencies) : 0
      },
      cache: {
        averageHitRate: cacheHitRates.length > 0 ? cacheHitRates.reduce((a, b) => a + b, 0) / cacheHitRates.length : 0,
        currentStats: this.cacheManager.getStats()
      }
    }
  }

  // 最適化提案の生成
  generateOptimizationSuggestions() {
    const report = this.generateReport()
    const suggestions: string[] = []

    // レンダリング最適化
    if (report.rendering.average > 16) {
      suggestions.push('レンダリング時間が長いです。メモ化やコンポーネント分割を検討してください。')
    }

    if (report.rendering.slowRenders > 10) {
      suggestions.push('遅いレンダリングが頻繁に発生しています。パフォーマンスプロファイリングを実行してください。')
    }

    // メモリ最適化
    if (report.memory.average > 100 * 1024 * 1024) { // 100MB
      suggestions.push('メモリ使用量が高いです。不要なオブジェクトのクリーンアップを検討してください。')
    }

    // ネットワーク最適化
    if (report.network.averageLatency > 1000) { // 1秒
      suggestions.push('ネットワーク遅延が高いです。キャッシュ戦略の見直しを検討してください。')
    }

    // キャッシュ最適化
    if (report.cache.averageHitRate < 0.7) {
      suggestions.push('キャッシュヒット率が低いです。キャッシュ戦略の調整を検討してください。')
    }

    return suggestions
  }
}

// 最適化フック
export function useFinalOptimization() {
  const performanceMonitor = useRef(PerformanceMonitor.getInstance())
  const [isOptimized, setIsOptimized] = React.useState(false)
  const [optimizationSuggestions, setOptimizationSuggestions] = React.useState<string[]>([])

  // パフォーマンス監視の開始
  useEffect(() => {
    const interval = setInterval(() => {
      performanceMonitor.current.recordMemoryUsage()
      
      // 最適化提案の更新
      const suggestions = performanceMonitor.current.generateOptimizationSuggestions()
      setOptimizationSuggestions(suggestions)
      
      // 最適化状態の判定
      const report = performanceMonitor.current.generateReport()
      const isOptimized = 
        report.rendering.average <= 16 &&
        report.memory.average <= 100 * 1024 * 1024 &&
        report.network.averageLatency <= 1000 &&
        report.cache.averageHitRate >= 0.7
      
      setIsOptimized(isOptimized)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  // レンダリング時間の記録
  const recordRenderTime = useCallback((componentName: string, renderTime: number) => {
    performanceMonitor.current.recordRenderTime(componentName, renderTime)
  }, [])

  // パフォーマンスレポートの取得
  const getPerformanceReport = useCallback(() => {
    return performanceMonitor.current.generateReport()
  }, [])

  // 最適化の実行
  const runOptimization = useCallback(async () => {
    const report = performanceMonitor.current.generateReport()
    
    // メモリ最適化
    if (report.memory.average > 100 * 1024 * 1024) {
      if (typeof window !== 'undefined' && 'gc' in window) {
        (window as any).gc()
      }
    }

    // キャッシュ最適化
    if (report.cache.averageHitRate < 0.7) {
      const cacheManager = CacheManager.getInstance()
      cacheManager.clear()
    }

    // レンダリング最適化
    if (report.rendering.average > 16) {
      // 重いコンポーネントの遅延読み込み
      console.log('Consider implementing lazy loading for heavy components')
    }
  }, [])

  return {
    isOptimized,
    optimizationSuggestions,
    recordRenderTime,
    getPerformanceReport,
    runOptimization
  }
}

// パフォーマンス最適化のベストプラクティス
export const PerformanceBestPractices = {
  // コンポーネントの最適化
  optimizeComponent: (componentName: string) => {
    return {
      memoize: true,
      lazyLoad: false,
      virtualize: false,
      debounce: false
    }
  },

  // 画像の最適化
  optimizeImage: (src: string, width: number, height: number) => {
    return {
      src: `${src}?w=${width}&h=${height}&q=85&f=webp`,
      loading: 'lazy' as const,
      decoding: 'async' as const,
      sizes: `(max-width: 768px) ${width}px, ${width}px`
    }
  },

  // ネットワークリクエストの最適化
  optimizeRequest: (url: string, options: RequestInit) => {
    return {
      url,
      options: {
        ...options,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          ...options.headers
        }
      },
      cache: 'default' as RequestCache
    }
  },

  // メモリ使用量の最適化
  optimizeMemory: () => {
    return {
      cleanupInterval: 30000, // 30秒
      maxCacheSize: 50 * 1024 * 1024, // 50MB
      maxCacheEntries: 1000,
      gcThreshold: 100 * 1024 * 1024 // 100MB
    }
  }
}

// パフォーマンステスト用のユーティリティ
export class PerformanceTester {
  private static instance: PerformanceTester
  private testResults: Map<string, number[]> = new Map()

  static getInstance() {
    if (!PerformanceTester.instance) {
      PerformanceTester.instance = new PerformanceTester()
    }
    return PerformanceTester.instance
  }

  // レンダリング時間のテスト
  async testRenderingTime(componentName: string, renderFn: () => void): Promise<number> {
    const startTime = performance.now()
    renderFn()
    const endTime = performance.now()
    const renderTime = endTime - startTime

    const results = this.testResults.get(componentName) || []
    results.push(renderTime)
    this.testResults.set(componentName, results)

    return renderTime
  }

  // メモリ使用量のテスト
  async testMemoryUsage(testName: string, testFn: () => void): Promise<number> {
    const beforeMemory = this.getMemoryUsage()
    testFn()
    const afterMemory = this.getMemoryUsage()
    const memoryDelta = afterMemory - beforeMemory

    const results = this.testResults.get(`memory_${testName}`) || []
    results.push(memoryDelta)
    this.testResults.set(`memory_${testName}`, results)

    return memoryDelta
  }

  // ネットワーク遅延のテスト
  async testNetworkLatency(url: string): Promise<number> {
    const startTime = performance.now()
    
    try {
      await fetch(url, { method: 'HEAD' })
      const endTime = performance.now()
      const latency = endTime - startTime

      const results = this.testResults.get(`network_${url}`) || []
      results.push(latency)
      this.testResults.set(`network_${url}`, results)

      return latency
    } catch (error) {
      return -1
    }
  }

  // メモリ使用量の取得
  private getMemoryUsage(): number {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return 0
    }
    return (performance as any).memory.usedJSHeapSize
  }

  // テスト結果の取得
  getTestResults() {
    const results: Record<string, {
      average: number
      max: number
      min: number
      count: number
    }> = {}

    for (const [testName, values] of this.testResults.entries()) {
      results[testName] = {
        average: values.reduce((a, b) => a + b, 0) / values.length,
        max: Math.max(...values),
        min: Math.min(...values),
        count: values.length
      }
    }

    return results
  }

  // テスト結果のクリア
  clearResults() {
    this.testResults.clear()
  }
}

// 最終的なパフォーマンス調整フック
export function useFinalPerformanceTuning() {
  const performanceMonitor = useRef(PerformanceMonitor.getInstance())
  const performanceTester = useRef(PerformanceTester.getInstance())
  const [isTuning, setIsTuning] = React.useState(false)

  // パフォーマンスチューニングの実行
  const runTuning = useCallback(async () => {
    setIsTuning(true)
    
    try {
      // 1. メモリ最適化
      if (typeof window !== 'undefined' && 'gc' in window) {
        (window as any).gc()
      }

      // 2. キャッシュ最適化
      const cacheManager = CacheManager.getInstance()
      cacheManager.clear()

      // 3. ネットワーク最適化
      const networkOptimizer = NetworkOptimizer.getInstance()
      // プリフェッチの実行
      await networkOptimizer.prefetch([
        '/api/cards',
        '/api/fortune',
        '/api/quiz'
      ])

      // 4. レンダリング最適化
      // 重いコンポーネントの遅延読み込み
      console.log('Performance tuning completed')
      
    } catch (error) {
      console.error('Performance tuning failed:', error)
    } finally {
      setIsTuning(false)
    }
  }, [])

  // パフォーマンステストの実行
  const runPerformanceTest = useCallback(async (testName: string, testFn: () => void) => {
    const renderTime = await performanceTester.current.testRenderingTime(testName, testFn)
    const memoryDelta = await performanceTester.current.testMemoryUsage(testName, testFn)
    
    return {
      renderTime,
      memoryDelta,
      testName
    }
  }, [])

  // テスト結果の取得
  const getTestResults = useCallback(() => {
    return performanceTester.current.getTestResults()
  }, [])

  return {
    isTuning,
    runTuning,
    runPerformanceTest,
    getTestResults
  }
}

export default {
  PerformanceMonitor,
  useFinalOptimization,
  PerformanceBestPractices,
  PerformanceTester,
  useFinalPerformanceTuning
}
