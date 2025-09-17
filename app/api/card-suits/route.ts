import { NextResponse } from "next/server"

// カードスーツのデータを修正します
const cardSuits = [
  {
    id: "default",
    name: "デフォルト",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-back.jpg-rP7JTYXlZGFOKJEN36kRqoqcfzBiXp.png",
    category: "basic",
  },
  {
    id: "moonlight",
    name: "ムーンライト",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/moon-TtddIf45eQo4wcxtbIHqhyj7Lor0RB.png",
    category: "premium",
  },
  {
    id: "golden",
    name: "ゴールデン",
    image: "/golden-tarot-back.png",
    category: "premium",
  },
  {
    id: "crystal",
    name: "クリスタル",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/crystal-tarot-back-puICtBkYOgd7xGlMtSoanT0qm4OZPW.png",
    category: "premium",
  },
  {
    id: "mystic",
    name: "ミスティック",
    image: "/mystic-tarot-back.png",
    category: "premium",
  },
  {
    id: "royal",
    name: "ロイヤル",
    image: "/royal-tarot-card-back.png",
    category: "premium",
  },
  {
    id: "dragon",
    name: "ドラゴン",
    image:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/dragon-tarot-back-62w6wpQ57g9BDqSCxvDz0Rkz9UopTS.png",
    category: "premium",
  },
  {
    id: "cosmic",
    name: "コズミック",
    image: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/card-skins-XwqGFSoGy0gRu0gru7YgtymhGiYwYU.png", // 新しく追加した画像を使用
    category: "special",
  },
  {
    id: "elemental",
    name: "四神",
    image: "/four-symbols-tarot-back.png",
    category: "special",
  },
  {
    id: "sakura",
    name: "サクラ",
    image: "/cardback-sakura.png",
    category: "seasonal",
  },
  {
    id: "halloween",
    name: "ハロウィン",
    image: "/cardback-halloween.png",
    category: "seasonal",
  },
  {
    id: "winter",
    name: "ウィンター",
    image: "/cardback-winter.png",
    category: "seasonal",
  },
]

export async function GET() {
  // 画像URLが存在するか確認するためのヘルパー関数
  const checkImageExists = async (url: string): Promise<boolean> => {
    // 相対パスの場合は常に存在すると仮定
    if (url.startsWith("/")) {
      return true
    }

    try {
      const response = await fetch(url, { method: "HEAD" })
      return response.ok
    } catch (error) {
      console.error(`Failed to check image URL: ${url}`, error)
      return false
    }
  }

  // 各カードスーツの画像URLが存在するか確認
  const suitsWithImageStatus = await Promise.all(
    cardSuits.map(async (suit) => {
      const imageExists = await checkImageExists(suit.image)
      return {
        ...suit,
        imageStatus: imageExists ? "ok" : "error",
      }
    }),
  )

  return NextResponse.json(suitsWithImageStatus)
}
