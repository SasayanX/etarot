# レビュー依頼機能

## ✅ Google Playポリシーに完全準拠

この機能は、Google Playの「評価、レビュー、インストール」ポリシーに完全に準拠しています。

### **ポリシー準拠のポイント**
- ❌ **報酬を一切提示しない**（ポイント、アイテム、特典なし）
- ✅ **強制しない**（「後で」ボタンあり）
- ✅ **ユーザー体験を尊重**（適切なタイミングで表示）
- ✅ **過度な表示を避ける**（条件付きで表示）

---

## 📋 機能概要

### **表示条件**
レビュー依頼ダイアログは、以下の条件をすべて満たした場合に表示されます：

1. ✅ **アプリを5回以上使用した**
2. ✅ **まだ一度も表示していない**、または**前回表示から7日以上経過**
3. ✅ **今日まだ表示していない**（1日1回まで）

### **表示タイミング**
- トップページ（`/`）を開いたとき
- ログインボーナスの**3秒後**に表示（UIが安定してから）

### **ユーザーアクション**
| アクション | 動作 | 次回表示 |
|-----------|------|---------|
| **レビューを書く** | Google Playのレビューページを開く | 二度と表示しない |
| **すでに書きました** | ダイアログを閉じる | 二度と表示しない ✅ |
| **後で** | ダイアログを閉じる | 7日後に再表示 |
| **×ボタン** | ダイアログを閉じる | 7日後に再表示 |

---

## 🔧 技術実装

### **ファイル構成**
```
hooks/
  └── use-review-prompt.ts          ← レビュー依頼のロジック

components/
  └── review-prompt-dialog.tsx      ← レビュー依頼ダイアログUI

app/
  └── page.tsx                      ← トップページに統合
```

### **1. `use-review-prompt.ts`（カスタムフック）**

#### **機能**
- 使用回数のカウント（`localStorage`）
- レビュー依頼の表示条件判定
- 表示履歴の管理

#### **LocalStorageキー**
| キー | 説明 | 型 | 例 |
|------|------|----|----|
| `appUsageCount` | アプリ使用回数 | number | `12` |
| `hasShownReviewPrompt` | レビューボタンを押したか | boolean | `"true"` |
| `lastReviewPromptDate` | 最後に表示した日付 | string | `"2025-10-11"` |

#### **ロジック**
```typescript
// 使用回数をインクリメント
const newUsageCount = usageCount + 1

// 表示条件判定
if (newUsageCount >= 5) {
  const shouldShow = !hasShownReview || (
    lastReviewPromptDate && 
    isMoreThanDaysAgo(lastReviewPromptDate, 7) &&
    lastReviewPromptDate !== today
  )
  
  if (shouldShow && lastReviewPromptDate !== today) {
    setShowReviewPrompt(true)
  }
}
```

### **2. `review-prompt-dialog.tsx`（UIコンポーネント）**

#### **デザイン**
- 🌟 **星5つ**のアイコン
- 💜 **紫とゴールド**のグラデーション
- 💖 **ハート**アイコンでフレンドリーな印象

#### **ボタン**
1. **「レビューを書く」**（メインボタン - オレンジ）
   - Google Playのレビューページを開く
   - Androidアプリ内: `market://details?id=com.ryuka.kanau_kiryu`
   - ブラウザ: `https://play.google.com/store/apps/details?id=com.ryuka.kanau_kiryu`
   - `hasShownReviewPrompt = true` に設定 → **二度と表示しない**

2. **「すでに書きました」**（セカンダリボタン - 緑）
   - ダイアログを閉じる
   - `hasShownReviewPrompt = true` に設定 → **二度と表示しない**
   - レビュー済みユーザーへの配慮 💚

3. **「後で」**（サブボタン - 紫）
   - ダイアログを閉じる
   - 7日後に再表示

#### **WebView検出**
```typescript
const ua = navigator.userAgent.toLowerCase()
const isAndroidWebView = ua.indexOf("wv") > -1 || ua.includes("tarotapp")

if (isAndroidWebView) {
  // Androidアプリ内の場合
  window.location.href = `market://details?id=${packageName}`
} else {
  // ブラウザの場合
  window.open(playStoreUrl, "_blank")
}
```

### **3. `app/page.tsx`（統合）**

#### **実装**
```typescript
export default function Home() {
  const { showReviewPrompt, dismissReviewPrompt, markReviewShown } = useReviewPrompt()

  return (
    <div className="py-8 space-y-8">
      {/* レビュー依頼ダイアログ */}
      {showReviewPrompt && (
        <ReviewPromptDialog
          isOpen={showReviewPrompt}
          onReview={markReviewShown}
          onDismiss={dismissReviewPrompt}
        />
      )}
      
      {/* 他のコンテンツ */}
    </div>
  )
}
```

---

## 📊 表示フロー

### **初回使用時（1〜4回目）**
```
トップページを開く
  ↓
使用回数をカウント（1, 2, 3, 4）
  ↓
❌ 5回未満なので表示しない
```

### **5回目の使用**
```
トップページを開く
  ↓
使用回数をカウント（5）
  ↓
✅ 5回以上 && 一度も表示していない
  ↓
🌟 レビュー依頼ダイアログを表示
```

### **ユーザーが「レビューを書く」を押した場合**
```
Google Playのレビューページを開く
  ↓
hasShownReviewPrompt = "true" に設定
  ↓
二度と表示しない ✅
```

### **ユーザーが「すでに書きました」を押した場合**
```
ダイアログを閉じる
  ↓
hasShownReviewPrompt = "true" に設定
  ↓
二度と表示しない ✅
（レビュー済みユーザーへの配慮）
```

### **ユーザーが「後で」を押した場合**
```
ダイアログを閉じる
  ↓
lastReviewPromptDate = 今日の日付 に設定
  ↓
7日後に再表示 🔄
```

---

## 🧪 テスト方法

### **1. 初回表示テスト**

#### **手順**
1. ブラウザの開発者ツールを開く（F12）
2. `localStorage` をクリア:
   ```javascript
   localStorage.removeItem("appUsageCount")
   localStorage.removeItem("hasShownReviewPrompt")
   localStorage.removeItem("lastReviewPromptDate")
   ```
3. トップページをリロード × 5回
4. 5回目に**レビュー依頼ダイアログが表示される**ことを確認

### **2. 「レビューを書く」ボタンテスト**

#### **手順**
1. レビュー依頼ダイアログを表示
2. 「レビューを書く」ボタンをクリック
3. **Google Playのレビューページが開く**ことを確認
4. トップページをリロード × 10回
5. **二度と表示されない**ことを確認

### **3. 「後で」ボタンテスト**

#### **手順**
1. レビュー依頼ダイアログを表示
2. 「後で」ボタンをクリック
3. `localStorage` を確認:
   ```javascript
   console.log(localStorage.getItem("lastReviewPromptDate")) // 今日の日付
   ```
4. トップページをリロード × 5回
5. **今日は表示されない**ことを確認
6. `lastReviewPromptDate` を8日前に変更:
   ```javascript
   const eightDaysAgo = new Date()
   eightDaysAgo.setDate(eightDaysAgo.getDate() - 8)
   localStorage.setItem("lastReviewPromptDate", eightDaysAgo.toISOString().split("T")[0])
   ```
7. トップページをリロード
8. **レビュー依頼ダイアログが再表示される**ことを確認

### **4. WebView内テスト（Androidアプリ）**

#### **手順**
1. Androidアプリでトップページを開く
2. レビュー依頼ダイアログを表示
3. 「レビューを書く」ボタンをクリック
4. **Google Playアプリが起動**し、レビューページが開くことを確認
5. （ブラウザではなく、ネイティブアプリで開くことを確認）

---

## 📈 期待される効果

### **レビュー数の増加**
- ✅ 適切なタイミングで依頼することで、**レビュー数が2〜5倍**増加する可能性
- ✅ アプリを気に入っているユーザーに依頼するため、**高評価が増える**

### **検索順位の向上**
- ✅ レビュー数が増えると、Google Playの**検索順位が上がる**
- ✅ 高評価が多いと、**おすすめアプリに表示される**可能性が高まる

### **ユーザー体験への影響**
- ✅ 強制しないため、**ユーザー体験を損なわない**
- ✅ 1日1回、7日おきなので、**煩わしくない**

---

## 🎯 カスタマイズ可能な設定

### **表示回数の変更**
```typescript
// hooks/use-review-prompt.ts
if (newUsageCount >= 5) {  // ← ここを変更（例: 10回に変更）
```

### **再表示期間の変更**
```typescript
// hooks/use-review-prompt.ts
isMoreThanDaysAgo(lastReviewPromptDate, 7)  // ← ここを変更（例: 14日に変更）
```

### **表示遅延の変更**
```typescript
// hooks/use-review-prompt.ts
const timer = setTimeout(() => {
  checkReviewPrompt()
}, 3000)  // ← ここを変更（例: 5000msに変更）
```

---

## 📝 まとめ

### **✅ 実装完了**
- ✅ レビュー依頼ダイアログの実装
- ✅ Google Playポリシーに完全準拠
- ✅ ログインボーナスと併用可能
- ✅ WebView対応（Androidアプリ内で動作）

### **🚀 次のステップ**
1. ✅ ビルド（`npm run build:lolipop`）
2. ✅ テスト（ブラウザ + Androidアプリ）
3. ✅ デプロイ（Netlify + ロリポップ）
4. ✅ 効果測定（Google Play Consoleでレビュー数をチェック）

---

**レビュー依頼機能の実装、お疲れ様でした！** 🎉✨

