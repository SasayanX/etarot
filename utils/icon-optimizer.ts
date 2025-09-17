/**
 * アイコン最適化ユーティリティ
 * Lucide Reactの個別インポートを最適化
 */

import { ComponentType } from 'react'

// 使用頻度の高いアイコンのみを個別インポート（バンドルサイズ削減）
export {
  CheckCircle,
  XCircle,
  Home,
  Trophy,
  Medal,
  User,
  Coins,
  ArrowRight,
  RotateCcw,
  HelpCircle,
  Settings,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RefreshCw,
  AlertCircle,
  ExternalLink,
  Loader2,
  Star,
  Heart,
  Clock,
  Target,
  Zap,
  Shield,
  Crown,
  Gem,
  Sparkles
} from 'lucide-react'

// アイコンキャッシュ（メモリ効率化）
const iconCache = new Map<string, ComponentType<any>>()

// 動的アイコン読み込み（遅延読み込み）
export const getIcon = async (iconName: string): Promise<ComponentType<any> | null> => {
  // キャッシュから取得
  if (iconCache.has(iconName)) {
    return iconCache.get(iconName)!
  }

  try {
    // 動的インポート
    const iconModule = await import('lucide-react')
    const Icon = iconModule[iconName as keyof typeof iconModule] as ComponentType<any>
    
    if (Icon) {
      // キャッシュに保存
      iconCache.set(iconName, Icon)
      return Icon
    }
    
    console.warn(`Icon "${iconName}" not found in lucide-react`)
    return null
  } catch (error) {
    console.error(`Failed to load icon "${iconName}":`, error)
    return null
  }
}

// バッチでアイコンをプリロード
export const preloadIcons = async (iconNames: string[]): Promise<void> => {
  const promises = iconNames.map(name => getIcon(name))
  await Promise.allSettled(promises)
}

// アイコンキャッシュのクリア
export const clearIconCache = (): void => {
  iconCache.clear()
}

// 使用統計（デバッグ用）
export const getIconCacheStats = () => ({
  cachedIcons: iconCache.size,
  cacheKeys: Array.from(iconCache.keys())
})
