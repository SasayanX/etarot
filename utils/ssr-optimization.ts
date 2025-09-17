/**
 * SSR最適化ユーティリティ
 * サーバーサイドレンダリングのパフォーマンス向上
 */

import { GetServerSideProps, GetStaticProps } from 'next'
import { dehydrate, QueryClient } from '@tanstack/react-query'

// SSR用の設定
export const SSR_CONFIG = {
  // キャッシュ設定
  cache: {
    maxAge: 60 * 60 * 24, // 24時間
    staleWhileRevalidate: 60 * 60 * 1, // 1時間
  },
  
  // プリフェッチ設定
  prefetch: {
    enabled: true,
    maxConcurrent: 3,
    timeout: 5000,
  },
  
  // 圧縮設定
  compression: {
    enabled: true,
    level: 6, // 1-9の範囲
  },
  
  // 画像最適化
  images: {
    domains: ['vercel.com', 'blob.vercel-storage.com'],
    formats: ['image/webp', 'image/avif'],
    sizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  }
}

// データプリフェッチ用のクエリキー
export const QUERY_KEYS = {
  // カードデータ
  CARDS: 'cards',
  CARD_DETAILS: 'card-details',
  CARD_IMAGES: 'card-images',
  
  // 占いデータ
  FORTUNE_TYPES: 'fortune-types',
  FORTUNE_READINGS: 'fortune-readings',
  
  // クイズデータ
  QUIZ_QUESTIONS: 'quiz-questions',
  QUIZ_RESULTS: 'quiz-results',
  
  // 設定データ
  SETTINGS: 'settings',
  LANGUAGE: 'language',
  
  // 統計データ
  STATS: 'stats',
  SCORES: 'scores',
} as const

// データフェッチ関数
export class DataFetcher {
  private static queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 5 * 60 * 1000, // 5分
        cacheTime: 10 * 60 * 1000, // 10分
        retry: 3,
        retryDelay: 1000,
      },
    },
  })

  // カードデータの取得
  static async fetchCards() {
    try {
      // 実際の実装では、APIからデータを取得
      const cards = await import('@/data/fortune-card-data')
      return cards.getAllCards()
    } catch (error) {
      console.error('Failed to fetch cards:', error)
      return []
    }
  }

  // 占いデータの取得
  static async fetchFortuneData() {
    try {
      const [fortuneTypes, fortuneReadings] = await Promise.all([
        import('@/data/fortune-messages-data'),
        import('@/data/fortune-readings-data')
      ])
      
      return {
        types: fortuneTypes.fortuneTypes,
        readings: fortuneReadings
      }
    } catch (error) {
      console.error('Failed to fetch fortune data:', error)
      return { types: {}, readings: {} }
    }
  }

  // クイズデータの取得
  static async fetchQuizData() {
    try {
      const quizData = await import('@/data/quiz-data')
      return quizData.quizQuestions
    } catch (error) {
      console.error('Failed to fetch quiz data:', error)
      return []
    }
  }

  // 設定データの取得
  static async fetchSettings() {
    try {
      // デフォルト設定を返す
      return {
        language: 'ja',
        theme: 'dark',
        soundEnabled: true,
        textToSpeechEnabled: false,
        animationsEnabled: true,
        difficulty: 'normal'
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
      return null
    }
  }

  // 統計データの取得
  static async fetchStats() {
    try {
      // ローカルストレージから統計を取得
      if (typeof window !== 'undefined') {
        const stats = localStorage.getItem('gameStats')
        return stats ? JSON.parse(stats) : null
      }
      return null
    } catch (error) {
      console.error('Failed to fetch stats:', error)
      return null
    }
  }
}

// SSR用のヘルパー関数
export class SSRHelpers {
  // ページのメタデータを生成
  static generatePageMetadata(page: string, data?: any) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    const metadata = {
      title: 'タロット占いアプリ',
      description: '美しいタロットカードで運勢を占いましょう',
      url: `${baseUrl}/${page}`,
      image: `${baseUrl}/og-image.jpg`,
      type: 'website',
      locale: 'ja_JP',
    }

    // ページ固有のメタデータ
    switch (page) {
      case 'fortune':
        return {
          ...metadata,
          title: 'タロット占い - 運勢を占いましょう',
          description: '本格的なタロットカードであなたの運勢を占います。恋愛、仕事、お金、決断など、様々な角度からアドバイスします。',
        }
      case 'quiz':
        return {
          ...metadata,
          title: 'タロットクイズ - 知識をテストしよう',
          description: 'タロットカードの知識をテストするクイズです。初心者から上級者まで楽しめます。',
        }
      case 'game':
        return {
          ...metadata,
          title: 'タロットゲーム - カードを揃えよう',
          description: 'タロットカードを使ったパズルゲームです。集中力と記憶力を鍛えましょう。',
        }
      default:
        return metadata
    }
  }

  // 構造化データを生成
  static generateStructuredData(page: string, data?: any) {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    
    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'タロット占いアプリ',
      description: '美しいタロットカードで運勢を占いましょう',
      url: baseUrl,
      applicationCategory: 'Entertainment',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'JPY'
      }
    }

    return structuredData
  }

  // パフォーマンス最適化のためのリソースヒント
  static generateResourceHints(page: string) {
    const hints = [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: true },
      { rel: 'dns-prefetch', href: 'https://vercel.com' },
    ]

    // ページ固有のヒント
    switch (page) {
      case 'fortune':
        hints.push(
          { rel: 'preload', href: '/api/fortune', as: 'fetch' },
          { rel: 'preload', href: '/images/cards', as: 'image' }
        )
        break
      case 'quiz':
        hints.push(
          { rel: 'preload', href: '/api/quiz', as: 'fetch' }
        )
        break
    }

    return hints
  }
}

// ページ別のSSR設定
export const PAGE_SSR_CONFIG = {
  // 占いページ
  fortune: {
    revalidate: 60 * 60 * 24, // 24時間
    fallback: false,
    prefetch: ['cards', 'fortune-types', 'fortune-readings'],
  },
  
  // クイズページ
  quiz: {
    revalidate: 60 * 60 * 12, // 12時間
    fallback: false,
    prefetch: ['quiz-questions', 'cards'],
  },
  
  // ゲームページ
  game: {
    revalidate: 60 * 60 * 6, // 6時間
    fallback: false,
    prefetch: ['cards', 'settings'],
  },
  
  // 設定ページ
  settings: {
    revalidate: 60 * 60 * 1, // 1時間
    fallback: false,
    prefetch: ['settings', 'language'],
  },
  
  // 辞書ページ
  dictionary: {
    revalidate: 60 * 60 * 48, // 48時間
    fallback: false,
    prefetch: ['cards', 'card-details'],
  },
}

// SSR用のミドルウェア
export const ssrMiddleware = {
  // キャッシュヘッダーの設定
  setCacheHeaders(res: any, page: string) {
    const config = PAGE_SSR_CONFIG[page as keyof typeof PAGE_SSR_CONFIG]
    if (config) {
      res.setHeader('Cache-Control', `public, max-age=${config.revalidate}, stale-while-revalidate=60`)
    }
  },

  // 圧縮の設定
  setCompressionHeaders(res: any) {
    res.setHeader('Content-Encoding', 'gzip')
    res.setHeader('Vary', 'Accept-Encoding')
  },

  // セキュリティヘッダーの設定
  setSecurityHeaders(res: any) {
    res.setHeader('X-Content-Type-Options', 'nosniff')
    res.setHeader('X-Frame-Options', 'DENY')
    res.setHeader('X-XSS-Protection', '1; mode=block')
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  },

  // パフォーマンスヘッダーの設定
  setPerformanceHeaders(res: any) {
    res.setHeader('X-DNS-Prefetch-Control', 'on')
    res.setHeader('X-Download-Options', 'noopen')
    res.setHeader('X-Permitted-Cross-Domain-Policies', 'none')
  }
}

// データプリフェッチ用のヘルパー
export const prefetchData = async (page: string) => {
  const config = PAGE_SSR_CONFIG[page as keyof typeof PAGE_SSR_CONFIG]
  if (!config) return

  const queryClient = new QueryClient()
  
  try {
    // プリフェッチするデータを並列で取得
    const prefetchPromises = config.prefetch.map(async (key) => {
      switch (key) {
        case 'cards':
          return queryClient.prefetchQuery([QUERY_KEYS.CARDS], DataFetcher.fetchCards)
        case 'fortune-types':
        case 'fortune-readings':
          return queryClient.prefetchQuery([QUERY_KEYS.FORTUNE_TYPES], DataFetcher.fetchFortuneData)
        case 'quiz-questions':
          return queryClient.prefetchQuery([QUERY_KEYS.QUIZ_QUESTIONS], DataFetcher.fetchQuizData)
        case 'settings':
          return queryClient.prefetchQuery([QUERY_KEYS.SETTINGS], DataFetcher.fetchSettings)
        case 'language':
          return queryClient.prefetchQuery([QUERY_KEYS.LANGUAGE], () => Promise.resolve('ja'))
        default:
          return Promise.resolve()
      }
    })

    await Promise.allSettled(prefetchPromises)
    
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
  } catch (error) {
    console.error('Failed to prefetch data:', error)
    return {
      props: {
        dehydratedState: dehydrate(queryClient),
      },
    }
  }
}

export default {
  SSR_CONFIG,
  QUERY_KEYS,
  DataFetcher,
  SSRHelpers,
  PAGE_SSR_CONFIG,
  ssrMiddleware,
  prefetchData
}
