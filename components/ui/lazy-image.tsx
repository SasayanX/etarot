/**
 * 遅延読み込み画像コンポーネント
 * Intersection Observer APIを使用した効率的な画像読み込み
 */

"use client"

import { useState, useRef, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface LazyImageProps {
  src: string
  alt: string
  className?: string
  fallback?: string
  placeholder?: string
  onLoad?: () => void
  onError?: (error: any) => void
  priority?: boolean
  sizes?: string
  quality?: number
}

export default function LazyImage({
  src,
  alt,
  className,
  fallback = '/placeholder.svg?height=300&width=200&text=Loading...',
  placeholder = '/placeholder.svg?height=300&width=200&text=Loading...',
  onLoad,
  onError,
  priority = false,
  sizes,
  quality = 75
}: LazyImageProps) {
  const [imageSrc, setImageSrc] = useState(priority ? src : placeholder)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isInView, setIsInView] = useState(priority)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  // Intersection Observer の設定
  const observerOptions = {
    root: null,
    rootMargin: '50px', // 50px手前で読み込み開始
    threshold: 0.1
  }

  // 画像の読み込み
  const loadImage = useCallback(() => {
    if (hasError || isLoaded) return

    const img = new Image()
    
    img.onload = () => {
      setImageSrc(src)
      setIsLoaded(true)
      onLoad?.()
    }
    
    img.onerror = (error) => {
      console.warn(`Failed to load image: ${src}`)
      setHasError(true)
      setImageSrc(fallback)
      onError?.(error)
    }
    
    // WebP対応の最適化
    const optimizedSrc = getOptimizedImageSrc(src, quality, sizes)
    img.src = optimizedSrc
  }, [src, fallback, onLoad, onError, hasError, isLoaded, quality, sizes])

  // Intersection Observer の設定
  useEffect(() => {
    if (priority || isInView) return

    const imgElement = imgRef.current
    if (!imgElement) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true)
            loadImage()
            observerRef.current?.unobserve(entry.target)
          }
        })
      },
      observerOptions
    )

    observerRef.current.observe(imgElement)

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      }
    }
  }, [loadImage, priority, isInView])

  // 優先読み込みの場合
  useEffect(() => {
    if (priority) {
      loadImage()
    }
  }, [priority, loadImage])

  return (
    <img
      ref={imgRef}
      src={imageSrc}
      alt={alt}
      className={cn(
        'transition-opacity duration-300',
        isLoaded ? 'opacity-100' : 'opacity-70',
        className
      )}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
    />
  )
}

// 画像URLの最適化
function getOptimizedImageSrc(src: string, quality: number, sizes?: string): string {
  // 外部URLの場合はそのまま返す
  if (src.startsWith('http')) {
    return src
  }

  // ローカル画像の最適化
  if (src.startsWith('/')) {
    // WebP対応のクエリパラメータを追加
    const params = new URLSearchParams()
    params.set('q', quality.toString())
    if (sizes) params.set('w', sizes)
    
    return `${src}?${params.toString()}`
  }

  return src
}

// 画像プリロード用のフック
export const useImagePreloader = (imageUrls: string[]) => {
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set())
  const [loadingImages, setLoadingImages] = useState<Set<string>>(new Set())

  const preloadImage = useCallback((url: string) => {
    if (loadedImages.has(url) || loadingImages.has(url)) return

    setLoadingImages(prev => new Set(prev).add(url))
    
    const img = new Image()
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(url))
      setLoadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(url)
        return newSet
      })
    }
    img.onerror = () => {
      setLoadingImages(prev => {
        const newSet = new Set(prev)
        newSet.delete(url)
        return newSet
      })
    }
    img.src = url
  }, [loadedImages, loadingImages])

  const preloadAll = useCallback(() => {
    imageUrls.forEach(preloadImage)
  }, [imageUrls, preloadImage])

  return {
    loadedImages: Array.from(loadedImages),
    loadingImages: Array.from(loadingImages),
    preloadImage,
    preloadAll,
    isLoaded: (url: string) => loadedImages.has(url),
    isLoading: (url: string) => loadingImages.has(url)
  }
}

// 画像最適化の統計
export const useImageOptimizationStats = () => {
  const [stats, setStats] = useState({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    totalLoadTime: 0
  })

  const recordImageLoad = useCallback((loadTime: number, success: boolean) => {
    setStats(prev => ({
      ...prev,
      totalImages: prev.totalImages + 1,
      loadedImages: success ? prev.loadedImages + 1 : prev.loadedImages,
      failedImages: success ? prev.failedImages : prev.failedImages + 1,
      totalLoadTime: prev.totalLoadTime + loadTime,
      averageLoadTime: (prev.totalLoadTime + loadTime) / (prev.totalImages + 1)
    }))
  }, [])

  return { stats, recordImageLoad }
}
