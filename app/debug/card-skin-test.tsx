"use client"

export default function CardSkinTestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-purple-950 py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        <h1 className="text-3xl font-bold text-purple-400 mb-8 text-center">
          カードスキンテスト（本番ビルド用に簡略化）
        </h1>
        <div className="text-center text-gray-300">
          <p>デバッグ機能は開発環境でのみ利用可能です。</p>
        </div>
      </div>
    </div>
  )
}