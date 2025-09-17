"use client"

export default function HardModeTest() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center text-white">
        <h1 className="text-4xl font-bold mb-4">ハードモード テスト</h1>
        <p className="text-xl">このページが表示されれば、ルーティングは正常です</p>
        <div className="mt-8">
          <button
            onClick={() => (window.location.href = "/game")}
            className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg"
          >
            ゲーム選択に戻る
          </button>
        </div>
      </div>
    </div>
  )
}
