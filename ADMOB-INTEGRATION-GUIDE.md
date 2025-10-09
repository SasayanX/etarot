# 📢 AdMob統合ガイド
## Netlify + Capacitor + AdMobの完全統合

---

## 🔍 現状の問題点

### **問題1: WebView読み込みURLが古い** ❌
```java
// D:\TarotApp_IconComplete_2025_0619_2016\app\src\main\java\com\ryuka\kanau_kiryu\MainActivity.java
// 行749
webView.loadUrl("https://tarot.kanau-kiryu.com/");  // 古いロリポップURL
```

**必要な修正**:
```java
webView.loadUrl("https://etarot.netlify.app/");  // 新しいNetlify URL
```

### **問題2: ウェブアプリ側のAdMobが無効化** ⚠️
```typescript
// utils/ad-utils.ts
// 行51-54
export function showAd(location: string): boolean {
  console.log(`広告表示リクエスト (${location}): ネイティブ側との競合を避けるため無効化されています`)
  return false  // 無効化されている
}
```

---

## 🎯 AdMob実装の選択肢

### **オプションA: ネイティブAdMob（現在の実装）** ⭐

#### **メリット**
- ✅ MainActivity.javaで完全実装済み
- ✅ バナー広告 + インタースティシャル広告
- ✅ タップカウント機能
- ✅ 広告削除課金機能
- ✅ AdMob SDK 24.4.0対応

#### **実装方法**
1. **MainActivity.javaをコピー**
   ```powershell
   Copy-Item "D:\TarotApp_IconComplete_2025_0619_2016\app\src\main\java\com\ryuka\kanau_kiryu\MainActivity.java" "android\app\src\main\java\com\ryuka\kanau_kiryu\MainActivity.java"
   ```

2. **URLをNetlifyに変更**
   ```java
   // 行749を変更
   webView.loadUrl("https://etarot.netlify.app/");
   ```

3. **レイアウトファイルをコピー**
   ```powershell
   Copy-Item "D:\TarotApp_IconComplete_2025_0619_2016\app\src\main\res\layout\*" "android\app\src\main\res\layout\"
   ```

4. **APK再ビルド**
   ```bash
   cd android
   .\gradlew.bat assembleDebug
   ```

---

### **オプションB: JavaScriptでAdMob（Google AdSense的）** 

#### **メリット**
- ✅ APK再ビルド不要
- ✅ Netlifyデプロイだけで更新可能

#### **デメリット**
- ❌ AdMobではなくAdSenseになる（収益率が低い）
- ❌ モバイルアプリでは推奨されない

#### **実装方法**
```typescript
// utils/ad-utils.ts を有効化
export function showAd(location: string): boolean {
  // Google AdSenseコードを埋め込む
  return true
}
```

---

## 🚀 推奨：オプションA（ネイティブAdMob）

### **理由**
1. ✅ 既に完全実装済み
2. ✅ AdMob SDK 24.4.0対応
3. ✅ 高い収益率
4. ✅ 課金機能統合済み

---

## 📋 実装手順（ネイティブAdMob）

### **Step 1: MainActivity.javaをコピー**

```powershell
Copy-Item "D:\TarotApp_IconComplete_2025_0619_2016\app\src\main\java\com\ryuka\kanau_kiryu\MainActivity.java" "android\app\src\main\java\com\ryuka\kanau_kiryu\MainActivity.java" -Force
```

### **Step 2: URLを変更**

`android/app/src/main/java/com/ryuka/kanau_kiryu/MainActivity.java`の749行目を変更：

```java
// 変更前
webView.loadUrl("https://tarot.kanau-kiryu.com/");

// 変更後
webView.loadUrl("https://etarot.netlify.app/");
```

また、753-759行目も変更：

```java
private boolean isInternalUrl(String url) {
    return url != null && (
            url.startsWith("https://etarot.netlify.app/") ||  // 追加
            url.startsWith("https://tarot.kanau-kiryu.com/") ||
            url.startsWith("https://etarot6.vercel.app/") ||
            url.startsWith("http://localhost") ||
            url.startsWith("file://")
    );
}
```

### **Step 3: レイアウトファイルをコピー**

```powershell
Copy-Item -Path "D:\TarotApp_IconComplete_2025_0619_2016\app\src\main\res\layout\*" -Destination "android\app\src\main\res\layout\" -Force
```

### **Step 4: リソースファイルをコピー（必要に応じて）**

```powershell
# values/strings.xml, values/styles.xml など
Copy-Item -Path "D:\TarotApp_IconComplete_2025_0619_2016\app\src\main\res\values\*" -Destination "android\app\src\main\res\values\" -Force
```

### **Step 5: APK再ビルド**

```bash
cd android
.\gradlew.bat assembleDebug
```

---

## 🧪 AdMob動作確認

### **テスト項目**
- [ ] アプリ起動時にバナー広告が表示される
- [ ] 10回タップでインタースティシャル広告が表示される
- [ ] タップカウントが正しく動作する
- [ ] 2分間隔が正しく機能する
- [ ] 広告削除課金が動作する

### **デバッグログ確認**
```bash
adb logcat | findstr "MainActivity"
```

**確認ポイント**:
- "AdMob SDK 24.4.0 初期化完了"
- "バナー広告読み込み成功"
- "インタースティシャル広告読み込み完了"

---

## 📊 AdMob実装の全体像

```
[ウェブアプリ (Netlify)]
         ↓ WebView読み込み
[MainActivity.java]
         ↓ AdMob SDK初期化
[AdMob広告]
  - バナー広告（画面下部）
  - インタースティシャル広告（10タップごと）
         ↓
[課金機能]
  - 広告削除購入
  - Billing Library v6
```

---

## ✅ チェックリスト

### **必要な作業**
- [ ] MainActivity.javaをコピー
- [ ] URLをNetlifyに変更
- [ ] レイアウトファイルをコピー
- [ ] APK再ビルド
- [ ] 実機でAdMobテスト

### **確認項目**
- [ ] バナー広告表示
- [ ] インタースティシャル広告表示
- [ ] タップカウント動作
- [ ] 広告削除課金動作

---

## 🎉 完成後の動作

1. **アプリ起動**
   - 美しいスプラッシュスクリーン（3秒）
   - MainActivity起動
   - AdMob初期化
   - Netlify URLを読み込み

2. **広告表示**
   - 画面下部にバナー広告
   - 10タップごとにインタースティシャル広告

3. **ウェブアプリ機能**
   - ボタン・画面遷移正常
   - 最適化されたパフォーマンス
   - Netlify CDNで高速

---

**次のステップ**: MainActivity.javaをコピーしてURL変更しますか？ 🚀

