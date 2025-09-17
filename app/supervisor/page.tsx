"use client"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Mail, Globe, QrCode, Copy, Check } from "lucide-react"
import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { useLanguage } from "@/contexts/language-context"

export default function SupervisorPage() {
  const { t } = useLanguage()
  const [showQrCode, setShowQrCode] = useState(false)
  const [imageError, setImageError] = useState(false)
  const [copied, setCopied] = useState(false)

  // LINE ID
  const lineId = "@826vncgb"

  // プロフィール画像URL
  const profileImageUrl =
    "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Knau%EF%BC%BFKiryuu-7N8YcoIxcIapv90HYTu2EgoNHFgQd7.png"

  // QRコードを生成するURL
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=https://line.me/ti/p/${encodeURIComponent(lineId)}`

  // LINE IDをクリップボードにコピーする関数
  const copyLineId = () => {
    navigator.clipboard.writeText(lineId).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  // 外部ブラウザでURLを開く関数
  const openExternalBrowser = (url: string) => {
    try {
      // 通常のウィンドウオープン
      window.open(url, "_system")
    } catch (error) {
      console.error("外部ブラウザを開く際にエラーが発生しました:", error)

      // フォールバック: 標準的な方法
      try {
        window.location.href = url
      } catch (fallbackError) {
        console.error("フォールバック方法でもエラーが発生しました:", fallbackError)
        alert("ブラウザでリンクを開けませんでした。QRコードをご利用ください。")
        setShowQrCode(true)
      }
    }
  }

  return (
    <div className="min-h-screen bg-[#121330] py-8">
      <div className="text-center space-y-2 mb-8">
        <h1 className="text-3xl font-bold text-amber-400">{t("supervisor.title")}</h1>
        <p className="text-xl text-purple-300">{t("supervisor.name")}</p>
      </div>

      <div className="flex flex-col items-center justify-center mb-8">
        <div className="w-40 h-40 rounded-full overflow-hidden border-4 border-amber-500 mb-6 ring-4 ring-amber-300/20 relative">
          <img
            src={profileImageUrl || "/placeholder.svg"}
            alt={t("supervisor.name")}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error("画像読み込みエラー: fallback to placeholder")
              setImageError(true)
              e.currentTarget.src = `/placeholder.svg?height=400&width=400&query=${encodeURIComponent("Buddhist monk portrait")}`
              e.currentTarget.onerror = null
            }}
          />
        </div>

        <div className="flex flex-col gap-4 items-center">
          <div className="flex gap-2">
            <Button
              className="bg-[#06C755] hover:bg-[#06C755]/90 text-white flex items-center gap-2 px-6 py-2 h-auto font-bold shadow-lg"
              onClick={() => {
                // 標準的なLINE友だち追加URL（WebView互換性向上）
                openExternalBrowser("https://line.me/ti/p/@826vncgb")
              }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-5 w-5"
              >
                <path d="M21 10c0-4.418-4.477-8-10-8S1 5.582 1 10c0 3.87 3.426 7.106 8.066 7.722.6.114 1.414.348 1.622.8.168.368.117.954.057 1.337l-.263 1.578c-.08.484-.368 1.894 1.66.934 2.027-.96 10.951-6.44 14.953-11.025A7.163 7.163 0 0 0 21 10Z" />
              </svg>
              <span>{t("supervisor.line.add")}</span>
            </Button>

            <Button
              variant="outline"
              className="bg-gray-800/30 border-gray-700 text-gray-300 hover:bg-gray-800/50"
              onClick={() => setShowQrCode(true)}
            >
              <QrCode className="h-5 w-5" />
            </Button>
          </div>

          <div className="flex gap-4 mt-2">
            <div className="flex items-center gap-2 bg-gray-800/60 text-purple-300 px-4 py-2 rounded-md">
              <Mail className="h-5 w-5" />
              <span>kanaukiryu@gmail.com</span>
            </div>

            <Button
              variant="ghost"
              className="flex items-center gap-2 bg-amber-500/20 text-amber-400 px-4 py-2 rounded-md hover:bg-amber-500/30 transition-colors"
              onClick={() => {
                openExternalBrowser("https://kanau-kiryu.com/")
              }}
            >
              <Globe className="h-5 w-5" />
              <span>{t("supervisor.website")}</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs defaultValue="greeting" className="w-full max-w-4xl mx-auto">
        <TabsList className="grid grid-cols-2 mb-6 bg-gray-800/30">
          <TabsTrigger value="greeting" className="data-[state=active]:bg-gray-800/60">
            {t("supervisor.greeting.tab")}
          </TabsTrigger>
          <TabsTrigger value="profile" className="data-[state=active]:bg-gray-800/60">
            {t("supervisor.profile.tab")}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="greeting">
          <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
            <CardContent className="space-y-4 pt-6">
              <p className="text-white leading-relaxed">{t("supervisor.greeting.content1")}</p>
              <p className="text-white leading-relaxed">{t("supervisor.greeting.content2")}</p>
              <p className="text-white leading-relaxed">{t("supervisor.greeting.content3")}</p>
              <div className="text-right mt-4">
                <p className="text-amber-400 font-bold">{t("supervisor.greeting.signature")}</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile">
          <Card className="border-purple-700 bg-gray-900/60 backdrop-blur-sm">
            <CardContent className="pt-6">
              <h2 className="text-2xl font-bold text-amber-400 mb-4">{t("supervisor.profile.title")}</h2>

              <div className="flex flex-wrap gap-2 mb-4">
                <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">姓名判断</Badge>
                <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/50">四柱推命</Badge>
                <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/50">タロット鑑定</Badge>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/50">手相</Badge>
                <Badge className="bg-red-500/20 text-red-400 border-red-500/50">数秘術</Badge>
                <Badge className="bg-cyan-500/20 text-cyan-400 border-cyan-500/50">六星占術</Badge>
              </div>

              <div className="space-y-4 text-white">
                <p className="leading-relaxed">{t("supervisor.profile.bio1")}</p>
                <p className="leading-relaxed">{t("supervisor.profile.bio2")}</p>
                <p className="leading-relaxed">{t("supervisor.profile.bio3")}</p>
                <p className="leading-relaxed">{t("supervisor.profile.bio4")}</p>
                <p className="leading-relaxed">{t("supervisor.profile.bio5")}</p>

                <div className="mt-6">
                  <h3 className="text-lg font-bold text-amber-400 mb-2">{t("supervisor.qualifications.title")}</h3>
                  <ul className="list-disc list-inside text-white space-y-1 ml-2">
                    <li>{t("supervisor.qualifications.item1")}</li>
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-bold text-amber-400 mb-2">{t("supervisor.titles.title")}</h3>
                  <ul className="list-disc list-inside text-white space-y-1 ml-2">
                    <li>{t("supervisor.titles.item1")}</li>
                    <li>{t("supervisor.titles.item2")}</li>
                    <li>{t("supervisor.titles.item3")}</li>
                  </ul>
                </div>

                <div className="grid grid-cols-3 gap-3 mt-6">
                  <div className="bg-gray-800/60 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-amber-400">15+</p>
                    <p className="text-xs text-purple-300">{t("supervisor.stats.experience")}</p>
                  </div>
                  <div className="bg-gray-800/60 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-amber-400">5,000+</p>
                    <p className="text-xs text-purple-300">{t("supervisor.stats.readings")}</p>
                  </div>
                  <div className="bg-gray-800/60 p-3 rounded-lg text-center">
                    <p className="text-2xl font-bold text-amber-400">97.5%</p>
                    <p className="text-xs text-purple-300">{t("supervisor.stats.accuracy")}</p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold text-amber-400 mb-4">{t("supervisor.services.title")}</h3>
                  <div className="grid grid-cols-1 gap-4">
                    <Card className="border-purple-700/50 bg-gray-800/40 hover:bg-gray-800/60 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-purple-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{t("supervisor.services.home.title")}</h4>
                            <p className="text-sm text-gray-300">{t("supervisor.services.home.description")}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-purple-500/20 border-purple-500/50 text-purple-300 hover:bg-purple-500/30"
                            onClick={() => openExternalBrowser("https://ie-unsei.jp/")}
                          >
                            {t("supervisor.services.button")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-green-700/50 bg-gray-800/40 hover:bg-gray-800/60 transition-colors">
                      <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center">
                            <svg
                              className="w-6 h-6 text-green-400"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z"
                              />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l2.414 2.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0M15 17a2 2 0 104 0M9 17h6"
                              />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-white">{t("supervisor.services.car.title")}</h4>
                            <p className="text-sm text-gray-300">{t("supervisor.services.car.description")}</p>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-green-500/20 border-green-500/50 text-green-300 hover:bg-green-500/30"
                            onClick={() => openExternalBrowser("https://car-unsei.jp/")}
                          >
                            {t("supervisor.services.button")}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* QRコードモーダル */}
      <Dialog open={showQrCode} onOpenChange={setShowQrCode}>
        <DialogContent className="bg-gray-900 border-purple-700">
          <DialogHeader>
            <DialogTitle className="text-center text-amber-400">{t("supervisor.line.qr.title")}</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center justify-center p-4">
            <div className="bg-white p-4 rounded-lg mb-4">
              {/* 動的に生成されたQRコード */}
              <img
                src={qrCodeUrl || "/placeholder.svg"}
                alt="LINE友だち追加QRコード"
                className="w-64 h-64"
                onError={(e) => {
                  console.error("QRコード画像読み込みエラー")
                  e.currentTarget.src = `/placeholder.svg?height=200&width=200&query=${encodeURIComponent("QR Code for LINE")}`
                  e.currentTarget.onerror = null
                }}
              />
            </div>
            <p className="text-white text-center">{t("supervisor.line.qr.instruction")}</p>

            {/* LINE IDとコピーボタン */}
            <div className="flex items-center justify-center mt-4 bg-gray-800 rounded-md p-2">
              <p className="text-gray-200 mr-2">{lineId}</p>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0" onClick={copyLineId}>
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                <span className="sr-only">Copy LINE ID</span>
              </Button>
            </div>

            {/* 直接開くボタン */}
            <Button
              className="mt-4 bg-[#06C755] hover:bg-[#06C755]/90 text-white"
              onClick={() => {
                openExternalBrowser("https://line.me/ti/p/@826vncgb")
                setShowQrCode(false)
              }}
            >
              {t("supervisor.line.open")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
