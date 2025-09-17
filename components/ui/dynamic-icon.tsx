/**
 * 動的アイコンコンポーネント
 * 遅延読み込みとキャッシュ機能付き
 */

import { useState, useEffect, Suspense } from 'react'
import { getIcon, preloadIcons } from '@/utils/icon-optimizer'
import { Loader2 } from 'lucide-react'

interface DynamicIconProps {
  name: string
  className?: string
  size?: number
  fallback?: React.ReactNode
  preload?: boolean
}

// アイコン読み込み中のフォールバック
const IconLoader = ({ className, size }: { className?: string; size?: number }) => (
  <Loader2 className={className} size={size} />
)

// 動的アイコンコンポーネント
export const DynamicIcon = ({ 
  name, 
  className, 
  size = 24, 
  fallback = <IconLoader className={className} size={size} />,
  preload = false
}: DynamicIconProps) => {
  const [Icon, setIcon] = useState<React.ComponentType<any> | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadIcon = async () => {
      try {
        setIsLoading(true)
        setError(false)
        
        const iconComponent = await getIcon(name)
        
        if (isMounted) {
          if (iconComponent) {
            setIcon(() => iconComponent)
          } else {
            setError(true)
          }
          setIsLoading(false)
        }
      } catch (err) {
        if (isMounted) {
          console.error(`Failed to load icon "${name}":`, err)
          setError(true)
          setIsLoading(false)
        }
      }
    }

    loadIcon()

    return () => {
      isMounted = false
    }
  }, [name])

  // プリロードが有効な場合
  useEffect(() => {
    if (preload) {
      preloadIcons([name])
    }
  }, [name, preload])

  if (isLoading) {
    return <>{fallback}</>
  }

  if (error || !Icon) {
    return <>{fallback}</>
  }

  return <Icon className={className} size={size} />
}

// バッチプリロード用のフック
export const useIconPreloader = (iconNames: string[]) => {
  const [isPreloading, setIsPreloading] = useState(false)
  const [preloadedIcons, setPreloadedIcons] = useState<string[]>([])

  useEffect(() => {
    const preload = async () => {
      setIsPreloading(true)
      try {
        await preloadIcons(iconNames)
        setPreloadedIcons(iconNames)
      } catch (error) {
        console.error('Failed to preload icons:', error)
      } finally {
        setIsPreloading(false)
      }
    }

    preload()
  }, [iconNames])

  return { isPreloading, preloadedIcons }
}

// よく使用されるアイコンのプリセット
export const IconPresets = {
  // ナビゲーション
  navigation: ['Home', 'Settings', 'User', 'Trophy'],
  
  // ゲーム関連
  game: ['Target', 'Zap', 'Shield', 'Crown', 'Gem'],
  
  // アクション
  actions: ['CheckCircle', 'XCircle', 'ArrowRight', 'RotateCcw', 'RefreshCw'],
  
  // 音声関連
  audio: ['Volume2', 'VolumeX', 'Mic', 'MicOff'],
  
  // 装飾
  decorative: ['Star', 'Heart', 'Sparkles', 'Clock']
} as const

export default DynamicIcon
