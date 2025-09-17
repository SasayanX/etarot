# eTarot APK ビルドガイド

## 前提条件
- Node.js と npm がインストールされていること
- Android Studio がインストールされていること
- Java Development Kit (JDK) がインストールされていること

## 初回セットアップ

1. **必要なパッケージをインストール**
   \`\`\`bash
   npm install @capacitor/core @capacitor/android @capacitor/cli
   \`\`\`

2. **Androidプラットフォームを追加**
   \`\`\`bash
   npm run cap:add
   \`\`\`

3. **Android Studioでプロジェクトを開く**
   \`\`\`bash
   npm run cap:open
   \`\`\`

## ビルド手順

### 開発用APKのビルド
\`\`\`bash
npm run apk:dev
\`\`\`

### リリース用APKのビルド
\`\`\`bash
npm run apk:release
\`\`\`
ビルドされたAPKは `android/app/build/outputs/apk/release/app-release.apk` にあります。

## 署名キーの作成（初回のみ）

\`\`\`bash
keytool -genkey -v -keystore android/app/keystore.jks -alias etarot -keyalg RSA -keysize 2048 -validity 10000
\`\`\`

## トラブルシューティング

### ビルドエラーが発生する場合
- Android Studioで「Build」→「Clean Project」を実行
- `android/gradle.properties` で JVM のメモリ設定を調整:
  \`\`\`
  org.gradle.jvmargs=-Xmx2048m
  \`\`\`

### アプリがクラッシュする場合
- `capacitor.config.ts` の `server.androidScheme` が `https` になっているか確認
- WebViewのデバッグを有効にして原因を調査:
  \`\`\`typescript
  android: {
    webContentsDebuggingEnabled: true
  }
  \`\`\`

## アップデート方法

1. Webアプリを更新
2. ビルドとデプロイ
   \`\`\`bash
   npm run apk:release
   \`\`\`

## アイコンとスプラッシュスクリーンの変更

1. `android/app/src/main/res/` 内の各 `mipmap-*` フォルダのアイコンを置き換え
2. スプラッシュスクリーンは `android/app/src/main/res/drawable/splash.png` を置き換え
\`\`\`

ビルドスクリプト（自動化用）：
