/**
 * 画像最適化ユーティリティ
 * WebP変換、リサイズ、圧縮などの画像最適化機能
 */

// 画像最適化の設定
export interface ImageOptimizationConfig {
  quality: number // 0-100
  format: 'webp' | 'jpeg' | 'png' | 'auto'
  width?: number
  height?: number
  fit: 'cover' | 'contain' | 'fill' | 'inside' | 'outside'
  position: 'center' | 'top' | 'bottom' | 'left' | 'right'
}

const defaultConfig: ImageOptimizationConfig = {
  quality: 80,
  format: 'auto',
  fit: 'cover',
  position: 'center'
}

// 画像URLの最適化
export function optimizeImageUrl(
  src: string, 
  config: Partial<ImageOptimizationConfig> = {}
): string {
  const finalConfig = { ...defaultConfig, ...config }
  
  // 外部URLの場合は最適化をスキップ
  if (src.startsWith('http') || src.startsWith('data:')) {
    return src
  }

  // プレースホルダーの場合はそのまま返す
  if (src.includes('placeholder') || src.includes('placehold.co')) {
    return src
  }

  // クエリパラメータを解析
  const url = new URL(src, window.location.origin)
  const params = new URLSearchParams(url.search)

  // 最適化パラメータを設定
  if (finalConfig.quality !== defaultConfig.quality) {
    params.set('q', finalConfig.quality.toString())
  }

  if (finalConfig.format !== 'auto') {
    params.set('f', finalConfig.format)
  }

  if (finalConfig.width) {
    params.set('w', finalConfig.width.toString())
  }

  if (finalConfig.height) {
    params.set('h', finalConfig.height.toString())
  }

  params.set('fit', finalConfig.fit)
  params.set('pos', finalConfig.position)

  // 最適化されたURLを構築
  const optimizedUrl = `${url.pathname}?${params.toString()}`
  return optimizedUrl
}

// レスポンシブ画像の生成
export function generateResponsiveImageSrc(
  baseSrc: string,
  sizes: { width: number; quality?: number }[]
): { src: string; srcSet: string; sizes: string } {
  const srcSet = sizes
    .map(({ width, quality = 80 }) => {
      const optimizedSrc = optimizeImageUrl(baseSrc, { width, quality })
      return `${optimizedSrc} ${width}w`
    })
    .join(', ')

  const sizesString = sizes
    .map(({ width }) => `(max-width: ${width}px) ${width}px`)
    .join(', ') + `, ${sizes[sizes.length - 1].width}px`

  return {
    src: optimizeImageUrl(baseSrc, { width: sizes[0].width }),
    srcSet,
    sizes: sizesString
  }
}

// WebP対応の検出
export function supportsWebP(): Promise<boolean> {
  return new Promise((resolve) => {
    const webP = new Image()
    webP.onload = webP.onerror = () => {
      resolve(webP.height === 2)
    }
    webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA'
  })
}

// 画像の遅延読み込み用の設定
export function getLazyLoadConfig(priority: boolean = false) {
  return {
    loading: priority ? 'eager' as const : 'lazy' as const,
    decoding: 'async' as const,
    fetchPriority: priority ? 'high' as const : 'auto' as const
  }
}

// 画像プリロードの最適化
export async function preloadOptimizedImages(
  imageUrls: string[],
  config: Partial<ImageOptimizationConfig> = {}
): Promise<string[]> {
  const optimizedUrls = imageUrls.map(url => optimizeImageUrl(url, config))
  
  const preloadPromises = optimizedUrls.map(url => 
    new Promise<string>((resolve, reject) => {
      const img = new Image()
      img.onload = () => resolve(url)
      img.onerror = () => reject(new Error(`Failed to preload: ${url}`))
      img.src = url
    })
  )

  try {
    const results = await Promise.allSettled(preloadPromises)
    return results
      .filter((result): result is PromiseFulfilledResult<string> => result.status === 'fulfilled')
      .map(result => result.value)
  } catch (error) {
    console.warn('Some images failed to preload:', error)
    return []
  }
}

// 画像キャッシュの管理
class ImageCache {
  private cache = new Map<string, { url: string; timestamp: number }>()
  private maxSize = 100
  private maxAge = 5 * 60 * 1000 // 5分

  set(key: string, url: string): void {
    // 古いエントリを削除
    this.cleanup()
    
    // キャッシュサイズ制限
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, { url, timestamp: Date.now() })
  }

  get(key: string): string | null {
    const entry = this.cache.get(key)
    if (!entry) return null

    // 期限切れチェック
    if (Date.now() - entry.timestamp > this.maxAge) {
      this.cache.delete(key)
      return null
    }

    return entry.url
  }

  private cleanup(): void {
    const now = Date.now()
    for (const [key, entry] of this.cache.entries()) {
      if (now - entry.timestamp > this.maxAge) {
        this.cache.delete(key)
      }
    }
  }

  clear(): void {
    this.cache.clear()
  }

  size(): number {
    return this.cache.size
  }
}

export const imageCache = new ImageCache()

// 画像最適化の統計
export interface ImageOptimizationStats {
  totalImages: number
  optimizedImages: number
  webpImages: number
  averageSizeReduction: number
  totalLoadTime: number
  averageLoadTime: number
}

export class ImageOptimizationTracker {
  private stats: ImageOptimizationStats = {
    totalImages: 0,
    optimizedImages: 0,
    webpImages: 0,
    averageSizeReduction: 0,
    totalLoadTime: 0,
    averageLoadTime: 0
  }

  recordImageLoad(loadTime: number, optimized: boolean, webp: boolean, sizeReduction: number = 0) {
    this.stats.totalImages++
    if (optimized) this.stats.optimizedImages++
    if (webp) this.stats.webpImages++
    
    this.stats.totalLoadTime += loadTime
    this.stats.averageLoadTime = this.stats.totalLoadTime / this.stats.totalImages
    
    if (sizeReduction > 0) {
      this.stats.averageSizeReduction = 
        (this.stats.averageSizeReduction * (this.stats.optimizedImages - 1) + sizeReduction) / 
        this.stats.optimizedImages
    }
  }

  getStats(): ImageOptimizationStats {
    return { ...this.stats }
  }

  reset(): void {
    this.stats = {
      totalImages: 0,
      optimizedImages: 0,
      webpImages: 0,
      averageSizeReduction: 0,
      totalLoadTime: 0,
      averageLoadTime: 0
    }
  }
}

export const imageOptimizationTracker = new ImageOptimizationTracker()
