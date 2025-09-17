export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] text-center px-4">
      <div className="w-[200px] h-[200px] bg-gray-700 rounded-full flex items-center justify-center text-white text-6xl mb-8">
        404
      </div>
      <h1 className="text-4xl font-bold text-white mb-4">ページが見つかりません</h1>
      <p className="text-lg text-gray-300 mb-8">お探しのページは存在しないか、移動された可能性があります。</p>
      <a href="/" className="px-6 py-3 bg-purple-700 hover:bg-purple-600 text-white rounded-md transition-colors">
        ホームに戻る
      </a>
    </div>
  )
}
