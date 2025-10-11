"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Star, Heart } from "lucide-react"

interface ReviewPromptDialogProps {
  isOpen: boolean
  onReview: () => void
  onDismiss: () => void
  onAlreadyReviewed: () => void
}

/**
 * レビュー依頼ダイアログ
 * 
 * Google Playポリシーに準拠:
 * - 報酬を一切提示しない
 * - 強制しない（「後で」ボタンあり）
 * - ユーザー体験を尊重
 */
export function ReviewPromptDialog({ isOpen, onReview, onDismiss, onAlreadyReviewed }: ReviewPromptDialogProps) {
  const handleReview = () => {
    // Google Playのレビューページを開く
    const packageName = "com.ryuka.kanau_kiryu"
    const playStoreUrl = `https://play.google.com/store/apps/details?id=${packageName}`
    
    // Androidアプリ内の場合は、ネイティブの評価ダイアログを開く
    // それ以外の場合はブラウザでGoogle Playを開く
    if (typeof window !== "undefined") {
      // WebView検出
      const ua = navigator.userAgent.toLowerCase()
      const isAndroidWebView = ua.indexOf("wv") > -1 || ua.includes("tarotapp")
      
      if (isAndroidWebView) {
        // Androidアプリ内の場合、Google Playアプリで開く
        window.location.href = `market://details?id=${packageName}`
      } else {
        // ブラウザの場合、新しいタブで開く
        window.open(playStoreUrl, "_blank")
      }
    }
    
    onReview()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onDismiss()}>
      <DialogContent className="bg-gradient-to-b from-purple-900 to-gray-900 border-purple-500 max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-amber-400 flex items-center justify-center gap-2">
            <Heart className="h-6 w-6 text-pink-400" />
            アプリを楽しんでいただけていますか？
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* メッセージ */}
          <div className="text-center space-y-3">
            <div className="flex justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className="h-8 w-8 fill-amber-400 text-amber-400"
                />
              ))}
            </div>
            
            <DialogDescription className="text-purple-100 text-base leading-relaxed">
              あなたのフィードバックが、より良いアプリ作りの励みになります。
              <br />
              <br />
              ぜひGoogle Playでレビューをお願いします！
            </DialogDescription>
          </div>

          {/* ボタン */}
          <div className="space-y-3">
            <Button
              onClick={handleReview}
              className="w-full bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-bold py-6 text-lg shadow-lg"
            >
              <Star className="mr-2 h-5 w-5" />
              レビューを書く
            </Button>
            
            <Button
              onClick={onAlreadyReviewed}
              variant="outline"
              className="w-full border-green-500 text-green-400 hover:bg-green-900/30 hover:text-green-300"
            >
              <Heart className="mr-2 h-4 w-4" />
              すでに書きました
            </Button>
            
            <Button
              onClick={onDismiss}
              variant="ghost"
              className="w-full text-purple-300 hover:text-purple-100 hover:bg-purple-900/30"
            >
              後で
            </Button>
          </div>

          {/* フッター */}
          <p className="text-center text-xs text-gray-400">
            ご協力ありがとうございます 🌟
          </p>
        </div>
      </DialogContent>
    </Dialog>
  )
}

