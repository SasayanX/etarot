"use client"

import { createContext, useContext, useState, useEffect, useRef, type ReactNode, useCallback } from "react"
import { usePathname } from "next/navigation"
import { preloadImages } from "@/utils/image-utils"

// SoundType の型定義
type SoundType = "flip" | "shuffle" | "match" | "success" | "wrong" | "whistle" | "correct" | "incorrect"

// SettingsContextType の型定義
type SettingsContextType = {
  soundEnabled: boolean
  toggleSound: () => void
  textToSpeechEnabled: boolean
  toggleTextToSpeech: () => void
  speak: (text: string) => void
  stopSpeaking: () => void
  playSound: (soundType: SoundType) => void
  audioLoaded: boolean
  imagesLoaded: boolean
  isSpeaking: boolean
  // デバッグ用の関数を追加
  testSpeech: () => void
  // 小アルカナカード設定を追加
  includeMinorArcanaInFortune: boolean
  toggleMinorArcanaInFortune: () => void
  includeMinorArcanaInGames: boolean
  toggleMinorArcanaInGames: () => void
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined)

// SOUND_FILES の定義
const SOUND_FILES: Record<SoundType, string> = {
  flip: "/sounds/card-flip.mp3",
  shuffle: "/sounds/card-shuffle.mp3",
  match: "/sounds/card-match.mp3",
  success: "/sounds/success.mp3",
  wrong: "/sounds/wrong.mp3",
  whistle: "/sounds/whistle.mp3",
}

// 代替音声ファイル（ブラウザ内で生成）
const generateBeepSound = (frequency = 440, duration = 300, volume = 0.5, type = "sine"): AudioBuffer | null => {
  if (typeof window === "undefined" || !window.AudioContext) {
    return null
  }

  try {
    const audioContext = new window.AudioContext()
    const buffer = audioContext.createBuffer(1, audioContext.sampleRate * (duration / 1000), audioContext.sampleRate)
    const channel = buffer.getChannelData(0)

    // 波形を生成
    for (let i = 0; i < buffer.length; i++) {
      const t = i / audioContext.sampleRate
      if (type === "sine") {
        channel[i] = Math.sin(2 * Math.PI * frequency * t) * volume
      } else if (type === "square") {
        channel[i] = Math.sign(Math.sin(2 * Math.PI * frequency * t)) * volume
      } else if (type === "sawtooth") {
        channel[i] = (((t * frequency) % 1) * 2 - 1) * volume
      } else if (type === "triangle") {
        const period = 1.0 / frequency
        const phase = t % period
        const normalized = phase / period
        channel[i] = (normalized < 0.5 ? normalized * 4 - 1 : 3 - normalized * 4) * volume
      } else if (type === "noise") {
        // ノイズを滑らかにするためのフィルタリング
        const randomValue = Math.random() * 2 - 1
        if (i > 0) {
          // 前のサンプルとの平均を取ることで滑らかにする
          channel[i] = ((randomValue + channel[i - 1]) / 2) * volume
        } else {
          channel[i] = randomValue * volume
        }
      } else if (type === "smooth") {
        // 複数の周波数を組み合わせた滑らかな音
        channel[i] =
          (Math.sin(2 * Math.PI * frequency * t) * 0.5 +
            Math.sin(2 * Math.PI * (frequency * 1.5) * t) * 0.3 +
            Math.sin(2 * Math.PI * (frequency * 2) * t) * 0.2) *
          volume
      }
    }

    // フェードイン
    const fadeInSamples = audioContext.sampleRate * 0.05 // 50ms
    for (let i = 0; i < fadeInSamples; i++) {
      const fadeInFactor = i / fadeInSamples
      channel[i] *= fadeInFactor
    }

    // フェードアウト
    const fadeOutSamples = audioContext.sampleRate * 0.1 // 100ms
    for (let i = buffer.length - fadeOutSamples; i < buffer.length; i++) {
      const fadeOutFactor = (buffer.length - i) / fadeOutSamples
      channel[i] *= fadeOutFactor
    }

    return buffer
  } catch (error) {
    console.error("音声生成に失敗しました:", error)
    return null
  }
}

// FALLBACK_SOUNDS の定義
const FALLBACK_SOUNDS: Record<SoundType, { frequency: number; duration: number; type: string }> = {
  flip: { frequency: 800, duration: 100, type: "sine" },
  shuffle: { frequency: 220, duration: 600, type: "smooth" },
  match: { frequency: 600, duration: 200, type: "sine" },
  success: { frequency: 1200, duration: 400, type: "sine" },
  wrong: { frequency: 300, duration: 300, type: "sawtooth" },
  whistle: { frequency: 1800, duration: 500, type: "sine" },
}

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [textToSpeechEnabled, setTextToSpeechEnabled] = useState(false)
  const [audioLoaded, setAudioLoaded] = useState(false)
  const [imagesLoaded, setImagesLoaded] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  // 小アルカナカード設定を追加
  const [includeMinorArcanaInFortune, setIncludeMinorArcanaInFortune] = useState(false)
  const [includeMinorArcanaInGames, setIncludeMinorArcanaInGames] = useState(false)
  const pathname = usePathname()
  const previousPathname = useRef<string | null>(null)

  // 音声キャッシュをrefで保持
  const audioCache = useRef<Record<SoundType, HTMLAudioElement | null>>({
    flip: null,
    shuffle: null,
    match: null,
    success: null,
    wrong: null,
    whistle: null,
  })

  // AudioContextの参照を保持
  const audioContextRef = useRef<AudioContext | null>(null)

  // 音声合成の初期化状態を追跡
  const speechInitAttempted = useRef(false)
  const voicesLoaded = useRef(false)

  // 音声合成の状態を管理
  const speechStateRef = useRef({
    initialized: false,
    speaking: false,
    pendingTexts: [] as string[],
    processingQueue: false,
    useAlternativeMethod: false,
    currentUtterance: null as SpeechSynthesisUtterance | null,
    errorCount: 0,
    maxErrorCount: 3,
    lastErrorTime: 0,
    isChunkedMode: false, // チャンク分割モードかどうか
    isDictionaryPage: false, // 辞典ページかどうか
    forceAlternativeForDictionary: false, // 辞典ページでも音声合成を試みる
    interruptedCount: 0, // 中断エラーのカウント
    maxInterruptedCount: 2, // 許容される中断エラーの最大数（2回に減らす）
    speechSynthesisAvailable: false, // 音声合成が利用可能かどうか
    dictionaryFallbackMode: false, // 辞典ページでも通常の音声合成を試みる
    speechErrorInDictionary: false, // 辞典ページで音声合成エラーが発生したかどうか
    retryCount: 0, // 再試行回数
    maxRetryCount: 2, // 最大再試行回数
    lastText: "", // 最後に読み
  })

  // 読み上げ停止関数 - 循環参照を避けるために先に定義
  const stopSpeaking = useCallback(() => {
    if (typeof window === "undefined") return

    console.log("読み上げを停止します")

    try {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }
      setIsSpeaking(false)
    } catch (error) {
      console.error("読み上げ停止エラー:", error)
    }
  }, [])

  // 現在のページが辞典ページかどうかを確認する関数
  const checkIfDictionaryPage = () => {
    if (typeof window === "undefined") return false

    const currentPath = window.location.pathname
    const isDictionary = currentPath.includes("/dictionary")

    if (isDictionary) {
      console.log("辞典ページを検出しました")
    }

    return isDictionary
  }

  // LocalStorageから設定を読み込む
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedSoundEnabled = localStorage.getItem("soundEnabled")
      const savedTextToSpeechEnabled = localStorage.getItem("textToSpeechEnabled")
      const savedIncludeMinorArcanaInFortune = localStorage.getItem("includeMinorArcanaInFortune")
      const savedIncludeMinorArcanaInGames = localStorage.getItem("includeMinorArcanaInGames")

      if (savedSoundEnabled !== null) {
        setSoundEnabled(savedSoundEnabled === "true")
      }

      if (savedTextToSpeechEnabled !== null) {
        setTextToSpeechEnabled(savedTextToSpeechEnabled === "true")
      }

      // 小アルカナを占いに含める設定は常にfalseに設定
      setIncludeMinorArcanaInFortune(false)
      localStorage.setItem("includeMinorArcanaInFortune", "false")

      if (savedIncludeMinorArcanaInGames !== null) {
        setIncludeMinorArcanaInGames(savedIncludeMinorArcanaInGames === "true")
      }

      // 初期ロード時に辞典ページかどうかを確認
      speechStateRef.current.isDictionaryPage = checkIfDictionaryPage()
    }
  }, [])

  // ページ遷移を監視して音声合成を停止 - 強化版
  useEffect(() => {
    // パスが変わったら音声合成を停止
    if (previousPathname.current && previousPathname.current !== pathname) {
      console.log(`ページ遷移を検出: ${previousPathname.current} -> ${pathname}`)

      // 直接 speechSynthesis を使用して停止
      if (typeof window !== "undefined") {
        // 確実に停止するために複数回試行
        try {
          // まず現在の状態をリセット
          const state = speechStateRef.current
          state.speaking = false
          state.currentUtterance = null
          state.processingQueue = false
          state.pendingTexts = []
          setIsSpeaking(false)

          // 音声合成を即時停止
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel()
            console.log("ページ遷移により読み上げを停止しました (1回目)")

            // 少し遅延させて再度停止を試みる（より確実に）
            setTimeout(() => {
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel()
                console.log("ページ遷移により読み上げを停止しました (2回目)")
              }
            }, 50)

            // さらに遅延させて3回目の停止を試みる
            setTimeout(() => {
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel()
                console.log("ページ遷移により読み上げを停止しました (3回目)")
              }
            }, 150)

            // 最後に4回目の停止を試みる
            setTimeout(() => {
              if (window.speechSynthesis) {
                window.speechSynthesis.cancel()
                console.log("ページ遷移により読み上げを停止しました (4回目)")
              }
            }, 300)
          }
        } catch (error) {
          console.error("音声停止中にエラーが発生しました:", error)
        }
      }
    }

    previousPathname.current = pathname
  }, [pathname])

  // コンポーネントのアンマウント時にも音声を停止するクリーンアップ関数を追加
  useEffect(() => {
    return () => {
      if (typeof window !== "undefined" && window.speechSynthesis) {
        try {
          // 複数回停止を試みる
          window.speechSynthesis.cancel()
          console.log("コンポーネントのアンマウントにより読み上げを停止しました (1回目)")

          // 少し遅延させて再度停止を試みる
          setTimeout(() => {
            if (window.speechSynthesis) {
              window.speechSynthesis.cancel()
              console.log("コンポーネントのアンマウントにより読み上げを停止しました (2回目)")
            }
          }, 50)
        } catch (error) {
          console.error("アンマウント時の音声停止中にエラーが発生しました:", error)
        }
      }
    }
  }, [])

  // AudioContextの初期化
  useEffect(() => {
    if (typeof window !== "undefined" && window.AudioContext && !audioContextRef.current) {
      try {
        audioContextRef.current = new window.AudioContext()
      } catch (error) {
        console.error("AudioContextの初期化に失敗しました:", error)
      }
    }

    return () => {
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(console.error)
      }
    }
  }, [])

  // 音声合成の初期化
  useEffect(() => {
    if (typeof window === "undefined" || speechInitAttempted.current) return

    speechInitAttempted.current = true

    // Web Speech APIのサポートチェック
    if (!window.speechSynthesis) {
      console.warn("このブラウザはWeb Speech APIをサポートしていません")
      speechStateRef.current.useAlternativeMethod = true
      return
    }

    try {
      // 音声合成の状態をリセット
      window.speechSynthesis.cancel()

      // 音声合成が利用可能かチェック
      speechStateRef.current.speechSynthesisAvailable = true

      // 音声が読み込まれたときのイベントハンドラ
      const handleVoicesChanged = () => {
        const voices = window.speechSynthesis.getVoices()
        console.log(`利用可能な音声: ${voices.length}個`)

        // 日本語の音声をログに出力
        const japaneseVoices = voices.filter(
          (voice) => voice.lang === "ja-JP" || voice.lang.startsWith("ja") || voice.name.includes("Japanese"),
        )
        console.log(
          "日本語の音声:",
          japaneseVoices.map((v) => `${v.name} (${v.lang})`),
        )

        // 日本語の音声が見つからない場合は警告するが、代替手段には切り替えない
        if (japaneseVoices.length === 0) {
          console.warn("日本語の音声が見つかりません。デフォルトの音声を使用します。")
        }

        voicesLoaded.current = true
        speechStateRef.current.initialized = true

        // 代替手段を使用しないように設定
        speechStateRef.current.useAlternativeMethod = false
      }

      // 既に音声が読み込まれているか確認
      const voices = window.speechSynthesis.getVoices()
      if (voices.length > 0) {
        handleVoicesChanged()
      }

      // 音声が読み込まれたときのイベントリスナーを追加
      window.speechSynthesis.onvoiceschanged = handleVoicesChanged

      // 5秒後にも音声が読み込まれていない場合でも、代替手段には切り替えない
      setTimeout(() => {
        if (!voicesLoaded.current) {
          console.warn("音声の読み込みタイムアウト。デフォルトの音声を使用します。")
          speechStateRef.current.initialized = true
          // 代替手段は使用しない
          speechStateRef.current.useAlternativeMethod = false
        }
      }, 5000)
    } catch (error) {
      console.error("音声合成の初期化に失敗しました:", error)
      // エラーが発生しても代替手段には切り替えない
      speechStateRef.current.useAlternativeMethod = false
    }

    return () => {
      if (window.speechSynthesis) {
        window.speechSynthesis.onvoiceschanged = null
      }
    }
  }, [])

  // 画像をプリロード
  useEffect(() => {
    if (typeof window === "undefined") return

    // Import the getCardImageUrl function
    import("@/utils/image-utils").then(({ getCardImageUrl }) => {
      // 大アルカナの画像パスを生成 - Vercel Blob Storage URLsを使用
      const tarotImagePaths = Array.from({ length: 22 }, (_, i) => getCardImageUrl(i))

      // 画像をプリロード
      const loadImages = async () => {
        console.log("タロットカード画像のプリロードを開始...")
        try {
          const loadedPaths = await preloadImages(tarotImagePaths)
          console.log(`${loadedPaths.length}/${tarotImagePaths.length}枚の画像をプリロードしました`)
          setImagesLoaded(true)
        } catch (error) {
          console.error("画像のプリロード中にエラーが発生しました:", error)
          // Even if some images fail, we still consider images loaded
          setImagesLoaded(true)
        }
      }

      loadImages()
    })
  }, [])

  // 音声ファイルをプリロード
  useEffect(() => {
    if (typeof window === "undefined") return

    console.log("効果音のプリロードを開始...")
    let loadedCount = 0
    const totalSounds = Object.keys(SOUND_FILES).length

    // 各音声タイプごとに読み込みを試行
    Object.entries(SOUND_FILES).forEach(([soundType, path]) => {
      const audio = new Audio()

      // 読み込み成功時
      audio.addEventListener(
        "canplaythrough",
        () => {
          console.log(`音声ファイル ${path} の読み込みが完了しました`)
          audioCache.current[soundType as SoundType] = audio
          loadedCount++

          if (loadedCount === totalSounds) {
            console.log("すべての効果音の読み込みが完了しました")
            setAudioLoaded(true)
          }
        },
        { once: true },
      )

      // 読み込み失敗時
      audio.addEventListener(
        "error",
        (e) => {
          console.warn(`音声ファイル ${path} の読み込みに失敗しました:`, e)
          audioCache.current[soundType as SoundType] = null
          loadedCount++

          if (loadedCount === totalSounds) {
            console.log("一部の効果音の読み込みに失敗しましたが、処理を続行します")
            setAudioLoaded(true)
          }
        },
        { once: true },
      )

      // 音量設定
      audio.volume = 0.5

      // 読み込み開始
      audio.src = path
      audio.load()
    })

    // クリーンアップ
    return () => {
      Object.values(audioCache.current).forEach((audio) => {
        if (audio) {
          audio.pause()
          audio.src = ""
        }
      })
    }
  }, [])

  // 設定を切り替える関数
  const toggleSound = () => {
    const newValue = !soundEnabled
    setSoundEnabled(newValue)
    localStorage.setItem("soundEnabled", newValue.toString())
  }

  const toggleTextToSpeech = () => {
    const newValue = !textToSpeechEnabled
    setTextToSpeechEnabled(newValue)
    localStorage.setItem("textToSpeechEnabled", newValue.toString())

    // テキスト読み上げを有効にした時に、初期化テストを実行
    if (newValue && typeof window !== "undefined") {
      testSpeech()
    }
  }

  // 小アルカナカード設定を切り替える関数
  const toggleMinorArcanaInFortune = () => {
    // 小アルカナを占いに含める機能はロックされています
    console.log("小アルカナを占いに含める機能は現在無効化されています")
    // 常にfalseを設定
    setIncludeMinorArcanaInFortune(false)
    localStorage.setItem("includeMinorArcanaInFortune", "false")
  }

  const toggleMinorArcanaInGames = () => {
    const newValue = !includeMinorArcanaInGames
    setIncludeMinorArcanaInGames(newValue)
    localStorage.setItem("includeMinorArcanaInGames", newValue.toString())
  }

  // 代替音を再生する関数
  const playFallbackSound = (soundType: SoundType) => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new window.AudioContext()
      } catch (error) {
        console.error("AudioContextの初期化に失敗しました:", error)
        return
      }
    }

    const ctx = audioContextRef.current

    // soundTypeのマッピングを追加
    let mappedSoundType = soundType
    if (soundType === "incorrect") mappedSoundType = "wrong"
    if (soundType === "correct") mappedSoundType = "success"

    const settings = FALLBACK_SOUNDS[mappedSoundType as keyof typeof FALLBACK_SOUNDS]

    // settingsが存在しない場合のフォールバック
    if (!settings) {
      console.warn(`未定義の音声タイプです: ${soundType}、デフォルト音を使用します`)
      // デフォルトの設定を使用
      const defaultSettings = {
        frequency: 440,
        duration: 300,
        type: "sine",
      }

      try {
        // シャッフル音の場合は特別な処理
        if (mappedSoundType === "shuffle") {
          // 複数の音を組み合わせてカードシャッフルのような音を作る
          const duration = settings.duration / 1000 // 秒に変換

          // 複数の短い音を連続して鳴らす
          for (let i = 0; i < 5; i++) {
            setTimeout(() => {
              if (!audioContextRef.current) return

              const oscillator = ctx.createOscillator()
              oscillator.type = "sine"
              oscillator.frequency.setValueAtTime(settings.frequency + i * 20, ctx.currentTime)

              const gainNode = ctx.createGain()
              gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
              gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

              oscillator.connect(gainNode)
              gainNode.connect(ctx.destination)

              oscillator.start()
              oscillator.stop(ctx.currentTime + 0.1)
            }, i * 100)
          }

          console.log(`改良されたシャッフル音を再生しました`)
          return
        }

        // 通常の音声バッファを生成
        const buffer = generateBeepSound(defaultSettings.frequency, defaultSettings.duration, 0.5, defaultSettings.type)
        if (!buffer) return

        // 音声ソースを作成
        const source = ctx.createBufferSource()
        source.buffer = buffer

        // ゲインノードを作成（音量調整用）
        const gainNode = ctx.createGain()
        gainNode.gain.value = 0.5

        // 接続して再生
        source.connect(gainNode)
        gainNode.connect(ctx.destination)
        source.start()

        console.log(`代替音声を再生しました: ${soundType}`)
      } catch (error) {
        console.error(`代替音声の再生に失敗しました (${soundType}):`, error)
      }
      return
    }

    try {
      // シャッフル音の場合は特別な処理
      if (mappedSoundType === "shuffle") {
        // 複数の音を組み合わせてカードシャッフルのような音を作る
        const duration = settings.duration / 1000 // 秒に変換

        // 複数の短い音を連続して鳴らす
        for (let i = 0; i < 5; i++) {
          setTimeout(() => {
            if (!audioContextRef.current) return

            const oscillator = ctx.createOscillator()
            oscillator.type = "sine"
            oscillator.frequency.setValueAtTime(settings.frequency + i * 20, ctx.currentTime)

            const gainNode = ctx.createGain()
            gainNode.gain.setValueAtTime(0.2, ctx.currentTime)
            gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)

            oscillator.connect(gainNode)
            gainNode.connect(ctx.destination)

            oscillator.start()
            oscillator.stop(ctx.currentTime + 0.1)
          }, i * 100)
        }

        console.log(`改良されたシャッフル音を再生しました`)
        return
      }

      // 通常の音声バッファを生成
      const buffer = generateBeepSound(settings.frequency, settings.duration, 0.5, settings.type)
      if (!buffer) return

      // 音声ソースを作成
      const source = ctx.createBufferSource()
      source.buffer = buffer

      // ゲインノードを作成（音量調整用）
      const gainNode = ctx.createGain()
      gainNode.gain.value = 0.5

      // 接続して再生
      source.connect(gainNode)
      gainNode.connect(ctx.destination)
      source.start()

      console.log(`代替音声を再生しました: ${soundType}`)
    } catch (error) {
      console.error(`代替音声の再生に失敗しました (${soundType}):`, error)
    }
  }

  // 効果音を再生する関数
  const playSound = (soundType: SoundType) => {
    if (!soundEnabled) {
      console.log(`効果音が無効なため、${soundType}の再生をスキップします`)
      return
    }

    console.log(`効果音の再生を試行: ${soundType}`)

    const audio = audioCache.current[soundType]

    if (!audio) {
      console.warn(`音声ファイルがロードされていないか、読み込みに失敗しています: ${soundType}`)

      // 代替手段として内蔵の音を再生
      console.log(`代替手段: 内蔵音を再生します (${soundType})`)
      playFallbackSound(soundType)
      return
    }

    try {
      // 再生中の場合は最初から再生し直す
      audio.currentTime = 0

      // 再生を試みる
      const playPromise = audio.play()

      // play()はPromiseを返すので、エラーハンドリングを追加
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log(`効果音の再生を開始しました: ${soundType}`)
          })
          .catch((error) => {
            console.error(`効果音の再生に失敗しました (${soundType}):`, error)

            // 自動再生ポリシーによるエラーの場合、代替音を再生
            console.log(`代替手段: 内蔵音を再生します (${soundType})`)
            playFallbackSound(soundType)
          })
      }
    } catch (error) {
      console.error(`効果音の再生中にエラーが発生しました (${soundType}):`, error)

      // エラー発生時も代替音を再生
      playFallbackSound(soundType)
    }
  }

  // テキストを文に分割する関数
  const splitTextIntoChunks = (text: string, maxChunkLength = 100): string[] => {
    if (!text) return []

    try {
      // 特殊文字や制御文字を事前に処理
      const sanitizedText = text
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // 制御文字を削除
        .replace(/\s+/g, " ") // 連続する空白を1つにまとめる
        .trim()

      if (!sanitizedText) return []

      // 句読点で分割（。、．，！？!?など）
      const sentences = sanitizedText.split(/([。．！？!?]+)/).reduce((result, part, index, array) => {
        if (index % 2 === 0) {
          // 文章部分
          const nextPart = array[index + 1] || ""
          result.push(part + nextPart)
        }
        return result
      }, [] as string[])

      // 長い文をさらに分割
      const chunks: string[] = []
      sentences.forEach((sentence) => {
        if (sentence.length <= maxChunkLength) {
          if (sentence.trim()) chunks.push(sentence)
        } else {
          // 読点で分割
          const subParts = sentence.split(/([、，]+)/).reduce((result, part, index, array) => {
            if (index % 2 === 0) {
              // 文章部分
              const nextPart = array[index + 1] || ""
              result.push(part + nextPart)
            }
            return result
          }, [] as string[])

          let currentChunk = ""
          subParts.forEach((part) => {
            if (currentChunk.length + part.length <= maxChunkLength) {
              currentChunk += part
            } else {
              if (currentChunk.trim()) chunks.push(currentChunk)
              currentChunk = part
            }
          })

          if (currentChunk.trim()) chunks.push(currentChunk)
        }
      })

      return chunks.filter((chunk) => chunk.trim().length > 0)
    } catch (error) {
      console.error("テキスト分割中にエラーが発生しました:", error)
      // エラーが発生した場合は元のテキストを1つのチャンクとして返す
      return text.trim() ? [text] : []
    }
  }

  // テキストを安全に処理する関数
  const sanitizeText = (text: string): string => {
    if (!text) return ""

    try {
      // 特殊文字や制御文字を削除
      return text
        .replace(/[\u0000-\u001F\u007F-\u009F]/g, "") // 制御文字を削除
        .replace(/[^\p{L}\p{N}\p{P}\p{Z}]/gu, "") // 非表示文字や特殊文字を削除
        .replace(/\s+/g, " ") // 連続する空白を1つにまとめる
        .trim()
    } catch (error) {
      console.error("テキストのサニタイズ中にエラーが発生しました:", error)
      return text.trim()
    }
  }

  // テキストの内容に基づいた音のパターンを生成する関数
  const generateSoundPattern = (text: string) => {
    if (!audioContextRef.current) {
      try {
        audioContextRef.current = new window.AudioContext()
      } catch (error) {
        console.error("AudioContextの初期化に失敗しました:", error)
        return 800 // デフォルトの待機時間
      }
    }

    try {
      const ctx = audioContextRef.current

      // テキストの長さに基づいて音のパターンを生成
      const textLength = Math.min(text.length, 100)

      // 代替音声が使用されていることをコンソールに明示的に表示
      console.log("音声合成の代わりに代替音声パターンを使用します")

      // 単純なビープ音ではなく、より自然な音声パターンを生成
      const playNotification = () => {
        try {
          // 通知音を生成（より穏やかな音に）
          const oscillator = ctx.createOscillator()
          oscillator.type = "sine" // サイン波（より穏やか）
          oscillator.frequency.setValueAtTime(440, ctx.currentTime) // A4音（標準的な音高）

          const gainNode = ctx.createGain()
          gainNode.gain.setValueAtTime(0.2, ctx.currentTime) // 音量を下げる
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5)

          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)

          oscillator.start()
          oscillator.stop(ctx.currentTime + 0.5)
        } catch (error) {
          console.error("通知音の生成に失敗しました:", error)
        }
      }

      // 単一の通知音を再生
      playNotification()

      // テキストの長さに応じて待機時間を調整
      const duration = Math.max(1000, textLength * 30)
      return duration
    } catch (error) {
      console.error("音のパターン生成に失敗しました:", error)
      return 1000 // デフォルトの待機時間
    }
  }

  // 代替手段で読み上げる関数（ビープ音）
  const speakWithBeep = (text: string) => {
    console.log("代替手段（通知音）で読み上げを実行します")

    // 音声合成の状態を更新
    setIsSpeaking(true)
    speechStateRef.current.speaking = true

    try {
      // テキストの内容に基づいた音のパターンを生成
      const duration = generateSoundPattern(text)

      // 一定時間後に完了
      setTimeout(() => {
        speechStateRef.current.speaking = false
        speechStateRef.current.processingQueue = false

        // キューに残りがあれば処理を続行
        if (speechStateRef.current.pendingTexts.length > 0) {
          processSpeechQueue()
        } else {
          setIsSpeaking(false)
        }
      }, duration)
    } catch (error) {
      console.error("代替手段での読み上げに失敗しました:", error)
      speechStateRef.current.speaking = false
      speechStateRef.current.processingQueue = false

      // キューに残りがあれば処理を続行
      if (speechStateRef.current.pendingTexts.length > 0) {
        processSpeechQueue()
      } else {
        setIsSpeaking(false)
      }
    }
  }

  // 音声合成キューを処理する関数
  const processSpeechQueue = () => {
    const state = speechStateRef.current

    // 既に処理中か、キューが空の場合は終了
    if (state.processingQueue || state.pendingTexts.length === 0) {
      if (state.pendingTexts.length === 0 && isSpeaking) {
        setIsSpeaking(false)
      }
      return
    }

    // 処理中フラグを設定
    state.processingQueue = true

    // キューから次のテキストを取得
    const text = state.pendingTexts.shift()

    if (!text) {
      state.processingQueue = false
      if (isSpeaking) setIsSpeaking(false)
      return
    }

    // WebViewの検出を試みる
    const isWebView = () => {
      // UAからWebViewを検出する一般的な方法
      const ua = navigator.userAgent.toLowerCase()
      const isAndroidWebView = ua.indexOf("wv") > -1 || ua.indexOf("webview") > -1
      const isIOSWebView = /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua)

      return isAndroidWebView || isIOSWebView
    }

    // WebViewの場合でもまずはSpeechSynthesisを試みる
    if (isWebView()) {
      console.log("WebViewを検出しましたが、まずテキスト読み上げを試みます")

      // 視覚的フィードバックも表示（バックアップとして）
      const showVisualFeedback = () => {
        // 簡易的な通知表示
        const notification = document.createElement("div")
        notification.style.position = "fixed"
        notification.style.bottom = "20px"
        notification.style.left = "50%"
        notification.style.transform = "translateX(-50%)"
        notification.style.backgroundColor = "rgba(0,0,0,0.8)"
        notification.style.color = "white"
        notification.style.padding = "10px 20px"
        notification.style.borderRadius = "5px"
        notification.style.zIndex = "9999"
        notification.style.maxWidth = "80%"
        notification.style.textContent = text
        document.body.appendChild(notification)

        // 数秒後に消す
        setTimeout(() => {
          document.body.removeChild(notification)
        }, 3000)
      }

      // バックアップとして視覚的フィードバックを表示
      showVisualFeedback()
    }

    try {
      // 音声合成の状態を更新
      setIsSpeaking(true)
      state.speaking = true

      // 新しいUtteranceを作成
      const utterance = new SpeechSynthesisUtterance(text)

      // 基本設定
      utterance.lang = "ja-JP"
      utterance.rate = 0.8 // 少し遅く
      utterance.pitch = 1.0
      utterance.volume = 0.9

      // 日本語の音声を探す
      const voices = window.speechSynthesis.getVoices()
      const japaneseVoice = voices.find(
        (voice) => voice.lang === "ja-JP" || voice.lang.startsWith("ja") || voice.name.includes("Japanese"),
      )

      if (japaneseVoice) {
        utterance.voice = japaneseVoice
        console.log(`日本語の音声を使用します: ${japaneseVoice.name}`)
      } else {
        console.log("日本語の音声が見つかりませんでした。デフォルトの音声を使用します。")
      }

      // イベントハンドラを設定
      utterance.onstart = () => {
        console.log("音声合成が開始されました")
        // エラーカウントをリセット（正常に開始できた場合）
        state.errorCount = 0
        state.interruptedCount = 0
        state.retryCount = 0
      }

      utterance.onend = () => {
        console.log("音声合成が正常に終了しました")
        state.speaking = false
        state.currentUtterance = null
        state.processingQueue = false

        // 次のテキストを処理
        setTimeout(() => {
          if (state.pendingTexts.length > 0) {
            processSpeechQueue()
          } else {
            setIsSpeaking(false)
          }
        }, 100)
      }

      utterance.onerror = (e) => {
        // エラーの詳細情報を取得
        const errorMessage = e.error || "不明なエラー"
        const errorTime = new Date().toISOString()

        console.error(`音声合成でエラーが発生しました [${errorTime}]: ${errorMessage}`)

        // 「interrupted」エラーの特別な処理
        if (errorMessage === "interrupted") {
          console.log("音声合成が中断されました - これは正常な動作の一部である場合があります")

          // 状態をリセット
          state.speaking = false
          state.currentUtterance = null
          state.processingQueue = false

          // 中断エラーの場合は少し待ってから次のテキストに進む
          setTimeout(() => {
            if (state.pendingTexts.length > 0) {
              processSpeechQueue()
            } else {
              setIsSpeaking(false)
            }
          }, 500) // 0.5秒待機

          return
        }

        // その他のエラーの処理
        console.error("エラー詳細:", e)
        state.errorCount++

        // 状態をリセット
        state.speaking = false
        state.currentUtterance = null
        state.processingQueue = false

        // 次のテキストを処理
        setTimeout(() => {
          if (state.pendingTexts.length > 0) {
            processSpeechQueue()
          } else {
            setIsSpeaking(false)
          }
        }, 100)
      }

      // 現在のUtteranceを保存
      state.currentUtterance = utterance

      // 読み上げを実行する前に少し待つ
      setTimeout(
        () => {
          try {
            // 辞書ページでは特別な設定を追加
            if (state.isDictionaryPage) {
              utterance.rate = 0.8 // 占い結果と同じ速度に調整
              utterance.volume = 0.9 // 占い結果と同じ音量に調整
            }

            // 読み上げ実行
            window.speechSynthesis.speak(utterance)

            // WebView対策: 複数回試行
            let attempts = 0
            const maxAttempts = 3
            const checkAndRetry = () => {
              if (attempts >= maxAttempts) return

              setTimeout(
                () => {
                  if (!window.speechSynthesis.speaking) {
                    console.log(`バックアップ: 再度読み上げを試みます (${attempts + 1}/${maxAttempts})`)
                    try {
                      window.speechSynthesis.speak(utterance)
                      attempts++
                      checkAndRetry()
                    } catch (e) {
                      console.error("再試行中にエラー:", e)

                      // 最終試行でも失敗した場合は代替手段を使用
                      if (attempts >= maxAttempts - 1) {
                        console.log("テキスト読み上げに失敗しました。代替手段を使用します")

                        try {
                          // 簡単な通知音を鳴らす
                          const ctx = new (window.AudioContext || window.webkitAudioContext)()
                          const oscillator = ctx.createOscillator()
                          oscillator.type = "sine"
                          oscillator.frequency.setValueAtTime(440, ctx.currentTime)

                          const gainNode = ctx.createGain()
                          gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
                          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)

                          oscillator.connect(gainNode)
                          gainNode.connect(ctx.destination)

                          oscillator.start()
                          oscillator.stop(ctx.currentTime + 0.5)
                        } catch (audioError) {
                          console.error("代替音声の再生に失敗:", audioError)
                        }
                      }
                    }
                  }
                },
                500 * (attempts + 1),
              )
            }

            checkAndRetry()

            // 読み上げが開始されない場合のフォールバック
            const speakTimeout = setTimeout(() => {
              if (state.speaking && state.currentUtterance === utterance) {
                console.warn("読み上げが開始されなかったようです。次のテキストに進みます。")

                // 状態をリセット
                state.speaking = false
                state.currentUtterance = null
                state.processingQueue = false

                // 次のテキストを処理（失敗したテキストはスキップ）
                setTimeout(() => {
                  if (state.pendingTexts.length > 0) {
                    processSpeechQueue()
                  } else {
                    setIsSpeaking(false)
                  }
                }, 100)
              }
            }, 2000)

            // 読み上げが開始されたらタイムアウトをクリア
            const originalOnstart = utterance.onstart
            utterance.onstart = (event) => {
              clearTimeout(speakTimeout)
              if (originalOnstart) originalOnstart.call(utterance, event)
            }
          } catch (error) {
            console.error("音声合成の実行中にエラーが発生しました:", error)

            // エラーが発生した場合も次のテキストを処理
            state.speaking = false
            state.currentUtterance = null
            state.processingQueue = false

            // 次のテキストを処理
            setTimeout(() => {
              if (state.pendingTexts.length > 0) {
                processSpeechQueue()
              } else {
                setIsSpeaking(false)
              }
            }, 100)
          }
        },
        state.isDictionaryPage ? 400 : 200,
      ) // 辞典ページでは待機時間を長めに
    } catch (error) {
      console.error("音声合成の準備中にエラーが発生しました:", error)

      // エラーが発生した場合も次のテキストを処理
      state.speaking = false
      state.currentUtterance = null
      state.processingQueue = false

      // 次のテキストを処理
      setTimeout(() => {
        if (state.pendingTexts.length > 0) {
          processSpeechQueue()
        } else {
          setIsSpeaking(false)
        }
      }, 100)
    }
  }

  // テキスト読み上げ関数
  const originalSpeak = (text: string) => {
    if (!textToSpeechEnabled || !text || typeof window === "undefined") {
      console.log("テキスト読み上げがスキップされました: 無効化されているか、テキストが空です")
      return
    }

    // 読み上げ中なら一度停止 - 強化版
    try {
      // まず状態をリセット
      const state = speechStateRef.current
      state.speaking = false
      state.currentUtterance = null
      state.processingQueue = false
      state.pendingTexts = []

      // 代替手段を使用しないように設定
      state.useAlternativeMethod = false

      // 読み上げ状態を更新
      setIsSpeaking(false)

      // Web Speech APIがサポートされている場合
      if (window.speechSynthesis) {
        // 読み上げキューをクリア - 複数回試行
        window.speechSynthesis.cancel()
        console.log("新しい読み上げのために停止しました (1回目)")

        // 少し遅延させて再度停止を試みる
        setTimeout(() => {
          if (window.speechSynthesis) {
            window.speechSynthesis.cancel()
            console.log("新しい読み上げのために停止しました (2回目)")
          }
        }, 50)
      }
    } catch (error) {
      console.error("読み上げ停止中にエラーが発生しました:", error)
    }

    // ゲーム中の短いフレーズ（コンボ数など）用に最適化された読み上げ処理
    if (text.length < 10) {
      // 短いフレーズの場合、単純化された処理を使用
      setTimeout(() => {
        try {
          if (!window.speechSynthesis) {
            console.warn("Web Speech APIが利用できません")
            return
          }

          // 短いフレーズ用の簡略化された音声合成設定
          const utterance = new SpeechSynthesisUtterance(text)
          utterance.lang = "ja-JP"
          utterance.rate = 1.0 // 通常速度
          utterance.pitch = 1.0
          utterance.volume = 0.9

          // 読み上げ状態を更新
          setIsSpeaking(true)

          // エラーハンドリング
          utterance.onerror = (e) => {
            console.warn(`音声合成エラー (簡略版): ${e.error}`)
            setIsSpeaking(false)
          }

          // 完了ハンドリング
          utterance.onend = () => {
            setIsSpeaking(false)
          }

          // 直接実行（キューイングなし）
          window.speechSynthesis.speak(utterance)

          // セーフティタイマー - 2秒後に強制的に読み上げ状態をリセット
          setTimeout(() => {
            if (speechStateRef.current.speaking) {
              setIsSpeaking(false)
            }
          }, 2000)
        } catch (error) {
          console.error("簡略化された読み上げに失敗:", error)
          setIsSpeaking(false)
        }
      }, 100)
      return
    }

    // 通常の長いテキスト用のオリジナル処理（ただし、ゲーム中はこちらは使用しない）
    // ...（以下の既存コードはそのままで）

    // 少し遅延させてから新しい読み上げを開始
    setTimeout(() => {
      try {
        // 現在のURLをチェックして辞典ページかどうかを判定
        speechStateRef.current.isDictionaryPage = checkIfDictionaryPage()

        // テキストをサニタイズ
        const sanitizedText = sanitizeText(text)
        if (!sanitizedText) {
          console.log("サニタイズ後のテキストが空のため、読み上げをスキップします")
          return
        }

        console.log("テキスト読み上げを開始します")
        console.log(`読み上げテキスト: "${sanitizedText.substring(0, 50)}${sanitizedText.length > 50 ? "..." : ""}"`)

        const state = speechStateRef.current

        // 状態をリセット
        state.pendingTexts = []
        state.errorCount = 0
        state.interruptedCount = 0
        state.lastErrorTime = 0
        state.retryCount = 0

        // 代替手段を使用しないように設定
        state.useAlternativeMethod = false

        // 辞書ページでは小さなチャンクに分割
        if (state.isDictionaryPage) {
          // 辞典ページでのテキスト分割をさらに最適化
          // 辞典ページでは非常に短いチャンクに分割
          // カード名だけなので分割せずに直接処理
          state.pendingTexts.push(sanitizedText)
          console.log(`辞典ページ: 短いテキストのため分割せずに処理します`)
        } else if (sanitizedText.length > 200) {
          // 長いテキストは適度に分割（通常ページ用）
          const chunks = splitTextIntoChunks(sanitizedText, 100)
          console.log(`長いテキスト: ${chunks.length}個のチャンクに分割しました`)

          chunks.forEach((chunk) => {
            if (chunk.trim()) {
              state.pendingTexts.push(chunk)
            }
          })
        } else {
          // 短いテキストは分割せずに処理
          state.pendingTexts.push(sanitizedText)
        }

        // 読み上げ状態を更新
        setIsSpeaking(true)

        // キューの処理を開始
        processSpeechQueue()
      } catch (error) {
        console.error("テキスト読み上げの初期化に失敗しました:", error)
        setIsSpeaking(false)
      }
    }, 100)
  }

  // ページ遷移時に音声合成を停止する
  useEffect(() => {
    const handleRouteChange = () => {
      if (window.speechSynthesis && isSpeaking) {
        window.speechSynthesis.cancel()
        setIsSpeaking(false)
        console.log("Route changed, speech synthesis cancelled")
      }
    }

    // クリーンアップ関数
    window.addEventListener("beforeunload", handleRouteChange)
    return () => {
      window.removeEventListener("beforeunload", handleRouteChange)
    }
  }, [isSpeaking])

  // テスト用の読み上げ関数
  const testSpeech = () => {
    if (typeof window === "undefined") {
      console.error("ブラウザ環境でのみ実行可能です")
      return
    }

    try {
      console.log("音声合成のテストを実行します")

      // テスト用のテキスト
      const testText = "これはテキスト読み上げのテストです"

      // 読み上げを実行
      originalSpeak(testText)
    } catch (error) {
      console.error("テスト: 音声合成の準備中にエラーが発生しました:", error)
      setIsSpeaking(false)
    }
  }

  // ページ遷移時に音声合成を停止する - 追加の対策
  useEffect(() => {
    // ページ遷移を検出するためのイベントリスナー
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden" && isSpeaking) {
        console.log("ページの可視性変更を検出: 音声合成を停止します")
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel()
          setIsSpeaking(false)

          // 状態をリセット
          const state = speechStateRef.current
          state.speaking = false
          state.currentUtterance = null
          state.processingQueue = false
          state.pendingTexts = []
        }
      }
    }

    // イベントリスナーを登録
    document.addEventListener("visibilitychange", handleVisibilityChange)

    // クリーンアップ関数
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange)
    }
  }, [isSpeaking])

  // Make sure the speak function is properly implemented:
  const currentUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null)

  // 音声合成の最適化：
  const speechQueue = useRef<string[]>([])
  const isProcessingSpeech = useRef<boolean>(false)

  const optimizedSpeak = useCallback(
    async (text: string) => {
      if (!textToSpeechEnabled) return

      speechQueue.current.push(text)

      if (!isProcessingSpeech.current) {
        isProcessingSpeech.current = true
        await processSpeechQueueOptimized()
        isProcessingSpeech.current = false
      }
    },
    [textToSpeechEnabled],
  )

  // 音声合成キューを処理する関数（最適化版）
  const processSpeechQueueOptimized = async () => {
    if (!textToSpeechEnabled) return

    if (speechQueue.current.length === 0) {
      setIsSpeaking(false)
      return
    }

    setIsSpeaking(true)
    const text = speechQueue.current.shift()
    if (!text) {
      setIsSpeaking(false)
      return
    }

    try {
      // 直接SpeechSynthesisを使用
      const utterance = new SpeechSynthesisUtterance(text)

      // 音声設定
      utterance.lang = "ja-JP"
      utterance.volume = 1.0 // 最大音量
      utterance.rate = 0.9 // 少し遅め
      utterance.pitch = 1.0 // 標準

      // 日本語の音声を探す
      const voices = window.speechSynthesis.getVoices()
      const japaneseVoice = voices.find(
        (voice) => voice.lang === "ja-JP" || voice.lang.startsWith("ja") || voice.name.includes("Japanese"),
      )

      if (japaneseVoice) {
        utterance.voice = japaneseVoice
        console.log(`日本語音声を使用: ${japaneseVoice.name}`)
      } else {
        console.log("日本語音声が見つかりません。デフォルト音声を使用します")
      }

      // イベントハンドラ
      utterance.onstart = () => {
        console.log("読み上げ開始")
        setIsSpeaking(true)
      }

      utterance.onend = () => {
        console.log("読み上げ完了")
        setIsSpeaking(false)
        // 次のテキストを処理
        if (speechQueue.current.length > 0) {
          processSpeechQueueOptimized()
        }
      }

      utterance.onerror = (e) => {
        console.error("読み上げエラー:", e)
        setIsSpeaking(false)
        // 次のテキストを処理
        if (speechQueue.current.length > 0) {
          processSpeechQueueOptimized()
        }
      }

      // 読み上げ実行
      window.speechSynthesis.speak(utterance)
    } catch (error) {
      console.error("読み上げ実行エラー:", error)
      setIsSpeaking(false)
      // 次のテキストを処理
      if (speechQueue.current.length > 0) {
        processSpeechQueueOptimized()
      }
    }
  }

  // テキスト読み上げ関数
  const speak = useCallback(
    (text: string) => {
      if (!textToSpeechEnabled || !text || typeof window === "undefined") {
        console.log("読み上げスキップ: 無効か空テキスト", textToSpeechEnabled, text?.length)
        return
      }

      // WebViewの検出を試みる
      const isWebView = () => {
        // UAからWebViewを検出する一般的な方法
        const ua = navigator.userAgent.toLowerCase()
        const isAndroidWebView = ua.indexOf("wv") > -1 || ua.indexOf("webview") > -1
        const isIOSWebView = /(iphone|ipod|ipad).*applewebkit(?!.*safari)/i.test(ua)
        // その他の検出方法
        const hasLimitedFeatures = !window.speechSynthesis || typeof window.speechSynthesis.speak !== "function"

        return isAndroidWebView || isIOSWebView || hasLimitedFeatures
      }

      // WebViewの場合は代替手段を使用
      if (isWebView()) {
        console.log("WebViewを検出しました。代替手段を使用します")

        // 代替手段1: 視覚的なフィードバック
        // テキストを画面に表示するなどの視覚的なフィードバック
        const showVisualFeedback = () => {
          // 既存のトースト通知機能があれば利用
          if (typeof window.showToast === "function") {
            window.showToast(text)
          } else {
            // 簡易的な通知表示
            const notification = document.createElement("div")
            notification.style.position = "fixed"
            notification.style.bottom = "20px"
            notification.style.left = "50%"
            notification.style.transform = "translateX(-50%)"
            notification.style.backgroundColor = "rgba(0,0,0,0.8)"
            notification.style.color = "white"
            notification.style.padding = "10px 20px"
            notification.style.borderRadius = "5px"
            notification.style.zIndex = "9999"
            notification.style.maxWidth = "80%"
            notification.textContent = text
            document.body.appendChild(notification)

            // 数秒後に消す
            setTimeout(() => {
              document.body.removeChild(notification)
            }, 3000)
          }
        }

        // 視覚的フィードバックを表示
        showVisualFeedback()

        // 代替手段2: 音による通知
        try {
          // 簡単な通知音を鳴らす
          const ctx = new (window.AudioContext || window.webkitAudioContext)()
          const oscillator = ctx.createOscillator()
          oscillator.type = "sine"
          oscillator.frequency.setValueAtTime(440, ctx.currentTime)

          const gainNode = ctx.createGain()
          gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
          gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)

          oscillator.connect(gainNode)
          gainNode.connect(ctx.destination)

          oscillator.start()
          oscillator.stop(ctx.currentTime + 0.5)
        } catch (error) {
          console.error("代替音声の再生に失敗:", error)
        }

        return
      }

      // 既存の読み上げを停止
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel()
        console.log("既存の読み上げを停止")
      }

      // 以下は既存のコード
      console.log(`読み上げ: "${text}"`)
      setIsSpeaking(true)

      // ... 残りの既存コード ...
      try {
        // 直接SpeechSynthesisを使用
        const utterance = new SpeechSynthesisUtterance(text)

        // 音声設定
        utterance.lang = "ja-JP"
        utterance.volume = 1.0 // 最大音量
        utterance.rate = 0.9 // 少し遅め
        utterance.pitch = 1.0 // 標準

        // 日本語の音声を探す
        const voices = window.speechSynthesis.getVoices()
        const japaneseVoice = voices.find(
          (voice) => voice.lang === "ja-JP" || voice.lang.startsWith("ja") || voice.name.includes("Japanese"),
        )

        if (japaneseVoice) {
          utterance.voice = japaneseVoice
          console.log(`日本語音声を使用: ${japaneseVoice.name}`)
        } else {
          console.log("日本語音声が見つかりません。デフォルト音声を使用します")
        }

        // イベントハンドラ
        utterance.onstart = () => {
          console.log("読み上げ開始")
          setIsSpeaking(true)
        }

        utterance.onend = () => {
          console.log("読み上げ完了")
          setIsSpeaking(false)
        }

        utterance.onerror = (e) => {
          console.error("読み上げエラー:", e)
          setIsSpeaking(false)
        }

        // 読み上げ実行
        window.speechSynthesis.speak(utterance)

        // WebView対策: 複数回試行
        let attempts = 0
        const maxAttempts = 3
        const checkAndRetry = () => {
          if (attempts >= maxAttempts) return

          setTimeout(
            () => {
              if (!window.speechSynthesis.speaking) {
                console.log(`バックアップ: 再度読み上げを試みます (${attempts + 1}/${maxAttempts})`)
                try {
                  window.speechSynthesis.speak(utterance)
                  attempts++
                  checkAndRetry()
                } catch (e) {
                  console.error("再試行中にエラー:", e)

                  // 最終試行でも失敗した場合は代替手段を使用
                  if (attempts >= maxAttempts - 1) {
                    console.log("テキスト読み上げに失敗しました。代替手段を使用します")

                    try {
                      // 簡単な通知音を鳴らす
                      const ctx = new (window.AudioContext || window.webkitAudioContext)()
                      const oscillator = ctx.createOscillator()
                      oscillator.type = "sine"
                      oscillator.frequency.setValueAtTime(440, ctx.currentTime)

                      const gainNode = ctx.createGain()
                      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
                      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 1)

                      oscillator.connect(gainNode)
                      gainNode.connect(ctx.destination)

                      oscillator.start()
                      oscillator.stop(ctx.currentTime + 0.5)
                    } catch (audioError) {
                      console.error("代替音声の再生に失敗:", audioError)
                    }
                  }
                }
              }
            },
            500 * (attempts + 1),
          )
        }

        checkAndRetry()
      } catch (error) {
        console.error("読み上げ実行エラー:", error)
        setIsSpeaking(false)
      }
    },
    [textToSpeechEnabled],
  )

  return (
    <SettingsContext.Provider
      value={{
        soundEnabled,
        toggleSound,
        textToSpeechEnabled,
        toggleTextToSpeech,
        speak: optimizedSpeak,
        stopSpeaking,
        playSound,
        audioLoaded,
        imagesLoaded,
        isSpeaking,
        testSpeech,
        includeMinorArcanaInFortune,
        toggleMinorArcanaInFortune,
        includeMinorArcanaInGames,
        toggleMinorArcanaInGames,
      }}
    >
      {children}
    </SettingsContext.Provider>
  )
}

export function useSettings() {
  const context = useContext(SettingsContext)
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider")
  }
  return context
}
