# 📱 Capacitor + Netlify 統合ガイド
## NetlifyデプロイをCapacitorアプリでラップする方法

---

## 🎯 概要

このガイドでは、Netlifyにデプロイしたウェブアプリを、Capacitorでラップして
ネイティブAndroidアプリ（APK）として配布する方法を説明します。

### **アーキテクチャ**
```
Next.js アプリ (最適化済み)
    ↓ ビルド
Netlify デプロイ (https://etarot.netlify.app)
    ↓ ラップ
Capacitor WebView (Android/iOS)
    ↓ ビルド
APK ファイル → Google Play
```

---

## ✅ メリット

### **1. サーバーレス運用** 🌐
- ✅ APK内にコードを含めない
- ✅ Netlifyから常に最新版を配信
- ✅ アプリストア審査なしで更新可能

### **2. パフォーマンス向上** ⚡
- ✅ グローバルCDN配信
- ✅ バンドルサイズ80%削減済み
- ✅ 読み込み時間50-60%短縮

### **3. 開発効率** 🚀
- ✅ ウェブとアプリで同じコードベース
- ✅ デプロイ後即座にアプリに反映
- ✅ A/Bテストやロールバックが簡単

### **4. コスト削減** 💰
- ✅ アプリ更新のたびにストア審査不要
- ✅ サーバー管理不要
- ✅ スケーリング自動

---

## 📋 前提条件

### **必要な環境**
- ✅ Node.js 18+ と npm
- ✅ Android Studio
- ✅ JDK 17+
- ✅ Netlifyデプロイ完了（`https://etarot.netlify.app`）

### **確認コマンド**
```bash
node --version    # v18以上
npm --version     # v9以上
java -version     # 17以上
```

---

## 🚀 セットアップ手順

### **Step 1: Capacitor設定確認**

既に設定済み：
```typescript
// capacitor.config.ts
const config: CapacitorConfig = {
  appId: "com.etarot.app",
  appName: "タロット大全",
  webDir: "out", // Next.js 静的エクスポート
  server: {
    url: "https://etarot.netlify.app", // Netlify URL
    cleartext: false,
    androidScheme: "https",
  },
}
```

### **Step 2: Next.js 静的エクスポート用ビルド**

```bash
# ロリポップ用（静的ファイル）
npm run build:lolipop
```

これで `out/` フォルダに静的ファイルが生成されます。

### **Step 3: Capacitorプロジェクト初期化**

```bash
# Androidプラットフォーム追加（初回のみ）
npx cap add android

# または既存のandroidフォルダがある場合
npx cap sync
```

### **Step 4: Capacitorプロジェクト同期**

```bash
# 静的ファイルをAndroidプロジェクトにコピー
npx cap sync android
```

### **Step 5: Android Studioで開く**

```bash
npx cap open android
```

---

## 🔧 APKビルド方法

### **方法1: Android Studioから（推奨）**

1. **Android Studio** でプロジェクトを開く
2. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
3. ビルド完了後、**Locate** をクリック
4. APKファイルが `android/app/build/outputs/apk/debug/app-debug.apk` に生成

### **方法2: コマンドラインから**

```bash
# デバッグAPK
cd android
./gradlew assembleDebug

# リリースAPK（署名済み）
./gradlew assembleRelease
```

---

## 🔐 リリースAPK署名（Google Play用）

### **Step 1: キーストア作成（初回のみ）**

```bash
keytool -genkey -v -keystore android/app/etarot-release.jks \
  -alias etarot \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

入力情報：
- パスワード: 安全なパスワード（記録必須）
- 名前: 組織名
- 組織単位: 開発チーム名
- 都市: 都市名
- 都道府県: 都道府県名
- 国: JP

### **Step 2: build.gradle 設定**

`android/app/build.gradle` に追加：

```gradle
android {
    ...
    signingConfigs {
        release {
            storeFile file('etarot-release.jks')
            storePassword 'YOUR_KEYSTORE_PASSWORD'
            keyAlias 'etarot'
            keyPassword 'YOUR_KEY_PASSWORD'
        }
    }
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled false
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
    }
}
```

### **Step 3: リリースAPKビルド**

```bash
cd android
./gradlew assembleRelease
```

出力：`android/app/build/outputs/apk/release/app-release.apk`

---

## 🔄 アプリ更新フロー

### **通常の更新（ストア審査不要）** ✨

1. **Next.jsアプリを更新**
   ```bash
   # コード修正
   git add .
   git commit -m "機能追加"
   git push origin master
   ```

2. **Netlify自動デプロイ**
   - GitHubプッシュで自動ビルド
   - 約3-5分で反映

3. **アプリで即座に反映** 🎉
   - ユーザーがアプリを開く
   - Netlifyから最新版を読み込み
   - **ストア審査不要！**

### **APK更新が必要な場合** 📱

以下の場合のみAPK再ビルド＋ストア更新が必要：
- ✅ アプリID変更
- ✅ パーミッション追加
- ✅ ネイティブプラグイン追加
- ✅ アイコン/スプラッシュスクリーン変更
- ✅ Capacitor設定変更

---

## 🎨 カスタマイズ

### **アプリアイコン変更**

```bash
# アイコン画像を準備（1024x1024 PNG）
# 以下のフォルダに配置：
android/app/src/main/res/mipmap-hdpi/ic_launcher.png
android/app/src/main/res/mipmap-mdpi/ic_launcher.png
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png
```

または、自動生成ツール使用：
```bash
npm install -g cordova-res
cordova-res android --skip-config --copy
```

### **スプラッシュスクリーン変更**

```bash
# スプラッシュ画像を準備
android/app/src/main/res/drawable/splash.png
```

### **アプリ名変更**

```typescript
// capacitor.config.ts
appName: "タロット大全 v2", // 新しい名前
```

---

## 🧪 テスト方法

### **1. ローカルテスト（エミュレータ）**

```bash
# エミュレータでアプリ起動
npx cap run android
```

### **2. 実機テスト**

```bash
# USBデバッグ有効化した実機を接続
npx cap run android --target=DEVICE_ID
```

### **3. APKインストールテスト**

```bash
# APKを実機にインストール
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

---

## 🐛 トラブルシューティング

### **問題: 白い画面が表示される**

**原因**: Netlify URLが正しく設定されていない

**解決**:
```typescript
// capacitor.config.ts
server: {
  url: "https://etarot.netlify.app", // 正しいURL確認
  cleartext: false,
}
```

### **問題: ネットワークエラー**

**原因**: CORS設定またはHTTPS接続の問題

**解決**:
1. Netlifyで`_headers`ファイル作成：
```
/*
  Access-Control-Allow-Origin: *
  X-Frame-Options: ALLOWALL
```

2. `capacitor.config.ts` で確認：
```typescript
android: {
  allowMixedContent: false, // HTTPSのみ
}
```

### **問題: ビルドエラー**

**解決**:
```bash
# Gradleキャッシュクリア
cd android
./gradlew clean

# または Android Studioで
Build → Clean Project
Build → Rebuild Project
```

### **問題: 署名エラー**

**解決**:
```bash
# キーストア情報確認
keytool -list -v -keystore android/app/etarot-release.jks
```

---

## 📊 パフォーマンス最適化

### **1. ネットワークキャッシュ**

```typescript
// capacitor.config.ts
plugins: {
  CapacitorHttp: {
    enabled: true,
  },
}
```

### **2. オフライン対応**

```typescript
// Service Worker 有効化（Next.js）
// next.config.mjs
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
})

module.exports = withPWA({
  // 既存の設定
})
```

### **3. 画像プリロード**

既に実装済み：
- WebP/AVIF対応
- Lazy Loading
- 画像最適化

---

## 📱 Google Play公開手順

### **Step 1: Google Play Console**
1. https://play.google.com/console にアクセス
2. アプリ作成
3. アプリ情報入力

### **Step 2: APKアップロード**
1. **リリース** → **製品版**
2. **新しいリリースを作成**
3. APKファイルをアップロード
4. リリースノート記入

### **Step 3: 段階的ロールアウト**
```
10% → 動作確認（1-2日）
50% → さらに確認（2-3日）
100% → 全ユーザーへ
```

---

## 🔄 移行戦略（既存アプリからの更新）

### **現在の状況**
- 既存アプリ: `tarot.kanau-kiryu.com`（ロリポップ）
- 新規アプリ: `https://etarot.netlify.app`（Netlify）

### **移行パターン**

#### **パターンA: 既存アプリを更新** 
```typescript
// capacitor.config.ts を更新してAPKビルド
server: {
  url: "https://etarot.netlify.app", // 新URL
}
```

**メリット**: 
- 既存ユーザーに自動配信
- アプリID変更不要

**手順**:
1. Google Playで新バージョンアップロード
2. 段階的ロールアウト（10% → 100%）
3. 問題なければ全ユーザーに配信

#### **パターンB: 新規アプリとして公開**
```typescript
// 新しいアプリID
appId: "com.etarot.app.v2",
```

**メリット**:
- 既存アプリ完全保護
- 並行運用可能

**手順**:
1. 新アプリID設定
2. 新規アプリとしてGoogle Play公開
3. 既存アプリに移行案内

---

## 📋 チェックリスト

### **デプロイ前**
- [ ] Netlifyデプロイ完了・動作確認
- [ ] `capacitor.config.ts` のURL設定
- [ ] アプリアイコン・スプラッシュ準備
- [ ] キーストア作成（リリース用）

### **ビルド前**
- [ ] Next.js 静的エクスポート成功
- [ ] `npx cap sync` 実行
- [ ] Android Studioで開けるか確認

### **テスト**
- [ ] エミュレータで動作確認
- [ ] 実機で動作確認
- [ ] 全ページ遷移テスト
- [ ] オフライン動作テスト

### **公開前**
- [ ] リリースAPK署名済み
- [ ] Google Play情報入力完了
- [ ] スクリーンショット準備
- [ ] プライバシーポリシー設定

---

## 🎯 推奨ワークフロー

```bash
# 1. ウェブアプリ更新
git add .
git commit -m "新機能追加"
git push origin master

# 2. Netlify 自動デプロイ（3-5分待機）

# 3. 動作確認
# https://etarot.netlify.app で確認

# 4. APK更新（必要な場合のみ）
npm run build:lolipop
npx cap sync android
cd android && ./gradlew assembleRelease

# 5. Google Playアップロード（必要な場合のみ）
```

---

## 🎉 完了！

これで、Netlifyにデプロイしたウェブアプリを、Capacitorでラップして
ネイティブAndroidアプリとして配布できます！

### **メリットまとめ**
- ✅ コード一元管理（ウェブ＆アプリ）
- ✅ 即座の更新反映（ストア審査不要）
- ✅ グローバルCDN配信
- ✅ パフォーマンス大幅向上
- ✅ 運用コスト削減

---

**次のステップ**: APKビルドを実行しましょう！ 🚀

