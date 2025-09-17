"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Volume2, VolumeX, Mic, MicOff, WalletCardsIcon as Cards } from "lucide-react"
import { useSettings } from "@/contexts/settings-context"
import Link from "next/link"
import { useLanguage } from "@/contexts/language-context"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function SettingsPage() {
  const {
    soundEnabled,
    toggleSound,
    textToSpeechEnabled,
    toggleTextToSpeech,
    testSpeech,
    includeMinorArcanaInFortune,
    toggleMinorArcanaInFortune,
    includeMinorArcanaInGames,
    toggleMinorArcanaInGames,
  } = useSettings()

  const { language, setLanguage, t } = useLanguage()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return null
  }

  return (
    <div className="container max-w-md mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center text-amber-400 mb-8">{t("settings.title")}</h1>

      <div className="space-y-6">
        <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-amber-400">{t("settings.language")}</CardTitle>
            <CardDescription className="text-gray-400">{t("settings.language.description")}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Select value={language} onValueChange={(value: "ja" | "en") => setLanguage(value)}>
                <SelectTrigger className="border-purple-600 bg-gray-800 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-purple-600 bg-gray-800">
                  <SelectItem value="ja" className="text-white hover:bg-purple-900/30">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🇯🇵</span>
                      <span>{t("language.japanese")}</span>
                    </div>
                  </SelectItem>
                  <SelectItem value="en" className="text-white hover:bg-purple-900/30">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg">🇺🇸</span>
                      <span>{t("language.english")}</span>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-amber-400">{t("settings.sound")}</CardTitle>
            <CardDescription className="text-gray-400">{t("settings.sound.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {soundEnabled ? (
                  <Volume2 className="h-5 w-5 text-green-400" />
                ) : (
                  <VolumeX className="h-5 w-5 text-gray-500" />
                )}
                <Label htmlFor="sound-toggle" className="text-white">
                  {t("settings.sound.effects")}
                </Label>
              </div>
              <Switch id="sound-toggle" checked={soundEnabled} onCheckedChange={toggleSound} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {textToSpeechEnabled ? (
                  <Mic className="h-5 w-5 text-green-400" />
                ) : (
                  <MicOff className="h-5 w-5 text-gray-500" />
                )}
                <Label htmlFor="tts-toggle" className="text-white">
                  {t("settings.sound.tts")}
                </Label>
              </div>
              <Switch id="tts-toggle" checked={textToSpeechEnabled} onCheckedChange={toggleTextToSpeech} />
            </div>

            {textToSpeechEnabled && (
              <Button
                variant="outline"
                size="sm"
                className="mt-2 w-full border-purple-600 text-purple-300 hover:bg-purple-900/30"
                onClick={testSpeech}
              >
                {t("settings.sound.test")}
              </Button>
            )}

            <p className="text-xs text-gray-400 mt-2">{t("settings.sound.note")}</p>
          </CardContent>
        </Card>

        <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-amber-400">{t("settings.cards")}</CardTitle>
            <CardDescription className="text-gray-400">{t("settings.cards.description")}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cards className="h-5 w-5 text-gray-500" />
                <Label htmlFor="minor-arcana-fortune-toggle" className="text-gray-400">
                  {t("settings.cards.minor.fortune")}
                </Label>
              </div>
              <Switch id="minor-arcana-fortune-toggle" checked={false} disabled={true} onCheckedChange={() => {}} />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Cards className="h-5 w-5 text-amber-400" />
                <Label htmlFor="minor-arcana-games-toggle" className="text-white">
                  {t("settings.cards.minor.games")}
                </Label>
              </div>
              <Switch
                id="minor-arcana-games-toggle"
                checked={includeMinorArcanaInGames}
                onCheckedChange={toggleMinorArcanaInGames}
              />
            </div>
          </CardContent>
          <CardFooter className="text-xs text-gray-400 pt-0">{t("settings.cards.note")}</CardFooter>
        </Card>

        <div className="flex justify-center">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-purple-300">
              {t("settings.back")}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}
