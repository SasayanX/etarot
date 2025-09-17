/**
 * メモ化最適化ユーティリティ
 * パフォーマンス向上のためのメモ化戦略
 */

import React, { memo, useMemo, useCallback, useRef, useEffect } from 'react'

// 深い比較のためのユーティリティ
export const deepEqual = (a: any, b: any): boolean => {
  if (a === b) return true
  if (a == null || b == null) return false
  if (typeof a !== typeof b) return false
  
  if (typeof a === 'object') {
    if (Array.isArray(a) !== Array.isArray(b)) return false
    
    if (Array.isArray(a)) {
      if (a.length !== b.length) return false
      return a.every((val, index) => deepEqual(val, b[index]))
    }
    
    const keysA = Object.keys(a)
    const keysB = Object.keys(b)
    
    if (keysA.length !== keysB.length) return false
    
    return keysA.every(key => deepEqual(a[key], b[key]))
  }
  
  return false
}

// カスタム比較関数付きのmemo
export const memoWithCustomCompare = <T extends React.ComponentType<any>>(
  Component: T,
  areEqual?: (prevProps: React.ComponentProps<T>, nextProps: React.ComponentProps<T>) => boolean
) => {
  return memo(Component, areEqual || deepEqual)
}

// 安定したコールバック作成
export const useStableCallback = <T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T => {
  const ref = useRef<T>()
  ref.current = callback
  
  return useCallback((...args: Parameters<T>) => {
    return ref.current?.(...args)
  }, deps) as T
}

// 安定した値作成（深い比較）
export const useStableValue = <T>(value: T, deps: React.DependencyList): T => {
  return useMemo(() => value, deps)
}

// デバウンス付きの値
export const useDebouncedValue = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = React.useState<T>(value)
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)
    
    return () => clearTimeout(timer)
  }, [value, delay])
  
  return debouncedValue
}

// スロットル付きの値
export const useThrottledValue = <T>(value: T, delay: number): T => {
  const [throttledValue, setThrottledValue] = React.useState<T>(value)
  const lastUpdateTime = useRef<number>(0)
  
  useEffect(() => {
    const now = Date.now()
    
    if (now - lastUpdateTime.current >= delay) {
      setThrottledValue(value)
      lastUpdateTime.current = now
    } else {
      const timer = setTimeout(() => {
        setThrottledValue(value)
        lastUpdateTime.current = Date.now()
      }, delay - (now - lastUpdateTime.current))
      
      return () => clearTimeout(timer)
    }
  }, [value, delay])
  
  return throttledValue
}

// 条件付きメモ化
export const useConditionalMemo = <T>(
  factory: () => T,
  deps: React.DependencyList,
  condition: boolean
): T => {
  return useMemo(() => {
    if (condition) {
      return factory()
    }
    return factory()
  }, condition ? deps : [])
}

// メモ化の統計情報
export const useMemoStats = () => {
  const stats = React.useRef({
    memoHits: 0,
    memoMisses: 0,
    totalRenders: 0
  })
  
  const recordMemoHit = useCallback(() => {
    stats.current.memoHits++
  }, [])
  
  const recordMemoMiss = useCallback(() => {
    stats.current.memoMisses++
  }, [])
  
  const recordRender = useCallback(() => {
    stats.current.totalRenders++
  }, [])
  
  const getStats = useCallback(() => {
    const { memoHits, memoMisses, totalRenders } = stats.current
    const hitRate = totalRenders > 0 ? (memoHits / totalRenders) * 100 : 0
    
    return {
      memoHits,
      memoMisses,
      totalRenders,
      hitRate: Math.round(hitRate * 100) / 100
    }
  }, [])
  
  const resetStats = useCallback(() => {
    stats.current = {
      memoHits: 0,
      memoMisses: 0,
      totalRenders: 0
    }
  }, [])
  
  return {
    recordMemoHit,
    recordMemoMiss,
    recordRender,
    getStats,
    resetStats
  }
}

// パフォーマンス監視付きのmemo
export const memoWithPerformanceMonitoring = <T extends React.ComponentType<any>>(
  Component: T,
  componentName?: string
) => {
  return memo((props: React.ComponentProps<T>) => {
    const renderStartTime = useRef<number>(0)
    const { recordRender } = useMemoStats()
    
    useEffect(() => {
      renderStartTime.current = performance.now()
      recordRender()
      
      return () => {
        const renderTime = performance.now() - renderStartTime.current
        if (process.env.NODE_ENV === 'development' && renderTime > 16) {
          console.warn(`🐌 遅いレンダリング: ${componentName || 'Unknown'} (${renderTime.toFixed(2)}ms)`)
        }
      }
    })
    
    return React.createElement(Component, props)
  })
}

// メモ化のベストプラクティス
export const memoizationBestPractices = {
  // 小さなコンポーネントはメモ化しない
  shouldMemoize: (componentSize: number, renderFrequency: number) => {
    return componentSize > 50 || renderFrequency > 10
  },
  
  // 依存関係の最適化
  optimizeDeps: (deps: React.DependencyList) => {
    return deps.filter(dep => dep !== undefined && dep !== null)
  },
  
  // コールバックの最適化
  optimizeCallback: (callback: Function, deps: React.DependencyList) => {
    // 依存関係が空の場合は、コールバックを安定化
    if (deps.length === 0) {
      return useCallback(callback, [])
    }
    return useCallback(callback, deps)
  }
}

export default {
  memoWithCustomCompare,
  useStableCallback,
  useStableValue,
  useDebouncedValue,
  useThrottledValue,
  useConditionalMemo,
  useMemoStats,
  memoWithPerformanceMonitoring,
  memoizationBestPractices
}
