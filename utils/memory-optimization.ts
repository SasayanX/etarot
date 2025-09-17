/**
 * メモリ最適化ユーティリティ
 * ガベージコレクションとメモリリークの防止
 */

import React, { useEffect, useRef, useCallback } from 'react'

// メモリ監視クラス
export class MemoryMonitor {
  private static instance: MemoryMonitor
  private memoryStats: {
    used: number
    total: number
    limit: number
    timestamp: number
  }[] = []
  private observers: ((stats: any) => void)[] = []
  private intervalId: NodeJS.Timeout | null = null

  static getInstance() {
    if (!MemoryMonitor.instance) {
      MemoryMonitor.instance = new MemoryMonitor()
    }
    return MemoryMonitor.instance
  }

  // メモリ使用量の取得
  getMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return {
        used: 0,
        total: 0,
        limit: 0,
        percentage: 0
      }
    }

    const memory = (performance as any).memory
    const used = memory.usedJSHeapSize
    const total = memory.totalJSHeapSize
    const limit = memory.jsHeapSizeLimit

    return {
      used,
      total,
      limit,
      percentage: (used / limit) * 100
    }
  }

  // メモリ監視の開始
  startMonitoring(interval: number = 5000) {
    if (this.intervalId) return

    this.intervalId = setInterval(() => {
      const stats = this.getMemoryUsage()
      this.memoryStats.push({
        ...stats,
        timestamp: Date.now()
      })

      // 古いデータを削除（最新100件のみ保持）
      if (this.memoryStats.length > 100) {
        this.memoryStats = this.memoryStats.slice(-100)
      }

      // オブザーバーに通知
      this.observers.forEach(observer => observer(stats))
    }, interval)
  }

  // メモリ監視の停止
  stopMonitoring() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  // オブザーバーの追加
  addObserver(observer: (stats: any) => void) {
    this.observers.push(observer)
  }

  // オブザーバーの削除
  removeObserver(observer: (stats: any) => void) {
    this.observers = this.observers.filter(obs => obs !== observer)
  }

  // メモリ統計の取得
  getStats() {
    return {
      current: this.getMemoryUsage(),
      history: this.memoryStats,
      average: this.calculateAverage(),
      peak: this.calculatePeak()
    }
  }

  // 平均メモリ使用量の計算
  private calculateAverage() {
    if (this.memoryStats.length === 0) return 0
    const sum = this.memoryStats.reduce((acc, stat) => acc + stat.used, 0)
    return sum / this.memoryStats.length
  }

  // ピークメモリ使用量の計算
  private calculatePeak() {
    if (this.memoryStats.length === 0) return 0
    return Math.max(...this.memoryStats.map(stat => stat.used))
  }
}

// メモリリーク検出クラス
export class MemoryLeakDetector {
  private static instance: MemoryLeakDetector
  private leakThreshold = 50 * 1024 * 1024 // 50MB
  private checkInterval = 10000 // 10秒
  private intervalId: NodeJS.Timeout | null = null
  private previousMemory = 0
  private consecutiveIncreases = 0

  static getInstance() {
    if (!MemoryLeakDetector.instance) {
      MemoryLeakDetector.instance = new MemoryLeakDetector()
    }
    return MemoryLeakDetector.instance
  }

  // リーク検出の開始
  startDetection() {
    if (this.intervalId) return

    this.intervalId = setInterval(() => {
      const currentMemory = this.getCurrentMemoryUsage()
      
      if (currentMemory > this.previousMemory) {
        this.consecutiveIncreases++
        
        if (this.consecutiveIncreases >= 3) {
          this.handlePotentialLeak(currentMemory)
        }
      } else {
        this.consecutiveIncreases = 0
      }
      
      this.previousMemory = currentMemory
    }, this.checkInterval)
  }

  // リーク検出の停止
  stopDetection() {
    if (this.intervalId) {
      clearInterval(this.intervalId)
      this.intervalId = null
    }
  }

  // 現在のメモリ使用量を取得
  private getCurrentMemoryUsage() {
    if (typeof window === 'undefined' || !('memory' in performance)) {
      return 0
    }
    return (performance as any).memory.usedJSHeapSize
  }

  // 潜在的なリークの処理
  private handlePotentialLeak(currentMemory: number) {
    console.warn('🚨 Potential memory leak detected:', {
      currentMemory: this.formatBytes(currentMemory),
      threshold: this.formatBytes(this.leakThreshold),
      consecutiveIncreases: this.consecutiveIncreases
    })

    // ガベージコレクションを強制実行
    this.forceGarbageCollection()
    
    // 警告をリセット
    this.consecutiveIncreases = 0
  }

  // ガベージコレクションの強制実行
  private forceGarbageCollection() {
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc()
    }
  }

  // バイト数をフォーマット
  private formatBytes(bytes: number) {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }
}

// メモリ最適化フック
export function useMemoryOptimization() {
  const memoryMonitor = useRef(MemoryMonitor.getInstance())
  const leakDetector = useRef(MemoryLeakDetector.getInstance())

  useEffect(() => {
    // メモリ監視の開始
    memoryMonitor.current.startMonitoring()
    leakDetector.current.startDetection()

    return () => {
      // クリーンアップ
      memoryMonitor.current.stopMonitoring()
      leakDetector.current.stopDetection()
    }
  }, [])

  // メモリ統計の取得
  const getMemoryStats = useCallback(() => {
    return memoryMonitor.current.getStats()
  }, [])

  // ガベージコレクションの強制実行
  const forceGC = useCallback(() => {
    if (typeof window !== 'undefined' && 'gc' in window) {
      (window as any).gc()
    }
  }, [])

  return {
    getMemoryStats,
    forceGC
  }
}

// オブジェクトプールクラス
export class ObjectPool<T> {
  private pool: T[] = []
  private createFn: () => T
  private resetFn: (obj: T) => void
  private maxSize: number

  constructor(createFn: () => T, resetFn: (obj: T) => void, maxSize: number = 100) {
    this.createFn = createFn
    this.resetFn = resetFn
    this.maxSize = maxSize
  }

  // オブジェクトの取得
  get(): T {
    if (this.pool.length > 0) {
      return this.pool.pop()!
    }
    return this.createFn()
  }

  // オブジェクトの返却
  release(obj: T) {
    if (this.pool.length < this.maxSize) {
      this.resetFn(obj)
      this.pool.push(obj)
    }
  }

  // プールのクリア
  clear() {
    this.pool = []
  }

  // プールのサイズ
  size() {
    return this.pool.length
  }
}

// メモリ効率的な配列操作
export class MemoryEfficientArray<T> {
  private items: T[] = []
  private deletedIndices: number[] = []

  // アイテムの追加
  add(item: T): number {
    if (this.deletedIndices.length > 0) {
      const index = this.deletedIndices.pop()!
      this.items[index] = item
      return index
    }
    return this.items.push(item) - 1
  }

  // アイテムの削除
  remove(index: number) {
    if (index >= 0 && index < this.items.length) {
      delete this.items[index]
      this.deletedIndices.push(index)
    }
  }

  // アイテムの取得
  get(index: number): T | undefined {
    return this.items[index]
  }

  // 有効なアイテムの取得
  getValidItems(): T[] {
    return this.items.filter((item, index) => 
      item !== undefined && !this.deletedIndices.includes(index)
    )
  }

  // 配列の最適化（削除されたアイテムを実際に削除）
  optimize() {
    const validItems = this.getValidItems()
    this.items = validItems
    this.deletedIndices = []
  }

  // 配列のクリア
  clear() {
    this.items = []
    this.deletedIndices = []
  }

  // 配列のサイズ
  size() {
    return this.items.length - this.deletedIndices.length
  }
}

// メモリ最適化のベストプラクティス
export const MemoryBestPractices = {
  // イベントリスナーのクリーンアップ
  cleanupEventListeners: (element: HTMLElement, events: string[]) => {
    events.forEach(event => {
      element.removeEventListener(event, () => {})
    })
  },

  // タイマーのクリーンアップ
  cleanupTimers: (timers: NodeJS.Timeout[]) => {
    timers.forEach(timer => clearTimeout(timer))
  },

  // インターバルのクリーンアップ
  cleanupIntervals: (intervals: NodeJS.Timeout[]) => {
    intervals.forEach(interval => clearInterval(interval))
  },

  // オブジェクトの深いクリア
  deepClear: (obj: any) => {
    if (obj && typeof obj === 'object') {
      Object.keys(obj).forEach(key => {
        if (obj[key] && typeof obj[key] === 'object') {
          MemoryBestPractices.deepClear(obj[key])
        }
        delete obj[key]
      })
    }
  },

  // 配列のクリア
  clearArray: (arr: any[]) => {
    arr.length = 0
  },

  // マップのクリア
  clearMap: (map: Map<any, any>) => {
    map.clear()
  },

  // セットのクリア
  clearSet: (set: Set<any>) => {
    set.clear()
  }
}

// メモリ使用量の監視フック
export function useMemoryWatcher(threshold: number = 100 * 1024 * 1024) { // 100MB
  const [memoryUsage, setMemoryUsage] = React.useState(0)
  const [isHighMemory, setIsHighMemory] = React.useState(false)

  useEffect(() => {
    const checkMemory = () => {
      if (typeof window !== 'undefined' && 'memory' in performance) {
        const memory = (performance as any).memory.usedJSHeapSize
        setMemoryUsage(memory)
        setIsHighMemory(memory > threshold)
      }
    }

    const interval = setInterval(checkMemory, 5000)
    checkMemory() // 初回実行

    return () => clearInterval(interval)
  }, [threshold])

  return {
    memoryUsage,
    isHighMemory,
    formatBytes: (bytes: number) => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }
  }
}

export default {
  MemoryMonitor,
  MemoryLeakDetector,
  useMemoryOptimization,
  ObjectPool,
  MemoryEfficientArray,
  MemoryBestPractices,
  useMemoryWatcher
}
