/**
 * アプリ移行設定
 * GooglePlayアプリからNetlifyへの段階的移行設定
 */

// 環境設定
export const ENVIRONMENT_CONFIG = {
  // 現在の本番環境（ロリポップ）
  CURRENT_PRODUCTION: {
    name: 'lolipop',
    baseUrl: 'https://tarot.your-domain.com',
    description: '現在の本番環境（既存ユーザー用）',
    status: 'active'
  },
  
  // 新しい本番環境（Netlify）
  NEW_PRODUCTION: {
    name: 'netlify',
    baseUrl: 'https://e-tarot-optimized.netlify.app', // デプロイ後に更新
    description: '最適化された新環境（移行先）',
    status: 'ready'
  }
}

// 移行フラグ設定
export const MIGRATION_FLAGS = {
  // 段階的移行の設定
  GRADUAL_MIGRATION: {
    enabled: false,  // 移行開始時にtrue
    rolloutPercentage: 0,  // 0-100の段階的増加
    targetUsers: [],  // 特定ユーザーID（テスト用）
    startDate: null,  // 移行開始日時
    endDate: null     // 完全移行予定日時
  },
  
  // 機能別移行設定
  FEATURES: {
    // 占い機能
    FORTUNE_TELLING: {
      enabled: false,
      rolloutPercentage: 0
    },
    // ゲーム機能
    GAMES: {
      enabled: false,
      rolloutPercentage: 0
    },
    // クイズ機能
    QUIZ: {
      enabled: false,
      rolloutPercentage: 0
    },
    // 設定機能
    SETTINGS: {
      enabled: false,
      rolloutPercentage: 0
    }
  }
}

// ユーザーセグメント設定
export const USER_SEGMENTS = {
  // 新規ユーザー（優先移行）
  NEW_USERS: {
    enabled: true,
    description: '新規インストールユーザー',
    migrationPriority: 1
  },
  
  // アクティブユーザー
  ACTIVE_USERS: {
    enabled: false,
    description: '週1回以上利用ユーザー',
    migrationPriority: 2
  },
  
  // 既存ユーザー（慎重移行）
  EXISTING_USERS: {
    enabled: false,
    description: '既存の全ユーザー',
    migrationPriority: 3
  }
}

// パフォーマンス監視設定
export const PERFORMANCE_CONFIG = {
  // 監視対象メトリクス
  METRICS: {
    LOAD_TIME: {
      threshold: 2000,  // 2秒以内
      alert: true
    },
    ERROR_RATE: {
      threshold: 0.01,  // 1%以内
      alert: true
    },
    USER_SATISFACTION: {
      threshold: 4.5,   // 5点満点中4.5以上
      alert: true
    }
  },
  
  // アラート設定
  ALERTS: {
    email: ['admin@your-domain.com'],
    slack: '#alerts-channel',
    sms: ['+81-xxx-xxx-xxxx']
  }
}

// ロールバック設定
export const ROLLBACK_CONFIG = {
  // 自動ロールバック条件
  AUTO_ROLLBACK: {
    enabled: true,
    triggers: {
      errorRateThreshold: 0.05,     // エラー率5%以上
      loadTimeThreshold: 5000,      // 読み込み時間5秒以上
      userComplaintThreshold: 10    // 苦情10件以上
    }
  },
  
  // 手動ロールバック
  MANUAL_ROLLBACK: {
    enabled: true,
    authRequired: true,
    confirmationRequired: true
  }
}

// API設定
export const API_CONFIG = {
  // 環境別エンドポイント
  getBaseUrl: (environment = 'current') => {
    switch (environment) {
      case 'netlify':
        return ENVIRONMENT_CONFIG.NEW_PRODUCTION.baseUrl
      case 'lolipop':
      default:
        return ENVIRONMENT_CONFIG.CURRENT_PRODUCTION.baseUrl
    }
  },
  
  // 動的URL選択
  getDynamicUrl: (userId, featureName) => {
    // ユーザーセグメントチェック
    if (shouldUseMigration(userId, featureName)) {
      return API_CONFIG.getBaseUrl('netlify')
    }
    return API_CONFIG.getBaseUrl('lolipop')
  }
}

// 移行判定ロジック
export const shouldUseMigration = (userId, featureName) => {
  // 移行が無効の場合
  if (!MIGRATION_FLAGS.GRADUAL_MIGRATION.enabled) {
    return false
  }
  
  // 特定ユーザー（テスト用）
  if (MIGRATION_FLAGS.GRADUAL_MIGRATION.targetUsers.includes(userId)) {
    return true
  }
  
  // 機能別チェック
  const featureFlag = MIGRATION_FLAGS.FEATURES[featureName?.toUpperCase()]
  if (!featureFlag?.enabled) {
    return false
  }
  
  // パーセンテージベースの判定
  const userHash = hashUserId(userId)
  const rolloutPercentage = featureFlag.rolloutPercentage || 
                           MIGRATION_FLAGS.GRADUAL_MIGRATION.rolloutPercentage
  
  return (userHash % 100) < rolloutPercentage
}

// ユーザーIDハッシュ化（一貫した判定のため）
const hashUserId = (userId) => {
  let hash = 0
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash // 32bit整数に変換
  }
  return Math.abs(hash)
}

// ヘルスチェック設定
export const HEALTH_CHECK_CONFIG = {
  // チェック間隔（ミリ秒）
  interval: 30000,  // 30秒
  
  // タイムアウト（ミリ秒）
  timeout: 5000,    // 5秒
  
  // エンドポイント
  endpoints: {
    current: `${ENVIRONMENT_CONFIG.CURRENT_PRODUCTION.baseUrl}/health`,
    new: `${ENVIRONMENT_CONFIG.NEW_PRODUCTION.baseUrl}/health`
  },
  
  // 失敗時の処理
  onFailure: (environment, error) => {
    console.error(`Health check failed for ${environment}:`, error)
    // アラート送信、ロールバック検討など
  }
}

// 移行状況レポート設定
export const REPORTING_CONFIG = {
  // レポート生成間隔
  interval: 3600000,  // 1時間
  
  // レポート内容
  metrics: [
    'migration_percentage',
    'user_satisfaction',
    'performance_metrics',
    'error_rates',
    'rollback_events'
  ],
  
  // 送信先
  destinations: {
    dashboard: 'https://monitoring.your-domain.com',
    email: ['team@your-domain.com'],
    slack: '#migration-reports'
  }
}

// デバッグ設定
export const DEBUG_CONFIG = {
  enabled: process.env.NODE_ENV === 'development',
  logLevel: 'info',  // error, warn, info, debug
  logMigrationDecisions: true,
  logPerformanceMetrics: true
}

// エクスポート
export default {
  ENVIRONMENT_CONFIG,
  MIGRATION_FLAGS,
  USER_SEGMENTS,
  PERFORMANCE_CONFIG,
  ROLLBACK_CONFIG,
  API_CONFIG,
  shouldUseMigration,
  HEALTH_CHECK_CONFIG,
  REPORTING_CONFIG,
  DEBUG_CONFIG
}
