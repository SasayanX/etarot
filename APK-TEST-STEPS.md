# 📱 APK動作確認手順
## デバッグAPKでテストする方法

---

## ✅ 現在の状況

### **完了した作業**
- ✅ Next.js 静的エクスポート完了 (`out/` フォルダ)
- ✅ Capacitor同期完了
- ✅ Android Studio起動済み

---

## 🚀 Android StudioでAPKビルド

### **方法1: Android Studioから（推奨・簡単）** ⭐

Android Studioで以下の手順を実行：

#### **Step 1: プロジェクトをクリーンビルド**
1. **Build** → **Clean Project** をクリック
2. 完了を待つ（1-2分）

#### **Step 2: プロジェクトを再ビルド**
1. **Build** → **Rebuild Project** をクリック
2. 完了を待つ（2-3分）
3. エラーがないか確認

#### **Step 3: デバッグAPKビルド**
1. **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)** をクリック
2. ビルド完了を待つ（2-3分）
3. 「APK(s) generated successfully」通知が表示される
4. **Locate** ボタンをクリック

✅ **出力先**: `android\app\build\outputs\apk\debug\app-debug.apk`

---

### **方法2: コマンドラインから（バックグラウンド推奨）**

```bash
# Androidフォルダに移動
cd android

# デバッグAPKビルド
gradlew assembleDebug
```

または、プロジェクトルートから：
```bash
npm run apk:debug
```

✅ **出力先**: `android\app\build\outputs\apk\debug\app-debug.apk`

---

## 📱 実機にインストール

### **準備: USBデバッグ有効化**

実機で以下を設定：

1. **設定** → **デバイス情報** → **ビルド番号** を7回タップ
2. 「開発者向けオプション」が有効化される
3. **設定** → **開発者向けオプション** → **USBデバッグ** をON
4. PCとUSB接続
5. 「USBデバッグを許可しますか？」→ **許可**

---

### **方法1: Android Studioから（推奨）**

1. 実機をUSBで接続
2. Android Studioの上部ツールバーでデバイスを選択
3. **Run** ボタン（緑の▶）をクリック
4. アプリが自動でインストール＆起動

---

### **方法2: ADBコマンドから**

```bash
# デバイス接続確認
adb devices

# 既存アプリがある場合は上書きインストール
adb install -r android\app\build\outputs\apk\debug\app-debug.apk

# 新規インストール
adb install android\app\build\outputs\apk\debug\app-debug.apk
```

---

### **方法3: APKファイルを直接転送**

1. APKファイルをメール/Googleドライブ等で実機に送信
2. 実機でダウンロード
3. ファイルマネージャーでAPKをタップ
4. 「提供元不明のアプリ」を許可
5. インストール

---

## ✅ 動作確認チェックリスト

### **基本動作**
- [ ] アプリが正常に起動する
- [ ] スプラッシュスクリーンが表示される
- [ ] Netlify URLから正しく読み込まれる（`https://etarot.netlify.app`）
- [ ] ネットワーク接続が正常

### **全ページ確認**
- [ ] 🏠 ホーム画面が正常に表示される
- [ ] 🔮 タロット占いページが表示される
- [ ] 🃏 カードシャッフルアニメーションが滑らか
- [ ] 📖 タロット辞書が正常に表示される
- [ ] 🎮 ゲームモード選択画面が表示される
- [ ] 🎮 各ゲームモード（クラシック、ハード、タイムアタック、バトル）が動作
- [ ] ❓ クイズモードが正常に動作
- [ ] ⚙️ 設定ページが正常に動作
- [ ] 🎨 スキン・カード裏面選択が正常に動作

### **パフォーマンス確認**
- [ ] ページ読み込みが2秒以内
- [ ] ページ遷移がスムーズ
- [ ] アニメーションが60fps
- [ ] メモリ使用量が適切
- [ ] バッテリー消費が適切

### **既存アプリとの互換性**
- [ ] 既存アプリがインストールされている場合、上書きできる
- [ ] データが引き継がれる（設定、コイン、進捗など）
- [ ] AdMob広告が表示される（テストモードの場合はテスト広告）
- [ ] アプリ内課金が動作する

### **エラーチェック**
- [ ] 白い画面が表示されない
- [ ] ネットワークエラーが出ない
- [ ] 画像読み込みエラーがない
- [ ] クラッシュしない

---

## 🐛 トラブルシューティング

### **問題: ビルドエラー**

#### **エラー: Gradle sync failed**
```bash
cd android
gradlew clean
```

Android Studioで:
1. **File** → **Invalidate Caches**
2. **Restart**

#### **エラー: SDK not found**
Android Studioで:
1. **Tools** → **SDK Manager**
2. **Android SDK** タブで必要なSDKをインストール
3. 特に **Android 13 (API 34)** が必要

---

### **問題: 白い画面が表示される**

#### **原因1: Netlify URLへの接続失敗**
```typescript
// capacitor.config.ts を確認
server: {
  url: "https://etarot.netlify.app",  // 正しいURL
  cleartext: false,  // HTTPSのみ
}
```

#### **原因2: ネットワーク権限**
`AndroidManifest.xml` を確認:
```xml
<uses-permission android:name="android.permission.INTERNET" />
```

#### **原因3: 静的ファイルが同期されていない**
```bash
npx cap sync android
```

---

### **問題: アプリがクラッシュする**

#### **ログ確認**
```bash
adb logcat | findstr "無料タロット占い - 毎日の運勢とカード占い"
```

または Android Studioの **Logcat** タブで確認

#### **よくある原因**
- AdMob IDが正しくない
- ネットワーク接続がない
- メモリ不足

---

### **問題: 既存アプリから上書きできない**

#### **原因: 署名キーが異なる**

既存アプリと同じキーストアを使用していることを確認:
```bash
# キーストアファイル確認
ls android\app\appkey.jks
```

`android\app\build.gradle` で署名設定を追加:
```gradle
android {
    signingConfigs {
        debug {
            storeFile file('appkey.jks')
            storePassword 'YOUR_PASSWORD'
            keyAlias 'YOUR_ALIAS'
            keyPassword 'YOUR_PASSWORD'
        }
    }
    buildTypes {
        debug {
            signingConfig signingConfigs.debug
        }
    }
}
```

---

## 📊 パフォーマンステスト

### **Chrome DevTools でリモートデバッグ**

1. PCのChromeで `chrome://inspect` を開く
2. 実機のアプリを起動
3. 「Inspect」をクリック
4. **Network** タブでネットワークパフォーマンス確認
5. **Performance** タブでレンダリングパフォーマンス確認

### **確認項目**
- 初回読み込み時間: **<2秒**
- First Contentful Paint: **<1.5秒**
- Largest Contentful Paint: **<2.5秒**
- Time to Interactive: **<3秒**

---

## ✅ テスト完了後

### **成功した場合**
- [ ] 動作確認チェックリストをすべてクリア
- [ ] パフォーマンステスト合格
- [ ] エラーなし

→ **次のステップ: リリースAPKビルド**
```bash
cd android
gradlew assembleRelease
```

### **問題がある場合**
- [ ] エラーログを確認
- [ ] トラブルシューティングを実施
- [ ] 必要に応じてコード修正
- [ ] 再ビルド＆再テスト

---

## 🎯 次のステップ

### **1. デバッグAPKテスト完了後**
リリースAPKをビルド:
```bash
cd android
gradlew assembleRelease
```

### **2. リリースAPKテスト**
実機でリリースAPKをテスト

### **3. Google Play Console**
リリースAPKをアップロード

### **4. 内部テスト配信**
テスターに配信（1-2日）

### **5. 段階的ロールアウト**
10% → 50% → 100%

---

## 📝 テスト結果記録

### **テスト環境**
- デバイス: _______________________
- Android バージョン: _______________________
- ビルド日時: _______________________
- APKバージョン: v2.5 (versionCode: 24)

### **テスト結果**
- 基本動作: ⬜ 成功 / ⬜ 失敗
- 全ページ確認: ⬜ 成功 / ⬜ 失敗
- パフォーマンス: ⬜ 成功 / ⬜ 失敗
- 互換性: ⬜ 成功 / ⬜ 失敗

### **問題点**
_______________________________________
_______________________________________
_______________________________________

### **総合評価**
⬜ リリース準備完了
⬜ 修正必要
⬜ 再テスト必要

---

## 🎉 APKビルド＆テスト完了！

すべてのテストが成功したら、Google Playへのアップロード準備完了です！

**次のコマンド**: リリースAPKビルド
```bash
cd android
gradlew assembleRelease
```

