// スコアデータの型定義
export interface ScoreEntry {
  score: number
  moves?: number
  date: string
  playerName: string
  tarotPoints?: number // 獲得したタロットポイントを追加
}

export interface ScoreData {
  classic: ScoreEntry[]
  timeAttack: ScoreEntry[]
  hard: ScoreEntry[]
}

// 初期スコアデータ
const initialScoreData: ScoreData = {
  classic: [],
  timeAttack: [],
  hard: [],
}

// スコアデータをローカルストレージから取得
export function getScoreData(): ScoreData {
  if (typeof window === "undefined") return initialScoreData

  const savedData = localStorage.getItem("tarotGameScores")
  if (!savedData) return initialScoreData

  try {
    return JSON.parse(savedData) as ScoreData
  } catch (error) {
    console.error("スコアデータの解析に失敗しました:", error)
    return initialScoreData
  }
}

// スコアデータをローカルストレージに保存
export function saveScoreData(data: ScoreData): void {
  if (typeof window === "undefined") return
  localStorage.setItem("tarotGameScores", JSON.stringify(data))
}

// 新しいスコアを追加
export function addScore(
  mode: "classic" | "timeAttack" | "hard",
  score: number,
  moves?: number,
  playerName = "プレイヤー",
  tarotPoints?: number,
): boolean {
  const data = getScoreData()

  // モード名の正規化
  const normalizedMode = mode === "time-attack" ? "timeAttack" : mode

  const newEntry: ScoreEntry = {
    score,
    moves,
    date: new Date().toISOString(),
    playerName,
    tarotPoints,
  }

  // 配列が存在しない場合は初期化
  if (!data[normalizedMode]) {
    data[normalizedMode] = []
  }

  // スコアを追加
  data[normalizedMode].push(newEntry)

  // スコアの降順でソート
  data[normalizedMode].sort((a, b) => b.score - a.score)

  // 上位5件のみ保持
  data[normalizedMode] = data[normalizedMode].slice(0, 5)

  // データを保存
  saveScoreData(data)

  // 追加したスコアがトップ5に入ったかどうかを返す
  return data[normalizedMode].some((entry) => entry === newEntry)
}

// スコアボードのタイトルを取得
export function getModeName(mode: "classic" | "timeAttack" | "hard"): string {
  switch (mode) {
    case "classic":
      return "クラシックモード"
    case "timeAttack":
      return "タイムアタックモード"
    case "hard":
      return "ハードモード"
    default:
      return "不明なモード"
  }
}

// 日付をフォーマット
export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return `${date.getFullYear()}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date
    .getDate()
    .toString()
    .padStart(2, "0")}`
}

// スコアがハイスコアかどうかを判定する関数
export function isHighScore(mode: "classic" | "timeAttack" | "hard", score: number): boolean {
  const data = getScoreData()
  const normalizedMode = mode === "time-attack" ? "timeAttack" : mode
  const modeScores = data[normalizedMode] || []

  // スコアデータが空の場合は自動的にハイスコア
  if (modeScores.length === 0) return true

  // 現在のスコアが既存のハイスコアより高いかチェック
  return modeScores.some((entry) => score > entry.score) || modeScores.length < 5
}

// ハイスコアを取得する関数
export async function getHighScores(mode: "classic" | "timeAttack" | "hard"): Promise<ScoreEntry[]> {
  const data = getScoreData()
  return data[mode] || []
}

// スコアを保存する関数
export async function saveScore(entry: ScoreEntry & { mode: "classic" | "timeAttack" | "hard" }): Promise<boolean> {
  const { mode, ...scoreEntry } = entry
  return addScore(mode, scoreEntry.score, scoreEntry.moves, scoreEntry.playerName, scoreEntry.tarotPoints)
}
