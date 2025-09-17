/**
 * コード分割ユーティリティ
 * 動的インポートと遅延読み込みの最適化
 */

import { ComponentType, lazy, Suspense } from 'react'
import { memoWithPerformanceMonitoring } from './memo-optimizer'

// 遅延読み込み用のローディングコンポーネント
const LoadingSpinner = memoWithPerformanceMonitoring(() => (
  <div className="flex items-center justify-center p-8">
    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
  </div>
), "LoadingSpinner")

// エラー境界コンポーネント
const ErrorBoundary = memoWithPerformanceMonitoring(({ 
  children, 
  fallback 
}: { 
  children: React.ReactNode
  fallback?: React.ReactNode 
}) => {
  const [hasError, setHasError] = React.useState(false)

  React.useEffect(() => {
    const handleError = () => setHasError(true)
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  if (hasError) {
    return fallback || (
      <div className="flex items-center justify-center p-8 text-red-400">
        <div className="text-center">
          <h3 className="text-lg font-semibold mb-2">読み込みエラー</h3>
          <p className="text-sm">コンポーネントの読み込みに失敗しました</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}, "ErrorBoundary")

// 動的インポートの設定
interface LazyLoadOptions {
  fallback?: ComponentType
  errorBoundary?: boolean
  preload?: boolean
  priority?: 'high' | 'low'
}

// 遅延読み込みコンポーネントの作成
export function createLazyComponent<T extends ComponentType<any>>(
  importFn: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const {
    fallback: Fallback = LoadingSpinner,
    errorBoundary = true,
    preload = false,
    priority = 'low'
  } = options

  const LazyComponent = lazy(importFn)

  // プリロード機能
  if (preload) {
    importFn().catch(() => {
      // プリロードエラーは無視
    })
  }

  const WrappedComponent = memoWithPerformanceMonitoring((props: any) => {
    if (errorBoundary) {
      return (
        <ErrorBoundary>
          <Suspense fallback={<Fallback />}>
            <LazyComponent {...props} />
          </Suspense>
        </ErrorBoundary>
      )
    }

    return (
      <Suspense fallback={<Fallback />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }, `LazyComponent_${importFn.name}`)

  return WrappedComponent
}

// ページレベルの遅延読み込み
export const LazyPages = {
  // ゲームページ
  ClassicGame: createLazyComponent(
    () => import('@/app/game/classic/page'),
    { priority: 'high' }
  ),
  HardGame: createLazyComponent(
    () => import('@/app/game/hard/page'),
    { priority: 'high' }
  ),
  TimeAttackGame: createLazyComponent(
    () => import('@/app/game/time-attack/page'),
    { priority: 'high' }
  ),
  BattleGame: createLazyComponent(
    () => import('@/app/game/battle/page'),
    { priority: 'high' }
  ),

  // 占いページ
  FortunePage: createLazyComponent(
    () => import('@/app/fortune/page'),
    { priority: 'high' }
  ),

  // クイズページ
  QuizPage: createLazyComponent(
    () => import('@/app/quiz/page'),
    { priority: 'high' }
  ),

  // 設定ページ
  SettingsPage: createLazyComponent(
    () => import('@/app/settings/page'),
    { priority: 'low' }
  ),

  // スキンページ
  SkinsPage: createLazyComponent(
    () => import('@/app/skins/page'),
    { priority: 'low' }
  ),

  // 辞書ページ
  DictionaryPage: createLazyComponent(
    () => import('@/app/dictionary/page'),
    { priority: 'low' }
  ),

  // デバッグページ
  DebugPage: createLazyComponent(
    () => import('@/app/debug/page'),
    { priority: 'low' }
  ),
}

// コンポーネントレベルの遅延読み込み
export const LazyComponents = {
  // 重いコンポーネント
  CardDetailView: createLazyComponent(
    () => import('@/components/card-detail-view'),
    { priority: 'low' }
  ),
  VictoryCelebration: createLazyComponent(
    () => import('@/components/victory-celebration'),
    { priority: 'low' }
  ),
  ConfettiCelebration: createLazyComponent(
    () => import('@/components/confetti-celebration'),
    { priority: 'low' }
  ),

  // チャートコンポーネント
  Chart: createLazyComponent(
    () => import('@/components/ui/chart'),
    { priority: 'low' }
  ),

  // モーダルコンポーネント
  LoginBonusModal: createLazyComponent(
    () => import('@/components/login-bonus-modal'),
    { priority: 'low' }
  ),
}

// プリロード戦略
export class PreloadStrategy {
  private static preloadedComponents = new Set<string>()
  private static preloadQueue: (() => Promise<any>)[] = []

  // コンポーネントのプリロード
  static async preloadComponent(componentName: string, importFn: () => Promise<any>) {
    if (this.preloadedComponents.has(componentName)) {
      return
    }

    try {
      await importFn()
      this.preloadedComponents.add(componentName)
    } catch (error) {
      console.warn(`Failed to preload ${componentName}:`, error)
    }
  }

  // バッチプリロード
  static async preloadBatch(components: Array<{ name: string; importFn: () => Promise<any> }>) {
    const promises = components.map(({ name, importFn }) => 
      this.preloadComponent(name, importFn)
    )
    
    await Promise.allSettled(promises)
  }

  // ユーザーインタラクションに基づくプリロード
  static preloadOnHover(componentName: string, importFn: () => Promise<any>) {
    return () => {
      this.preloadComponent(componentName, importFn)
    }
  }

  // プリロードキューに追加
  static queuePreload(importFn: () => Promise<any>) {
    this.preloadQueue.push(importFn)
  }

  // キューを実行
  static async processQueue() {
    const promises = this.preloadQueue.map(importFn => importFn())
    this.preloadQueue = []
    
    await Promise.allSettled(promises)
  }

  // プリロード統計
  static getStats() {
    return {
      preloadedCount: this.preloadedComponents.size,
      queuedCount: this.preloadQueue.length,
      preloadedComponents: Array.from(this.preloadedComponents)
    }
  }
}

// ルートベースのコード分割
export const RouteBasedSplitting = {
  // 認証が必要なページ
  authenticated: [
    'settings',
    'skins',
    'debug'
  ],

  // ゲームページ
  game: [
    'classic',
    'hard',
    'time-attack',
    'battle'
  ],

  // コンテンツページ
  content: [
    'fortune',
    'quiz',
    'dictionary'
  ],

  // プリロード戦略
  getPreloadStrategy(route: string) {
    if (this.authenticated.includes(route)) {
      return 'on-demand' // 認証後に読み込み
    }
    if (this.game.includes(route)) {
      return 'preload' // ゲームページは事前読み込み
    }
    if (this.content.includes(route)) {
      return 'on-hover' // ホバー時に読み込み
    }
    return 'lazy' // デフォルトは遅延読み込み
  }
}

// バンドル分析用の統計
export const BundleAnalyzer = {
  // コンポーネントの読み込み時間を測定
  async measureLoadTime(componentName: string, importFn: () => Promise<any>) {
    const startTime = performance.now()
    
    try {
      await importFn()
      const loadTime = performance.now() - startTime
      
      console.log(`📦 ${componentName} loaded in ${loadTime.toFixed(2)}ms`)
      
      return {
        componentName,
        loadTime,
        success: true
      }
    } catch (error) {
      const loadTime = performance.now() - startTime
      
      console.error(`❌ ${componentName} failed to load in ${loadTime.toFixed(2)}ms:`, error)
      
      return {
        componentName,
        loadTime,
        success: false,
        error
      }
    }
  },

  // バンドルサイズの推定
  estimateBundleSize(importFn: () => Promise<any>) {
    // 実際の実装では、webpack-bundle-analyzerを使用
    return {
      estimated: 'unknown',
      actual: 'requires build analysis'
    }
  }
}

export default {
  createLazyComponent,
  LazyPages,
  LazyComponents,
  PreloadStrategy,
  RouteBasedSplitting,
  BundleAnalyzer
}
