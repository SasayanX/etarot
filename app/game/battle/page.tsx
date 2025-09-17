"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import Link from "next/link"
import { useSettings } from "@/contexts/settings-context"
import VictoryCelebration from "@/components/victory-celebration"
import { Shield, RotateCcw, Home } from "lucide-react"

// タロットカードの定義（簡略化）
const tarotCards = [
  { id: 0, name: "愚者", image: "/rider-waite/fool.jpg", power: 0, effect: "50%の確率で攻撃を回避" },
  { id: 1, name: "魔術師", image: "/rider-waite/magician.jpg", power: 1, effect: "次のカードの攻撃力+3" },
  { id: 16, name: "塔", image: "/rider-waite/tower.jpg", power: 16, effect: "両プレイヤーに7ダメージ" },
  { id: 19, name: "太陽", image: "/rider-waite/sun.jpg", power: 19, effect: "ライフポイントを7回復" },
  { id: 21, name: "世界", image: "/rider-waite/world.jpg", power: 21, effect: "すべての特殊効果を発動" },
]

// バックアップ画像のURLを生成
const getBackupImageUrl = (card: { name: string }) => {
  return `/placeholder.svg?height=300&width=200&query=rider waite tarot card ${card.name}`
}

export default function TarotBattlePage() {
  const { playSound } = useSettings()
  const [playerLife, setPlayerLife] = useState(30)
  const [enemyLife, setEnemyLife] = useState(30)
  const [playerDeck, setPlayerDeck] = useState(tarotCards)
  const [enemyDeck, setEnemyDeck] = useState([...tarotCards].sort(() => 0.5 - Math.random()))
  const [playerCard, setPlayerCard] = useState<(typeof tarotCards)[0] | null>(null)
  const [enemyCard, setEnemyCard] = useState<(typeof tarotCards)[0] | null>(null)
  const [battleLog, setBattleLog] = useState<string[]>([])
  const [turn, setTurn] = useState(1)
  const [gameOver, setGameOver] = useState(false)
  const [playerWon, setPlayerWon] = useState(false)
  const [showVictory, setShowVictory] = useState(false)
  const [earnedPoints, setEarnedPoints] = useState(0)

  const [cardBackImage, setCardBackImage] = useState("/royal-tarot-card-back.png")

  useEffect(() => {
    // ローカルストレージからカードバック画像を取得
    const storedCardBack = localStorage.getItem("selectedCardBack")
    if (storedCardBack) {
      setCardBackImage(storedCardBack)
    }
  }, [])

  // カードをプレイする
  const playCard = (card: (typeof tarotCards)[0]) => {
    // プレイヤーのカードをセット
    setPlayerCard(card)

    // プレイヤーのデッキからカードを削除
    setPlayerDeck(playerDeck.filter((c) => c.id !== card.id))

    // 効果音を再生
    playSound("flip")

    // 敵のカードをランダムに選択
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * enemyDeck.length)
      const selectedEnemyCard = enemyDeck[randomIndex]
      setEnemyCard(selectedEnemyCard)
      setEnemyDeck(enemyDeck.filter((_, i) => i !== randomIndex))

      // 効果音を再生
      playSound("flip")

      // バトル結果を計算
      setTimeout(() => {
        resolveBattle(card, selectedEnemyCard)
      }, 1000)
    }, 1000)
  }

  // バトル結果を計算
  const resolveBattle = (playerCard: (typeof tarotCards)[0], enemyCard: (typeof tarotCards)[0]) => {
    const playerPower = playerCard.power
    const enemyPower = enemyCard.power
    const newLog: string[] = []

    // 特殊効果の適用（簡略化）
    newLog.push(`あなた: ${playerCard.name}（攻撃力: ${playerPower}）`)
    newLog.push(`敵: ${enemyCard.name}（攻撃力: ${enemyPower}）`)

    // 特殊効果のログ
    newLog.push(`${playerCard.name}の効果: ${playerCard.effect}`)
    newLog.push(`${enemyCard.name}の効果: ${enemyCard.effect}`)

    // 勝敗判定
    if (playerPower > enemyPower) {
      const damage = playerPower - enemyPower
      setEnemyLife((prev) => Math.max(0, prev - damage))
      newLog.push(`敵に${damage}ダメージ！`)
      playSound("match")
    } else if (enemyPower > playerPower) {
      const damage = enemyPower - playerPower
      setPlayerLife((prev) => Math.max(0, prev - damage))
      newLog.push(`あなたに${damage}ダメージ！`)
      playSound("match")
    } else {
      newLog.push("引き分け！")
    }

    setBattleLog([...battleLog, ...newLog])
    setTurn(turn + 1)

    // 次のターンの準備
    setTimeout(() => {
      setPlayerCard(null)
      setEnemyCard(null)

      // ゲーム終了判定
      if (enemyLife <= 0) {
        setGameOver(true)
        setPlayerWon(true)
        const points = calculatePoints()
        setEarnedPoints(points)
        setShowVictory(true)
      } else if (playerLife <= 0) {
        setGameOver(true)
        setPlayerWon(false)
      } else if (playerDeck.length === 0 || enemyDeck.length === 0) {
        setGameOver(true)
        setPlayerWon(playerLife > enemyLife)
        if (playerLife > enemyLife) {
          const points = calculatePoints()
          setEarnedPoints(points)
          setShowVictory(true)
        }
      }
    }, 2000)
  }

  // 獲得ポイントの計算
  const calculatePoints = () => {
    // 残りライフと残りカード数に基づいてポイントを計算
    const lifeBonus = playerLife * 10
    const cardBonus = playerDeck.length * 50
    const turnBonus = Math.max(0, 500 - turn * 20)
    return lifeBonus + cardBonus + turnBonus
  }

  // ゲームをリセット
  const resetGame = () => {
    setPlayerLife(30)
    setEnemyLife(30)
    setPlayerDeck([...tarotCards].sort(() => 0.5 - Math.random()))
    setEnemyDeck([...tarotCards].sort(() => 0.5 - Math.random()))
    setPlayerCard(null)
    setEnemyCard(null)
    setBattleLog([])
    setTurn(1)
    setGameOver(false)
    setPlayerWon(false)
    setShowVictory(false)
  }

  return (
    <div className="py-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-amber-400">タロットバトル</h1>
        <p className="text-xl text-purple-300">カードの力で対決しよう</p>
      </div>

      {/* 敵の情報 */}
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-red-700">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-red-400">敵</h2>
          <div className="text-white">残りカード: {enemyDeck.length}</div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-red-400" />
          <Progress value={(enemyLife / 30) * 100} className="h-4 bg-gray-700">
            <div className="h-full bg-red-600 rounded-full transition-all duration-500"></div>
          </Progress>
          <span className="text-white font-bold">{enemyLife}</span>
        </div>
      </div>

      {/* バトルフィールド */}
      <div className="grid grid-cols-2 gap-4 min-h-[200px]">
        <div className="flex justify-center items-center">
          {playerCard && (
            <div className="transform transition-all duration-500 hover:scale-105">
              <img
                src={playerCard.image || getBackupImageUrl(playerCard)}
                alt={playerCard.name}
                className="w-32 h-48 object-cover rounded-lg border-2 border-amber-600"
                onError={(e) => {
                  e.currentTarget.src = getBackupImageUrl(playerCard)
                }}
              />
              <div className="mt-2 text-center">
                <p className="text-white font-bold">{playerCard.name}</p>
                <p className="text-amber-400">攻撃力: {playerCard.power}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-center items-center">
          {enemyCard && (
            <div className="transform transition-all duration-500">
              <img
                src={enemyCard.image || getBackupImageUrl(enemyCard)}
                alt={enemyCard.name}
                className="w-32 h-48 object-cover rounded-lg border-2 border-red-600"
                onError={(e) => {
                  e.currentTarget.src = getBackupImageUrl(enemyCard)
                }}
              />
              <div className="mt-2 text-center">
                <p className="text-white font-bold">{enemyCard.name}</p>
                <p className="text-red-400">攻撃力: {enemyCard.power}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* プレイヤーの情報 */}
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-amber-700">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-lg font-bold text-amber-400">あなた</h2>
          <div className="text-white">残りカード: {playerDeck.length}</div>
        </div>
        <div className="flex items-center gap-2">
          <Shield className="text-amber-400" />
          <Progress value={(playerLife / 30) * 100} className="h-4 bg-gray-700">
            <div className="h-full bg-amber-600 rounded-full transition-all duration-500"></div>
          </Progress>
          <span className="text-white font-bold">{playerLife}</span>
        </div>
      </div>

      {/* プレイヤーの手札 */}
      {!gameOver && !playerCard && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {playerDeck.map((card) => (
            <Card
              key={card.id}
              className="border-purple-700 bg-gray-900/60 backdrop-blur-sm hover:border-amber-500 transition-all cursor-pointer"
              onClick={() => playCard(card)}
            >
              <CardContent className="p-2">
                <img
                  src={card.image || getBackupImageUrl(card)}
                  alt={card.name}
                  className="w-full aspect-[2/3] object-cover rounded-lg"
                  onError={(e) => {
                    e.currentTarget.src = getBackupImageUrl(card)
                  }}
                />
                <div className="mt-2 text-center">
                  <p className="text-white font-bold">{card.name}</p>
                  <p className="text-amber-400 text-sm">攻撃力: {card.power}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* バトルログ */}
      <div className="bg-gray-900/60 backdrop-blur-sm rounded-lg p-4 border border-purple-700 max-h-40 overflow-y-auto">
        <h3 className="text-purple-300 font-bold mb-2">バトルログ</h3>
        {battleLog.length > 0 ? (
          <ul className="space-y-1">
            {battleLog.map((log, index) => (
              <li key={index} className="text-gray-300 text-sm">
                {log}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400 text-sm">カードを選んでバトルを開始してください</p>
        )}
      </div>

      {/* ゲームオーバー表示 */}
      {gameOver && !showVictory && (
        <div className="bg-gray-900/80 backdrop-blur-md p-6 rounded-lg border-2 border-purple-700 text-center">
          <h2 className="text-2xl font-bold mb-4">{playerWon ? "勝利！" : "敗北..."}</h2>
          <p className="text-white mb-6">
            {playerWon
              ? "おめでとうございます！あなたはタロットの力を見事に使いこなしました。"
              : "残念...次は違う戦略で挑戦してみましょう。"}
          </p>
          <div className="flex justify-center space-x-4">
            <Button onClick={resetGame} className="bg-purple-700 hover:bg-purple-600">
              <RotateCcw className="mr-2 h-4 w-4" />
              もう一度プレイ
            </Button>
            <Link href="/game">
              <Button variant="outline" className="border-purple-700 text-purple-300">
                <Home className="mr-2 h-4 w-4" />
                ゲーム選択に戻る
              </Button>
            </Link>
          </div>
        </div>
      )}

      {/* 勝利演出 */}
      {showVictory && (
        <VictoryCelebration
          isActive={showVictory}
          message="タロットバトル勝利！"
          points={earnedPoints}
          onComplete={() => setShowVictory(false)}
        />
      )}

      {/* ゲーム説明 */}
      <div className="bg-gray-800/60 backdrop-blur-sm rounded-lg p-4 border border-purple-700 max-w-3xl mx-auto">
        <h3 className="text-lg font-bold text-amber-400 mb-2">ゲームルール</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-300 text-sm">
          <li>各プレイヤーは30のライフポイントを持ちます</li>
          <li>手札からカードを1枚選んでプレイします</li>
          <li>カードの数字が攻撃力となります</li>
          <li>攻撃力が高いカードが勝ち、差分のダメージを与えます</li>
          <li>各カードには特殊効果があります</li>
          <li>相手のライフを0にするか、カードがなくなった時点で多くのライフを持つプレイヤーの勝利です</li>
        </ul>
      </div>
    </div>
  )
}
