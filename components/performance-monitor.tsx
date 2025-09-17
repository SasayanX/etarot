/**
 * パフォーマンス監視コンポーネント
 * 開発環境でのパフォーマンス可視化
 */

"use client"

import { usePerformanceMonitor } from "@/hooks/use-performance-monitor"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertTriangle, CheckCircle, Zap, Clock, Package } from "lucide-react"

interface PerformanceMonitorProps {
  show?: boolean
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'
}

export default function PerformanceMonitor({ 
  show = process.env.NODE_ENV === 'development',
  position = 'top-right'
}: PerformanceMonitorProps) {
  const { metrics, getPerformanceWarnings, getOptimizationSuggestions } = usePerformanceMonitor()

  if (!show) return null

  const warnings = getPerformanceWarnings()
  const suggestions = getOptimizationSuggestions()

  const positionClasses = {
    'top-right': 'top-4 right-4',
    'top-left': 'top-4 left-4',
    'bottom-right': 'bottom-4 right-4',
    'bottom-left': 'bottom-4 left-4'
  }

  return (
    <div className={`fixed ${positionClasses[position]} z-50 max-w-sm`}>
      <Card className="bg-gray-900/95 backdrop-blur-sm border-purple-500">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-purple-400 flex items-center gap-2">
            <Zap className="h-4 w-4" />
            パフォーマンス監視
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {/* レンダリング時間 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Clock className="h-3 w-3 text-blue-400" />
              <span>レンダリング時間</span>
            </div>
            <Badge 
              variant={metrics.renderTime > 16 ? "destructive" : "secondary"}
              className="text-xs"
            >
              {metrics.renderTime.toFixed(2)}ms
            </Badge>
          </div>

          {/* メモリ使用量 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Package className="h-3 w-3 text-green-400" />
              <span>メモリ使用量</span>
            </div>
            <Badge 
              variant={metrics.memoryUsage > 100 ? "destructive" : "secondary"}
              className="text-xs"
            >
              {metrics.memoryUsage}MB
            </Badge>
          </div>

          {/* 画像読み込み時間 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Package className="h-3 w-3 text-yellow-400" />
              <span>画像読み込み</span>
            </div>
            <Badge 
              variant={metrics.imageLoadTime > 1000 ? "destructive" : "secondary"}
              className="text-xs"
            >
              {metrics.imageLoadTime.toFixed(0)}ms
            </Badge>
          </div>

          {/* コンポーネント数 */}
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-purple-400" />
              <span>コンポーネント数</span>
            </div>
            <Badge variant="outline" className="text-xs">
              {metrics.componentCount}
            </Badge>
          </div>

          {/* 警告 */}
          {warnings.length > 0 && (
            <div className="mt-3 p-2 bg-red-900/20 border border-red-500/30 rounded">
              <div className="flex items-center gap-1 text-red-400 text-xs font-medium mb-1">
                <AlertTriangle className="h-3 w-3" />
                警告
              </div>
              <ul className="text-xs text-red-300 space-y-1">
                {warnings.map((warning, index) => (
                  <li key={index}>• {warning}</li>
                ))}
              </ul>
            </div>
          )}

          {/* 最適化提案 */}
          {suggestions.length > 0 && (
            <div className="mt-3 p-2 bg-blue-900/20 border border-blue-500/30 rounded">
              <div className="text-blue-400 text-xs font-medium mb-1">
                最適化提案
              </div>
              <ul className="text-xs text-blue-300 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index}>• {suggestion}</li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
