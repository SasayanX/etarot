/**
 * アプリケーション設定
 * Google Play アプリからの参照URL管理
 */

// アプリバージョン管理
export const APP_VERSION = '2.0.0' // 新バージョン

// デプロイ環境設定
export const DEPLOY_CONFIG = {
  // 本番環境URL
  production: {
    // 既存アプリ用（ロリポップ）
    legacy: 'https://tarot.kanau-kiryu.com',
    
    // 新バージョンアプリ用（Netlify）
    current: 'https://e-tarot-app.netlify.app', // 仮のNetlify URL
    
    // カスタムドメイン設定後
    customDomain: 'https://tarot-v2.kanau-kiryu.com', // オプションB の場合
  },
  
  // 開発環境
  development: 'http://localhost:3000',
}

// バージョン別URL取得
export const getBaseUrl = () => {
  const appVersion = parseFloat(APP_VERSION)
  
  if (process.env.NODE_ENV === 'development') {
    return DEPLOY_CONFIG.development
  }
  
  // バージョン2.0以降は新Netlifyサイトを参照
  if (appVersion >= 2.0) {
    return DEPLOY_CONFIG.production.customDomain || DEPLOY_CONFIG.production.current
  }
  
  // バージョン1.x は既存ロリポップサイトを参照
  return DEPLOY_CONFIG.production.legacy
}

// 機能フラグ（段階的移行用）
export const FEATURE_FLAGS = {
  useNetlifyDeploy: true, // Netlifyデプロイ使用
  enableGradualMigration: true, // 段階的移行有効
  migrationPercentage: 100, // 新規ユーザーの100%をNetlifyへ
}

// ヘルスチェックエンドポイント
export const HEALTH_CHECK = {
  netlify: `${DEPLOY_CONFIG.production.current}/api/health`,
  legacy: `${DEPLOY_CONFIG.production.legacy}/api/health`,
}

// フォールバック設定（Netlify障害時）
export const FALLBACK_CONFIG = {
  enabled: true,
  fallbackUrl: DEPLOY_CONFIG.production.legacy, // ロリポップにフォールバック
  maxRetries: 3,
  timeout: 5000, // 5秒
}

console.log('🚀 App Config Loaded:', {
  version: APP_VERSION,
  baseUrl: getBaseUrl(),
  environment: process.env.NODE_ENV,
})

