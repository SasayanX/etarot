/**
 * 占いヘッダーコンポーネント
 * 占いタイプの選択と説明を表示
 */

"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useLanguage } from "@/contexts/language-context"
import { fortuneTypes } from "@/data/fortune-messages-data"

interface FortuneType {
  id: string
  name: string
  cards: number
  description: string
}

interface FortuneHeaderProps {
  fortuneTypes: FortuneType[]
  selectedType: string | null
  onTypeSelect: (typeId: string) => void
  disabled?: boolean
}

export default function FortuneHeader({
  fortuneTypes,
  selectedType,
  onTypeSelect,
  disabled = false
}: FortuneHeaderProps) {
  const { language } = useLanguage()

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-purple-400 mb-2">
          {language === "en" ? "Tarot Fortune Telling" : "タロット占い"}
        </h1>
        <p className="text-gray-300">
          {language === "en" 
            ? "Choose your fortune type and discover your destiny" 
            : "占いの種類を選んで、あなたの運命を占いましょう"
          }
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {fortuneTypes.map((type) => (
          <Card
            key={type.id}
            className={`cursor-pointer transition-all duration-300 hover:shadow-lg ${
              selectedType === type.id
                ? "border-purple-500 bg-purple-900/20 shadow-lg shadow-purple-500/20"
                : "border-gray-700 hover:border-purple-400"
            } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={() => !disabled && onTypeSelect(type.id)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-lg text-center text-purple-300">
                {type.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <CardDescription className="text-center text-gray-400 mb-3">
                {type.description}
              </CardDescription>
              <div className="text-center">
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-600/20 text-purple-300">
                  {type.cards} {language === "en" ? "cards" : "枚"}
                </span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
