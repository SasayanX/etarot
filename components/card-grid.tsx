"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import TarotCard from "./tarot-card"
import type { Card } from "@/data/card-data"
import { Search, X } from "lucide-react"

interface CardGridProps {
  cards: Card[]
  title?: string
  onCardClick?: (card: Card) => void
  showSearch?: boolean
  showFilters?: boolean
  emptyMessage?: string
}

export default function CardGrid({
  cards,
  title,
  onCardClick,
  showSearch = true,
  showFilters = true,
  emptyMessage = "カードが見つかりませんでした",
}: CardGridProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState<string | null>(null)
  const [filteredCards, setFilteredCards] = useState<Card[]>(cards)
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [cardBackImage, setCardBackImage] = useState("/royal-tarot-card-back.webp")

  useEffect(() => {
    // ローカルストレージからカードバック画像を取得
    const storedCardBack = localStorage.getItem("selectedCardBack")
    if (storedCardBack) {
      setCardBackImage(storedCardBack)
    }
  }, [])

  // フィルターオプションを生成
  const filterOptions = [
    { id: "all", label: "すべて" },
    { id: "major", label: "大アルカナ" },
    { id: "wands", label: "ワンド" },
    { id: "cups", label: "カップ" },
    { id: "swords", label: "ソード" },
    { id: "pentacles", label: "ペンタクル" },
  ]

  // 検索とフィルターの適用
  useEffect(() => {
    let result = [...cards]

    // 検索語による絞り込み
    if (searchTerm) {
      result = result.filter((card) => card.name.toLowerCase().includes(searchTerm.toLowerCase()))
    }

    // フィルターによる絞り込み
    if (activeFilter && activeFilter !== "all") {
      if (activeFilter === "major") {
        result = result.filter((card) => card.id < 22)
      } else {
        // スートによるフィルタリング
        const suitMap: Record<string, string> = {
          wands: "ワンド",
          cups: "カップ",
          swords: "ソード",
          pentacles: "ペンタクル",
        }
        result = result.filter((card) => card.suit === suitMap[activeFilter])
      }
    }

    setFilteredCards(result)
  }, [cards, searchTerm, activeFilter])

  // 検索をクリア
  const clearSearch = () => {
    setSearchTerm("")
  }

  return (
    <div className="space-y-6">
      {/* タイトルセクション */}
      {title && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-amber-400">{title}</h2>
        </motion.div>
      )}

      {/* 検索とフィルターセクション */}
      {(showSearch || showFilters) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="space-y-4"
        >
          {/* 検索バー */}
          {showSearch && (
            <div className="relative">
              <div
                className={`flex items-center bg-gray-800 rounded-lg border ${isSearchFocused ? "border-amber-500" : "border-purple-700"} transition-colors duration-300`}
              >
                <div className="pl-3 text-gray-400">
                  <Search size={18} />
                </div>
                <input
                  type="text"
                  placeholder="カード名で検索..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsSearchFocused(true)}
                  onBlur={() => setIsSearchFocused(false)}
                  className="w-full py-3 px-2 bg-transparent text-white focus:outline-none"
                />
                {searchTerm && (
                  <button onClick={clearSearch} className="pr-3 text-gray-400 hover:text-white transition-colors">
                    <X size={18} />
                  </button>
                )}
              </div>
            </div>
          )}

          {/* フィルター */}
          {showFilters && (
            <div className="flex flex-wrap gap-2">
              {filterOptions.map((option) => (
                <button
                  key={option.id}
                  onClick={() => setActiveFilter(option.id === activeFilter ? null : option.id)}
                  className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-300 ${
                    option.id === activeFilter
                      ? "bg-purple-700 text-white shadow-md"
                      : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </motion.div>
      )}

      {/* カードグリッド */}
      <div className="relative min-h-[200px]">
        {filteredCards.length > 0 ? (
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              visible: {
                transition: {
                  staggerChildren: 0.05,
                },
              },
            }}
            className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6"
          >
            {filteredCards.map((card, index) => (
              <motion.div
                key={card.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: { duration: 0.5 },
                  },
                }}
              >
                <TarotCard
                  card={card}
                  size="md"
                  showName
                  onClick={() => onCardClick && onCardClick(card)}
                  animationDelay={index * 0.03}
                  className="mx-auto"
                  backImage={cardBackImage}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <p className="text-gray-400 text-center py-12">{emptyMessage}</p>
          </motion.div>
        )}
      </div>
    </div>
  )
}
