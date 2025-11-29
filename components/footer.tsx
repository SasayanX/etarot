"use client"

import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"

export default function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="bg-gray-900/90 border-t border-purple-800 py-6 mt-8">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-400 text-sm text-center md:text-left">
            <p>© 2025 カナウ・AIプロダクション. All rights reserved.</p>
            <p className="text-xs mt-1">開発者: 占い師・金間 麻耶 (カナマ キリュウ)</p>
          </div>
          <div className="flex flex-wrap justify-center md:justify-end gap-4 text-sm">
            <Link
              href="/privacy"
              className="text-purple-300 hover:text-purple-200 transition-colors underline"
              data-internal-link="true"
              data-webview-safe="true"
            >
              プライバシーポリシー
            </Link>
            <span className="text-gray-600">|</span>
            <Link
              href="/terms"
              className="text-purple-300 hover:text-purple-200 transition-colors underline"
              data-internal-link="true"
              data-webview-safe="true"
            >
              利用規約
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

