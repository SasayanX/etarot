/**
 * 統一されたエラーハンドリングユーティリティ
 */

export class AppError extends Error {
  constructor(
    message: string,
    public code: string,
    public statusCode: number = 500,
    public context?: Record<string, any>
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class ImageLoadError extends AppError {
  constructor(src: string, originalError?: Error) {
    super(
      `Failed to load image: ${src}`,
      'IMAGE_LOAD_ERROR',
      404,
      { src, originalError: originalError?.message }
    )
  }
}

export class AudioLoadError extends AppError {
  constructor(soundType: string, originalError?: Error) {
    super(
      `Failed to load audio: ${soundType}`,
      'AUDIO_LOAD_ERROR',
      404,
      { soundType, originalError: originalError?.message }
    )
  }
}

export class SpeechSynthesisError extends AppError {
  constructor(text: string, originalError?: Error) {
    super(
      `Failed to synthesize speech: ${text.substring(0, 50)}...`,
      'SPEECH_SYNTHESIS_ERROR',
      500,
      { text, originalError: originalError?.message }
    )
  }
}

export class StorageError extends AppError {
  constructor(operation: string, key: string, originalError?: Error) {
    super(
      `Storage operation failed: ${operation} for key ${key}`,
      'STORAGE_ERROR',
      500,
      { operation, key, originalError: originalError?.message }
    )
  }
}

// エラーハンドラーの設定
export function setupErrorHandlers() {
  // 未処理のPromise拒否をキャッチ
  window.addEventListener('unhandledrejection', (event) => {
    console.error('Unhandled promise rejection:', event.reason)
    
    // エラーをログに記録（本番環境では外部サービスに送信）
    if (process.env.NODE_ENV === 'production') {
      // ここでエラー追跡サービス（Sentry等）に送信
      logErrorToService(event.reason)
    }
    
    // デフォルトの動作を防ぐ
    event.preventDefault()
  })

  // グローバルエラーハンドラー
  window.addEventListener('error', (event) => {
    console.error('Global error:', event.error)
    
    if (process.env.NODE_ENV === 'production') {
      logErrorToService(event.error)
    }
  })
}

// エラーログの送信（本番環境用）
function logErrorToService(error: any) {
  // 実際の実装では、Sentry、LogRocket、Bugsnagなどのサービスを使用
  console.log('Error logged to service:', error)
}

// エラーメッセージの国際化
export function getErrorMessage(error: Error, language: 'ja' | 'en' = 'ja'): string {
  if (error instanceof AppError) {
    const messages = {
      ja: {
        IMAGE_LOAD_ERROR: '画像の読み込みに失敗しました',
        AUDIO_LOAD_ERROR: '音声の読み込みに失敗しました',
        SPEECH_SYNTHESIS_ERROR: '音声合成に失敗しました',
        STORAGE_ERROR: 'データの保存に失敗しました',
        NETWORK_ERROR: 'ネットワークエラーが発生しました',
        UNKNOWN_ERROR: '不明なエラーが発生しました'
      },
      en: {
        IMAGE_LOAD_ERROR: 'Failed to load image',
        AUDIO_LOAD_ERROR: 'Failed to load audio',
        SPEECH_SYNTHESIS_ERROR: 'Failed to synthesize speech',
        STORAGE_ERROR: 'Failed to save data',
        NETWORK_ERROR: 'Network error occurred',
        UNKNOWN_ERROR: 'Unknown error occurred'
      }
    }
    
    return messages[language][error.code as keyof typeof messages.ja] || messages[language].UNKNOWN_ERROR
  }
  
  return language === 'ja' ? 'エラーが発生しました' : 'An error occurred'
}

// エラーの再試行ロジック
export async function retryOperation<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delay: number = 1000
): Promise<T> {
  let lastError: Error
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      lastError = error as Error
      
      if (attempt === maxRetries) {
        throw lastError
      }
      
      // 指数バックオフで遅延
      await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt - 1)))
    }
  }
  
  throw lastError!
}

// エラーの分類
export function categorizeError(error: Error): {
  category: 'network' | 'storage' | 'media' | 'speech' | 'unknown'
  severity: 'low' | 'medium' | 'high' | 'critical'
  retryable: boolean
} {
  if (error instanceof ImageLoadError || error instanceof AudioLoadError) {
    return { category: 'media', severity: 'medium', retryable: true }
  }
  
  if (error instanceof SpeechSynthesisError) {
    return { category: 'speech', severity: 'low', retryable: true }
  }
  
  if (error instanceof StorageError) {
    return { category: 'storage', severity: 'high', retryable: true }
  }
  
  if (error.message.includes('network') || error.message.includes('fetch')) {
    return { category: 'network', severity: 'medium', retryable: true }
  }
  
  return { category: 'unknown', severity: 'high', retryable: false }
}
