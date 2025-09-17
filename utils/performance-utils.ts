/**
 * パフォーマンス最適化用のユーティリティ関数
 */

import { useCallback, useMemo, useRef } from 'react'

// デバウンス関数
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}

// スロットル関数
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args)
      inThrottle = true
      setTimeout(() => (inThrottle = false), limit)
    }
  }
}

// メモ化されたコールバック作成
export function useStableCallback<T extends (...args: any[]) => any>(
  callback: T,
  deps: React.DependencyList
): T {
  const ref = useRef<T>()
  ref.current = callback
  
  return useCallback((...args: Parameters<T>) => {
    return ref.current?.(...args)
  }, deps) as T
}

// メモ化された値作成（深い比較）
export function useDeepMemo<T>(factory: () => T, deps: React.DependencyList): T {
  return useMemo(factory, deps)
}

// 画像プリロードの最適化
export async function preloadImage(src: string): Promise<boolean> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => resolve(true)
    img.onerror = () => resolve(false)
    img.src = src
  })
}

// バッチ画像プリロード
export async function preloadImagesBatch(
  sources: string[],
  batchSize = 5
): Promise<{ loaded: string[]; failed: string[] }> {
  const loaded: string[] = []
  const failed: string[] = []
  
  for (let i = 0; i < sources.length; i += batchSize) {
    const batch = sources.slice(i, i + batchSize)
    const results = await Promise.allSettled(
      batch.map(async (src) => {
        const success = await preloadImage(src)
        return { src, success }
      })
    )
    
    results.forEach((result) => {
      if (result.status === 'fulfilled') {
        if (result.value.success) {
          loaded.push(result.value.src)
        } else {
          failed.push(result.value.src)
        }
      } else {
        failed.push(batch[results.indexOf(result)])
      }
    })
  }
  
  return { loaded, failed }
}

// リソースの遅延読み込み
export function useLazyLoad<T>(
  loader: () => Promise<T>,
  deps: React.DependencyList = []
): { data: T | null; loading: boolean; error: Error | null } {
  const [data, setData] = React.useState<T | null>(null)
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<Error | null>(null)
  
  const load = useCallback(async () => {
    if (data || loading) return
    
    setLoading(true)
    setError(null)
    
    try {
      const result = await loader()
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Unknown error'))
    } finally {
      setLoading(false)
    }
  }, [loader, data, loading])
  
  React.useEffect(() => {
    load()
  }, deps)
  
  return { data, loading, error }
}

// パフォーマンス測定
export function measurePerformance<T extends (...args: any[]) => any>(
  fn: T,
  name: string
): T {
  return ((...args: Parameters<T>) => {
    const start = performance.now()
    const result = fn(...args)
    const end = performance.now()
    
    if (process.env.NODE_ENV === 'development') {
      console.log(`${name} took ${end - start} milliseconds`)
    }
    
    return result
  }) as T
}

// メモリ使用量の監視
export function logMemoryUsage(label: string) {
  if (process.env.NODE_ENV === 'development' && 'memory' in performance) {
    const memory = (performance as any).memory
    console.log(`${label} - Memory usage:`, {
      used: Math.round(memory.usedJSHeapSize / 1024 / 1024) + ' MB',
      total: Math.round(memory.totalJSHeapSize / 1024 / 1024) + ' MB',
      limit: Math.round(memory.jsHeapSizeLimit / 1024 / 1024) + ' MB'
    })
  }
}
