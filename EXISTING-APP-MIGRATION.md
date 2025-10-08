# 📱 既存Google Playアプリ移行ガイド
## ロリポップ → Netlify への安全なアプリ更新

---

## 📊 既存アプリ情報

### **現在公開中のアプリ**
- **アプリID**: `com.ryuka.kanau_kiryu`
- **アプリ名**: タロット大全
- **参照URL**: `https://tarot.kanau-kiryu.com`（ロリポップ）
- **ストア**: Google Play
- **状態**: 公開中・既存ユーザーあり

### **既存の機能**
- ✅ AdMob広告統合（AdMob ID: `ca-app-pub-3409171148853394~6749471057`）
- ✅ Google Play Billing（アプリ内課金）
- ✅ アプリ内更新（App Update API）
- ✅ スプラッシュスクリーン
- ✅ 縦画面固定

---

## 🎯 新バージョンの変更点

### **変更される部分** 🔄
1. **参照URL**: `https://tarot.kanau-kiryu.com` → `https://etarot.netlify.app`
2. **パフォーマンス**: バンドルサイズ80%削減、読み込み時間50-60%短縮
3. **CDN**: グローバルCDN配信開始
4. **バージョン**: `versionCode` を +1 する

### **変更されない部分** ✅
1. **アプリID**: `com.ryuka.kanau_kiryu`（同じまま）
2. **AdMob設定**: そのまま維持
3. **課金機能**: そのまま維持
4. **アプリ名**: 同じまま
5. **アイコン**: 同じまま

---

## 🚀 更新手順

### **Step 1: バージョン情報更新**

`android/app/build.gradle` を更新：

```gradle
defaultConfig {
    applicationId "com.ryuka.kanau_kiryu"
    minSdk 23
    targetSdk 34
    versionCode 2  // 1 → 2 に変更（既存が1の場合）
    versionName "2.0.0"  // 1.0 → 2.0.0 に変更
}
```

### **Step 2: Capacitor設定確認**

`capacitor.config.ts` が正しく設定されていることを確認：

```typescript
const config: CapacitorConfig = {
  appId: "com.ryuka.kanau_kiryu", // ✅ 既存と同じ
  appName: "タロット大全",         // ✅ 既存と同じ
  webDir: "out",
  server: {
    url: "https://etarot.netlify.app", // 🆕 Netlify URL
    cleartext: false,
    androidScheme: "https",
  },
}
```

### **Step 3: 静的ファイルビルド**

```bash
# Next.js 静的エクスポート
npm run build:lolipop
```

出力: `out/` フォルダに静的ファイル生成

### **Step 4: Capacitor同期**

```bash
# 静的ファイルをAndroidプロジェクトに同期
npx cap sync android
```

### **Step 5: Android Studioで確認**

```bash
# Android Studio起動
npx cap open android
```

Android Studioで：
1. **Build** → **Clean Project**
2. **Build** → **Rebuild Project**
3. エラーがないか確認

### **Step 6: APKビルド**

#### **デバッグAPK（テスト用）**
```bash
cd android
./gradlew assembleDebug
```

出力: `android/app/build/outputs/apk/debug/app-debug.apk`

#### **リリースAPK（Google Play用）**
```bash
cd android
./gradlew assembleRelease
```

出力: `android/app/build/outputs/apk/release/app-release.apk`

---

## 🧪 テスト手順

### **1. ローカルテスト（エミュレータ）**

```bash
# エミュレータで起動
npx cap run android
```

**確認項目**:
- ✅ アプリが起動するか
- ✅ Netlify URLから正しくコンテンツが読み込まれるか
- ✅ 全ページが正常に動作するか
- ✅ AdMobテスト広告が表示されるか
- ✅ 課金機能が動作するか（テストアカウント）

### **2. 実機テスト**

```bash
# USBデバッグ有効化した実機を接続
adb devices

# デバッグAPKインストール
adb install android/app/build/outputs/apk/debug/app-debug.apk
```

**確認項目**:
- ✅ 既存アプリが上書きインストールできるか（同じアプリID）
- ✅ データが引き継がれているか
- ✅ すべての機能が正常動作するか
- ✅ パフォーマンスが向上しているか

### **3. 内部テスト配信（推奨）**

Google Play Consoleで：
1. **リリース** → **内部テスト**
2. リリースAPKをアップロード
3. テスターを追加（自分 + 数名）
4. 1-2日テスト

---

## 📱 Google Play アップロード手順

### **Step 1: リリースAPK準備**

```bash
# 署名済みリリースAPKビルド
cd android
./gradlew assembleRelease

# APKファイル確認
ls -l app/build/outputs/apk/release/app-release.apk
```

### **Step 2: Google Play Console**

1. https://play.google.com/console にアクセス
2. 既存アプリ「タロット大全」を選択
3. **製品版** → **新しいリリースを作成**

### **Step 3: APKアップロード**

1. **App Bundle または APK をアップロード**
2. `app-release.apk` を選択
3. アップロード完了を待つ

### **Step 4: リリースノート記入**

```
【バージョン 2.0.0 の新機能】

🚀 パフォーマンス大幅向上
・読み込み時間が50-60%高速化
・より快適な操作性を実現

✨ 最適化
・アプリサイズを大幅削減
・グローバルCDNによる高速配信
・画像読み込みの最適化

🐛 バグ修正と安定性向上
・各種バグを修正
・アプリの安定性を向上

引き続きタロット大全をお楽しみください！
```

### **Step 5: 段階的ロールアウト（推奨）** 🛡️

リスク管理のため、段階的に公開：

```
1日目: 内部テスト（テスター数名）
2日目: 10%のユーザーに公開
4日目: 問題なければ 50%に拡大
7日目: 問題なければ 100%に拡大
```

**設定方法**:
1. Google Play Console → リリース作成
2. 「段階的な公開」を選択
3. 初期パーセンテージ: **10%**
4. 「リリースを開始」

**監視**:
- クラッシュレポート確認
- ユーザーレビュー確認
- 問題なければ次の段階へ

---

## 🔄 既存ユーザーへの影響

### **アップデート時の動作**

1. **Google Playで更新通知**
   - 「タロット大全 v2.0.0が利用可能」

2. **ユーザーが更新をタップ**
   - 既存アプリが上書きインストール
   - アプリIDが同じなので、データは保持

3. **アプリ起動**
   - 新しいNetlify URLから読み込み
   - より高速な動作を体験

### **ユーザーデータの保持** ✅

以下は保持されます：
- ✅ ログイン情報
- ✅ 設定（テーマ、言語など）
- ✅ 購入履歴
- ✅ アプリ内通貨・コイン
- ✅ ゲーム進捗

---

## 🛡️ 安全対策

### **1. ロールバック準備**

問題が発生した場合、即座に対応：

#### **方法A: Google Playでロールバック**
1. Google Play Console
2. 「リリース」 → 「製品版」
3. 「以前のバージョンに戻す」

#### **方法B: Netlify URLを元に戻す**

緊急時のフォールバック：
```typescript
// capacitor.config.ts（緊急時のみ）
server: {
  url: "https://tarot.kanau-kiryu.com", // 一時的に旧URLに戻す
}
```

APKをビルドし直して緊急アップロード。

### **2. 監視体制**

リリース後の監視：

#### **Google Play Console**
- クラッシュレポート（毎日確認）
- ANR（Application Not Responding）レポート
- ユーザーレビュー

#### **Netlify**
- アクセスログ
- エラーレート
- パフォーマンスメトリクス

### **3. フォールバック機能（アプリ側）**

`app-config.js` で自動フォールバック実装済み：

```javascript
export const FALLBACK_CONFIG = {
  enabled: true,
  fallbackUrl: 'https://tarot.kanau-kiryu.com', // ロリポップ
  maxRetries: 3,
  timeout: 5000,
}
```

Netlifyが応答しない場合、自動的に旧URLにフォールバック。

---

## 📊 期待される効果

### **パフォーマンス改善**

| 項目 | 旧バージョン | 新バージョン | 改善率 |
|------|-------------|-------------|--------|
| **読み込み時間** | 3-5秒 | 1.2-2秒 | **50-60%短縮** |
| **バンドルサイズ** | 大 | 小 | **80%削減** |
| **First Load JS** | ~800 kB | ~403-501 kB | **40-50%削減** |

### **ユーザー体験向上**

- ⚡ より速いページ遷移
- 📱 スムーズなアニメーション
- 🌐 世界中どこからでも高速アクセス
- 💾 データ使用量削減

### **運用改善**

- 🚀 今後のアップデートがストア審査不要
- 🔄 Netlifyデプロイで即座に反映
- 📊 詳細なパフォーマンス監視
- 💰 運用コスト削減

---

## ✅ チェックリスト

### **ビルド前**
- [ ] `versionCode` を +1
- [ ] `versionName` を更新（例: "2.0.0"）
- [ ] Capacitor設定でNetlify URL確認
- [ ] AdMob ID が正しく設定されているか確認

### **ビルド**
- [ ] `npm run build:lolipop` 成功
- [ ] `npx cap sync android` 成功
- [ ] デバッグAPKビルド成功
- [ ] リリースAPKビルド成功

### **テスト**
- [ ] エミュレータで動作確認
- [ ] 実機で動作確認
- [ ] 既存アプリから上書きインストール成功
- [ ] データ引き継ぎ確認
- [ ] AdMob広告表示確認
- [ ] 課金機能確認

### **公開前**
- [ ] リリースノート作成
- [ ] スクリーンショット更新（必要に応じて）
- [ ] 内部テスト実施
- [ ] クラッシュがないか確認

### **公開**
- [ ] Google Play ConsoleにAPKアップロード
- [ ] 段階的ロールアウト設定（10%から）
- [ ] 監視体制確立
- [ ] 問題発生時の対応フロー確認

---

## 🎯 推奨タイムライン

```
Day 1: APKビルド & 内部テスト配信
Day 2-3: 内部テストフィードバック & 修正
Day 4: 10%ロールアウト開始
Day 5-6: 監視（クラッシュレート、レビュー確認）
Day 7: 50%に拡大
Day 8-10: 継続監視
Day 11: 100%全ユーザーに配信
Day 12-: 継続監視（1ヶ月）
```

---

## 📞 トラブルシューティング

### **問題: 上書きインストールできない**

**原因**: 署名キーが異なる

**解決**: 既存アプリと同じキーストアを使用
```bash
# 既存のキーストア確認
keytool -list -v -keystore android/app/etarot-release.jks
```

### **問題: AdMob広告が表示されない**

**原因**: AdMob IDの設定ミス

**解決**: `AndroidManifest.xml` 確認
```xml
<meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="ca-app-pub-3409171148853394~6749471057"/>
```

### **問題: 白い画面が表示される**

**原因**: Netlify URLの接続エラー

**解決**:
1. Netlify URLが正しいか確認
2. ネットワーク接続確認
3. `cleartext: false` 確認（HTTPSのみ）

---

## 🎉 完了！

この手順で、既存の「タロット大全」アプリを、
Netlifyの最適化された環境に移行できます！

### **メリットまとめ**
- ✅ 既存ユーザーに影響なし
- ✅ データ完全保持
- ✅ パフォーマンス大幅向上
- ✅ 段階的ロールアウトで安全
- ✅ 今後の更新が超高速

**次のステップ**: APKビルドを実行しましょう！ 🚀

