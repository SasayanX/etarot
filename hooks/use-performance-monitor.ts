/**
 * パフォーマンス監視フック
 * リアルタイムでパフォーマンスを監視・最適化
 */

import React, { useEffect, useRef, useState, useCallback } from 'react'

interface PerformanceMetrics {
  renderTime: number
  memoryUsage: number
  bundleSize: number
  imageLoadTime: number
  componentCount: number
}

interface PerformanceConfig {
  enableMemoryMonitoring: boolean
  enableRenderTiming: boolean
  enableBundleAnalysis: boolean
  sampleRate: number // 0-1, 監視の頻度
}

const defaultConfig: PerformanceConfig = {
  enableMemoryMonitoring: true,
  enableRenderTiming: true,
  enableBundleAnalysis: false,
  sampleRate: 0.1 // 10%の確率で監視
}

export const usePerformanceMonitor = (config: Partial<PerformanceConfig> = {}) => {
  const finalConfig = { ...defaultConfig, ...config }
  const [metrics, setMetrics] = useState<PerformanceMetrics>({
    renderTime: 0,
    memoryUsage: 0,
    bundleSize: 0,
    imageLoadTime: 0,
    componentCount: 0
  })
  
  const renderStartTime = useRef<number>(0)
  const componentCount = useRef<number>(0)
  const imageLoadTimes = useRef<number[]>([])

  // レンダリング時間の測定開始
  const startRenderTiming = useCallback(() => {
    if (finalConfig.enableRenderTiming && Math.random() < finalConfig.sampleRate) {
      renderStartTime.current = performance.now()
    }
  }, [finalConfig])

  // レンダリング時間の測定終了
  const endRenderTiming = useCallback(() => {
    if (finalConfig.enableRenderTiming && renderStartTime.current > 0) {
      const renderTime = performance.now() - renderStartTime.current
      setMetrics(prev => ({ ...prev, renderTime }))
      renderStartTime.current = 0
    }
  }, [finalConfig])

  // メモリ使用量の監視
  const measureMemoryUsage = useCallback(() => {
    if (finalConfig.enableMemoryMonitoring && 'memory' in performance) {
      const memory = (performance as any).memory
      const memoryUsage = Math.round(memory.usedJSHeapSize / 1024 / 1024) // MB
      setMetrics(prev => ({ ...prev, memoryUsage }))
    }
  }, [finalConfig])

  // 画像読み込み時間の測定
  const measureImageLoadTime = useCallback((startTime: number) => {
    const loadTime = performance.now() - startTime
    imageLoadTimes.current.push(loadTime)
    
    // 最新10個の平均を計算
    const recentTimes = imageLoadTimes.current.slice(-10)
    const avgLoadTime = recentTimes.reduce((a, b) => a + b, 0) / recentTimes.length
    
    setMetrics(prev => ({ ...prev, imageLoadTime: avgLoadTime }))
  }, [])

  // コンポーネント数のカウント
  const incrementComponentCount = useCallback(() => {
    componentCount.current += 1
    setMetrics(prev => ({ ...prev, componentCount: componentCount.current }))
  }, [])

  // バンドルサイズの推定
  const estimateBundleSize = useCallback(() => {
    if (finalConfig.enableBundleAnalysis) {
      // 実際の実装では、webpack-bundle-analyzerの結果を使用
      const estimatedSize = 2.5 * 1024 * 1024 // 2.5MB (推定)
      setMetrics(prev => ({ ...prev, bundleSize: estimatedSize }))
    }
  }, [finalConfig])

  // パフォーマンス警告の生成
  const getPerformanceWarnings = useCallback(() => {
    const warnings: string[] = []
    
    if (metrics.renderTime > 16) { // 60fps未満
      warnings.push(`レンダリング時間が長すぎます: ${metrics.renderTime.toFixed(2)}ms`)
    }
    
    if (metrics.memoryUsage > 100) { // 100MB超過
      warnings.push(`メモリ使用量が多すぎます: ${metrics.memoryUsage}MB`)
    }
    
    if (metrics.imageLoadTime > 1000) { // 1秒超過
      warnings.push(`画像読み込み時間が長すぎます: ${metrics.imageLoadTime.toFixed(2)}ms`)
    }
    
    if (metrics.componentCount > 1000) { // 1000コンポーネント超過
      warnings.push(`コンポーネント数が多すぎます: ${metrics.componentCount}`)
    }
    
    return warnings
  }, [metrics])

  // 最適化の推奨事項
  const getOptimizationSuggestions = useCallback(() => {
    const suggestions: string[] = []
    
    if (metrics.renderTime > 16) {
      suggestions.push('React.memo、useMemo、useCallbackの使用を検討してください')
    }
    
    if (metrics.memoryUsage > 100) {
      suggestions.push('画像キャッシュの最適化を検討してください')
    }
    
    if (metrics.imageLoadTime > 1000) {
      suggestions.push('画像の遅延読み込みを実装してください')
    }
    
    if (metrics.componentCount > 1000) {
      suggestions.push('コンポーネントの分割を検討してください')
    }
    
    return suggestions
  }, [metrics])

  // 定期的な監視
  useEffect(() => {
    const interval = setInterval(() => {
      measureMemoryUsage()
      estimateBundleSize()
    }, 5000) // 5秒ごと

    return () => clearInterval(interval)
  }, [measureMemoryUsage, estimateBundleSize])

  // 開発環境でのログ出力
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      const warnings = getPerformanceWarnings()
      if (warnings.length > 0) {
        console.warn('🚨 パフォーマンス警告:', warnings)
      }
    }
  }, [metrics, getPerformanceWarnings])

  return {
    metrics,
    startRenderTiming,
    endRenderTiming,
    measureImageLoadTime,
    incrementComponentCount,
    getPerformanceWarnings,
    getOptimizationSuggestions,
    clearMetrics: () => setMetrics({
      renderTime: 0,
      memoryUsage: 0,
      bundleSize: 0,
      imageLoadTime: 0,
      componentCount: 0
    })
  }
}

// パフォーマンス監視用のHOC
export const withPerformanceMonitor = <P extends object>(
  Component: React.ComponentType<P>,
  config?: Partial<PerformanceConfig>
) => {
  return (props: P) => {
    const { startRenderTiming, endRenderTiming, incrementComponentCount } = usePerformanceMonitor(config)
    
    useEffect(() => {
      startRenderTiming()
      incrementComponentCount()
      
      return () => {
        endRenderTiming()
      }
    }, [startRenderTiming, endRenderTiming, incrementComponentCount])
    
    return React.createElement(Component, props)
  }
}

export default usePerformanceMonitor
