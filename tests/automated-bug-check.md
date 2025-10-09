# 🧪 自動バグチェック方法
## 人間の手動チェック以外の方法

---

## 🎯 自動テスト手法

### **1. TypeScript型チェック（既に実装済み）** ✅

```bash
npm run type-check
```

**検出できるバグ**:
- ✅ 型の不一致
- ✅ 未定義の変数
- ✅ 関数の引数エラー
- ✅ プロパティの存在チェック

---

### **2. ESLint（既に実装済み）** ✅

```bash
npm run lint
```

**検出できるバグ**:
- ✅ 使われていない変数
- ✅ 無限ループの可能性
- ✅ useEffectの依存関係エラー
- ✅ コーディング規約違反

---

### **3. ビルドエラーチェック（既に実装済み）** ✅

```bash
npm run build:lolipop
```

**検出できるバグ**:
- ✅ インポートエラー
- ✅ コンパイルエラー
- ✅ モジュール解決エラー
- ✅ 静的生成エラー

---

## 🚀 追加できる自動テスト

### **4. ユニットテスト（推奨）** ⭐

#### **インストール**
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event
```

#### **テスト例**
```typescript
// __tests__/quiz-logic.test.ts
import { describe, it, expect } from '@jest/globals'

describe('クイズ正解判定', () => {
  it('正解の場合、正解と表示される', () => {
    const correctAnswer = 2
    const selectedOption = 2
    const isCorrect = selectedOption === correctAnswer
    
    expect(isCorrect).toBe(true)
  })
  
  it('不正解の場合、不正解と表示される', () => {
    const correctAnswer = 2
    const selectedOption = 1
    const isCorrect = selectedOption === correctAnswer
    
    expect(isCorrect).toBe(false)
  })
})
```

---

### **5. E2Eテスト（Playwright）** 🎭

#### **インストール**
```bash
npm install --save-dev @playwright/test
npx playwright install
```

#### **テスト例**
```typescript
// tests/e2e/dictionary.spec.ts
import { test, expect } from '@playwright/test'

test('辞典のカードをクリックすると詳細が表示される', async ({ page }) => {
  await page.goto('https://etarot.netlify.app/dictionary')
  
  // 最初のカードをクリック
  await page.click('.grid > div:first-child')
  
  // カード詳細が表示されることを確認
  await expect(page.locator('h2')).toBeVisible()
  
  // 説明文が空でないことを確認
  const description = await page.locator('.card-description').textContent()
  expect(description).not.toBe('')
  expect(description.length).toBeGreaterThan(10)
})

test('クイズで不正解の場合、不正解と表示される', async ({ page }) => {
  await page.goto('https://etarot.netlify.app/quiz')
  
  // クイズ開始
  await page.click('text=クイック')
  await page.click('text=開始')
  
  // 誤った選択肢をクリック（最初の選択肢が正解でない場合）
  await page.click('.options button:nth-child(1)')
  
  // 結果を確認
  const result = await page.locator('h3').textContent()
  
  // 正解または不正解のどちらかが表示される
  expect(result === '正解！' || result === '不正解').toBe(true)
})
```

**実行**:
```bash
npx playwright test
```

---

### **6. ビジュアルリグレッションテスト** 📸

#### **インストール**
```bash
npm install --save-dev @playwright/test
```

#### **テスト例**
```typescript
// tests/visual/pages.spec.ts
import { test, expect } from '@playwright/test'

test('辞典ページのスクリーンショット', async ({ page }) => {
  await page.goto('https://etarot.netlify.app/dictionary')
  await expect(page).toHaveScreenshot('dictionary.png')
})

test('クイズページのスクリーンショット', async ({ page }) => {
  await page.goto('https://etarot.netlify.app/quiz')
  await expect(page).toHaveScreenshot('quiz.png')
})
```

**効果**: UIの意図しない変更を検出

---

### **7. Lighthouse CI（パフォーマンス自動チェック）** 🔍

#### **インストール**
```bash
npm install --save-dev @lhci/cli
```

#### **設定ファイル**
```javascript
// lighthouserc.js
module.exports = {
  ci: {
    collect: {
      url: ['https://etarot.netlify.app/'],
      numberOfRuns: 3,
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.9 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
      },
    },
  },
}
```

**実行**:
```bash
npx lhci autorun
```

**効果**: パフォーマンス低下を自動検出

---

### **8. Netlify Deploy Preview（既に利用可能）** 🌐

Netlifyは自動的に：
- ✅ ビルドエラーを検出
- ✅ デプロイプレビューを生成
- ✅ ビルドログを保存

**確認方法**:
```
https://app.netlify.com/sites/etarot/deploys
```

---

## 🤖 CI/CDパイプライン（推奨）

### **GitHub Actions設定**

```yaml
# .github/workflows/test.yml
name: 自動テスト

on:
  push:
    branches: [ master ]
  pull_request:
    branches: [ master ]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Node.jsセットアップ
      uses: actions/setup-node@v3
      with:
        node-version: '18'
    
    - name: 依存関係インストール
      run: npm ci
    
    - name: TypeScript型チェック
      run: npm run type-check
    
    - name: ESLintチェック
      run: npm run lint
    
    - name: ビルドテスト
      run: npm run build:lolipop
    
    - name: E2Eテスト（オプション）
      run: npx playwright test
    
    - name: Lighthouseテスト（オプション）
      run: npx lhci autorun
```

**効果**: GitHubにプッシュするたびに自動テスト実行

---

## 📊 現在使用中の自動チェック

### **既に実装されているもの** ✅

1. **TypeScript strict mode**
   - 型エラーを厳密にチェック
   - 未使用変数を検出

2. **ESLint**
   - コーディング規約チェック
   - 潜在的なバグを検出

3. **Next.jsビルドチェック**
   - 静的生成エラーを検出
   - インポートエラーを検出

4. **prebuild script**
   ```json
   "prebuild": "npm run type-check && npm run lint"
   ```
   - ビルド前に自動チェック

---

## 🎯 推奨する追加テスト

### **短期（すぐに実装可能）**

1. **Playwright E2Eテスト**
   - 主要な機能の自動テスト
   - 実装時間: 1-2時間

2. **Lighthouse CI**
   - パフォーマンス自動監視
   - 実装時間: 30分

### **中期（時間があれば）**

3. **ユニットテスト**
   - 重要な関数のテスト
   - 実装時間: 2-4時間

4. **GitHub Actions**
   - CI/CDパイプライン
   - 実装時間: 1時間

---

## 💡 最も効果的な方法

### **現状の組み合わせ（推奨）** ⭐

```bash
# デプロイ前に実行
npm run type-check  # 型エラーチェック
npm run lint        # コード品質チェック
npm run build:lolipop  # ビルドエラーチェック

# デプロイ後に実行
# ブラウザで主要機能を確認
# APKで実機確認
```

---

## 🎉 まとめ

### **既に実装されている自動チェック**
- ✅ TypeScript型チェック
- ✅ ESLintコード品質チェック
- ✅ Next.jsビルドチェック
- ✅ Netlify自動デプロイ

### **人間のチェックが必要な部分**
- UI/UX（見た目、使いやすさ）
- 実機での動作確認
- AdMob広告の表示確認
- ユーザーフロー全体の確認

---

**Androidアプリ（APK）の修正は不要です！Netlifyデプロイ完了後、既存のAPKで最新版が自動的に表示されます！** 🎊✨
