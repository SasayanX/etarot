"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function AudioTestPage() {
  const router = useRouter()

  useEffect(() => {
    // クローズドテスト中はデバッグページにアクセスできないようにリダイレクト
    router.push("/")
  }, [router])

  // リダイレクト中は何も表示しない
  return null
}
